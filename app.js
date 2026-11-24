/* ==========================================================
 * GEARUP N GOO — APPLICATION (v1.0)
 * Journey Intelligence Engine
 *  - Client-side hash router
 *  - 5-step Planner wizard
 *  - Recommendation scoring (interest + distance + time + popularity)
 *  - Guide matching (94% style score)
 *  - Detour recommendation w/ cost/benefit
 *  - Leaflet interactive map w/ layers
 *  - Heritage Passport (localStorage)
 * ========================================================== */

(() => {
  "use strict";

  /* ---------------- Global state ---------------- */
  const state = {
    wizard: {
      level: null,      // quick | weekend | deep
      destination: null,
      interests: new Set(),
      transport: "bike",
      budget: "moderate",
      language: "English",
      startPoint: "",
      date: "",
      time: "08:00",
      pace: "Balanced",
      travellers: "Solo",
      destinationSelection: { country: "India", stateId: null, districtId: null, selectedPlaceIds: [] },
    },
    currentJourney: null, // generated itinerary
    passport: { visited: [] },
    mapLayers: { stops: true, hidden: true, food: true, fuel: true, ev: true, guide: true, route: true },
  };

  /* ---------------- Local helpers ---------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const toCamel = (s) => s.replace(/-./g, m => m[1].toUpperCase());

  function haversineKm(a, b) {
    const R = 6371; const toRad = d => d * Math.PI / 180;
    const dLat = toRad(b[0] - a[0]), dLon = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]), lat2 = toRad(b[0]);
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function totalDistance(points) {
    let d = 0; for (let i = 1; i < points.length; i++) d += haversineKm(points[i-1], points[i]);
    return d;
  }

  function hhmm(date, addMin) {
    const d = new Date(date.getTime() + addMin * 60000);
    return d.getHours().toString().padStart(2,"0") + ":" + d.getMinutes().toString().padStart(2,"0");
  }

  function toast(msg, kind = "default") {
    const t = document.createElement("div");
    t.className = "toast" + (kind !== "default" ? ` toast--${kind}` : "");
    t.textContent = msg;
    $("#toasts").appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(()=>t.remove(),320); }, 2400);
  }

  /* ---------------- Passport persistence ---------------- */
  function loadPassport() {
    try {
      const raw = localStorage.getItem("gng_passport");
      if (raw) state.passport = Object.assign({ visited: [], completedStops: [], storiesHeard: [], achievements: [], experiences: [] }, JSON.parse(raw));
    } catch (e) {}
    if (!state.passport.visited) state.passport.visited = [];
    if (!state.passport.completedStops) state.passport.completedStops = [];
    if (!state.passport.storiesHeard) state.passport.storiesHeard = [];
  }
  function savePassport() { localStorage.setItem("gng_passport", JSON.stringify(state.passport)); renderPassport(); }
  function markVisited(destId) {
    if (!state.passport.visited.includes(destId)) { state.passport.visited.push(destId); savePassport(); }
  }
  // Bridge so intel.js passport writes (Journey Mode completions, stories)
  // refresh the app-side drawer state and UI.
  window.__gngPassportRefresh = function() { loadPassport(); renderPassport(); };
  // Live-layer refresh callback (road route / weather arriving after render)
  window.__gngRefreshJourney = function() {
    if (location.hash.startsWith("#/journey")) renderJourney();
  };

  /* =======================================================
   * ROUTER
   * ======================================================= */
  const routes = {
    "/": renderHome,
    "/guides": renderGuides,
    "/history": renderHeritageIndia,
    "/planner": renderPlanner,
    "/journey": renderJourney,
  };

  // Map legacy heritage-circuit destinations (data.js) to new district slugs
  const LEGACY_DISTRICT_MAP = {
    "hampi": "vijayanagara",
    "belur": "chikkamagaluru", // closest district; Belur/Halebidu are Hassan but not in 7-demo set; keep on Chikkamagaluru district page as a nearby mention? Simpler: map belur/halebidu/aihole/pattadakal/badami/haveri to vijayanagara for continuity
    "halebidu": "chikkamagaluru",
    "badami": "vijayanagara",
    "aihole": "vijayanagara",
    "pattadakal": "vijayanagara",
    "haveri": "chitradurga"
  };

  function router() {
    // Tear down any Leaflet map instance so container swaps don't leak
    if (mapInstance) { try { mapInstance.remove(); } catch(e){} mapInstance = null; }
    const appEl = $("#app"); if (appEl) appEl.classList.remove("x-leaving");

    const hash = location.hash.replace(/^#/, "") || "/";
    const parts = hash.split("/").filter(Boolean);
    const path0 = "/" + (parts[0] || "");

    // /explore was removed — gracefully send old links to the Heritage Archive
    if (parts[0] === "explore") { location.hash = "#/history"; return; }

    // Legacy route compatibility: /destination/<id> + /monument/<id> → heritage archive
    if ((parts[0] === "destination" || parts[0] === "monument") && parts[1]) {
      const target = GNG_LEGACY_HISTORY_MAP[parts[1]] || "#/history";
      location.hash = target;
      return;
    }
    // NATIONAL HERITAGE ARCHIVE: INDIA → STATE → PLACE → STORY
    if (parts[0] === "history") {
      closeMobileNav();
      window.scrollTo({top:0,behavior:"instant"});
      const H = window.GNGHeritage;
      if (parts[2]) {
        if (H && H.getPlace(parts[1], parts[2])) { renderHeritagePlace(parts[1], parts[2]); updateActiveNav("history"); return; }
      } else if (parts[1]) {
        if (H && H.getState(parts[1])) { renderStateHistory(parts[1]); updateActiveNav("history"); return; }
        // legacy destination ids → new national place pages
        const legacyPlace = GNG_LEGACY_HISTORY_MAP[parts[1]];
        if (legacyPlace) { location.hash = legacyPlace; return; }
        const mapped = LEGACY_DISTRICT_MAP[parts[1]];
        if (mapped) { renderHistoryFor(mapped, /*district*/ true); updateActiveNav("history"); return; }
        renderHistoryFor(parts[1]); updateActiveNav("history"); return;
      }
      // no sub-path → falls through to routes["/history"] (renderHeritageIndia)
    }

    // GLOBAL SEARCH results page: #/search?q=...
    if (parts[0] && parts[0].split("?")[0] === "search") {
      closeMobileNav();
      window.scrollTo({top:0,behavior:"instant"});
      renderSearchPage(); updateActiveNav(""); return;
    }

    // Close mobile nav if open
    closeMobileNav();

    // Route match
    const fn = routes[path0] || routes["/"];
    window.scrollTo({top:0,behavior:"instant"});
    fn();
    updateActiveNav(parts[0]);
  }

  window.addEventListener("hashchange", router);

  function updateActiveNav(path) {
    $$(".nav__links a, .nav__mobile a").forEach(a => {
      const route = a.dataset.route;
      const active = route === (path || "home");
      a.classList.toggle("active", active);
    });
  }

  function navigate(to) { location.hash = to; }

  /* =======================================================
   * NAV INTERACTIONS
   * ======================================================= */
  function initNav() {
    const nav = $("#navbar");
    const onScroll = () => {
      // Transparent overlay navbar over the dark cinematic hero (home only —
      // the planner page is light and gets the default ivory navbar).
      const isDarkHero =
        (!location.hash || location.hash === "#/");
      nav.classList.toggle("scrolled", window.scrollY > 20);
      nav.classList.toggle("nav--dark", isDarkHero && window.scrollY < 120);
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    onScroll();

    $("#navHamburger").addEventListener("click", () => {
      const open = $("#navHamburger").classList.toggle("open");
      $("#navMobile").hidden = !open;
      $("#navHamburger").setAttribute("aria-expanded", String(open));
    });

    $("#passportFab").addEventListener("click", () => { $("#passportDrawer").hidden = false; });
    $("#passportClose").addEventListener("click", () => { $("#passportDrawer").hidden = true; });
    initAccountUI();
  }

  function initAccountUI() {
    const modal = $("#accountModal"), mount = $("#accountNav"), form = $("#accountForm");
    if (!modal || !mount || !form) return;
    let mode = "signin";
    const current = () => { try { return JSON.parse(localStorage.getItem("gng_account") || "null"); } catch(e) { return null; } };
    const renderNav = () => {
      const account = current();
      mount.innerHTML = account
        ? `<button class="profile-trigger" id="profileTrigger" aria-label="Open profile"><span>${escapeHtml((account.name || account.email || "G").trim().charAt(0).toUpperCase())}</span><i>${escapeHtml(account.name || account.email.split("@")[0])}</i></button><div class="profile-menu" id="profileMenu" hidden><strong>${escapeHtml(account.name || "Traveller")}</strong><small>${escapeHtml(account.email)}</small><button id="profileSignOut">Sign out</button></div>`
        : `<button class="account-trigger" id="accountTrigger">Sign in</button>`;
      $("#accountTrigger")?.addEventListener("click", () => open("signin"));
      $("#profileTrigger")?.addEventListener("click", () => { const menu = $("#profileMenu"); if (menu) menu.hidden = !menu.hidden; });
      $("#profileSignOut")?.addEventListener("click", () => { localStorage.removeItem("gng_account"); renderNav(); toast("Signed out on this device."); });
    };
    const setMode = next => {
      mode = next;
      $$("[data-account-mode]", modal).forEach(b => b.classList.toggle("active", b.dataset.accountMode === mode));
      $("#accountNameField").hidden = mode !== "signup";
      $("#accountTitle").textContent = mode === "signup" ? "Create your account" : "Welcome back";
      $("#accountSub").textContent = mode === "signup" ? "Save journeys and build a Heritage Passport across India." : "Sign in to save journeys and keep your Heritage Passport with you.";
      $(".account-submit", modal).textContent = mode === "signup" ? "Create account" : "Sign in";
    };
    const open = next => { setMode(next); modal.hidden = false; $("#accountEmail").focus(); };
    window.openAccount = open;
    $$("[data-account-mode]", modal).forEach(b => b.addEventListener("click", () => setMode(b.dataset.accountMode)));
    $$('[data-account-close]', modal).forEach(b => b.addEventListener("click", () => modal.hidden = true));
    form.addEventListener("submit", e => {
      e.preventDefault();
      const email = $("#accountEmail").value.trim().toLowerCase();
      const name = $("#accountName").value.trim();
      if (!email || !$("#accountPassword").value || (mode === "signup" && !name)) { toast("Please complete the required fields.", "error"); return; }
      const account = { email, name: mode === "signup" ? name : (current()?.name || email.split("@")[0]), signedInAt: new Date().toISOString() };
      localStorage.setItem("gng_account", JSON.stringify(account));
      modal.hidden = true; form.reset(); renderNav(); toast(mode === "signup" ? "Account created on this device." : "Signed in successfully.", "success");
    });
    renderNav();
  }
  function closeMobileNav() {
    $("#navHamburger").classList.remove("open");
    const m = $("#navMobile"); if (m) m.hidden = true;
    $("#navHamburger").setAttribute("aria-expanded","false");
  }

  /* =======================================================
   * VIEW: HOME
   * ======================================================= */
  function renderHome() {
    const app = $("#app");
    const states = window.GNGHeritage ? GNGHeritage.states() : [];
    const featured = getAllDestinations(); // legacy heritage circuit — kept for discoverability
    const categoryCopy = {
      photography:"Frame golden-hour landscapes, temple detail, and the moments between destinations.",
      heritage:"Follow monuments, living traditions, and the stories that shaped every place.",
      architecture:"Trace craft, engineering, sculpture, and the forms that define a region.",
      trekking:"Take the scenic route through hills, trails, viewpoints, and quiet terrain.",
      nature:"Build a slower journey around forests, water, wildlife, and open landscapes.",
      food:"Find local flavours, memorable roadside stops, and regional food traditions.",
      culture:"Meet festivals, craft, music, rituals, and everyday local life.",
      history:"Travel across dynasties, trade routes, conflicts, and turning points in time.",
      sunrise:"Start where the light is best — quiet views before the day begins.",
      sunset:"End at a viewpoint, waterfront, or fort made for the last light.",
      hidden:"Step beyond the obvious with lesser-known places worth the detour.",
      markets:"Discover makers, streets, bazaars, and the pulse of local commerce.",
      spiritual:"Make room for sacred architecture, calm rituals, and reflective stops.",
      adventure:"Add active detours and experiences that change the pace of the road.",
      family:"Choose easy, memorable experiences that work beautifully together.",
      couples:"Shape a more intimate route with scenic stays and unhurried moments."
    };
    const categoryCard = i => `
      <button class="cat" data-interest="${i.id}">
        <span class="cat__badge">Journey theme</span>
        <span class="cat__label">${i.icon} ${i.label}</span>
        <span class="cat__copy">${categoryCopy[i.id] || "Build a journey around the experiences you care about most."}</span>
        <span class="cat__hint">${i.label.toUpperCase()}</span>
      </button>`;
    const topCategories = INTERESTS.filter((_, i) => i % 2 === 0);
    const bottomCategories = INTERESTS.filter((_, i) => i % 2 === 1);

    app.innerHTML = `
      <!-- HERO -->
      <section class="hero">
        <div class="hero__grid"></div>
        <div class="hero__media" role="img" aria-label="Golden-hour view of Hampi's boulder-strewn landscape with ancient temple gopuram"></div>
        <div class="hero__content">
          <span class="hero__eyebrow">Journey Intelligence · India</span>
          <h1>Your journey.<br>Your interests.<br><em>Your India.</em></h1>
          <p class="hero__sub">Plan routes around the places you actually want to experience — from iconic heritage to hidden viewpoints, local food and stories most travellers miss.</p>
          <div class="hero__ctas">
            <button class="btn btn--primary btn--lg" onclick="location.hash='#/planner'">Plan My Trip</button>
            <button class="btn btn--outline-light btn--lg" onclick="location.hash='#/history'">Discover Heritage</button>
          </div>
        </div>
        <div class="hero__scroll"><span>Scroll</span></div>
      </section>

      <!-- BEYOND THE MAP — national discovery -->
      <section class="x-section" id="beyondSection">
        <div class="x-bg" data-plx="0.045" aria-hidden="true"></div>
        <div class="x-section__inner">
          <div class="x-head">
            <span class="eyebrow" data-rv style="--d:0s">Beyond the map</span>
            <h2 class="x-head__h" data-rv-mask style="--d:.12s">India,<br><em>beyond the obvious.</em></h2>
            <p class="x-head__sub" data-rv style="--d:.26s">Every road has places worth stopping for. Every monument has a story worth knowing.</p>
          </div>

          <div class="x-jline" data-rv style="--d:.34s" aria-hidden="true">
            <div class="x-jline__track"><i class="x-jline__fill"></i></div>
            <span class="x-jline__dot" style="left:0%"></span>
            <span class="x-jline__dot" style="left:25%"></span>
            <span class="x-jline__dot" style="left:50%"></span>
            <span class="x-jline__dot" style="left:75%"></span>
            <span class="x-jline__dot" style="left:100%"></span>
            <span class="x-jline__label">the journey line</span>
          </div>

          <div class="x-marquee" aria-hidden="true">
            <div class="x-marquee__track">
              <span>INDIA&ensp;·&ensp;HERITAGE&ensp;·&ensp;ARCHITECTURE&ensp;·&ensp;CULTURE&ensp;·&ensp;HISTORY&ensp;·&ensp;TEMPLES&ensp;·&ensp;FORTS&ensp;·&ensp;TRAVEL&ensp;·&ensp;STORIES&ensp;·&ensp;</span>
              <span>INDIA&ensp;·&ensp;HERITAGE&ensp;·&ensp;ARCHITECTURE&ensp;·&ensp;CULTURE&ensp;·&ensp;HISTORY&ensp;·&ensp;TEMPLES&ensp;·&ensp;FORTS&ensp;·&ensp;TRAVEL&ensp;·&ensp;STORIES&ensp;·&ensp;</span>
            </div>
          </div>

          <div class="x-grid x-grid--home" id="homeStateGrid">
            ${states.map((st,i) => homeStateCard(st, i, (i%5)*70)).join("")}
          </div>
          <p class="x-note" data-rv style="--d:.2s">Ten curated states open the atlas — built to grow, state by state, across all of India.</p>
        </div>
      </section>

      <!-- CATEGORIES -->
      <section class="section section--sand" id="experienceSection">
        <div class="centered">
          <span class="eyebrow">Discover by interest</span>
          <h2>What kind of journey are you looking for?</h2>
          <p style="color:var(--muted-2)">Hover to pause, then choose an interest to see where it can take you.</p>
        </div>
        <div class="cats-marquee" id="catTiles" aria-label="Journey interests">
          <div class="cats-marquee__track cats-marquee__track--forward">
            ${topCategories.map(categoryCard).join("")}
            ${topCategories.map(categoryCard).join("")}
          </div>
          <div class="cats-marquee__track cats-marquee__track--reverse">
            ${bottomCategories.map(categoryCard).join("")}
            ${bottomCategories.map(categoryCard).join("")}
          </div>
        </div>
        <div id="catMatches" style="max-width:1200px;margin:2rem auto 0;display:none"></div>
      </section>

      <!-- HOW IT WORKS -->
      <section class="section">
        <div class="centered">
          <span class="eyebrow">How it works</span>
          <h2>From plan to pilgrimage in three steps.</h2>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step__num">01</div>
            <h3>Tell us how you travel</h3>
            <p>Choose duration, interests, transport and preferences. No drop-downs to kill the spark.</p>
            <div class="step__tags"><span class="step__tag">Duration</span><span class="step__tag">Interests</span><span class="step__tag">Transport</span></div>
          </div>
          <div class="step">
            <div class="step__num">02</div>
            <h3>We build the journey</h3>
            <p>Our route intelligence picks stops, orders them, and estimates realistic times — not perfect circles on a map.</p>
            <div class="step__tags"><span class="step__tag">Scoring</span><span class="step__tag">Routing</span><span class="step__tag">Timing</span></div>
          </div>
          <div class="step">
            <div class="step__num">03</div>
            <h3>Discover more along the way</h3>
            <p>Hidden detours, heritage detours, food, fuel, and a guide matched to how you actually travel.</p>
            <div class="step__tags"><span class="step__tag">Detours</span><span class="step__tag">Guides</span><span class="step__tag">Stops</span></div>
          </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="final-cta">
        <h2>Your next journey is waiting.</h2>
        <p>Don't just visit a place. Experience everything the road has to offer.</p>
        <button class="btn btn--primary btn--lg" onclick="location.hash='#/planner'">Get Started</button>
      </section>
    `;

    // Bind state cards → Heritage Archive state pages
    $$(".xcard[data-state]").forEach(card => {
      card.addEventListener("click", () => { location.hash = `#/history/${card.dataset.state}`; });
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); location.hash = `#/history/${card.dataset.state}`; } });
    });

    // National motion: reveals, journey line, marquee pacing, subtle parallax
    initRevealMotion();

    // Categories: highlight STATES from the national heritage dataset
    const matchesEl = $("#catMatches");
    $$(".cat").forEach(tile => {
      tile.addEventListener("click", () => {
        $$(".cat").forEach(c => c.classList.remove("active"));
        tile.classList.add("active");
        const id = tile.dataset.interest;
        const matching = states.filter(st => (st.places||[]).some(p =>
          (p.facets||[]).includes(id) || (p.tags||[]).some(t => t.toLowerCase() === id)
        ));
        if (!matching.length) {
          matchesEl.style.display = "block";
          matchesEl.innerHTML = `<p style="text-align:center;color:var(--muted-2)">No state in the first edition is tagged with this interest yet — but the planner will match it when you plan a trip.</p>`;
          return;
        }
        matchesEl.style.display = "block";
        matchesEl.innerHTML = `
          <h3 style="margin-bottom:1rem;font-family:var(--serif)">Best for ${INTERESTS.find(x=>x.id===id)?.label || id}:</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.8rem">
            ${matching.map(st=>`
              <button onclick="location.hash='#/history/${st.slug}'" style="text-align:left;padding:1rem;border:1px solid var(--line);border-radius:var(--radius);background:var(--ivory);cursor:pointer;transition:all .2s" onmouseover="this.style.background='var(--sand)'" onmouseout="this.style.background='var(--ivory)'">
                <div style="font-family:var(--serif);font-size:1.1rem;font-weight:600">${st.name}</div>
                <div style="font-size:.8rem;color:var(--muted-2);margin-top:.2rem">${(st.places||[]).length} stories · open state</div>
              </button>
            `).join("")}
          </div>
        `;
      });
    });
  }

  /* =======================================================
   * HOME STATE CARDS (Heritage Archive teaser)
   * Renders the 10 archive states on the home page; each card
   * opens the state page in the Heritage Archive (#/history).
   * ======================================================= */
  const HOME_STATE_COPY = {
    "karnataka":      { desc: "Where empires, sacred architecture and living traditions meet.", tags: ["HERITAGE","TEMPLES","ARCHITECTURE"] },
    "rajasthan":      { desc: "Fortresses, stepwells, royal cities and desert landscapes shaped by centuries of dynastic history.", tags: ["FORTS","ROYAL HERITAGE","DESERT"] },
    "madhya-pradesh": { desc: "Prehistoric rock art, Buddhist monuments, medieval kingdoms and forgotten cities across the heart of India.", tags: ["ANCIENT","ARCHAEOLOGY","KINGDOMS"] },
    "gujarat":        { desc: "Ancient settlements, stepwells, temples and trading landscapes reveal centuries of innovation and exchange.", tags: ["ARCHAEOLOGY","STEPWELLS","CULTURE"] },
    "maharashtra":    { desc: "Cave monasteries, Deccan forts, ancient settlements and historic cities shaped by many eras.", tags: ["CAVES","FORTS","DECCAN"] },
    "odisha":         { desc: "Kalinga's ancient landscapes connect Buddhist heritage, sacred architecture and remarkable temple traditions.", tags: ["KALINGA","BUDDHISM","TEMPLES"] },
    "tamil-nadu":     { desc: "Pallava, Chola, Pandya and Nayak legacies survive through temples, forts, inscriptions and ancient settlements.", tags: ["CHOLA","PALLAVA","TEMPLES"] },
    "uttar-pradesh":  { desc: "Ancient Buddhist landscapes, forts, sacred cities and archaeological sites reveal layers of northern Indian history.", tags: ["ANCIENT","BUDDHISM","FORTS"] },
    "telangana":      { desc: "Kakatiya temples, Deccan architecture and historic fortifications reveal a state shaped by multiple dynasties.", tags: ["KAKATIYA","DECCAN","HERITAGE"] },
    "andhra-pradesh": { desc: "Buddhist sites, Vijayanagara landscapes, rock-cut caves and historic forts reveal Andhra's long cultural history.", tags: ["BUDDHISM","VIJAYANAGARA","FORTS"] }
  };
  function homeStateCard(st, i, delayMs) {
    const copy = HOME_STATE_COPY[st.slug] || { desc: st.description, tags: st.tags };
    const hasUnesco = (st.places || []).some(p => p.unesco);
    return `
      <article class="xcard${i === 9 ? " xcard--wide" : ""}" data-state="${st.slug}" role="button" tabindex="0"
               aria-label="Discover ${escapeHtml(st.name)} in the Heritage Archive" style="--d:${delayMs}ms;--tint:${HA_TINTS[i % HA_TINTS.length]}">
        <div class="xcard__imgbox">
          <img class="xcard__img" src="${st.heroImage}" alt="Landscape of ${escapeHtml(st.name)}" loading="lazy" decoding="async" />
        </div>
        <span class="xcard__num">${String(i+1).padStart(2,"0")}</span>
        ${hasUnesco ? `<span class="xcard__badge">UNESCO</span>` : ""}
        <div class="xcard__body">
          <h3 class="xcard__name">${escapeHtml(st.name)}</h3>
          <p class="xcard__desc">${escapeHtml(copy.desc)}</p>
          <div class="xcard__tags">${copy.tags.map(t => `<span>${escapeHtml(t)}</span>`).join("")}</div>
          <div class="xcard__foot">
            <span class="xcard__count">${(st.places||[]).length} STORIES</span>
            <span class="xcard__cta">READ STORIES <i aria-hidden="true">→</i></span>
          </div>
        </div>
      </article>
    `;
  }

  /* =======================================================
   * MOTION SYSTEM — premium, subtle, continuous
   * Reveals (IntersectionObserver) · journey line · marquee ·
   * restrained parallax · smooth route exit. CSS-first, one
   * rAF-gated scroll handler, honors prefers-reduced-motion.
   * ======================================================= */
  let __motionScrollBound = false;
  function __motionFrame() {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    $$(".x-jline").forEach(l => {
      const r = l.getBoundingClientRect(), vh = innerHeight;
      const prog = Math.max(0, Math.min(1, (vh * 0.9 - r.top) / (r.height + vh * 0.55)));
      l.style.setProperty("--p", prog.toFixed(3));
      const dots = l.querySelectorAll(".x-jline__dot");
      dots.forEach((d,i) => d.classList.toggle("on", prog >= (i + 0.5) / dots.length));
    });
    if (!rm && innerWidth >= 900) {
      $$("[data-plx]").forEach(el => {
        const host = el.parentElement.getBoundingClientRect();
        if (host.bottom < -80 || host.top > innerHeight + 80) return;
        const off = (host.top + host.height/2 - innerHeight/2) * parseFloat(el.dataset.plx || "0.05");
        el.style.transform = `translateY(${(-off).toFixed(1)}px)`;
      });
    }
  }
  function initRevealMotion() {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!rm && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(ents => {
        ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });
      $$("[data-rv],[data-rv-mask],.xcard").forEach(el => io.observe(el));
    } else {
      $$("[data-rv],[data-rv-mask],.xcard").forEach(el => el.classList.add("in"));
    }
    if (!__motionScrollBound) {
      __motionScrollBound = true;
      let tick = false;
      const onScroll = () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; __motionFrame(); }); } };
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onScroll, { passive: true });
    }
    __motionFrame();
  }


  /* =======================================================
   * TRIP DRAFT (planner preselection) + UNIFIED TARGET RESOLVER
   * (restored beside the removed explorer views)
   * ======================================================= */
  const tripDraft = {
    districtId: null,
    placeIds: new Set()
  };
  function addToTripDraft(districtId, placeId) {
    tripDraft.districtId = districtId;
    tripDraft.placeIds.add(placeId);
    state.wizard.destination = districtId;
  }
  function isInTripDraft(districtId, placeId) {
    return tripDraft.districtId === districtId && tripDraft.placeIds.has(placeId);
  }

  function resolveTarget(id) {
    // Prefer districts (new hierarchy)
    let target = getDistrict(id);
    let isDistrict = !!target;
    if (!target) {
      target = getDestination(id);
      isDistrict = false;
    }
    // India-wide curated districts (india-destinations.js service)
    if (!target && window.GNGIndiaDestinations) {
      const d = GNGIndiaDestinations.districtById(id);
      if (d) {
        target = Object.assign({}, d, {
          shortDesc: d.description || "",
          historicalSummary: d.historySummary || d.description || "",
          guides: d.guides || [],
          detours: d.detours || [],
          fuelStops: d.fuelStops || [],
          evStops: d.evStops || [],
          heroGradient: d.heroGradient || "linear-gradient(135deg,#241a12 0%,#4a3324 35%,#8a5a3a 65%,#d8c8a8 100%)",
          UNESCO: (d.tags || []).includes("unesco"),
          source: d.source ? (typeof d.source === "string" ? { name: d.source, confidence: "high", verified: "2026-08" } : d.source)
                           : { name: "GEARUP N GOO curated India dataset", confidence: "high", verified: "2026-08" }
        });
        isDistrict = true;
      }
    }
    if (!target) return null;
    return {
      target,
      isDistrict,
      id: target.id,
      name: target.name,
      coords: target.coords,
      heroGradient: target.heroGradient || target.heroGradient,
      places: (target.places||[]).map(p => ({
        ...p,
        coords: p.coords,
        tags: p.tags||[],
        durationMin: p.durationMin||45,
        bestTime: p.bestTime||"Daytime",
        photographyScore: p.photographyScore||7.5,
        type: p.type || "place"
      })),
      detours: target.detours||[],
      fuelStops: target.fuelStops||[],
      evStops: target.evStops||[],
      guides: target.guides||[],
      source: target.source,
      historySummary: target.historicalSummary||target.shortDesc||""
    };
  }

  /* =======================================================
   * VIEW: HISTORY INDEX / DESTINATION
   * ======================================================= */
  /* =======================================================
   * VIEW: HERITAGE ARCHIVE — INDIA (states only)
   * Hierarchy: INDIA → STATE → PLACE → STORY → HISTORY → JOURNEY
   * ======================================================= */
  function renderHeritageIndia() {
    const app = $("#app");
    const states = window.GNGHeritage ? GNGHeritage.states() : [];
    const H = window.GNGHeritage;

    const chips = ["ALL"].concat(H ? H.ALL_FACETS.map(f => f.toUpperCase()) : []);

    app.innerHTML = `
      <section class="ha-hero">
        <div class="ha-hero__strips" aria-hidden="true">
          <div class="ha-hero__strip"></div><div class="ha-hero__strip"></div><div class="ha-hero__strip"></div>
        </div>
        <div class="ha-hero__inner">
          <span class="ha-hero__eyebrow">Heritage Archive · India</span>
          <h1>India,<br><em>through time.</em></h1>
          <p class="ha-hero__sub">Thousands of years. Hundreds of kingdoms. One living civilisation.</p>
          <p class="ha-hero__secondary">Explore India's heritage through the places, people, dynasties, architecture and stories that shaped the subcontinent.</p>
        </div>
      </section>

      <section class="ha-section">
        <div class="ha-section__head">
          <span class="eyebrow">The archive</span>
          <h2>India's heritage, state by state.</h2>
          <p>Start with a state. Discover the places history left behind.</p>
        </div>

        <div class="ha-filters" id="haFilters">
          ${chips.map((c,i) => `<button class="ha-chip ${i===0?"active":""}" data-facet="${c}">${c}</button>`).join("")}
        </div>
        <p id="haFilterNote" style="max-width:1400px;margin:-1.2rem auto 2rem;font-size:.74rem;color:var(--muted-2)"></p>

        <div class="ha-section__body">
          <div class="ha-states" id="haStates">
            ${states.map((st,i) => heritageStateCard(st,i)).join("")}
          </div>
          <p style="margin-top:2.2rem;font-size:.8rem;color:var(--muted-2)">
            The national archive launches with these ten curated states — the architecture is built to grow, state by state and union territory by union territory.
          </p>
        </div>
      </section>
    `;

    // Filter states by facet — the first level shows STATES only, never monuments
    $$("#haFilters .ha-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        $$("#haFilters .ha-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const f = chip.dataset.facet.toLowerCase();
        let shown = 0;
        $$("#haStates .ha-state").forEach((el, i) => {
          const st = states[i];
          const match = f === "all" || (H.facets(st) || []).includes(f);
          el.style.display = match ? "" : "none";
          if (match) shown++;
        });
        const note = $("#haFilterNote"); if (note) note.textContent = shown + (shown===1?" state":" states") + " match “" + chip.dataset.facet + "”";
      });
    });
  }

  function heritageStateCard(st, i) {
    const hasUnesco = (st.places || []).some(p => p.unesco);
    return `
      <article class="ha-state" data-state="${st.slug}" role="button" tabindex="0"
               aria-label="Explore ${escapeHtml(st.name)}"
               onclick="location.hash='#/history/${st.slug}'"
               onkeydown="if(event.key==='Enter')location.hash='#/history/${st.slug}'">
        <div class="ha-state__img" style="background-image:url('${st.heroImage}')"></div>
        <span class="ha-state__num">${String(i+1).padStart(2,"0")}</span>
        ${hasUnesco ? `<span class="ha-state__badge ha-state__badge--unesco">UNESCO</span>` : ""}
        <div class="ha-state__body">
          <h3 class="ha-state__name">${escapeHtml(st.name)}</h3>
          <p class="ha-state__desc">${escapeHtml(st.description)}</p>
          <div class="ha-tags">${(st.tags||[]).map(t => `<span>${escapeHtml(t)}</span>`).join("")}</div>
          <div class="ha-state__foot">
            <span class="ha-state__stories">${(st.places||[]).length} STORIES</span>
            <span class="ha-state__cta">EXPLORE STATE →</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderHistoryFor(id, fromDistrict) {
    // Try new district first, then legacy destination
    let d = getDistrict(id);
    let backLink = "#/planner";
    if (!d) { d = getDestination(id); backLink = "#/planner"; }
    if (!d) return renderHistory();
    const dynasty = getDynasty(d.dynasty);
    const app = $("#app");

    app.innerHTML = `
      <section class="page-hero">
        <div class="page-hero__media" style="--bg:${d.heroGradient}"></div>
        <div class="page-hero__content">
          <nav class="breadcrumb"><a href="#/">Home</a> / <a href="#/history">History</a> / ${d.name}</nav>
          <h1>${d.name}</h1>
          <div class="page-hero__sub">${d.tagline||d.historicalSummary||d.description||""}</div>
        </div>
      </section>

      <section class="section">
        <div class="centered">
          <span class="eyebrow">Timeline</span>
          <h2>${d.name} through time.</h2>
          ${dynasty ? `<p style="color:var(--muted-2)">Primary dynasty/period: <strong>${dynasty.name}</strong> · ${dynasty.period} · ${dynasty.region}</p>`:""}
          <p style="color:var(--muted-2);max-width:60ch;margin:1rem auto 0">${d.historicalSummary||""}</p>
        </div>

        <div class="timeline" style="max-width:900px;margin:2rem auto 0">
          ${(d.timeline||[]).map(ev => `
            <div class="timeline__item">
              <div class="timeline__year">${ev.year}</div>
              <h3>${ev.event.split(".")[0]}.</h3>
              <p>${ev.event}</p>
            </div>
          `).join("")}
          ${!(d.timeline&&d.timeline.length) ? `<p style="color:var(--muted-2);text-align:center">Timeline coming soon for this destination.</p>`:""}
        </div>

        <div class="flex-between" style="max-width:900px;margin:3rem auto 0">
          <button class="btn btn--ghost" onclick="location.hash='#/history'">← All history</button>
          <button class="btn btn--primary" onclick="prefillPlanner('${d.id}')">Plan a trip here</button>
        </div>
      </section>
    `;
  }

  /* =======================================================
   * NATIONAL HERITAGE ARCHIVE — state & place pages, search,
   * and ADD TO MY JOURNEY integration.
   * Reusable components (single implementation, data-driven):
   *   StateHistoryPage → renderStateHistory(slug)
   *   HeritagePlacePage → renderHeritagePlace(stateSlug, placeSlug)
   *   StateCard → heritageStateCard (above)
   *   HeritagePlaceCard → heritagePlaceCard
   *   HistoryTimeline / HistoricalFactPanel → inline below
   *   SearchBar / SearchDropdown → initHeritageSearch
   *   SearchResultsPage / DidYouMean / NoResults → renderSearchPage
   * ======================================================= */

  // Legacy /history/<destinationId> URLs → national place pages
  const GNG_LEGACY_HISTORY_MAP = {
    "hampi": "#/history/karnataka/hampi",
    "pattadakal": "#/history/karnataka/pattadakal",
    "aihole": "#/history/karnataka/aihole",
    "badami": "#/history/karnataka/badami-cave-temples",
    "belur": "#/history/karnataka/belur",
    "halebidu": "#/history/karnataka/halebidu"
  };

  // Per-place warm tints so cards from one state don't look identical
  const HA_TINTS = [
    "rgba(201,106,61,.38)","rgba(102,112,90,.42)","rgba(176,128,58,.40)",
    "rgba(122,58,53,.40)","rgba(90,90,58,.42)","rgba(154,79,43,.38)"
  ];
  const HA_LOOK_GLYPHS = ["✦","◈","▤","◍","⌘","❖"];

  function haPlaceThumb(p, idx) {
    // Tint overlay (for cohesion) layered over the exact uploaded image
    return HA_TINTS[idx % HA_TINTS.length];
  }
  function haImgTag(src, file, alt, cls) {
    return `<img ${cls ? `class="${cls}" ` : ""}src="${src}" data-file="${file}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" onerror="haImgPending(this)" />`;
  }
  window.__haMissingImages = new Set();
  window.haImgPending = function(img) {
    const file = img.dataset.file || String(img.src).split("/").pop();
    if (!window.__haMissingImages.has(file)) {
      window.__haMissingImages.add(file);
      console.warn("Missing image: " + file);
    }
    const ph = document.createElement("div");
    ph.className = "ha-img-pending";
    ph.innerHTML = `<span>Image pending</span><small>${file}</small>`;
    img.replaceWith(ph);
  };

  /* ---------- HeritagePlaceCard ---------- */
  function heritagePlaceCard(state, p, i) {
    const file = (p.image || "").split("/").pop();
    return `
      <article class="ha-card" role="button" tabindex="0" aria-label="Read the story of ${escapeHtml(p.name)}"
               onclick="location.hash='#/history/${state.slug}/${p.slug}'"
               onkeydown="if(event.key==='Enter')location.hash='#/history/${state.slug}/${p.slug}'">
        <div class="ha-card__img" style="--st-tint:${haPlaceThumb(p,i)}">
          ${haImgTag(p.image, file, p.name)}
          <span class="ha-card__class ${p.unesco ? "ha-card__class--unesco" : ""}">${escapeHtml(p.classification)}</span>
          <span class="ha-card__period">${escapeHtml(p.period)}</span>
        </div>
        <div class="ha-card__body">
          <span class="ha-card__type">${escapeHtml(p.heritageType)}</span>
          <h3 class="ha-card__name">${escapeHtml(p.name)}</h3>
          <p class="ha-card__hook">${escapeHtml(p.tagline)}</p>
          <div class="ha-tags">${(p.tags||[]).slice(0,3).map(t => `<span>${escapeHtml(t)}</span>`).join("")}</div>
          <span class="ha-card__cta">READ THE STORY →</span>
        </div>
      </article>
    `;
  }

  /* ---------- StateHistoryPage ---------- */
  function renderStateHistory(slug) {
    const H = window.GNGHeritage;
    const st = H.getState(slug);
    if (!st) return renderHeritageIndia();
    const app = $("#app");
    const unescoCount = st.places.filter(p => p.unesco).length;

    app.innerHTML = `
      <section class="ha-shero">
        <div class="ha-shero__img" style="background-image:url('${st.heroImage}')"></div>
        <div class="ha-shero__inner">
          <nav class="ha-crumbs" aria-label="Breadcrumb">
            <a href="#/history">Heritage Archive</a><span>/</span><a href="#/history">India</a><span>/</span>${escapeHtml(st.name)}
          </nav>
          <h1>${escapeHtml(st.name)}</h1>
          <p class="ha-shero__desc">${escapeHtml(st.description)}</p>
          <div class="ha-tags ha-shero__tags">${(st.tags||[]).map(t => `<span>${escapeHtml(t)}</span>`).join("")}</div>
        </div>
      </section>

      <section class="ha-section">
        <div class="ha-section__head">
          <span class="eyebrow">${unescoCount ? unescoCount + " UNESCO sites included" : "Six stories"}</span>
          <h2>6 stories from ${escapeHtml(st.name)}.</h2>
          <p>Each story is a place — open one to travel through its history, architecture and meaning.</p>
        </div>
        <div class="ha-section__body">
          <div class="ha-places">
            ${st.places.map((p,i) => heritagePlaceCard(st,p,i)).join("")}
          </div>
        </div>
      </section>
    `;
  }

  /* ---------- HeritagePlacePage ---------- */
  function renderHeritagePlace(stateSlug, placeSlug) {
    const H = window.GNGHeritage;
    const entry = H.getPlace(stateSlug, placeSlug);
    if (!entry) return renderStateHistory(stateSlug);
    const st = entry.state, p = entry.place;
    const app = $("#app");
    const near = H.nearby(p, 200, 5);
    const inJourney = getMyJourney().some(x => x.id === st.slug + "/" + p.slug);

    app.innerHTML = `
      <article class="ha-place">
        <header class="ha-place-hero">
          <div class="ha-place-hero__img" style="--st-tint:${haPlaceThumb(p, Math.abs(p.slug.length)%6)}">
            ${haImgTag(p.image, (p.image||"").split("/").pop(), p.name, "ha-place-hero__photo")}
          </div>
          <div class="ha-place-hero__inner">
            <nav class="ha-crumbs" aria-label="Breadcrumb">
              <a href="#/history">Heritage Archive</a><span>/</span><a href="#/history">India</a><span>/</span>
              <a href="#/history/${st.slug}">${escapeHtml(st.name)}</a><span>/</span>${escapeHtml(p.name)}
            </nav>
            <span class="ha-hero__eyebrow" style="margin-bottom:.6rem">${escapeHtml(p.classification)}</span>
            <h1>${escapeHtml(p.name)}</h1>
            <div class="ha-place-hero__meta">
              <div><strong>Period</strong>${escapeHtml(p.period)}</div>
              <div><strong>Dynasty / era</strong>${escapeHtml(p.dynasty)}</div>
              <div><strong>Location</strong>${escapeHtml(p.location)}, ${escapeHtml(st.name)}</div>
              <div><strong>Category</strong>${escapeHtml(p.heritageType)}</div>
            </div>
            <div class="ha-tags" style="margin-top:1.1rem">${(p.tags||[]).map(t => `<span>${escapeHtml(t)}</span>`).join("")}</div>
          </div>
        </header>

        <section class="ha-block">
          <div class="ha-article">
            <h3>Why this place matters</h3>
            ${(p.why||[]).map(t => `<p>${t}</p>`).join("")}
            <div class="ha-added-bar ${inJourney ? "show" : ""}" id="haAddedBar">
              <span id="haAddedMsg">${escapeHtml(p.name)} is in your journey list.</span>
              <a onclick="planHeritageRoute('${st.slug}','${p.slug}')" role="button">PLAN THIS ROUTE →</a>
            </div>
          </div>
        </section>

        <section class="ha-block ha-block--sand">
          <div class="ha-article">
            <h3>History timeline</h3>
            <div class="ha-tl">
              ${(p.timeline||[]).map(ev => `
                <div class="ha-tl__item">
                  <span class="ha-tl__stage">${escapeHtml(ev.stage)}</span>
                  <div class="ha-tl__year">${escapeHtml(ev.year)}</div>
                  <p class="ha-tl__text">${ev.text}</p>
                </div>
              `).join("") || `<p class="ha-tl__text">Historical timeline information for this place is still being verified.</p>`}
            </div>
          </div>
        </section>

        <section class="ha-block ha-block--dark">
          <div class="ha-article"><h3>Who shaped this place?</h3></div>
          <div class="ha-who">
            ${(p.who||[]).map(w => `
              <div class="ha-who__item">
                <span class="ha-who__k">${escapeHtml(w.k)}</span>
                <span class="ha-who__v">${escapeHtml(w.v)}</span>
              </div>
            `).join("")}
          </div>
        </section>

        <section class="ha-block">
          <div class="ha-article"><h3>Look closer</h3></div>
          <div class="ha-look">
            ${(p.lookCloser||[]).map((l,i) => `
              <div class="ha-look__tile">
                <div class="ha-look__thumb" style="--look-bg:linear-gradient(150deg,${HA_TINTS[i%HA_TINTS.length].replace(/[\d.]+\)$/,".22)")},var(--ivory-2))">
                  <span class="ha-look__glyph">${HA_LOOK_GLYPHS[i % HA_LOOK_GLYPHS.length]}</span>
                </div>
                <div class="ha-look__t">${escapeHtml(l.t)}</div>
                <div class="ha-look__d">${escapeHtml(l.d)}</div>
              </div>
            `).join("")}
          </div>
        </section>

        <section class="ha-block ha-block--sand">
          <div class="ha-article"><h3>Then → Now</h3></div>
          <div class="ha-then">
            <div class="ha-then__panel">
              <span class="ha-then__k">THEN — ${escapeHtml(p.period)}</span>
              <p>${escapeHtml((p.thenNow||{}).then || "Historical information for this place is still being verified.")}</p>
            </div>
            <div class="ha-then__arrow" aria-hidden="true">↓</div>
            <div class="ha-then__panel">
              <span class="ha-then__k">TODAY</span>
              <p>${escapeHtml((p.thenNow||{}).now || "")}</p>
            </div>
          </div>
        </section>

        <section class="ha-block" id="haMapBlock">
          <div class="ha-article"><h3>On the map</h3></div>
          <div class="ha-mapgrid">
            <div class="ha-map"><div id="haMap"></div></div>
            <div class="ha-near">
              <div class="ha-near__t">Nearby heritage places</div>
              ${near.length ? near.map(n => `
                <div class="ha-near__item" role="button" tabindex="0" onclick="location.hash='#/history/${n.state.slug}/${n.place.slug}'">
                  <span class="ha-near__name">${escapeHtml(n.place.name)}</span>
                  <span class="ha-near__meta">${n.km.toFixed(0)} km · ${escapeHtml(n.state.name)}</span>
                </div>
              `).join("") : `<p style="font-size:.85rem;color:var(--muted-2)">No other archive places within 200 km yet.</p>`}
              <div class="ha-coords">${p.coordinates[0].toFixed(4)}° N, ${p.coordinates[1].toFixed(4)}° E</div>
              <button class="btn btn--primary btn--sm" style="margin-top:.6rem" onclick="planHeritageRoute('${st.slug}','${p.slug}')">EXPLORE NEARBY</button>
            </div>
          </div>
        </section>

        <section class="ha-block ha-block--dark">
          <div class="ha-cta">
            <h3>Want to experience it?</h3>
            <p>${escapeHtml(p.tagline)}</p>
            <div class="ha-cta__btns">
              <button class="btn btn--primary btn--lg" onclick="planHeritageRoute('${st.slug}','${p.slug}')">PLAN A VISIT</button>
              <button class="btn btn--outline-light btn--lg" data-add-place="${st.slug}/${p.slug}" ${inJourney?"disabled":""} onclick="addHeritageToJourney('${st.slug}','${p.slug}')">${inJourney?"ADDED ✓":"ADD TO JOURNEY"}</button>
              <button class="btn btn--outline-light btn--lg" onclick="document.getElementById('haMapBlock').scrollIntoView({behavior:'smooth'})">FIND NEARBY PLACES</button>
              <button class="btn btn--outline-light btn--lg" onclick="__gngStoryPlace('${st.slug}','${p.slug}')">STORY MODE</button>
              <button class="btn btn--outline-light btn--lg" onclick="__gngWhyPlace('${st.slug}','${p.slug}')">WHY SHOULD I GO?</button>
            </div>
          </div>
        </section>

        <section class="ha-section" style="padding-top:2rem">
          <div class="ha-sources">
            <strong style="letter-spacing:.2em;text-transform:uppercase;font-size:.62rem;color:var(--accent-dark)">Sources & verification</strong><br>
            ${(p.sources||[]).map(s => `${escapeHtml(s.name)} · verified ${escapeHtml(s.verified)} · confidence: ${escapeHtml(s.confidence)}${s.url?` · <a href="${s.url}" target="_blank" rel="noopener">Open source ↗</a>`:""}`).join("<br>")}
            <br><span style="color:var(--muted)">Coordinates are approximate. Legends and folklore are labelled as such, never as established fact.</span>
          </div>
        </section>
      </article>
    `;

    setTimeout(() => initHeritageMap(p, near), 150);
  }

  function initHeritageMap(place, nearList) {
    const el = $("#haMap");
    if (!el || typeof L === "undefined") return;
    if (mapInstance) { try { mapInstance.remove(); } catch(e){} mapInstance = null; }
    const map = L.map("haMap", { scrollWheelZoom: false }).setView(place.coordinates, 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const mainIcon = L.divIcon({ className: "", iconSize: [32,32], iconAnchor: [16,16],
      html: `<div class="marker-icon marker-icon--start" style="background:var(--accent)">★</div>` });
    L.marker(place.coordinates, { icon: mainIcon }).addTo(map)
      .bindPopup(`<strong>${escapeHtml(place.name)}</strong><br><span style="color:var(--muted-2)">${escapeHtml(place.location)}</span>`);
    const group = L.layerGroup().addTo(map);
    (nearList||[]).forEach(n => {
      const ic = L.divIcon({ className: "", iconSize: [28,28], iconAnchor: [14,14],
        html: `<div class="marker-icon marker-icon--stop" style="width:28px;height:28px;font-size:.7rem">${n.state.name[0]}</div>` });
      L.marker(n.place.coordinates, { icon: ic }).addTo(group)
        .bindPopup(`<strong>${escapeHtml(n.place.name)}</strong><br><span style="color:var(--muted-2)">${escapeHtml(n.state.name)} · ${n.km.toFixed(0)} km</span>`);
    });
    mapInstance = map;
    setTimeout(() => map.invalidateSize(), 250);
  }

  /* ---------- ADD TO MY JOURNEY ---------- */
  function getMyJourney() {
    try { return JSON.parse(localStorage.getItem("gng_my_journey") || "[]"); } catch(e) { return []; }
  }
  window.getMyJourney = getMyJourney;

  window.addHeritageToJourney = function(stateSlug, placeSlug) {
    const H = window.GNGHeritage; if (!H) return;
    const entry = H.getPlace(stateSlug, placeSlug); if (!entry) return;
    const list = getMyJourney();
    const id = stateSlug + "/" + placeSlug;
    if (list.some(x => x.id === id)) { toast(`${entry.place.name} is already in your journey.`); return; }
    list.push({ id, name: entry.place.name, state: entry.state.name, coords: entry.place.coordinates, addedAt: new Date().toISOString() });
    try { localStorage.setItem("gng_my_journey", JSON.stringify(list)); } catch(e) {}
    toast(`${entry.place.name} has been added to your journey.`, "success");
    const bar = $("#haAddedBar");
    if (bar) { const msg = $("#haAddedMsg"); if (msg) msg.textContent = `${entry.place.name} has been added to your journey.`; bar.classList.add("show"); }
    $$("[data-add-place]").forEach(b => { if (b.dataset.addPlace === id) { b.textContent = "ADDED ✓"; b.disabled = true; } });
  };

  window.planHeritageRoute = function(stateSlug, placeSlug) {
    const H = window.GNGHeritage; if (!H) return;
    const entry = H.getPlace(stateSlug, placeSlug); if (!entry) return;
    const p = entry.place;
    if (p.plan && p.plan.prefill && (getDistrict(p.plan.prefill) || getDestination(p.plan.prefill))) {
      prefillPlanner(p.plan.prefill); // navigates to /planner itself
    } else {
      state.wizard.startPoint = (p.plan && p.plan.start) || p.name;
      toast(`Trip planner opened — starting point set to ${state.wizard.startPoint}.`, "success");
      navigate("/planner");
    }
  };

  /* ---------- SearchResultsPage / DidYouMean / NoResults ---------- */
  function renderSearchPage() {
    const H = window.GNGHeritage;
    const app = $("#app");
    const m = location.hash.match(/[?&]q=([^&]*)/);
    const q = m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
    const res = q ? H.search(q) : { places: [], states: [], contexts: [], didYouMean: null };
    const dynasties = res.contexts.filter(c => c.item.type === "dynasty");
    const others = res.contexts.filter(c => c.item.type !== "dynasty");
    const total = res.places.length + res.states.length + res.contexts.length;

    const placeRow = (r, action) => {
      const isState = action === "state";
      const src = isState ? r.item.heroImage : r.item.image;
      return `
      <div class="ha-rrow">
        <div class="ha-rrow__thumb">${haImgTag(src, (src||"").split("/").pop(), r.item.name)}</div>
        <div style="min-width:0">
          <div class="ha-rrow__name">${escapeHtml(r.item.name)}</div>
          <div class="ha-rrow__meta">${action === "state" ? `State · ${(r.item.places||[]).length} heritage stories` : "Heritage Place · " + escapeHtml(r.item.stateName || r.item.name)}</div>
          ${r.item.tagline || r.item.description ? `<div class="ha-rrow__ctx">${escapeHtml((r.item.tagline || r.item.description || "").slice(0,120))}</div>` : ""}
          ${r.item.dynasty && action !== "state" ? `<div class="ha-rrow__ctx" style="color:var(--accent-dark)">${escapeHtml(r.item.dynasty)}</div>` : ""}
        </div>
        <div class="ha-rrow__go">
          ${action === "state"
            ? `<button class="btn btn--ghost btn--sm" onclick="location.hash='#/history/${r.item.slug}'">EXPLORE STATE →</button>`
            : `<button class="btn btn--ghost btn--sm" onclick="location.hash='#/history/${r.item.stateSlug}/${r.item.slug}'">READ STORY</button>
               <button class="btn btn--primary btn--sm" onclick="addHeritageToJourney('${r.item.stateSlug}','${r.item.slug}')">+ JOURNEY</button>`}
        </div>
      </div>`;
    };

    const ctxRow = (r) => {
      const ref = (r.item.refs && r.item.refs[0]) ? H.getPlace(r.item.refs[0][0], r.item.refs[0][1]) : null;
      return `
      <div class="ha-rrow">
        <div class="ha-rrow__thumb" style="background:linear-gradient(150deg,var(--olive),var(--dark))"></div>
        <div style="min-width:0">
          <div class="ha-rrow__name">${escapeHtml(r.item.name)}</div>
          <div class="ha-rrow__meta">${r.item.type === "dynasty" ? "Dynasty" : r.item.type === "period" ? "Historical period" : "Culture"} · ${escapeHtml(r.item.period)}</div>
          <div class="ha-rrow__ctx">${escapeHtml(r.item.description)}</div>
        </div>
        <div class="ha-rrow__go">
          ${ref ? `<button class="btn btn--ghost btn--sm" onclick="location.hash='#/history/${ref.state.slug}/${ref.place.slug}'">OPEN STORY →</button>` : ""}
        </div>
      </div>`;
    };

    const group = (title, rows) => rows.length ? `
      <div class="ha-rgroup">
        <div class="ha-rgroup__t">${title}<small>${rows.length} result${rows.length>1?"s":""}</small></div>
        ${rows.join("")}
      </div>` : "";

    app.innerHTML = `
      <section class="ha-section" style="padding-top:calc(var(--nav-h) + 3rem)">
        <div class="ha-results">
          <nav class="ha-crumbs"><a href="#/">Home</a><span>/</span>Search</nav>
          <span class="eyebrow">Search results</span>
          <h2 style="font-size:clamp(1.8rem,3.4vw,2.8rem);margin:.4rem 0 1.6rem">Results for <span class="ha-results__q">“${escapeHtml(q)}”</span></h2>

          ${res.didYouMean ? `
            <div class="ha-dym">
              <span class="ha-dym__k">Did you mean?</span>
              <span class="ha-dym__name">${escapeHtml(res.didYouMean.name)}</span>
              ${res.didYouMean.place
                ? `<button class="btn btn--primary btn--sm" onclick="location.hash='#/history/${res.didYouMean.place.stateSlug}/${res.didYouMean.place.slug}'">VIEW RESULT</button>`
                : res.didYouMean.state
                  ? `<button class="btn btn--primary btn--sm" onclick="location.hash='#/history/${res.didYouMean.state.slug}'">VIEW RESULT</button>` : ""}
              <span class="ha-dym__meta">${res.didYouMean.place ? escapeHtml(res.didYouMean.place.name) + " · " + escapeHtml(res.didYouMean.place.stateName || "") : ""}</span>
            </div>` : ""}

          ${total ? group("Places", res.places.map(r => placeRow(r))) +
                   group("States", res.states.map(r => placeRow(r, "state"))) +
                   group("Dynasties", dynasties.map(ctxRow)) +
                   group("Historical context & culture", others.map(ctxRow))
            : res.didYouMean ? "" : `
            <div class="ha-noresults">
              <h3>No heritage stories found</h3>
              <p>We couldn't find a match for “${escapeHtml(q)}”.</p>
              <div class="ha-noresults__chips">
                ${["Hampi","Ramappa","Ajanta","Rajasthan","Chola","Buddhist","Forts","UNESCO"].map(s =>
                  `<button class="ha-chip" onclick="location.hash='#/search?q='+encodeURIComponent('${s}')">${s}</button>`).join("")}
              </div>
              <button class="btn btn--primary" onclick="location.hash='#/history'">EXPLORE ALL STATES</button>
            </div>`}

          <div style="margin-top:2.5rem"><button class="btn btn--ghost btn--sm" onclick="location.hash='#/history'">← Heritage Archive</button></div>
        </div>
      </section>`;
  }

  /* ---------- SearchBar + SearchDropdown (navbar) ---------- */
  function initHeritageSearch() {
    const H = window.GNGHeritage;
    const wrap = $("#navSearch"), trig = $("#navSearchTrigger"), input = $("#navSearchInput"),
          panel = $("#navSearchPanel"), goBtn = $("#navSearchGo"), mobBtn = $("#navSearchMobile");
    if (!wrap || !H) return;

    // Mobile / focus overlay
    const overlay = document.createElement("div");
    overlay.className = "ha-soverlay"; overlay.setAttribute("role","dialog"); overlay.setAttribute("aria-label","Search heritage");
    overlay.innerHTML = `
      <div class="ha-soverlay__bar">
        <input type="text" placeholder="Search places, states, monuments, history..." aria-label="Search places, states, monuments, history" />
        <button type="button">Close</button>
      </div>
      <div class="ha-spanel" hidden></div>`;
    document.body.appendChild(overlay);
    const oInput = overlay.querySelector("input"), oClose = overlay.querySelector("button"), oPanel = overlay.querySelector(".ha-spanel");

    let timer = null, items = [], activeIdx = -1;

    function closeAll() {
      wrap.classList.remove("open"); panel.hidden = true;
      overlay.classList.remove("open"); activeIdx = -1;
    }
    function openDesktop() { closeAll(); wrap.classList.add("open"); setTimeout(() => input.focus(), 60); }
    function openOverlay() { closeAll(); overlay.classList.add("open"); setTimeout(() => oInput.focus(), 60); }
    function isOpen() { return wrap.classList.contains("open") || overlay.classList.contains("open"); }

    function hrefFor(it) {
      if (it.kind === "place") return "#/history/" + it.item.stateSlug + "/" + it.item.slug;
      if (it.kind === "state") return "#/history/" + it.item.slug;
      const ref = (it.item.refs && it.item.refs[0]) ? H.getPlace(it.item.refs[0][0], it.item.refs[0][1]) : null;
      return ref ? "#/history/" + ref.state.slug + "/" + ref.place.slug : "#/search?q=" + encodeURIComponent(it.item.name);
    }
    function thumbFor(it) {
      const src = it.kind === "state" ? it.item.heroImage : it.kind === "place" ? it.item.image : null;
      if (src) return `<div class="ha-sitem__thumb">${haImgTag(src, src.split("/").pop(), it.item.name)}</div>`;
      return `<div class="ha-sitem__thumb ha-sitem__thumb--ctx"></div>`;
    }

    function renderPanel(box, q, inp) {
      activeIdx = -1;
      if (!q.trim()) { box.hidden = true; box.innerHTML = ""; items = []; return; }
      const sug = H.suggest(q, 8);
      items = sug.items;
      let html = "";
      if (sug.didYouMean) {
        const d = sug.didYouMean;
        html += `
          <div class="ha-sdym">
            <div class="ha-sdym__k">Did you mean?</div>
            <div class="ha-sdym__row">
              <span class="ha-sdym__name">${escapeHtml(d.name)}${d.place ? ` <span style="color:var(--muted-2);font-size:.78rem">· ${escapeHtml(d.place.stateName || "")}</span>` : ""}</span>
              <button class="btn btn--primary btn--sm" data-dym="1">VIEW</button>
            </div>
          </div>`;
      }
      const groupHTML = (label, kind) => {
        const gi = items.map((it, i) => ({ it, i })).filter(x => x.it.kind === kind);
        if (!gi.length) return "";
        return `<div class="ha-sgroup">${label}</div>` + gi.map(x => `
          <div class="ha-sitem" data-idx="${x.i}" role="button" tabindex="-1">
            ${thumbFor(x.it)}
            <div class="ha-sitem__body">
              <div class="ha-sitem__name">${escapeHtml(x.it.item.name)}</div>
              <div class="ha-sitem__meta">${x.it.kind === "place" ? `${escapeHtml(x.it.item.stateName)} · ${escapeHtml(x.it.item.dynasty || "")}` :
                x.it.kind === "state" ? `${(x.it.item.places||[]).length} Heritage Stories` :
                `${escapeHtml(x.it.item.period || "")}`}</div>
            </div>
            <span class="ha-sitem__go">${x.it.kind === "place" ? "READ STORY" : x.it.kind === "state" ? "EXPLORE" : "OPEN"} →</span>
          </div>`).join("");
      };
      html += groupHTML("Heritage place", "place") + groupHTML("State", "state") + groupHTML("Historical context", "context");
      if (!items.length && !sug.didYouMean) html += `<div class="ha-sempty">No close match found. Press Enter for full results.</div>`;
      html += `
        <div class="ha-spanel__hint"><span>Suggestions</span><span><span class="ha-kbd">↑↓</span> navigate · <span class="ha-kbd">↵</span> open · <span class="ha-kbd">esc</span> close</span></div>`;
      html += `<div class="ha-sfoot" data-all="1"><span>VIEW ALL RESULTS</span><span>→</span></div>`;
      box.innerHTML = html;
      box.hidden = false;

      box.querySelectorAll(".ha-sitem").forEach(el => {
        el.addEventListener("click", () => { closeAll(); location.hash = hrefFor(items[+el.dataset.idx]); });
      });
      const allBtn = box.querySelector("[data-all]");
      if (allBtn) allBtn.addEventListener("click", () => { closeAll(); location.hash = "#/search?q=" + encodeURIComponent(q); });
      const dymBtn = box.querySelector("[data-dym]");
      if (dymBtn) dymBtn.addEventListener("click", () => {
        const d = sug.didYouMean; closeAll();
        if (d.place) location.hash = "#/history/" + d.place.stateSlug + "/" + d.place.slug;
        else if (d.state) location.hash = "#/history/" + d.state.slug;
      });
    }

    function wireInput(inp, box) {
      inp.addEventListener("input", () => {
        clearTimeout(timer);
        timer = setTimeout(() => renderPanel(box, inp.value), 120);
      });
      inp.addEventListener("keydown", (e) => {
        const els = box.querySelectorAll(".ha-sitem, .ha-sfoot");
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!els.length) return;
          if (e.key === "ArrowDown") activeIdx = (activeIdx + 1) % els.length;
          else activeIdx = (activeIdx - 1 + els.length) % els.length;
          els.forEach(el => el.classList.remove("active"));
          els[activeIdx].classList.add("active");
          els[activeIdx].scrollIntoView({ block: "nearest" });
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (activeIdx >= 0 && els[activeIdx]) { els[activeIdx].click(); return; }
          if (inp.value.trim()) { closeAll(); location.hash = "#/search?q=" + encodeURIComponent(inp.value.trim()); }
        } else if (e.key === "Escape") { closeAll(); inp.blur(); }
      });
    }
    wireInput(input, panel);
    wireInput(oInput, oPanel);

    trig.addEventListener("click", () => { window.innerWidth <= 860 ? openOverlay() : openDesktop(); });
    if (mobBtn) mobBtn.addEventListener("click", openOverlay);
    oClose.addEventListener("click", closeAll);
    if (goBtn) goBtn.addEventListener("click", () => {
      if (input.value.trim()) { closeAll(); location.hash = "#/search?q=" + encodeURIComponent(input.value.trim()); }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".nav-search") && !e.target.closest(".ha-soverlay")) {
        panel.hidden = true; wrap.classList.remove("open");
      }
    });
    document.addEventListener("keydown", (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || ""));
      if (e.key === "/" && !typing && !isOpen()) { e.preventDefault(); window.innerWidth <= 860 ? openOverlay() : openDesktop(); }
      if (e.key === "Escape" && isOpen()) closeAll();
    });
  }


  /* =======================================================
   * VIEW: GUIDES — LinkedIn-style "People you may know" grid
   * ======================================================= */
  const dismissedGuides = new Set(JSON.parse(localStorage.getItem("gng_dismissed_guides") || "[]"));
  const connectedGuides = new Set(JSON.parse(localStorage.getItem("gng_connected_guides") || "[]"));

  function persistDismissed() { localStorage.setItem("gng_dismissed_guides", JSON.stringify([...dismissedGuides])); }
  function persistConnected() { localStorage.setItem("gng_connected_guides", JSON.stringify([...connectedGuides])); }

  function guideBannerFor(g, dest) {
    // Compose a warm editorial gradient per guide, biased by destination accent.
    const accents = {
      hampi:       ["#6a3a20", "#c96a3d", "#e8a96a"],
      belur:       ["#2f3a28", "#5a6a4a", "#a08a5a"],
      halebidu:    ["#1f2a20", "#4a5544", "#8a7a5a"],
      badami:      ["#5a2a1a", "#a0553a", "#d08a5a"],
      aihole:      ["#3a2f1a", "#7a6a44", "#c0a77a"],
      pattadakal:  ["#3a1f20", "#7a3a35", "#c07060"],
      haveri:      ["#2f2a1f", "#6a5a3a", "#a89060"]
    };
    // New district palettes
    const districtAccents = {};
    getAllDistricts().forEach(d => { districtAccents[d.id] = d.palette ? d.palette.slice(0,3) : ["#3a2a1a","#8a5a3a","#c9884a"]; });
    const pal = (dest && districtAccents[dest.id]) ? districtAccents[dest.id]
              : (dest && accents[dest.id]) ? accents[dest.id]
              : ["#3a2a1a","#8a5a3a","#c9884a"];
    // deterministic slight rotation per guide id (string hash -> angle)
    let h = 0; for (const c of (g.id || g.name)) h = (h*31 + c.charCodeAt(0)) >>> 0;
    const angle = (h % 60) * 6;
    return `linear-gradient(${angle}deg, ${pal[0]} 0%, ${pal[1]} 55%, ${pal[2]} 100%)`;
  }

  function guideAvatarBgFor(g) {
    let h = 0; for (const c of (g.id || g.name)) h = (h*17 + c.charCodeAt(0) + 53) >>> 0;
    const hues = [
      ["#8b3a1f","#c96a3d"],
      ["#3a5a44","#6a8060"],
      ["#7a3a35","#b05a50"],
      ["#5a4020","#a87840"],
      ["#2f3a55","#5a7098"],
      ["#4a3a60","#7a6a9a"],
      ["#8a5a20","#c89050"]
    ];
    const [a,b] = hues[h % hues.length];
    return `linear-gradient(135deg,${a},${b})`;
  }

  function buildHeadline(g, dest) {
    const special = g.specialties[0] || g.title;
    return `${g.title} · ${special}${dest ? ` · ${g.years} yrs at ${dest.name}` : ""}`;
  }

  function renderGuides() {
    const app = $("#app");
    let allGuides = [];
    getAllDestinations().forEach(d => (d.guides||[]).forEach(g => allGuides.push({...g, destId: d.id, destName: d.name})));
    getAllDistricts().forEach(d => (d.guides||[]).forEach(g => allGuides.push({...g, destId: d.id, destName: d.name})));
    allGuides = allGuides.filter(g => !dismissedGuides.has(g.id));

    const languages = new Set(); allGuides.forEach(g => g.languages.forEach(l => languages.add(l)));

    app.innerHTML = `
      <section style="padding-top:2rem">
        <div class="guides-header">
          <div>
            <span class="eyebrow">Local Guides</span>
            <h1>Local experts you may want to meet</h1>
            <p class="guides-header__sub">Verified heritage specialists, photographers and storytellers across Karnataka's heritage circuit. Filter by language, tap a card to connect.</p>
          </div>
          <button class="guides-header__showall" id="showAllGuides">Show all →</button>
        </div>

        <div class="guide-filter-bar">
          <button class="chip-filter active" data-lg="all">All Languages</button>
          ${[...languages].map(l => `<button class="chip-filter" data-lg="${l}">${l}</button>`).join("")}
        </div>

        <div class="guides-grid" id="guideGrid">
          ${allGuides.map(g => {
            const dest = getDestination(g.destId) || getDistrict(g.destId);
            return renderGuideCard(g, dest);
          }).join("")}
        </div>

        ${allGuides.length === 0 ? `
          <div style="max-width:520px;margin:2rem auto;padding:2rem;text-align:center;background:#fff;border:1px solid var(--line);border-radius:var(--radius-lg)">
            <h3 style="font-family:var(--serif);margin-bottom:.4rem">You've dismissed every guide.</h3>
            <p style="color:var(--muted-2);font-size:.9rem;margin-bottom:1rem">Reset the list to see all local experts again.</p>
            <button class="btn btn--primary btn--sm" id="resetGuides">Reset guides</button>
          </div>` : ""}

        <p style="text-align:center;padding:0 clamp(1rem,5vw,3rem);font-size:.78rem;color:var(--muted)">
          Guide profiles are illustrative demo data. The match percentage (shown after planning a trip) weights language, destination expertise and selected interests.
        </p>
      </section>
    `;

    const render = (list) => {
      const getGuideDest = (id) => getDestination(id) || getDistrict(id);
      $("#guideGrid").innerHTML = list.length
        ? list.map(g => renderGuideCard(g, getGuideDest(g.destId))).join("")
        : `<div style="grid-column:1/-1;padding:2rem;text-align:center;color:var(--muted-2)">No guides match that filter.</div>`;
      bindGuideCardActions();
    };

    $$(".chip-filter[data-lg]").forEach(chip => {
      chip.addEventListener("click", () => {
        $$(".chip-filter[data-lg]").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const lang = chip.dataset.lg;
        render(lang === "all" ? allGuides : allGuides.filter(g => g.languages.includes(lang)));
      });
    });

    const resetBtn = $("#resetGuides");
    if (resetBtn) resetBtn.addEventListener("click", () => {
      dismissedGuides.clear(); persistDismissed(); renderGuides();
    });

    const showAll = $("#showAllGuides");
    if (showAll) showAll.addEventListener("click", () => {
      window.scrollTo({top: 0, behavior: "smooth"});
      toast("Showing all guides.");
    });

    bindGuideCardActions();
  }

  function renderGuideCard(g, dest) {
    const initials = (g.name || "").split(/\s+/).map(s=>s[0]).slice(0,2).join("").toUpperCase() || "G";
    const connected = connectedGuides.has(g.id);
    const banner = guideBannerFor(g, dest);
    const avatarBg = guideAvatarBgFor(g);
    const headline = buildHeadline(g, dest);
    const mutual = g.specialties.slice(0,2).join(" · ");
    const iconPlus = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M9 7V4H7v3H4v2h3v3h2V9h3V7z"/><circle cx="12.5" cy="3.5" r="1.8" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>`;
    const iconCheck = `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6.5 11.3 3.2 8l1.1-1.1 2.2 2.2 5.2-5.2L12.8 5z"/></svg>`;
    return `
      <article class="guide-card" data-guide="${g.id}">
        <button class="guide-card__dismiss" data-dismiss="${g.id}" aria-label="Dismiss ${escapeHtml(g.name)}">✕</button>
        <div class="guide-card__banner" style="--banner:${banner}"></div>
        <div class="guide-card__avatar" style="--avatar-bg:${avatarBg}">${initials}</div>
        <div class="guide-card__body">
          <h3 class="guide-card__name">${escapeHtml(g.name)}</h3>
          <div class="guide-card__headline" title="${escapeHtml(headline)}">${escapeHtml(headline)}</div>
          <div class="guide-card__mutual">
            <span class="guide-card__mutual-icon">★</span>
            <span><strong style="color:var(--dark)">${g.rating}</strong> · ${g.trips.toLocaleString()} trips · ${escapeHtml(mutual)}</span>
          </div>
          <button class="guide-card__connect ${connected ? "connected" : ""}" data-connect="${g.id}">
            ${connected ? iconCheck : iconPlus}
            <span>${connected ? "Connected" : "+ Connect"}</span>
          </button>
        </div>
      </article>
    `;
  }

  function bindGuideCardActions() {
    $$("[data-dismiss]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.dismiss;
        dismissedGuides.add(id); persistDismissed();
        const card = btn.closest(".guide-card");
        if (card) {
          card.style.transition = "all .25s var(--ease)";
          card.style.transform = "scale(.9)"; card.style.opacity = "0";
          setTimeout(() => {
            // re-render current filtered set
            const activeLang = document.querySelector(".chip-filter.active[data-lg]")?.dataset.lg || "all";
            let list = [];
            getAllDestinations().forEach(d => (d.guides||[]).forEach(g => list.push({...g, destId: d.id, destName: d.name})));
            getAllDistricts().forEach(d => (d.guides||[]).forEach(g => list.push({...g, destId: d.id, destName: d.name})));
            list = list.filter(g => !dismissedGuides.has(g.id));
            if (activeLang !== "all") list = list.filter(g => g.languages.includes(activeLang));
            const grid = $("#guideGrid");
            if (grid) {
              if (list.length === 0) { renderGuides(); return; }
              // find correct destination/district object for each guide
              const getGuideDest = (id) => getDestination(id) || getDistrict(id);
              grid.innerHTML = list.map(g => renderGuideCard(g, getGuideDest(g.destId))).join("");
              bindGuideCardActions();
            }
          }, 220);
        }
      });
    });
    $$("[data-connect]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.connect;
        if (connectedGuides.has(id)) {
          connectedGuides.delete(id); toast(`Disconnected.`);
        } else {
          connectedGuides.add(id); toast(`Request sent to ${btn.closest(".guide-card").querySelector(".guide-card__name").textContent.trim()}`,"success");
        }
        persistConnected();
        const card = btn.closest(".guide-card");
        if (card) {
          // find the guide by searching both legacy destinations and districts
          let found = null, foundDest = null;
          const searchGuide = (d) => {
            (d.guides||[]).forEach(g => { if (g.id === id) { found = {...g, destId: d.id, destName: d.name}; foundDest = d; } });
          };
          getAllDestinations().forEach(searchGuide);
          if (!found) getAllDistricts().forEach(searchGuide);
          if (found) card.outerHTML = renderGuideCard(found, foundDest);
          bindGuideCardActions();
        }
      });
    });
  }

  /* =======================================================
   * VIEW: PLANNER WIZARD
   * ======================================================= */
  function renderPlanner() {
    // reset wizard but keep defaults
    const app = $("#app");

    app.innerHTML = `
      <section class="wizard" id="wizardRoot">
        <div class="wizard__inner">
          <div class="wizard__progress" id="wizardProgress">
            ${[1,2,3,4,5].map(i=>`<div class="wizard__step-dot" data-step="${i}"><span></span></div>`).join("")}
          </div>
          <div class="wizard__step-labels">
            <span>Depth</span><span>Destination</span><span>Interests</span><span>Details</span><span>Generate</span>
          </div>

          <div id="wizardSteps"></div>

          <div class="wizard__nav">
            <button class="btn btn--ghost" id="wizardBack" disabled>← Back</button>
            <button class="btn btn--primary" id="wizardNext">Continue →</button>
          </div>
        </div>
      </section>
    `;

    // Make sure defaults are set
    if (!state.wizard.interests.size) {
      // default interests depending on destination? keep empty
    }

    wizardStep(1);

    $("#wizardBack").addEventListener("click", wizardBack);
    $("#wizardNext").addEventListener("click", wizardNext);
  }

  let wizardCurrent = 1;
  function wizardStep(n) {
    wizardCurrent = n;
    const container = $("#wizardSteps");

    // Update progress
    $$(".wizard__step-dot").forEach(dot => {
      const s = parseInt(dot.dataset.step, 10);
      dot.classList.toggle("done", s < n);
      dot.classList.toggle("active", s === n);
    });

    // Back button state
    $("#wizardBack").disabled = n === 1;
    $("#wizardNext").textContent = n === 5 ? "Generate My Journey" : "Continue →";

    if (n === 1) container.innerHTML = step1HTML();
    if (n === 2) container.innerHTML = step2HTML();
    if (n === 3) container.innerHTML = step3HTML();
    if (n === 4) container.innerHTML = step4HTML();
    if (n === 5) container.innerHTML = step5HTML();

    bindStep(n);
  }
  function wizardBack() { if (wizardCurrent > 1) wizardStep(wizardCurrent - 1); }
  function wizardNext() {
    if (!validateStep(wizardCurrent)) return;
    if (wizardCurrent < 5) return wizardStep(wizardCurrent + 1);
    // step 5 -> generate
    generateJourney();
  }
  function validateStep(n) {
    if (n === 1 && !state.wizard.level) { toast("Choose a trip depth to continue."); return false; }
    if (n === 2 && !state.wizard.destination) { toast("Choose a destination to continue."); return false; }
    if (n === 3 && state.wizard.interests.size < 1) { toast("Select at least one interest."); return false; }
    return true;
  }

  function step1HTML() {
    return `
      <div class="wizard__step active">
        <span class="eyebrow">Step 01 · Depth</span>
        <h2>How deep do you want to explore?</h2>
        <p class="wizard__sub">Choose how long you want to spend. We'll scale stops, detours and pace accordingly.</p>
        <div class="level-cards">
          ${TRIP_LEVELS.map(l => `
            <div class="level-card ${state.wizard.level === l.id ? 'selected':''}" data-level="${l.id}">
              <div class="level-card__num">${l.number}</div>
              <div class="level-card__dur">${l.duration}</div>
              <h3>${l.title}</h3>
              <p>${l.desc}</p>
              <ul>${l.ideal.map(x => `<li>${x}</li>`).join("")}</ul>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
  /* =======================================================
   * STEP 02 · INDIA-WIDE DESTINATION SELECTION
   * India → State / UT → District → Top tourist places.
   * All destination data comes from the GNGIndiaDestinations
   * service (data layer); nothing state-specific is hard-coded
   * here. Selection persists in state.wizard.destination +
   * state.wizard.destinationSelection (stable IDs).
   * ======================================================= */
  const step2 = {
    view: "states",            // states | districts | places
    stateId: null, districtId: null,
    stateQuery: "", districtQuery: "", placeQuery: "",
    region: "All", openPlaceId: null
  };
  const step2Registry = new Map();   // "districtId/placeId" -> place (for modals/actions)
  const IN_TINTS = [["#3a2a20","#6a5a48"],["#22301f","#4a5a3a"],["#3a2020","#6a4038"],["#20303a","#40586a"],["#2f2a20","#57492f"],["#241f30","#453a5a"]];
  const IN_GLYPHS = ["◆", "▲", "✦", "❖", "◈", "⬡"];
  const IN_TAG_ICONS = { heritage:"🏛", architecture:"🏗", photography:"📷", history:"📜", spiritual:"🕉", nature:"🌿", food:"🍛", culture:"🎭", sunset:"🌇", sunrise:"🌅", beaches:"🏖", adventure:"🧗", trekking:"🥾", wildlife:"🐘", markets:"🏪", family:"👨‍👩‍👧", couples:"💞", hidden:"🗝", forts:"🏰" };

  window.__inImgFail = function(el) {
    const name = el.dataset.name || "India";
    const gi = (+el.dataset.gi || 0) % 6;
    const f = document.createElement("div");
    f.className = "in-img-fallback";
    f.style.setProperty("--ft1", IN_TINTS[gi][0]);
    f.style.setProperty("--ft2", IN_TINTS[gi][1]);
    f.innerHTML = `<span>${IN_GLYPHS[gi]}</span><small>${escapeHtml(name)}</small>`;
    el.replaceWith(f);
  };
  function inImgHtml(image, name, gi) {
    if (image && image.src) {
      return `<img src="${image.src}" alt="${escapeHtml(image.alt || name)}" loading="lazy" decoding="async"
                   data-name="${escapeHtml(name)}" data-gi="${gi % 6}" onerror="__inImgFail(this)" />`;
    }
    const t = IN_TINTS[gi % 6];
    return `<div class="in-img-fallback" style="--ft1:${t[0]};--ft2:${t[1]}"><span>${IN_GLYPHS[gi % 6]}</span><small>${escapeHtml(name)}</small></div>`;
  }
  function inMatchBadge(place, districtId) {
    if (!state.wizard.interests.size || !window.GNGIntel) return "";
    try {
      const m = GNGIntel.calculatePlaceMatch(place, GNGIntel.prefsFromWizard(state.wizard), { destId: districtId });
      return `<span class="in-match-badge">${Math.round(m.finalScore)}% match</span>`;
    } catch (e) { return ""; }
  }
  function inStep2Error() {
    return `
      <div class="wizard__step active">
        <span class="eyebrow">Step 02 · Destination</span>
        <h2>Where are you <em>going?</em></h2>
        <div class="in-error" style="margin-top:1.2rem">
          <b>We couldn’t load destinations right now.</b>
          Please try again.
          <div style="margin-top:.9rem"><button class="in-btn in-btn--solid" id="inRetryBtn">Retry</button></div>
        </div>
      </div>`;
  }

  function step2HTML() {
    const IND = window.GNGIndiaDestinations;
    if (!IND || !IND.ready()) return inStep2Error();
    try {
      if (step2.view === "districts" && step2.stateId) return step2DistrictsHTML();
      if (step2.view === "places" && step2.stateId && step2.districtId) return step2PlacesHTML();
      step2.view = "states";
      return step2StatesHTML();
    } catch (e) {
      console.warn("Step 02 render failed", e);
      return inStep2Error();
    }
  }

  /* ---------- View 1: States & Union Territories ---------- */
  function step2StatesHTML() {
    const IND = GNGIndiaDestinations;
    const regions = IND.regions();
    const chips = regions.map(r =>
      `<button class="in-region-chip ${step2.region === r ? "active" : ""}" data-region="${r}">${r}</button>`).join("");
    return `
      <div class="wizard__step active">
        <span class="eyebrow">Step 02 · Destination</span>
        <h2>Where are you <em>going?</em></h2>
        <p class="wizard__sub">Choose a state and discover its best places, district by district.</p>

        <div class="in-intro-head">
          <span class="in-kicker">Explore India</span>
          <p>From Himalayan valleys to coastal villages, discover India’s heritage, culture and landscapes.</p>
        </div>

        <div class="dest-search"><input type="text" id="inStateSearch" value="${escapeHtml(step2.stateQuery)}" placeholder="Search states or union territories..." aria-label="Search states or union territories" /></div>
        <div class="in-region-row" id="inRegionRow">${chips}</div>

        <div id="inFeaturedWrap"></div>
        <div class="india-section-head"><span>All states &amp; union territories</span><small id="inStateCount"></small></div>
        <div class="in-grid" id="inStateGrid"></div>
        <div id="inStateEmpty"></div>

        <div class="india-section-head" style="margin-top:2rem"><span>Heritage circuits</span><small>Collections built from verified destination data.</small></div>
        <div class="in-grid" id="inCircuitGrid">
          ${(IND.circuits() || []).map((c, i) => `
            <button class="in-circuit-card" data-circuit="${c.id}">
              <span class="in-circuit-name">${escapeHtml(c.name)}</span>
              <span class="in-circuit-meta">${escapeHtml(c.theme)} · ${escapeHtml(c.estimatedDuration)}</span>
              <span class="in-circuit-places">${c.resolvedPlaces.map(p => escapeHtml(p.name)).join(" · ")}</span>
            </button>`).join("")}
        </div>
      </div>`;
  }
  function inStateCardHTML(s, gi) {
    const IND = GNGIndiaDestinations;
    let selected = false;
    try { const d = state.wizard.destination && IND.districtById(state.wizard.destination); selected = !!(d && d.stateId === s.id); } catch (e) {}
    const badge = s.status === "verified"
      ? `<span class="in-card-badge in-card-badge--curated">Curated · ${s.curatedDistricts} district${s.curatedDistricts !== 1 ? "s" : ""}</span>`
      : (s.heritageStories ? `<span class="in-card-badge in-card-badge--archive">Heritage archive</span>` : `<span class="in-card-badge">Coming soon</span>`);
    const sub = s.type === "union-territory" ? "Union Territory" : `Capital ${s.capital}`;
    return `
      <button class="in-state-card ${selected ? "selected" : ""}" data-state="${s.id}">
        <div class="in-card-img">${inImgHtml(s.image, s.name, gi)}${badge}</div>
        <div class="in-card-body">
          <div class="in-card-name">${escapeHtml(s.name)}</div>
          <div class="in-card-sub">${s.districtsCount} district${s.districtsCount !== 1 ? "s" : ""} · ${escapeHtml(sub)}</div>
          <div class="in-card-themes">${escapeHtml(s.themes.join(" · "))}</div>
          <span class="in-card-cta">Explore state →</span>
        </div>
      </button>`;
  }
  function step2RefreshStateGrid() {
    const IND = GNGIndiaDestinations;
    let list = IND.searchStates(step2.stateQuery);
    if (step2.region !== "All") list = list.filter(s => s.region === step2.region);
    const grid = $("#inStateGrid"), empty = $("#inStateEmpty"), count = $("#inStateCount"), feat = $("#inFeaturedWrap");
    if (!grid) return;
    grid.innerHTML = list.map((s, i) => inStateCardHTML(s, i)).join("");
    count.textContent = list.length ? `${list.length} of 36 shown` : "";
    empty.innerHTML = list.length ? "" : `<div class="in-empty"><b>No states found.</b>Try another state or region.</div>`;
    if (feat) {
      const showFeat = !step2.stateQuery && step2.region === "All";
      feat.innerHTML = showFeat ? `
        <div class="india-section-head"><span>Featured right now</span><small>Hand-picked states with curated district data.</small></div>
        <div class="in-featured-grid">${IND.featuredStates().map((s, i) => inStateCardHTML(s, i + 1)).join("")}</div>` : "";
    }
    $$("#inStateGrid [data-state]", grid).forEach(el => el.addEventListener("click", () => {
      step2.stateId = el.dataset.state; step2.view = "districts"; step2.districtQuery = "";
      wizardStep(2);
    }));
    if (feat) $$("#inFeaturedWrap [data-state]", feat).forEach(el => el.addEventListener("click", () => {
      step2.stateId = el.dataset.state; step2.view = "districts"; step2.districtQuery = "";
      wizardStep(2);
    }));
  }

  /* ---------- View 2: Districts of a state ---------- */
  function step2DistrictsHTML() {
    const st = GNGIndiaDestinations.getState(step2.stateId);
    if (!st) { step2.view = "states"; return step2StatesHTML(); }
    return `
      <div class="wizard__step active">
        <nav class="in-crumb"><button data-nav="states">India</button><i>/</i><span>${escapeHtml(st.name)}</span></nav>
        <button class="in-back" data-nav="states">← All states</button>
        <h2 class="in-drill-title">${escapeHtml(st.name)}</h2>
        <p class="wizard__sub">Explore ${escapeHtml(st.name)} district by district. ${escapeHtml(st.shortDescription)}</p>

        <div class="dest-search"><input type="text" id="inDistrictSearch" value="${escapeHtml(step2.districtQuery)}" placeholder="Search districts..." aria-label="Search districts" /></div>
        <div class="india-section-head"><span>Districts</span><small id="inDistrictCount"></small></div>
        <div class="in-grid" id="inDistrictGrid"></div>
        <div id="inDistrictEmpty"></div>
      </div>`;
  }
  function inDistrictCardHTML(d, gi) {
    const selected = state.wizard.destination === d.id;
    const n = (d.places || []).length;
    const themes = (d.themes || []).slice(0, 3).join(" · ");
    return `
      <button class="in-district-card ${selected ? "selected" : ""} ${d.status === "partial" ? "is-partial" : ""}" data-district="${d.id}">
        <div class="in-card-img">
          ${inImgHtml(d.image, d.name, gi)}
          ${d.status === "verified" ? "" : `<span class="in-card-badge in-card-badge--archive">Archive picks</span>`}
          <span class="in-card-badge" style="left:auto;right:.55rem;background:rgba(247,243,236,.94);color:#171717">${n} top place${n !== 1 ? "s" : ""}</span>
        </div>
        <div class="in-card-body">
          <div class="in-card-name">${escapeHtml(d.name)}</div>
          <div class="in-card-sub">${escapeHtml(GNGIndiaDestinations.getState(d.stateId).name)} · ${n} top place${n !== 1 ? "s" : ""}</div>
          <div class="in-card-themes">${escapeHtml(themes)}</div>
          <span class="in-card-cta">Explore →</span>
        </div>
      </button>`;
  }
  function step2RefreshDistrictGrid() {
    const st = GNGIndiaDestinations.getState(step2.stateId);
    const list = GNGIndiaDestinations.searchDistricts(step2.stateId, step2.districtQuery);
    const grid = $("#inDistrictGrid"), empty = $("#inDistrictEmpty"), count = $("#inDistrictCount");
    if (!grid) return;
    grid.innerHTML = list.map((d, i) => inDistrictCardHTML(d, i)).join("");
    count.textContent = list.length ? `${list.length} district${list.length !== 1 ? "s" : ""}` : "";
    if (!list.length) {
      empty.innerHTML = st && GNGIndiaDestinations.districts(step2.stateId).length
        ? `<div class="in-empty"><b>No districts match your search.</b>Try a different name.</div>`
        : `<div class="in-empty"><b>District guides for ${escapeHtml(st ? st.name : "this state")} are coming soon.</b>
             ${st && st.heritageStories ? `${st.heritageStories} verified heritage stor${st.heritageStories !== 1 ? "ies are" : "y is"} available in the <a href="#/history">Heritage Archive</a>.` : "This demo is expanding state by state — Karnataka, Rajasthan, Kerala, Tamil Nadu, Goa and Himachal Pradesh are curated today."}
           </div>`;
    } else empty.innerHTML = "";
    $$("#inDistrictGrid [data-district]", grid).forEach(el => el.addEventListener("click", () => {
      step2.districtId = el.dataset.district; step2.view = "places"; step2.placeQuery = ""; step2.openPlaceId = null;
      wizardStep(2);
    }));
  }

  /* ---------- View 3: Top tourist places of a district ---------- */
  function step2PlacesHTML() {
    const d = GNGIndiaDestinations.district(step2.stateId, step2.districtId);
    if (!d) { step2.view = "districts"; return step2DistrictsHTML(); }
    const st = GNGIndiaDestinations.getState(step2.stateId);
    step2Registry.clear();
    (d.places || []).forEach(p => step2Registry.set(d.id + "/" + p.id, p));
    const n = (d.places || []).length;
    const interestsHint = state.wizard.interests.size ? "" :
      `<p class="in-match-note">Tip — pick interests in Step 03 and return here to see a personal match score on every place.</p>`;
    return `
      <div class="wizard__step active">
        <nav class="in-crumb">
          <button data-nav="states">India</button><i>/</i>
          <button data-nav="districts">${escapeHtml(st.name)}</button><i>/</i>
          <span>${escapeHtml(d.name)}</span>
        </nav>
        <button class="in-back" data-nav="districts">← Back to districts</button>
        <h2 class="in-drill-title">${escapeHtml(d.name)}</h2>
        <p class="wizard__sub">${escapeHtml(d.description || "")} ${d.status === "partial" ? " <em>(National Heritage Archive selection — curated district guide coming soon.)</em>" : ""}</p>

        <div class="dest-search"><input type="text" id="inPlaceSearch" value="${escapeHtml(step2.placeQuery)}" placeholder="Search places, tags..." aria-label="Search places" /></div>
        <div class="india-section-head"><span>Top places to visit</span><small>Ranked by travel importance · ${n} place${n !== 1 ? "s" : ""}</small></div>
        ${interestsHint}
        <div class="in-place-grid" id="inPlaceGrid">${inPlacesGridHTML(d)}</div>
        <div id="inPlaceEmpty"></div>

        <div class="in-confirm-row" id="inConfirmRow">
          <div>
            <span class="in-count-chip" id="inSelChip"></span>
          </div>
          <span class="in-note" id="inSelNote"></span>
          <button class="in-btn in-btn--solid" data-confirm="${d.id}">${state.wizard.destination === d.id ? "✓ Selected for your journey" : `Use ${escapeHtml(d.name)} for my journey`}</button>
        </div>
      </div>`;
  }
  function inPlacesGridHTML(d) {
    return (d.places || []).map((p, i) => {
      const key = d.id + "/" + p.id;
      const added = state.wizard.destinationSelection.selectedPlaceIds.includes(key);
      const open = step2.openPlaceId === p.id;
      const hrs = Math.round((p.durationMin || 60) / 60 * 10) / 10;
      const durTxt = hrs >= 1 ? (Number.isInteger(hrs) ? `${hrs} hr${hrs !== 1 ? "s" : ""}` : `${hrs} hrs`) : `${p.durationMin} min`;
      const tags = (p.tags || []).slice(0, 4);
      return `
        <article class="in-place-card ${added ? "added" : ""}" data-place="${p.id}" data-search="${escapeHtml((p.name + " " + tags.join(" ") + " " + (p.shortDescription || "")).toLowerCase())}">
          <div class="in-place-card__imgwrap">
            ${inImgHtml(p.image, p.name, i)}
            <span class="in-card-rank">${String(i + 1).padStart(2, "0")}</span>
            ${inMatchBadge(p, d.id)}
          </div>
          <div class="in-place-card__body">
            <div class="in-place-card__type">${escapeHtml(p.type || "Place")}${p.verified ? " · verified" : ""}</div>
            <div class="in-place-card__name">${escapeHtml(p.name)}</div>
            <div class="in-place-card__desc">${escapeHtml(p.shortDescription || "")}</div>
            <div class="in-place-card__meta">
              <span>Best time <b>${escapeHtml(p.bestTime || "Daytime")}</b></span>
              <span>Recommended <b>${durTxt}</b></span>
            </div>
            <div class="in-place-card__tags">${tags.map(t => (IN_TAG_ICONS[t] ? IN_TAG_ICONS[t] + " " : "") + escapeHtml(t)).join(" · ")}</div>
            <div class="in-place-actions">
              <button class="in-btn" data-open-place="${p.id}">${open ? "Hide details" : "Why visit?"}</button>
              <button class="in-btn in-btn--add ${added ? "added" : ""}" data-add-place="${p.id}">${added ? "Added ✓" : "+ Add to journey"}</button>
            </div>
            ${open ? inPlaceDetailHTML(d, p, added) : ""}
          </div>
        </article>`;
    }).join("");
  }
  function inPlaceDetailHTML(d, p, added) {
    const hrs = Math.round(((p.durationMin || 60) / 60) * 10) / 10;
    const credit = p.image && p.image.status === "generated" ? "AI-generated editorial illustration (representative)" : (p.image ? p.image.credit : "Image unavailable");
    const storyLink = p.archiveRef ? `<a class="in-btn" style="text-decoration:none" href="#/history/${p.archiveRef.state}/${p.archiveRef.slug}">Read the full story →</a>` : "";
    return `
      <div class="in-place-detail">
        <p><strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(p.shortDescription || "")}</p>
        <div class="in-why-chips">
          ${(p.tags || []).slice(0, 6).map(t => `<span class="in-why-chip">${IN_TAG_ICONS[t] || "•"} ${escapeHtml(t)}</span>`).join("")}
        </div>
        <div class="in-detail-kv">
          <span><b>Best time</b>${escapeHtml(p.bestTime || "Daytime")}</span>
          <span><b>Recommended</b>${hrs} hrs</span>
          <span><b>Image</b>${escapeHtml(credit)}</span>
        </div>
        <div class="in-place-actions">
          <button class="in-btn in-btn--solid" data-why="${p.id}">Why should I go?</button>
          <button class="in-btn in-btn--add ${added ? "added" : ""}" data-add-place="${p.id}">${added ? "Added ✓" : "Add to my journey"}</button>
          ${storyLink}
        </div>
      </div>`;
  }

  /* ---------- Step 02 actions ---------- */
  function step2SelCount(districtId) {
    return state.wizard.destinationSelection.selectedPlaceIds.filter(k => k.startsWith(districtId + "/")).length;
  }
  function step2UpdateConfirmRow(districtId, dName) {
    const chip = $("#inSelChip"), note = $("#inSelNote");
    const n = step2SelCount(districtId);
    if (chip) chip.innerHTML = `${state.wizard.destination === districtId ? "✓" : "◎"} ${escapeHtml(dName)}`;
    if (note) note.textContent = n ? `${n} place${n !== 1 ? "s" : ""} preselected for your journey` : "Add places to preselect them, or continue with the ranked shortlist.";
  }
  window.__gngWhyStep2 = function(districtId, placeId) {
    const p = step2Registry.get(districtId + "/" + placeId);
    if (p && window.GNGIntel) GNGIntel.openWhyModal({ kind: "place", place: p, destId: districtId });
  };
  window.__gngAddStep2 = function(districtId, placeId) {
    const ds = state.wizard.destinationSelection;
    const key = districtId + "/" + placeId;
    const idx = ds.selectedPlaceIds.indexOf(key);
    const adding = idx < 0;
    if (adding) {
      ds.selectedPlaceIds.push(key);
      ds.stateId = step2.stateId; ds.districtId = districtId;
      state.wizard.destination = districtId;         // stable id for the planner
      tripDraft.districtId = districtId;             // existing preselection mechanism
      tripDraft.placeIds.add(placeId);
      toast(`${step2Registry.get(key) ? step2Registry.get(key).name : "Place"} added to your journey.`, "success");
    } else {
      ds.selectedPlaceIds.splice(idx, 1);
      if (tripDraft.districtId === districtId) tripDraft.placeIds.delete(placeId);
      toast("Removed from your journey.");
    }
    // Update cards in place (no re-render, keeps scroll + open detail)
    const p = step2Registry.get(key);
    $$(`.in-place-card[data-place="${placeId}"]`).forEach(card => {
      card.classList.toggle("added", adding);
      $$("[data-add-place]", card).forEach(b => { b.classList.toggle("added", adding); b.textContent = adding ? "Added ✓" : "+ Add to journey"; });
    });
    const dName = (GNGIndiaDestinations.district(step2.stateId, districtId) || {}).name || districtId;
    step2UpdateConfirmRow(districtId, dName);
    const row = $("#inConfirmRow");
    if (row) {
      const btn = $("[data-confirm]", row);
      if (btn) btn.textContent = `✓ Selected for your journey`;
    }
  };
  function step2ConfirmDistrict(districtId) {
    const d = GNGIndiaDestinations.district(step2.stateId, districtId) || GNGIndiaDestinations.districtById(districtId);
    // Circuit anchors may be legacy heritage destinations (data.js) — still valid targets.
    if (!d && !resolveTarget(districtId)) { toast("That destination isn’t available yet.", "error"); return; }
    state.wizard.destination = districtId;
    const name = d ? d.name : districtId.replace(/-/g, " ");
    const ds = state.wizard.destinationSelection;
    ds.country = "India"; ds.stateId = d ? d.stateId : step2.stateId; ds.districtId = districtId;
    // Preselect every place the user added from THIS district
    tripDraft.districtId = districtId;
    tripDraft.placeIds = new Set(ds.selectedPlaceIds.filter(k => k.startsWith(districtId + "/")).map(k => k.split("/")[1]));
    toast(`${name} selected — Continue to Step 03 when ready.`, "success");
    step2UpdateConfirmRow(districtId, name);
    const row = $("#inConfirmRow");
    if (row) { const btn = $("[data-confirm]", row); if (btn) btn.textContent = "✓ Selected for your journey"; }
    // Reflect selection on district cards if user goes back
    if (step2.view === "places") return;
    wizardStep(2);
  }
  function bindStep2PlaceCards(d) {
    if (!d) return;
    const districtId = d.id;
    $$("#inPlaceGrid [data-add-place]").forEach(b => b.addEventListener("click", ev => {
      ev.stopPropagation();
      __gngAddStep2(districtId, b.dataset.addPlace);
    }));
    $$("#inPlaceGrid [data-why]").forEach(b => b.addEventListener("click", ev => {
      ev.stopPropagation();
      __gngWhyStep2(districtId, b.dataset.why);
    }));
  }

  function step3HTML() {
    return `
      <div class="wizard__step active">
        <span class="eyebrow">Step 03 · Interests</span>
        <h2>What do you want to experience?</h2>
        <p class="wizard__sub">Select as many as you like. We score every place against every interest — more picks = better matches.</p>
        <div class="interest-grid">
          ${INTERESTS.map(i => `
            <button class="interest-pill ${state.wizard.interests.has(i.id)?'selected':''}" data-interest="${i.id}">
              <div class="interest-pill__ico">${i.icon}</div>
              <div class="interest-pill__lbl">${i.label}</div>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }
  function step4HTML() {
    const w = state.wizard;
    return `
      <div class="wizard__step active">
        <span class="eyebrow">Step 04 · Travel details</span>
        <h2>How are you travelling?</h2>
        <p class="wizard__sub">We use this for realistic pacing and fuel/EV routing.</p>

        <div class="detail-grid">
          <div class="detail-field">
            <label>Starting location</label>
            <input type="text" id="fStart" value="${escapeHtml(w.startPoint||'')}" placeholder="e.g. Hampi Bazaar, Hospet">
          </div>
          <div class="detail-field">
            <label>Date</label>
            <input type="date" id="fDate" value="${w.date||''}">
          </div>
          <div class="detail-field">
            <label>Start time</label>
            <input type="time" id="fTime" value="${w.time||'08:00'}">
          </div>
          <div class="detail-field">
            <label>Travellers</label>
            <select id="fTravellers">
              ${TRAVELLER_TYPES.map(t => `<option ${w.travellers===t?'selected':''}>${t}</option>`).join("")}
            </select>
          </div>
        </div>

        <div style="margin-top:1.5rem">
          <label class="eyebrow">Transport</label>
          <div class="option-row" id="optTransport">
            ${TRANSPORTS.map(t => `
              <button class="option-btn ${w.transport===t.id?'selected':''}" data-val="${t.id}">${t.icon} ${t.label}</button>
            `).join("")}
          </div>

          <label class="eyebrow" style="margin-top:1rem">Budget</label>
          <div class="option-row" id="optBudget">
            ${BUDGETS.map(b => `
              <button class="option-btn ${w.budget===b.id?'selected':''}" data-val="${b.id}">${b.label}</button>
            `).join("")}
          </div>

          <label class="eyebrow" style="margin-top:1rem">Language for guide</label>
          <div class="option-row" id="optLang">
            ${LANGUAGES.slice(0,6).map(l => `
              <button class="option-btn ${w.language===l?'selected':''}" data-val="${l}">${l}</button>
            `).join("")}
          </div>

          <label class="eyebrow" style="margin-top:1rem">Pace</label>
          <div class="option-row" id="optPace">
            ${PACES.map(p => `
              <button class="option-btn ${w.pace===p?'selected':''}" data-val="${p}">${p}</button>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }
  function step5HTML() {
    const tgt = resolveTarget(state.wizard.destination);
    const d = tgt ? tgt.target : null;
    const level = TRIP_LEVELS.find(l => l.id === state.wizard.level);
    const interestsText = [...state.wizard.interests].map(i => INTERESTS.find(x=>x.id===i)?.label).filter(Boolean).join(", ");
    const transport = TRANSPORTS.find(t => t.id === state.wizard.transport);
    return `
      <div class="wizard__step active">
        <span class="eyebrow">Step 05 · Review</span>
        <h2>Ready when you are.</h2>
        <p class="wizard__sub">We'll build your journey in a few seconds — you can add or remove any stop afterwards.</p>
        <div style="background:#fff;border:1px solid var(--line);border-radius:var(--radius-lg);padding:2rem;display:grid;gap:1rem">
          <div class="kv"><div class="kv__k">Destination</div><div class="kv__v">${d?d.name:"—"}</div></div>
          <div class="kv"><div class="kv__k">Trip level</div><div class="kv__v">${level?titleCase(level.title):"—"} · ${level?level.duration:""}</div></div>
          <div class="kv"><div class="kv__k">Interests</div><div class="kv__v">${interestsText||"—"}</div></div>
          <div class="kv"><div class="kv__k">Transport</div><div class="kv__v">${transport?transport.label:"—"}</div></div>
          <div class="kv"><div class="kv__k">Language</div><div class="kv__v">${state.wizard.language}</div></div>
          <div class="kv"><div class="kv__k">Budget · Pace</div><div class="kv__v">${titleCase(state.wizard.budget)} · ${state.wizard.pace}</div></div>
        </div>
      </div>
    `;
  }

  function titleCase(s) { return String(s).replace(/\b\w/g, c => c.toUpperCase()); }

  function bindStep(n) {
    if (n === 1) {
      $$(".level-card").forEach(c => c.addEventListener("click", () => {
        $$(".level-card").forEach(x => x.classList.remove("selected"));
        c.classList.add("selected");
        state.wizard.level = c.dataset.level;
      }));
    }
    if (n === 2) {
      // India-wide drilldown bindings (states → districts → places)
      const retry = $("#inRetryBtn");
      if (retry) retry.addEventListener("click", () => { step2.view = "states"; wizardStep(2); });

      const sIn = $("#inStateSearch");
      if (sIn) {
        sIn.addEventListener("input", e => { step2.stateQuery = e.target.value; step2RefreshStateGrid(); });
        $$("#inRegionRow [data-region]").forEach(ch => ch.addEventListener("click", () => {
          step2.region = ch.dataset.region;
          $$("#inRegionRow [data-region]").forEach(x => x.classList.toggle("active", x === ch));
          step2RefreshStateGrid();
        }));
        $$("#inCircuitGrid [data-circuit]").forEach(el => el.addEventListener("click", () => {
          const c = (GNGIndiaDestinations.circuits() || []).find(x => x.id === el.dataset.circuit);
          if (!c) return;
          step2ConfirmDistrict(c.anchorDistrictId);
          toast(`${c.name} — destination set to ${c.anchorDistrictId.replace(/-/g, " ")}.`, "success");
        }));
        step2RefreshStateGrid();
      }

      const dIn = $("#inDistrictSearch");
      if (dIn) {
        dIn.addEventListener("input", e => { step2.districtQuery = e.target.value; step2RefreshDistrictGrid(); });
        step2RefreshDistrictGrid();
      }

      const pIn = $("#inPlaceSearch");
      if (pIn) {
        const d = GNGIndiaDestinations.district(step2.stateId, step2.districtId);
        step2UpdateConfirmRow(step2.districtId, d ? d.name : step2.districtId);
        pIn.addEventListener("input", e => {
          const q = e.target.value.trim().toLowerCase();
          let shown = 0;
          $$("#inPlaceGrid .in-place-card").forEach(card => {
            const hit = !q || (card.dataset.search || "").includes(q);
            card.style.display = hit ? "" : "none";
            if (hit) shown++;
          });
          const emp = $("#inPlaceEmpty");
          if (emp) emp.innerHTML = shown ? "" : `<div class="in-empty"><b>No places match your search.</b>Try another name or tag.</div>`;
        });
        $$("#inPlaceGrid [data-open-place]").forEach(b => b.addEventListener("click", ev => {
          ev.stopPropagation();
          step2.openPlaceId = step2.openPlaceId === b.dataset.openPlace ? null : b.dataset.openPlace;
          const grid = $("#inPlaceGrid");
          if (grid) grid.innerHTML = inPlacesGridHTML(d);
          bindStep2PlaceCards(d);
        }));
        bindStep2PlaceCards(d);
      }

      // Drill navigation (breadcrumb / back links) — present on all sub-views
      $$("[data-nav]").forEach(el => el.addEventListener("click", () => {
        const to = el.dataset.nav;
        if (to === "states") { step2.view = "states"; }
        if (to === "districts") { step2.view = "districts"; }
        wizardStep(2);
      }));
      const confirmBtn = $("[data-confirm]");
      if (confirmBtn) confirmBtn.addEventListener("click", () => step2ConfirmDistrict(confirmBtn.dataset.confirm));
    }
    if (n === 3) {
      $$(".interest-pill").forEach(p => p.addEventListener("click", () => {
        p.classList.toggle("selected");
        const id = p.dataset.interest;
        if (state.wizard.interests.has(id)) state.wizard.interests.delete(id);
        else state.wizard.interests.add(id);
      }));
    }
    if (n === 4) {
      const start = $("#fStart"); if (start) start.addEventListener("input", e => state.wizard.startPoint = e.target.value);
      const date = $("#fDate"); if (date) date.addEventListener("input", e => state.wizard.date = e.target.value);
      const time = $("#fTime"); if (time) time.addEventListener("input", e => state.wizard.time = e.target.value);
      const tr = $("#fTravellers"); if (tr) tr.addEventListener("change", e => state.wizard.travellers = e.target.value);
      bindOptionRow("#optTransport", "transport");
      bindOptionRow("#optBudget", "budget");
      bindOptionRow("#optLang", "language");
      bindOptionRow("#optPace", "pace");
    }
  }
  function bindOptionRow(selector, key) {
    const row = $(selector); if (!row) return;
    $$(".option-btn", row).forEach(btn => btn.addEventListener("click", () => {
      $$(".option-btn", row).forEach(x => x.classList.remove("selected"));
      btn.classList.add("selected");
      state.wizard[key] = btn.dataset.val;
    }));
  }

  /* =======================================================
   * PREFILL PLANNER from a district or place card
   * ======================================================= */
  window.prefillPlanner = function(id, placeId) {
    state.wizard.level = state.wizard.level || "quick";
    state.wizard.destination = id;
    if (placeId) {
      tripDraft.districtId = id;
      tripDraft.placeIds.add(placeId);
    }
    if (!state.wizard.interests.size) {
      // default interests based on destination
      const tgt = resolveTarget(id);
      if (tgt) {
        const tagSet = new Set();
        tgt.places.slice(0,6).forEach(p => (p.tags||[]).forEach(t => tagSet.add(t.toLowerCase())));
        ["heritage","photography","nature","architecture","sunset"].forEach(t => { if (tagSet.has(t)) state.wizard.interests.add(t); });
      }
      if (!state.wizard.interests.size) {
        state.wizard.interests.add("heritage");
        state.wizard.interests.add("photography");
      }
    }
    navigate("/planner");
  };

  /* =======================================================
   * JOURNEY GENERATION ENGINE
   * ======================================================= */
  function preAnalysisHTML() {
    const w = state.wizard;
    const resolved = resolveTarget(w.destination);
    if (!resolved) return "";
    const dest = resolved.target;
    const levelDays = w.level === "deep" ? 4 : w.level === "weekend" ? 2 : 1;
    const plannedStops = (dest.places || []).slice(0, w.level === "deep" ? 12 : w.level === "weekend" ? 7 : 4);
    const estimate = GNGIntel.calculateBudget({
      wizard: w,
      destination: dest,
      stops: plannedStops,
      bestGuide: (dest.guides || [])[0] || null,
      stats: { totalKm: levelDays === 4 ? 260 : levelDays === 2 ? 120 : 48 }
    });
    const crowd = GNGIntel.calculateCrowdEstimate(dest, w.date, +((w.time || "08:00").split(":")[0]));
    const money = n => "₹" + n.toLocaleString("en-IN");
    const interest = [...w.interests][0] || "heritage";
    return `
      <div class="journey-preview__eyebrow">Before we build your route</div>
      <h2>Ready for <em>${escapeHtml(dest.name)}</em></h2>
      <p class="journey-preview__intro">A quick travel read, shaped around your ${escapeHtml(interest)} interest and ${escapeHtml((w.pace || "balanced").toLowerCase())} pace.</p>
      <div class="journey-preview__cards">
        <article class="preview-card preview-card--conditions">
          <div class="preview-card__head"><span class="preview-card__icon">☀</span><div><span>Today's conditions</span><strong>Travel snapshot</strong></div></div>
          <div class="preview-card__facts">
            <div><b>${escapeHtml(crowd.level || "Moderate")}</b><span>expected crowds</span></div>
            <div><b>${escapeHtml((w.time || "08:00"))}</b><span>your start time</span></div>
            <div><b>07:30</b><span>best start estimate</span></div>
          </div>
          <p>Forecast and road conditions are checked during analysis. Opening hours stay based on destination data.</p>
        </article>
        <article class="preview-card preview-card--budget">
          <div class="preview-card__head"><span class="preview-card__icon">₹</span><div><span>Smart budget</span><strong>${money(estimate.total)} <small>estimated total</small></strong></div></div>
          <div class="preview-card__budget"><b>${money(estimate.perPerson)}</b><span>per person · ${estimate.meta.days} day${estimate.meta.days === 1 ? "" : "s"}</span></div>
          <p>${w.budget === "budget" ? "Built to keep the trip economical." : "Includes a practical route allowance and selected experience costs."}</p>
        </article>
      </div>
      <button class="btn btn--primary btn--lg journey-preview__continue" id="genPreviewProceed">Analyse my journey <span aria-hidden="true">→</span></button>
      <p class="journey-preview__note">All costs and conditions are estimates. The full breakdown appears in your journey dashboard.</p>`;
  }

  function generateJourney() {
    // Show a concise pre-analysis snapshot. The detailed conditions and cost
    // breakdown remain on the dashboard, so this moment stays focused.
    const loader = $("#genLoader");
    const preview = $("#journeyPreview");
    const analysis = $("#genAnalysis");
    loader.hidden = false;
    preview.hidden = false;
    analysis.hidden = true;
    preview.innerHTML = preAnalysisHTML();
    const proceed = $("#genPreviewProceed");
    const genSteps = [
      "Understanding your travel style...",
      "Matching places to your interests...",
      "Building your route...",
      ...(navigator.onLine ? ["Checking road distances...", "Checking weather conditions..."] : []),
      "Optimizing your schedule...",
      "Calculating your budget...",
      "Finding smart detours...",
      "Preparing heritage stories...",
      "Preparing your journey..."
    ];
    const list = $("#genSteps");
    list.innerHTML = genSteps.map(s => `<li>${s}</li>`).join("");
    const bar = $("#genBar");
    const beginAnalysis = () => {
      preview.hidden = true;
      analysis.hidden = false;
      let i = 0;
      const runStep = () => {
        if (i >= genSteps.length) {
          loader.hidden = true;
          finishGeneration();
          return;
        }
        $$("li", list).forEach((li,idx) => {
          li.classList.remove("active","done");
          if (idx < i) li.classList.add("done");
          if (idx === i) li.classList.add("active");
        });
        bar.style.width = ((i+1)/genSteps.length*100)+"%";
        i++;
        setTimeout(runStep, 380);
      };
      setTimeout(runStep, 120);
    };
    if (proceed) proceed.addEventListener("click", beginAnalysis, { once: true });
  }

  function finishGeneration() {
    const w = state.wizard;
    const resolved = resolveTarget(w.destination);
    if (!resolved) { toast("Please pick a destination.","error"); return navigate("/planner"); }
    const dest = resolved.target;

    // --- Build trip stops ---
    // 1) Score all places against user interests
    const transport = TRANSPORTS.find(t => t.id === w.transport);
    const paceFactor = w.pace === "Relaxed" ? 1.25 : w.pace === "Fast-paced" ? 0.8 : 1.0;
    const hourBudget = TRIP_LEVELS.find(l => l.id === w.level)?.hourBudget || 10;

    // Ensure any tripDraft preselected places are included first
    const preselectedIds = (tripDraft.districtId === w.destination) ? [...tripDraft.placeIds] : [];

    // 1) Deterministic personalized scoring (Feature A) — same inputs,
    //    same journey. Random jitter removed from the recommendation.
    const prefs = GNGIntel.prefsFromWizard(w);
    const scoredMap = new Map();
    const scored = dest.places.map(p => {
      const m = GNGIntel.calculatePlaceMatch(p, prefs, { destId: dest.id });
      scoredMap.set(p.id, m);
      // Duration still costs schedule time (selection constraint, not ranking)
      return { ...p, score: m.finalScore - (p.durationMin || 30) * 0.04 };
    }).sort((a,b) => b.score - a.score);

    // 2) Greedy selection fitting time budget (roughly)
    // Begin with any places the user preselected from the place page
    let remaining = hourBudget * 60 * 0.7; // 70% sightseeing, 30% transit
    const stops = [];
    for (const id of preselectedIds) {
      const p = dest.places.find(x => x.id === id);
      if (p) {
        stops.push({...p, _presel: true, score: Infinity});
        remaining -= (p.durationMin||30);
      }
    }
    for (const p of scored) {
      if (stops.some(s => s.id === p.id)) continue;
      const dur = p.durationMin || 30;
      if (dur <= remaining) { stops.push(p); remaining -= dur; }
      if (remaining < 15) break;
    }
    // Make sure there's a food stop if budget >= 6h and there's an explicit food place,
    // otherwise insert a generic "Local lunch" stop
    const hasFood = stops.some(s => s.type === "food" || (s.tags||[]).includes("food"));
    if (!hasFood && hourBudget >= 6) {
      const foodStop = dest.places.find(p => p.type === "food" || (p.tags||[]).includes("food"));
      if (foodStop) stops.push(foodStop);
      else stops.push({ id: "food-"+dest.id, name: "Local Lunch", type: "food", tags:["food","culture"], durationMin: 45, bestTime: "13:00", photographyScore: 6.0, desc: "Recommended break for local Kannadiga cuisine.", coords: dest.coords, _synthetic: true });
    }

    // 3) Order stops: earliest bestTime first, food near middle
    stops.sort((a,b) => {
      const timeToMinutes = (t) => {
        if (!t) return 999;
        const m = t.match(/(\d{1,2}):(\d{2})/);
        if (m) return parseInt(m[1])*60+parseInt(m[2]);
        if (/opening/i.test(t) || /morning/i.test(t) || /^0/i.test(t)) return 9*60;
        if (/afternoon/i.test(t)) return 14*60;
        if (/sunset/i.test(t)) return 17*60;
        return 12*60;
      };
      if (a.type === "food") return 0.01; // will be moved after sort below
      if (b.type === "food") return -0.01;
      return timeToMinutes(a.bestTime) - timeToMinutes(b.bestTime);
    });
    // place food at ~midday index
    const foodIdx = stops.findIndex(s => s.type === "food");
    if (foodIdx >= 0) {
      const [f] = stops.splice(foodIdx,1);
      const midIdx = Math.max(1, Math.min(stops.length-1, Math.round(stops.length/2)));
      stops.splice(midIdx,0,f);
    }

    // 4) Compute timing: start at user time; travel time between points
    const [sh, sm] = (w.time || "08:00").split(":").map(n=>parseInt(n,10));
    let clock = new Date(); clock.setHours(sh, sm, 0, 0);

    // approximate center / start point
    const startCoord = w.startPoint && w.startPoint.toLowerCase().includes("hospet") ? [15.2700,76.3900] : dest.coords;

    let prevCoord = startCoord;
    let totalDist = 0;
    const timedStops = stops.map((s, i) => {
      const dKm = haversineKm(prevCoord, s.coords);
      totalDist += dKm;
      const travelMin = Math.max(3, Math.round(dKm / transport.speedKmh * 60 * paceFactor));
      clock = new Date(clock.getTime() + travelMin * 60000);
      const arrive = hhmm(clock,0);
      const dur = s.durationMin || 30;
      clock = new Date(clock.getTime() + dur * 60000);
      const depart = hhmm(clock,0);
      prevCoord = s.coords;
      // why selected
      const matchedTags = s.tags.filter(t => w.interests.has(t));
      const why = matchedTags.length
        ? `Picked for ${matchedTags.map(t=>INTERESTS.find(i=>i.id===t)?.label||t).join(" · ")}.`
        : "A signature stop at this destination.";
      return { ...s, travelKm: dKm, travelMin, arrive, depart, index:i, why };
    });

    // 5) Smart detours: score detours by detour cost vs interest benefit
    const maxDetourMin = w.pace === "Relaxed" ? 35 : w.pace === "Fast-paced" ? 12 : 22;
    const detours = [];
    // Try inserting detours between consecutive stops
    for (let i = 0; i < timedStops.length - 1; i++) {
      const a = timedStops[i].coords, b = timedStops[i+1].coords;
      const straightAB = haversineKm(a,b);
      for (const det of (dest.detours||[])) {
        const detDist = haversineKm(a, det.coords) + haversineKm(det.coords, b) - straightAB;
        const detourKm = (det.detourKm != null && !isNaN(det.detourKm)) ? +det.detourKm : 3;
        if (detDist <= detourKm + 0.8 && detDist <= 10) {
          // interest matching benefit
          let benefit = 0;
          const bestForLower = (det.bestFor||[]).map(x=>x.toLowerCase());
          w.interests.forEach(int => {
            if ((det.tags||[]).includes(int) || bestForLower.includes(int)) benefit += 10;
          });
          if (det.photographyScore && w.interests.has("photography")) benefit += det.photographyScore - 6;
          const visitMin = det.visitMin || det.durationMin || 15;
          const costMin = Math.round(detDist / transport.speedKmh * 60 * paceFactor) + visitMin;
          const score = benefit - costMin * 0.2;
          if (score > 3) {
            detours.push({ ...det, detourKm: +detDist.toFixed(1), visitMin, costMin, benefit, score, insertAfter: i, added:false });
          }
        }
      }
    }
    detours.sort((a,b) => b.score - a.score);

    // 6) Practical stops: choose closest fuel/EV to the route (roughly — nearest to midpoint)
    const routeMid = timedStops[Math.floor(timedStops.length/2)]?.coords || dest.coords;
    const fuelStops = [...(dest.fuelStops||[])].map(f => ({...f, kmToRoute: haversineKm(f.coords, routeMid)})).sort((a,b)=>a.kmToRoute-b.kmToRoute).slice(0,2);
    const evStops = [...(dest.evStops||[])].map(f => ({...f, kmToRoute: haversineKm(f.coords, routeMid)})).sort((a,b)=>a.kmToRoute-b.kmToRoute).slice(0,1);

    // 7) Guide matching (94%-style score)
    // If district has no guides, fall back to legacy destinations' guides as a demo
    let guidePool = dest.guides && dest.guides.length ? dest.guides : [];
    if (!guidePool.length) {
      getAllDestinations().forEach(d => d.guides.forEach(g => guidePool.push(g)));
    }
    const guides = guidePool.map(g => {
      let match = 0; let reasons = [];
      // language (30%)
      if (g.languages.includes(w.language)) { match += 30; reasons.push(`${w.language} language`); }
      else { const english = g.languages.includes("English"); if (english && w.language!=="English"){ match += 12; reasons.push(`English fallback`); } }
      // interests (max 40%)
      let interestScore = 0;
      w.interests.forEach(int => {
        if (int === "photography" && (g.expertise?.photography||70) > 80) { interestScore += 15; reasons.push("photography walks"); }
        else if (int === "heritage" && (g.expertise?.heritage||70) > 85) { interestScore += 15; reasons.push("heritage depth"); }
        else if (int === "architecture" && (g.expertise?.architecture||70) > 85) { interestScore += 12; reasons.push("architecture knowledge"); }
        else if (int === "family" && (g.expertise?.family||70) > 80) { interestScore += 10; reasons.push("family-friendly"); }
        else if (int === "history" && (g.expertise?.history||70) > 85) { interestScore += 14; reasons.push("historical context"); }
        else if (int === "nature" || int === "trekking" || int === "wildlife") {
          if ((g.expertise?.photography||70) > 80) { interestScore += 10; reasons.push("outdoor guiding"); }
        }
      });
      match += Math.min(40, interestScore);
      // rating/trips (20%)
      match += Math.min(20, (g.rating - 4.5) * 40 + Math.min(10, g.trips/150));
      // destination expertise (10%)
      if ((g.destinations||[]).includes(dest.id) || (g.destinations||[]).includes(w.destination)) match += 10;
      else if (guidePool.length > dest.guides.length) match += 3; // generic pool, smaller bonus
      // budget alignment
      if (g.priceTier === w.budget) match += 2;
      match = Math.max(60, Math.min(99, Math.round(match)));
      return { ...g, match, reasons: [...new Set(reasons)].slice(0,3) };
    }).sort((a,b)=>b.match-a.match);

    const bestGuide = guides[0];

    // 8) Summary stats
    const totalTravelTimeMin = timedStops.reduce((s,x)=>s+x.travelMin,0);
    const totalVisitTimeMin = timedStops.reduce((s,x)=>s+(x.durationMin||30),0);
    const totalTimeMin = totalTravelTimeMin + totalVisitTimeMin;
    const budgetMult = BUDGETS.find(b => b.id === w.budget)?.multiplier || 1;
    const costEstimate = Math.round((totalDist * 6 + timedStops.length * 80) * budgetMult / 10) * 10;

    const experiences = new Set();
    timedStops.forEach(s => s.tags.forEach(t => experiences.add(t)));

    // Build journey
    state.currentJourney = {
      wizard: {...w, interests: [...w.interests]},
      destination: dest,
      startCoord,
      stops: timedStops,
      detours,
      fuelStops, evStops,
      guides, bestGuide,
      stats: {
        totalKm: +totalDist.toFixed(1),
        stopsCount: timedStops.length,
        totalTimeMin,
        totalTravelTimeMin,
        totalVisitTimeMin,
        costEstimate,
        experiences: experiences.size,
        hiddenCount: detours.length,
      },
      mapInitialized: false,
    };

    // Journey intelligence layer (Features A/C/G): attach per-stop match
    // breakdowns, budget estimate and static conditions; live road/weather
    // enhancement runs async after render and never blocks the dashboard.
    (function enrichJourneyObject(){
      const J = state.currentJourney;
      J.stops.forEach(s => {
        const m = scoredMap.get(s.id);
        if (m) { s.match = { finalScore: m.finalScore, scoreBreakdown: m.scoreBreakdown, matchedInterests: m.matchedInterests, recommendationReasons: m.recommendationReasons }; s.__meta = m._meta; }
      });
      const destMatch = GNGIntel.calculateDestinationMatch(dest, prefs);
      J.match = { finalScore: destMatch.finalScore, reasons: destMatch.reasons, interests: [...w.interests] };
      J.budget = GNGIntel.calculateBudget(J);
      J.conditions = {
        weather: { status: "PENDING" },
        crowd: GNGIntel.calculateCrowdEstimate(dest, w.date, +((w.time || "08:00").split(":")[0])),
        road: { status: "UNAVAILABLE", live: false },
        events: GNGIntel.eventsFor(dest.id, w.date),
        bestStart: "07:30"
      };
      J.route = null; // filled by enhanceJourney (OSRM) or fallback
      GNGIntel.savePrefs(w);
    })();

    // NOTE: Passport stamping now happens on Journey Mode stop completion,
    // not on generation (a generated plan is an intention, not a visit).
    navigate("/journey");

    // Live layer: real road route + weather + adaptive warnings (async,
    // graceful — falls back to straight-line estimates when offline).
    GNGIntel.enhanceJourney(state.currentJourney).catch(() => {});
  }

  /* =======================================================
   * JOURNEY INTELLIGENCE CARD (Features A/C/E/G rendered together)
   * ======================================================= */
  function intelCardHTML(J) {
    const I = window.GNGIntel, esc = I.esc;
    const st = J.stops || [];
    const avg = key => st.length ? Math.round(st.reduce((s, x) => s + ((x.match && x.match.scoreBreakdown[key]) ?? 0), 0) / st.length) : 0;
    const bars = [["Interests", avg("interest")], ["Photography", avg("photography")], ["Heritage", avg("heritage")], ["Pace fit", avg("pace")]];
    const match = J.match || { finalScore: 0, reasons: [] };
    const w = J.wizard;

    // Conditions (Feature G) — honest status labels
    const W = (J.conditions || {}).weather || { status: "PENDING" };
    const crowd = (J.conditions || {}).crowd || { level: "—", confidence: "Estimated" };
    const road = (J.conditions || {}).road || { status: "UNAVAILABLE" };
    const events = (J.conditions || {}).events || [];
    const weatherLine = W.status === "LIVE"
      ? `${W.temperature ?? "—"}°C · ${W.condition} · rain ${W.precipitationProbability ?? 0}%`
      : W.status === "PENDING" ? "Checking live forecast…" : "Temporarily unavailable — itinerary still works";
    const weatherMeta = W.status === "LIVE" ? `${W.source} · updated ${Math.max(0, Math.round((Date.now() - new Date(W.fetchedAt)) / 60000))} min ago · LIVE` : W.status === "UNAVAILABLE" ? "LIVE data unavailable · using destination timings" : "";
    const warnings = J.adaptiveWarnings || [];
    const route = J.route;

    // Budget (Feature C)
    const B = J.budget;
    const money = n => n == null ? "—" : "₹" + n.toLocaleString("en-IN");
    const bstat = B ? I.budgetStatus(B) : null;
    const opt = B ? I.budgetOptimizeSuggestions(B) : null;

    // Stories (Feature E)
    const storyStops = st.filter(s => s.__meta || s.match).slice(0, 2);

    return `
      <div class="icard">
        <div class="icard__match">
          <span class="icard__pct">${match.finalScore}%</span>
          <span class="icard__pctlabel">Personal match<br>for this journey</span>
          <div class="icard__bars">
            ${bars.map(([l, v]) => `<div class="icard__bar"><span>${l}</span><span class="bar"><i style="width:${v}%"></i></span><b>${v}</b></div>`).join("")}
          </div>
        </div>
        <p class="icard__why">
          Built around your ${match.interests && match.interests.length ? match.interests.slice(0,3).map(i => i.toLowerCase()).join(", ") : "travel"} interests, ${esc((w.pace || "").toLowerCase())} pace, ${esc((w.transport || "").replace("public","public transport"))} travel and ${esc(w.travellers || "")} traveller preference.
          ${match.reasons && match.reasons.length ? " " + esc(match.reasons[0]) : ""}
        </p>
        <div class="icard__routebadge">${route ? (route.isLive
            ? `<strong>Road route</strong> ${route.distanceKm} km · ${Math.round(route.durationMin)} min · ${esc(route.provider)}`
            : `<strong>Estimated route</strong> ${route.distanceKm} km · straight-line fallback · live routing unavailable`) : `<strong>Route</strong> calculating…`}</div>
      </div>

      <div class="icard icard--conditions">
        <h4 class="icard__h">Today's journey conditions</h4>
        <div class="cond__grid">
          <div class="cond"><span class="cond__k">☀ Weather</span><span class="cond__v">${esc(weatherLine)}</span><span class="cond__meta">${esc(weatherMeta)}</span></div>
          <div class="cond"><span class="cond__k">👥 Crowd</span><span class="cond__v">${esc(crowd.level)} · ${esc(crowd.confidence)}</span><span class="cond__meta">Estimated from weekday, time & popularity</span></div>
          <div class="cond"><span class="cond__k">🕐 Opening</span><span class="cond__v">${J.conditions && J.conditions.opening ? `From dataset: ${esc(J.conditions.opening.default ? J.conditions.opening.default[0][0] + "–" + J.conditions.opening.default[0][1] : (J.conditions.opening[0] || []).join("–"))}` : "Hours from destination data"}</span><span class="cond__meta">Not real-time — verify locally</span></div>
          <div class="cond"><span class="cond__k">🚗 Roads</span><span class="cond__v">${road.status === "UNAVAILABLE" ? "Live road data unavailable" : "—"}</span><span class="cond__meta">${esc(road.advisory || "No live road provider configured")}</span></div>
          <div class="cond"><span class="cond__k">🎭 Events</span><span class="cond__v">${events.length ? `${events.length} during your dates` : "None in dataset"}</span><span class="cond__meta">${events.length ? esc(events.map(e => e.name).join(", ")) : "Verified dataset only"}</span></div>
          <div class="cond"><span class="cond__k">🥾 Best start</span><span class="cond__v">${esc((J.conditions || {}).bestStart || "07:30")}</span><span class="cond__meta">Estimated · light + crowds</span></div>
        </div>
        ${warnings.length ? `
        <div class="cond__warn">
          <strong>${warnings.length} adaptive suggestion${warnings.length > 1 ? "s" : ""}</strong>
          ${warnings.slice(0, 2).map(x => `<div class="cond__warnrow">${esc(x.stopName)} · planned ${esc(x.planned)} · recommended ${esc(String(x.recommended))} — ${esc(x.reason)}</div>`).join("")}
          <button class="btn btn--ghost btn--sm" id="applyAdaptBtn" style="margin-top:.5rem">Apply smart adjustments</button>
        </div>` : `<div class="cond__ok">No schedule conflicts detected for your selected date. ✓</div>`}
      </div>

      ${B ? `
      <div class="icard icard--budget">
        <h4 class="icard__h">Smart budget <span class="icard__est">Estimated</span></h4>
        <div class="budget__grid">
          ${(w.transport === "public" ? [["Transport", B.transport]] : [["Fuel", B.fuel], ["Parking", B.parking]]).map(([l, v]) => `<div class="brow"><span>${l}</span><b>${money(v)}</b></div>`).join("")}
          <div class="brow"><span>Stay · ${B.meta.nights} night${B.meta.nights === 1 ? "" : "s"}${B.meta.rooms > 1 ? ` · ${B.meta.rooms} rooms` : ""}</span><b>${money(B.accommodation)}</b></div>
          <div class="brow"><span>Food · ${B.meta.persons} ${B.meta.persons > 1 ? "people" : "person"} × ${B.meta.days} day${B.meta.days > 1 ? "s" : ""}</span><b>${money(B.food)}</b></div>
          <div class="brow"><span>Entry tickets</span><b>${money(B.entryFees)}</b></div>
          <div class="brow"><span>Experiences</span><b>${money(B.experiences)}</b></div>
          ${B.guide ? `<div class="brow"><span>Guide (matched)</span><b>${money(B.guide)}</b></div>` : ""}
          <div class="brow"><span>Contingency 8%</span><b>${money(B.contingency)}</b></div>
          <div class="brow brow--total"><span>Estimated total</span><b>${money(B.total)}</b></div>
          <div class="brow brow--pp"><span>Per person</span><b>${money(B.perPerson)}</b></div>
        </div>
        <div class="budget__status budget__status--${bstat.tone}">${bstat.label} · ~${money(Math.round(B.perPerson / B.meta.days))}/person/day</div>
        ${opt.save > 0 ? `<button class="btn btn--ghost btn--sm" id="budgetOptBtn" style="margin-top:.6rem">💡 Smart ways to save ~${money(opt.save)}</button><div id="budgetTips" hidden class="budget__tips">${opt.tips.map(t => `• ${esc(t)}`).join("<br>")}</div>` : ""}
      </div>` : ""}

      <div class="icard icard--stories">
        <h4 class="icard__h">Heritage stories</h4>
        ${storyStops.map(s => `
          <div class="srow">
            <div><strong>${esc(s.name)}</strong><span class="srow__era">${esc(J.destination.heritagePeriod || "")}</span></div>
            <button class="btn btn--ghost btn--sm" data-story-stop="${st.indexOf(s)}">Explore the story →</button>
          </div>`).join("")}
        <div class="srow">
          <div><strong>${esc(J.destination.name)} — the full story</strong><span class="srow__era">${esc(J.destination.heritagePeriod || "")}</span></div>
          <button class="btn btn--ghost btn--sm" data-story-dest="1">Story mode →</button>
        </div>
      </div>`;
  }

  /* =======================================================
   * VIEW: JOURNEY DASHBOARD
   * ======================================================= */
  function renderJourney() {
    const J = state.currentJourney;
    if (!J) { navigate("/planner"); return; }

    // Expose the live journey object for journey-live.js (used by its
    // journey-complete overlay save/share actions and inline handlers).
    window.__gngCurrentJourney = J;

    const { destination, stops, detours, fuelStops, evStops, bestGuide, stats } = J;
    const w = J.wizard;
    const fmtTime = (min) => {
      const h = Math.floor(min/60), m = Math.round(min%60);
      return h > 0 ? `${h}h ${m>0?m+"m":""}` : `${m}m`;
    };

    const app = $("#app");
    app.innerHTML = `
      <div class="dashboard">
        <aside class="dash-left" id="dashLeft">
          <div class="dash-mobile-toggle">
            <button class="btn btn--sm btn--primary" id="showItinerary">Itinerary</button>
            <button class="btn btn--sm btn--ghost" id="showMap">Map</button>
          </div>

          <div class="dash-summary">
            <div class="eyebrow eyebrow--light">Your journey</div>
            <h2>${destination.name}</h2>
            <div class="dash-stats">
              <div class="dash-stat"><strong>${stats.totalKm} km</strong><span>Distance</span></div>
              <div class="dash-stat"><strong>${stats.stopsCount}</strong><span>Stops</span></div>
              <div class="dash-stat"><strong>${fmtTime(stats.totalTimeMin)}</strong><span>Total time</span></div>
              <div class="dash-stat"><strong>₹${(J.budget ? J.budget.total : stats.costEstimate).toLocaleString ? (J.budget ? J.budget.total : stats.costEstimate).toLocaleString("en-IN") : J.budget ? J.budget.total : stats.costEstimate}</strong><span>${J.budget ? "Est. budget" : "Est. travel"}</span></div>
            </div>
            <div class="dash-stats" style="grid-template-columns:repeat(3,1fr);margin-bottom:0">
              <div class="dash-stat"><strong>${stats.experiences}</strong><span>Experiences</span></div>
              <div class="dash-stat"><strong id="hiddenStat">${stats.hiddenCount}</strong><span>Hidden</span></div>
              <div class="dash-stat" style="border:none"><strong id="guideMatchStat">${bestGuide?bestGuide.match+"%":"—"}</strong><span>Guide match</span></div>
            </div>
            <div class="dash-actions" style="margin-top:1.2rem">
              <button class="btn btn--light btn--sm" id="saveJourney">Save Journey</button>
              <button class="btn btn--outline-light btn--sm" id="editTrip">Edit Trip</button>
              <button class="btn btn--outline-light btn--sm" id="shareTrip">Share</button>
            </div>
          </div>

          <div class="dash-section">
            <h3>Timeline</h3>
            <div id="tlList">
              ${stops.map((s,i) => renderTimelineItem(s,i)).join("")}
            </div>
          </div>

          <div class="intel" id="intelCard">
            <div class="eyebrow" style="margin-bottom:.6rem">Journey Intelligence</div>
            ${intelCardHTML(J)}
            <h4>Along your route</h4>
            <div id="detourList">
              ${detours.length ? detours.map((d,i) => renderDetour(d,i)).join("") : '<p style="font-size:.85rem;color:var(--muted-2)">No worthwhile detour found — your route already covers the best of what\'s near.</p>'}
            </div>
          </div>

          ${bestGuide ? (() => {
            const dest = resolveTarget(w.destination)?.target || null;
            const banner = guideBannerFor(bestGuide, dest);
            const avatarBg = guideAvatarBgFor(bestGuide);
            const initials = (bestGuide.name || "").split(/\s+/).map(s=>s[0]).slice(0,2).join("").toUpperCase();
            return `
            <div class="guide-match" style="padding:0;overflow:hidden;background:#fff;border:1px solid var(--line);color:var(--dark)">
              <div style="position:relative;height:64px;background:${banner}">
                <div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.6);color:#fff;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;padding:.35rem .65rem;border-radius:40px;font-weight:700">
                  ${bestGuide.match}% MATCH
                </div>
              </div>
              <div style="padding:0 1rem 1rem;text-align:center">
                <div class="guide-card__avatar" style="--avatar-bg:${avatarBg};margin-top:-34px;width:68px;height:68px;font-size:1.45rem">${initials}</div>
                <div style="font-weight:600;font-size:1.05rem;margin-top:.4rem">${bestGuide.name}</div>
                <div style="font-size:.78rem;color:var(--muted-2);margin-top:.2rem">${bestGuide.title}</div>
                <div class="guide-match__reason" style="font-style:italic;font-size:.8rem;color:var(--muted-2);margin-top:.5rem;padding:.5rem .7rem;background:var(--ivory-2);border-radius:var(--radius)">
                  "Matched because you selected ${bestGuide.reasons.join(" + ")} and requested ${w.language}."
                </div>
                <div style="margin-top:.7rem;display:flex;gap:.3rem;flex-wrap:wrap;justify-content:center">
                  ${bestGuide.languages.map(l=>`<span class="guide-chip">${l}</span>`).join("")}
                </div>
                <div style="margin-top:.35rem;display:flex;gap:.3rem;flex-wrap:wrap;justify-content:center">
                  ${bestGuide.specialties.slice(0,3).map(s=>`<span class="guide-chip guide-chip--accent">${s}</span>`).join("")}
                </div>
                <div style="margin-top:.7rem;font-size:.75rem;color:var(--muted-2)">
                  ★ ${bestGuide.rating} · ${bestGuide.trips.toLocaleString()} trips · Meet at ${bestGuide.meetPoint}
                </div>
                <div style="margin-top:.8rem;display:flex;gap:.5rem;justify-content:center">
                  <button class="btn btn--primary btn--sm" onclick="toast('Request sent to ${bestGuide.name.replace(/'/g,"\\'")}. They will contact you shortly.','success')">Request Guide</button>
                  <button class="btn btn--ghost btn--sm" onclick="location.hash='#/guides'">View all</button>
                </div>
              </div>
            </div>`;
          })() : ""}

          <div class="dash-section">
            <h3>Practical stops</h3>
            <div class="stops-list">
              ${fuelStops.map(f => `
                <div class="stop-row stop-row--fuel">
                  <span><strong>${f.name}</strong></span>
                  <span class="stop-row__type">Petrol · ${f.kmToRoute.toFixed(1)} km off</span>
                </div>
              `).join("")}
              ${evStops.map(f => `
                <div class="stop-row stop-row--ev">
                  <span><strong>${f.name}</strong></span>
                  <span class="stop-row__type">EV · ${f.kmToRoute.toFixed(1)} km off</span>
                </div>
              `).join("")}
              ${!fuelStops.length && !evStops.length ? `<p style="font-size:.85rem;color:var(--muted-2)">No fuel/EV data available for this area yet.</p>`:""}
            </div>
            <p style="font-size:.75rem;color:var(--muted);margin-top:.8rem">Fuel/EV stops are representative demo data. Always verify with live services before travel.</p>
          </div>

          <div class="dash-section">
            <h3>Explore deeper</h3>
            <button class="btn btn--ghost btn--sm" onclick="location.hash='#/history/${destination.id}'">${destination.name} historical timeline →</button>
          </div>
        </aside>

        <div class="dash-right">
          <div class="map-glass"><span class="map-glass__dot"></span> Route ready · ${destination.name}</div>
          <div class="map-toggle">
            <button data-layer="stops" class="active">Stops</button>
            <button data-layer="hidden" class="active">Hidden</button>
            <button data-layer="food" class="active">Food</button>
            <button data-layer="fuel" class="active">Fuel/EV</button>
            <button data-layer="guide" class="active">Guide</button>
            <button data-layer="route" class="active">Route</button>
          </div>
          <div id="map"></div>
        </div>
      </div>
    `;

    // Intelligence bindings (Features A/C/E/G)
    $$("#intelCard [data-story-stop]").forEach(b => b.addEventListener("click", () => GNGIntel.openStoryModal(stops[+b.dataset.storyStop])));
    $$("#intelCard [data-story-dest]").forEach(b => b.addEventListener("click", () => GNGIntel.openStoryModal(J.destination)));
    const adaptBtn = $("#applyAdaptBtn");
    if (adaptBtn) adaptBtn.addEventListener("click", () => {
      const res = GNGIntel.adaptJourneyToConditions(J);
      toast(res.applied ? `Schedule adjusted — ${res.applied} stop${res.applied > 1 ? "s" : ""} moved for conditions.` : "Nothing to adjust — your schedule already fits.", "success");
      renderJourney();
    });
    const optBtn = $("#budgetOptBtn");
    if (optBtn) optBtn.addEventListener("click", () => { const t = $("#budgetTips"); if (t) t.hidden = !t.hidden; });
    $$("[data-why-stop]").forEach(b => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const s = stops[+b.dataset.whyStop];
      if (s) GNGIntel.openWhyModal({ kind: "place", place: s, destId: J.destination.id }, GNGIntel.prefsFromWizard(J.wizard));
    }));

    // Bindings
    $("#saveJourney").addEventListener("click", () => {
      try {
        const saved = JSON.parse(localStorage.getItem("gng_journeys") || "[]");
        saved.push({ savedAt: new Date().toISOString(), journeyId: destination.id + "_" + Date.now(), data: J });
        localStorage.setItem("gng_journeys", JSON.stringify(saved));
        toast("Journey saved to your device.","success");
      } catch(e) { toast("Couldn't save locally — storage may be full.","error"); }
    });
    $("#editTrip").addEventListener("click", () => navigate("/planner"));
    $("#shareTrip").addEventListener("click", () => {
      const url = location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(()=>toast("Journey link copied.","success"));
      } else toast(url);
    });
    $("#showItinerary")?.addEventListener("click", () => {
      $("#dashLeft").scrollIntoView({behavior:"smooth"});
    });
    $("#showMap")?.addEventListener("click", () => {
      $("#map").scrollIntoView({behavior:"smooth"});
    });

    // Detour add/remove bindings
    $$("[data-add-detour]").forEach(b => b.addEventListener("click", () => toggleDetour(parseInt(b.dataset.addDetour,10))));

    // Map layer toggles
    $$(".map-toggle button").forEach(b => b.addEventListener("click", () => {
      const layer = b.dataset.layer;
      state.mapLayers[layer] = !state.mapLayers[layer];
      b.classList.toggle("active", state.mapLayers[layer]);
      updateMapLayers();
    }));

    // Init map after DOM paint
    setTimeout(initMap, 80);
  }

  function renderTimelineItem(s, i) {
    const badges = s.tags.map(t => {
      let cls = "";
      if (t === "photography" || t === "sunrise" || t === "sunset") cls = "tl-badge--photo";
      else if (t === "heritage" || t === "architecture" || t === "history" || t === "spiritual") cls = "tl-badge--heritage";
      else if (t === "food" || t === "culture") cls = "tl-badge--food";
      else if (t === "hidden") cls = "tl-badge--hidden";
      return `<span class="tl-badge ${cls}">${t.replace(/\b\w/g,c=>c.toUpperCase())}</span>`;
    }).join("");
    return `
      <div class="tl-item" data-stop="${i}">
        <div class="tl-item__dot"></div>
        <div class="tl-item__time">${s.arrive}</div>
        <div class="tl-item__name">${s.name}</div>
        <div class="tl-item__meta">
          ${badges}
          <span class="tl-badge">${s.durationMin||30} min</span>
          <span class="tl-badge">${s.travelKm.toFixed(1)} km from previous</span>
        </div>
        <div class="tl-item__why">${s.why}</div>
        <div class="tl-item__actions">
          <button class="tl-item__add tl-item__add--remove" data-remove-stop="${i}">Remove</button>
          <button class="tl-item__add" data-zoom-stop="${i}">Show on map</button>
          <button class="tl-item__add" data-why-stop="${i}" title="Why this place was picked for you">${s.match ? s.match.finalScore + "% · " : ""}Why this place</button>
        </div>
      </div>
    `;
  }
  function renderDetour(d, i) {
    return `
      <div class="detour" data-detour="${i}">
        <div style="display:flex;gap:.8rem;align-items:center;flex:1">
          <div class="detour__score"><strong>${(d.photographyScore||7.5).toFixed(1)}</strong><span>Score</span></div>
          <div class="detour__info">
            <strong>${d.name}</strong>
            <span>+${d.detourKm} km · ${d.costMin} min total · ${d.visitMin} min visit · ${d.bestFor.join(" · ")}</span>
            <div style="font-size:.75rem;color:var(--muted-2);font-style:italic;margin-top:.15rem">${d.whyWorth||""}</div>
          </div>
        </div>
        <button class="tl-item__add" data-add-detour="${i}">${d.added?"Added ✓":"Add"}</button>
      </div>
    `;
  }

  function toggleDetour(i) {
    const J = state.currentJourney; if (!J) return;
    const det = J.detours[i]; if (!det) return;
    det.added = !det.added;
    const btn = $(`[data-add-detour="${i}"]`);
    if (btn) btn.textContent = det.added ? "Added ✓" : "Add";

    // insert/remove from stops
    if (det.added) {
      const pseudoStop = {
        ...det,
        name: det.name,
        type: "detour",
        tags: [...new Set([...(det.tags||[]), "hidden"])],
        durationMin: det.visitMin,
        desc: det.desc,
        isDetour: true,
        travelKm: det.detourKm, travelMin: Math.round(det.detourKm/35*60),
        arrive: "—", depart: "—",
        why: `Detour added by you — best for ${det.bestFor.join(" · ")}.`,
      };
      J.stops.splice(det.insertAfter + 1, 0, pseudoStop);
      J.stats.stopsCount = J.stops.length;
      J.stats.totalKm = +(J.stats.totalKm + det.detourKm).toFixed(1);
      J.stats.hiddenCount = J.detours.filter(x=>x.added).length;
      toast(`Added "${det.name}" to your route.`,"success");
    } else {
      const idx = J.stops.findIndex(s => s.isDetour && s.id === det.id);
      if (idx >= 0) J.stops.splice(idx, 1);
      J.stats.stopsCount = J.stops.length;
      J.stats.totalKm = +Math.max(0, J.stats.totalKm - det.detourKm).toFixed(1);
      J.stats.hiddenCount = J.detours.filter(x=>x.added).length;
      toast(`Removed "${det.name}".`);
    }
    renderJourney(); // simplest reliable refresh for MVP
  }

  /* =======================================================
   * LEAFLET MAP
   * ======================================================= */
  let mapInstance = null;
  let mapLayerGroups = {};
  let routeLine = null;

  function initMap() {
    const J = state.currentJourney; if (!J) return;
    if (mapInstance) { mapInstance.remove(); mapInstance = null; }

    const mapEl = $("#map");
    if (!mapEl) return;
    // Ensure container has height
    mapEl.style.height = "100%";

    const map = L.map("map", { zoomControl: true, attributionControl: true, preferCanvas: true })
      .setView(J.destination.coords, 13);

    // Satellite base gives Journey Mode a navigation-grade visual surface.
    // Labels are kept in a separate transparent layer for readability.
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: 'Tiles © Esri'
    }).addTo(map);
    L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: '© Esri'
    }).addTo(map);

    // Layer groups
    mapLayerGroups = {
      stops: L.layerGroup().addTo(map),
      hidden: L.layerGroup().addTo(map),
      food: L.layerGroup().addTo(map),
      fuel: L.layerGroup().addTo(map),
      ev: L.layerGroup().addTo(map),
      guide: L.layerGroup().addTo(map),
      route: L.layerGroup().addTo(map),
    };

    // Custom icons
    const mkIcon = (cls, label) => L.divIcon({
      className: "",
      html: `<div class="marker-icon ${cls}">${label}</div>`,
      iconSize: [30,30], iconAnchor: [15,15]
    });

    // Start marker
    L.marker(J.startCoord, { icon: mkIcon("marker-icon--start", "S") })
      .bindPopup(`<strong>Start</strong><br><span class="pop-tag">${J.wizard.startPoint || J.destination.name}</span>`)
      .addTo(mapLayerGroups.stops);

    // Stop markers
    J.stops.forEach((s, i) => {
      const cls =
        s.type === "food" ? "marker-icon--food" :
        s.isDetour ? "marker-icon--hidden" : "marker-icon--stop";
      const label = s.isDetour ? "✦" : s.type === "food" ? "🍴" : (i+1);
      const m = L.marker(s.coords, { icon: mkIcon(cls, label) })
        .bindPopup(`
          <strong>${s.name}</strong>
          <div style="color:var(--muted-2);font-size:.8rem;margin:.2rem 0">
            ${s.type === "food" ? "Food stop" : s.isDetour ? "Your detour" : "Planned stop"} · ${s.durationMin||30} min
          </div>
          ${s.tags.map(t=>`<span class="pop-tag">${t.replace(/\b\w/g,c=>c.toUpperCase())}</span>`).join("")}
          <div><button onclick="focusStop(${i})">Focus in timeline</button></div>
        `);
      if (s.type === "food") m.addTo(mapLayerGroups.food);
      else if (s.isDetour) m.addTo(mapLayerGroups.hidden);
      else m.addTo(mapLayerGroups.stops);
    });

    // Un-added detours shown as hints (hidden layer)
    J.detours.forEach((d, i) => {
      if (d.added) return;
      L.marker(d.coords, { icon: mkIcon("marker-icon--hidden", "?") })
        .bindPopup(`<strong>${escapeHtml(d.name)}</strong><br><span class="pop-tag">Hidden detour</span><span class="pop-tag">+${d.detourKm} km</span><br><div style="margin-top:.3rem;font-size:.8rem;color:var(--muted-2)">${escapeHtml(d.desc||"")}</div><div><button onclick="addDetourFromMap(${i})">Add to journey</button></div>`)
        .addTo(mapLayerGroups.hidden);
    });

    // Fuel & EV
    J.fuelStops.forEach(f => {
      L.marker(f.coords, { icon: mkIcon("marker-icon--fuel", "⛽") })
        .bindPopup(`<strong>${f.name}</strong><br><span class="pop-tag">Petrol</span>`)
        .addTo(mapLayerGroups.fuel);
    });
    J.evStops.forEach(f => {
      L.marker(f.coords, { icon: mkIcon("marker-icon--ev", "⚡") })
        .bindPopup(`<strong>${f.name}</strong><br><span class="pop-tag">EV Charger</span>`)
        .addTo(mapLayerGroups.ev);
    });

    // Guide meeting point
    if (J.bestGuide) {
      // Approximate meet point near destination coords if no precise coord: offset slightly
      const meetCoord = [J.destination.coords[0] + 0.005, J.destination.coords[1] - 0.003];
      L.marker(meetCoord, { icon: mkIcon("marker-icon--guide", "★") })
        .bindPopup(`<strong>Meet: ${J.bestGuide.name}</strong><br><span class="pop-tag">Guide</span><br>${J.bestGuide.meetPoint}`)
        .addTo(mapLayerGroups.guide);
    }

    // Route polyline — real road geometry when the live OSRM layer succeeded,
    // straight segments as the clearly-labelled fallback.
    const routeCoords = (J.route && J.route.geometry && J.route.geometry.length > 1)
      ? J.route.geometry
      : [J.startCoord, ...J.stops.map(s => s.coords)];
    routeLine = L.polyline(routeCoords, {
      color: "#C96A3D", weight: 4, opacity: 0.85,
      dashArray: (J.route && J.route.isLive) ? "1 8" : "8 8", lineJoin:"round"
    }).addTo(mapLayerGroups.route);
    map.__gngRouteLine = routeLine;
    // Animate "drawing" feel by replacing dash offset
    setTimeout(() => { routeLine.setStyle({ dashArray: "8 8" }); }, 80);

    // Fit bounds
    try { map.fitBounds(routeLine.getBounds().pad(0.15)); } catch(e){}

    mapInstance = map;

    // Stop zoom buttons
    $$("[data-zoom-stop]").forEach(btn => {
      btn.addEventListener("click", () => focusStop(parseInt(btn.dataset.zoomStop,10)));
    });
    $$("[data-remove-stop]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.removeStop,10);
        const s = J.stops[idx];
        if (s.isDetour) {
          // toggle matching detour
          const di = J.detours.findIndex(d => d.id === s.id);
          if (di >= 0) toggleDetour(di);
        } else {
          J.stops.splice(idx,1);
          J.stats.stopsCount = J.stops.length;
          toast(`Removed "${s.name}" from your route.`);
          renderJourney();
        }
      });
    });

    // fix layout size (in case container was hidden)
    setTimeout(() => map.invalidateSize(), 250);

    // ---------------- LIVE JOURNEY ENGINE (journey-live.js) ----------------
    // Must run after all markers & layer groups exist: the module upgrades
    // stop-marker popups, injects the Start Journey controls / HUD into the
    // dashboard, and binds itself to this map instance. It uses real GPS
    // (navigator.geolocation) when available and falls back to demo-mode
    // simulation along the route geometry when it isn't.
    if (window.GngLiveJourney && state.currentJourney) {
      try {
        window.GngLiveJourney.init(state.currentJourney, map);
      } catch (err) {
        console.warn("[GngLiveJourney] init failed:", err);
      }
    }
  }

  window.focusStop = function(i) {
    const J = state.currentJourney; if (!J || !mapInstance) return;
    const s = J.stops[i]; if (!s) return;
    mapInstance.flyTo(s.coords, 16, {duration: 0.8});
    const el = $(`.tl-item[data-stop="${i}"]`);
    if (el) {
      $$(".tl-item").forEach(x => x.style.background = "");
      el.style.background = "var(--sand)";
      el.scrollIntoView({behavior:"smooth", block:"center"});
    }
  };

  window.addDetourFromMap = function(i) { toggleDetour(i); };

  // Heritage-place helpers for intel modals (Why should I go? / Story mode)
  window.__gngWhyPlace = function(stateSlug, placeSlug) {
    const e = window.GNGHeritage && GNGHeritage.getPlace(stateSlug, placeSlug);
    if (e) GNGIntel.openWhyModal({ kind: "place", place: e.place, destId: null });
  };
  window.__gngStoryPlace = function(stateSlug, placeSlug) {
    const e = window.GNGHeritage && GNGHeritage.getPlace(stateSlug, placeSlug);
    if (e) GNGIntel.openStoryModal(Object.assign({}, e.place, { __heritage: true }));
  };
  // Resolve a journey stop to the richest story object available
  window.__gngFindStopStory = function(stop) {
    if (!window.GNGHeritage || !stop || !stop.coords) return stop;
    const hits = GNGHeritage.allPlaces().filter(x => x.place.coordinates[0] === stop.coords[0] && x.place.coordinates[1] === stop.coords[1]);
    if (hits.length) return Object.assign({}, hits[0].place, { __heritage: true });
    return stop;
  };

  // ---- Globals for journey-live.js (and app inline onclick handlers) ----
  // The live engine's inline HTML calls window.toast(...) directly.
  window.toast = toast;
  // Maps interest tags to timeline badge color classes (see styles.css).
  window.tagColor = function(tag) {
    const badgeMap = {
      photography: "tl-badge--photo",
      heritage:    "tl-badge--heritage",
      food:        "tl-badge--food",
      hidden:      "tl-badge--hidden"
    };
    return badgeMap[tag] || "";
  };

  function updateMapLayers() {
    if (!mapInstance) return;
    Object.entries(mapLayerGroups).forEach(([name, group]) => {
      if (state.mapLayers[name]) {
        if (!mapInstance.hasLayer(group)) group.addTo(mapInstance);
      } else {
        if (mapInstance.hasLayer(group)) mapInstance.removeLayer(group);
      }
    });
  }

  /* =======================================================
   * HERITAGE PASSPORT RENDER
   * ======================================================= */
  function renderPassport() {
    const list = $("#passportList");
    const visited = state.passport.visited;
    // Count UNESCO across both legacy destinations and districts
    const unescoCount = visited.filter(id => {
      const dest = getDestination(id);
      const dist = getDistrict(id);
      return (dest && dest.UNESCO) || (dist && dist.tags && dist.tags.includes("unesco"));
    }).length;
    const dynasties = new Set();
    visited.forEach(id => {
      const d = getDestination(id);
      if (d) dynasties.add(d.dynasty);
      const dist = getDistrict(id);
      if (dist) dynasties.add(dist.dynasty);
    });
    $("#psVisited").textContent = visited.length;
    $("#psDynasties").textContent = dynasties.size;
    $("#psUnesco").textContent = unescoCount;

    // Feature H — progress + achievements (computed from real stored progress)
    let achEl = $("#passportAchievements");
    if (!achEl && list) {
      achEl = document.createElement("div");
      achEl.id = "passportAchievements"; achEl.className = "pp-ach";
      list.parentElement.insertBefore(achEl, list);
    }
    if (achEl && window.GNGIntel) {
      const stopsDone = (state.passport.completedStops || []).length;
      const stories = (state.passport.storiesHeard || []).length;
      const ach = GNGIntel.computeAchievements(state.passport);
      const done = ach.filter(a => a.done).length;
      achEl.innerHTML = `
        <div class="pp-ach__row">
          <strong>${stopsDone}</strong><span>Stops done</span>
          <strong>${stories}</strong><span>Stories</span>
          <strong>${done}</strong><span>Badges</span>
        </div>
        <div class="pp-ach__list" aria-label="Achievements">
          ${ach.map(a => `
            <div class="pp-ach__item ${a.done ? "is-done" : ""}" title="${a.verb} ${a.need} ${a.unit}">
              <span>${a.icon}</span>
              <div><b>${a.name}</b><i>${a.done ? "✓ unlocked" : a.current + " / " + a.need}</i></div>
            </div>`).join("")}
        </div>`;
    }

    if (!visited.length) {
      list.innerHTML = `<li class="passport-empty">Your passport is empty. Start by planning a trip or exploring a destination.</li>`;
      return;
    }
    list.innerHTML = visited.map(id => {
      // New districts first
      const dist = getDistrict(id);
      if (dist) {
        const dynasty = getDynasty(dist.dynasty);
        const isUnesco = dist.tags && dist.tags.includes("unesco");
        return `
          <li class="passport-item" onclick="prefillPlanner('${dist.slug}')" title="Plan another journey here">
            <div class="passport-item__thumb" style="--bg:${dist.heroGradient};background:${dist.heroGradient}"></div>
            <div>
              <strong>${dist.name}</strong>
              <span>${dynasty ? dynasty.name : titleCase(dist.dynasty)} · ${dist.places.length} places${isUnesco?" · UNESCO":""}</span>
            </div>
            <span class="passport-item__check">✓</span>
          </li>
        `;
      }
      const d = getDestination(id);
      if (!d) return "";
      return `
        <li class="passport-item" onclick="location.hash='#/destination/${d.id}'">
          <div class="passport-item__thumb" style="--bg:${d.heroGradient};background:${d.heroGradient}"></div>
          <div>
            <strong>${d.name}</strong>
            <span>${d.heritagePeriod}${d.UNESCO?" · UNESCO":""}</span>
          </div>
          <span class="passport-item__check">✓</span>
        </li>
      `;
    }).join("");
  }

  /* =======================================================
   * BOOT
   * ======================================================= */
  function boot() {
    loadPassport();
    initNav();
    initHeritageSearch();
    renderPassport();
    // Kick off routing
    router();

    // Remove preload class after first paint so animations play
    requestAnimationFrame(() => {
      setTimeout(() => { document.body.classList.remove("preload"); }, 60);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
