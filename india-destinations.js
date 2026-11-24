/* ============================================================
 * GEARUP N GOO — INDIA DESTINATION SERVICE (national hierarchy)
 *
 *   INDIA → STATE / UT → DISTRICT → TOP TOURIST PLACES
 *
 * This module is the single data facade for the India-wide
 * destination system. It OWNS the 36 states/UTs and MERGES
 * district/place records from their home datasets:
 *
 *   Karnataka districts  -> districts.js (existing, verified)
 *   Curated districts    -> india-places.js (RJ KL TN GA HP)
 *   Heritage archive     -> heritage-data-*.js via GNGHeritage
 *                           (derived partial districts for
 *            states without curated districts yet)
 *   Legacy circuit       -> data.js DESTINATIONS (still resolved
 *                           by app.js resolveTarget; surfaced
 *                           here as heritage circuits)
 *
 * UI code (app.js Step 02) reads ONLY this service — never the
 * raw datasets — so adding a state later means adding data, not
 * rewriting UI.
 * ============================================================ */
window.GNGIndiaDestinations = (() => {

  const GEN = "AI-generated editorial illustration — representative of the location";
  const sImg = (src, alt, status) => ({ src, alt, credit: status === "photo" ? "GEARUP N GOO dataset" : GEN, source: status === "photo" ? "curated dataset" : "generated", status: status || "generated" });

  /* ---------------- STATES & UNION TERRITORIES ----------------
   * districtsCount = administrative districts (public fact).
   * status: "verified"  -> curated district + top-place data seeded
   *         "partial"   -> state card + heritage archive / basic data
   * themes are uppercase editorial category lines (data-driven). */
  const STATES = [
    { id:"andhra-pradesh", name:"Andhra Pradesh", type:"state", capital:"Amaravati", region:"South", districtsCount:26,
      shortDescription:"Chalukyan and Vijayanagara temples, long coastline and the Seshachalam hills.",
      themes:["TEMPLES","FORTS","COAST"], status:"partial", featured:false, image:sImg("assets/states/andhra-pradesh.jpg","Undavalli rock-cut caves beside the Krishna river, Andhra Pradesh","photo") },
    { id:"arunachal-pradesh", name:"Arunachal Pradesh", type:"state", capital:"Itanagar", region:"Northeast", districtsCount:25,
      shortDescription:"Monastery towns and high passes on the eastern Himalaya.",
      themes:["MOUNTAINS","MONASTERIES","NATURE"], status:"partial", featured:false, image:null },
    { id:"assam", name:"Assam", type:"state", capital:"Dispur", region:"Northeast", districtsCount:35,
      shortDescription:"Brahmaputra valley — one-horned rhino country and tea gardens.",
      themes:["WILDLIFE","TEA","CULTURE"], status:"partial", featured:false, image:null },
    { id:"bihar", name:"Bihar", type:"state", capital:"Patna", region:"East", districtsCount:38,
      shortDescription:"Buddhist circuit of Bodh Gaya and the ancient Magadhan capitals.",
      themes:["BUDDHIST","HERITAGE","SPIRITUAL"], status:"partial", featured:false, image:null },
    { id:"chhattisgarh", name:"Chhattisgarh", type:"state", capital:"Raipur", region:"Central", districtsCount:33,
      shortDescription:"Waterfalls, tribal culture and forested hill temples.",
      themes:["WATERFALLS","TRIBAL","FORESTS"], status:"partial", featured:false, image:null },
    { id:"goa", name:"Goa", type:"state", capital:"Panaji", region:"West", districtsCount:2,
      shortDescription:"Portuguese-baroque Old Goa and a coast of beach villages.",
      themes:["BEACHES","HERITAGE","FOOD"], status:"verified", featured:true, image:sImg("assets/states/goa.jpg","White chapel façade among coconut palms on a Goan beach","generated") },
    { id:"gujarat", name:"Gujarat", type:"state", capital:"Gandhinagar", region:"West", districtsCount:33,
      shortDescription:"Stepwells, Harappan cities and the salt desert of Kutch.",
      themes:["STEPWELLS","ARCHAEOLOGY","DESERT"], status:"partial", featured:false, image:sImg("assets/states/gujarat.jpg","Rani ki Vav stepwell with sculpted galleries, Gujarat","photo") },
    { id:"haryana", name:"Haryana", type:"state", capital:"Chandigarh", region:"North", districtsCount:22,
      shortDescription:"Kurukshetra's sacred tanks and Mughal-era gardens on the Delhi frontier.",
      themes:["HERITAGE","SPIRITUAL","LAKES"], status:"partial", featured:false, image:null },
    { id:"himachal-pradesh", name:"Himachal Pradesh", type:"state", capital:"Shimla", region:"North", districtsCount:12,
      shortDescription:"Colonial ridge towns, cedar valleys and Himalayan passes.",
      themes:["MOUNTAINS","TREKKING","NATURE"], status:"verified", featured:true, image:sImg("assets/states/himachal-pradesh.jpg","Snow-dusted deodar ridges above a Himalayan valley town, Himachal Pradesh","generated") },
    { id:"jharkhand", name:"Jharkhand", type:"state", capital:"Ranchi", region:"East", districtsCount:24,
      shortDescription:"Chotanagpur plateau of falls, forests and tribal craft.",
      themes:["WATERFALLS","FORESTS","TRIBAL"], status:"partial", featured:false, image:null },
    { id:"karnataka", name:"Karnataka", type:"state", capital:"Bengaluru", region:"South", districtsCount:31,
      shortDescription:"Empires of the Deccan — Vijayanagara, Hoysala and Chalukya heartland.",
      themes:["HERITAGE","WILDLIFE","COAST"], status:"verified", featured:true, image:sImg("assets/states/karnataka.jpg","Hampi's temple skyline among granite boulders, Karnataka","photo") },
    { id:"kerala", name:"Kerala", type:"state", capital:"Thiruvananthapuram", region:"South", districtsCount:14,
      shortDescription:"Backwaters, spice-port heritage and the Western Ghats tea hills.",
      themes:["BACKWATERS","BEACHES","CULTURE"], status:"verified", featured:true, image:sImg("assets/states/kerala.jpg","Houseboat on palm-fringed backwaters at golden hour, Kerala","generated") },
    { id:"madhya-pradesh", name:"Madhya Pradesh", type:"state", capital:"Bhopal", region:"Central", districtsCount:52,
      shortDescription:"Stupas, rock shelters and India's best-known tiger reserves.",
      themes:["HERITAGE","WILDLIFE","TEMPLES"], status:"partial", featured:false, image:sImg("assets/states/madhya-pradesh.jpg","Sanchi stupa among verdure, Madhya Pradesh","photo") },
    { id:"maharashtra", name:"Maharashtra", type:"state", capital:"Mumbai", region:"West", districtsCount:36,
      shortDescription:"Ajanta and Ellora caves, Deccan forts and the Konkan coast.",
      themes:["FORTS","CAVES","COAST"], status:"partial", featured:false, image:sImg("assets/states/maharashtra.jpg","Ellora's Kailasa temple carved from a single rock face, Maharashtra","photo") },
    { id:"manipur", name:"Manipur", type:"state", capital:"Imphal", region:"Northeast", districtsCount:16,
      shortDescription:"Loktak's floating islands and Meitei heritage.",
      themes:["LAKES","CULTURE","NATURE"], status:"partial", featured:false, image:null },
    { id:"meghalaya", name:"Meghalaya", type:"state", capital:"Shillong", region:"Northeast", districtsCount:12,
      shortDescription:"Living-root bridges under some of the wettest skies on earth.",
      themes:["WATERFALLS","CAVES","NATURE"], status:"partial", featured:false, image:null },
    { id:"mizoram", name:"Mizoram", type:"state", capital:"Aizawl", region:"Northeast", districtsCount:8,
      shortDescription:"Bamboo hill country and Mizo craft villages.",
      themes:["MOUNTAINS","CULTURE","NATURE"], status:"partial", featured:false, image:null },
    { id:"nagaland", name:"Nagaland", type:"state", capital:"Kohima", region:"Northeast", districtsCount:16,
      shortDescription:"Naga tribal heritage and the WWII Kohima battlefield.",
      themes:["TRIBAL","HISTORY","MOUNTAINS"], status:"partial", featured:false, image:null },
    { id:"odisha", name:"Odisha", type:"state", capital:"Bhubaneswar", region:"East", districtsCount:30,
      shortDescription:"Kalinga temples, Buddhist hills and Chilika's lagoon birds.",
      themes:["TEMPLES","BUDDHIST","COAST"], status:"partial", featured:false, image:sImg("assets/states/odisha.jpg","Konark-inspired temple wheel carving, Odisha","photo") },
    { id:"punjab", name:"Punjab", type:"state", capital:"Chandigarh", region:"North", districtsCount:23,
      shortDescription:"The Golden Temple, sacred tanks and fertile five-river country.",
      themes:["SPIRITUAL","HERITAGE","FOOD"], status:"partial", featured:false, image:sImg("assets/states/punjab.jpg","Golden Temple reflected in its sacred pool at dusk, Amritsar, Punjab","generated") },
    { id:"rajasthan", name:"Rajasthan", type:"state", capital:"Jaipur", region:"North", districtsCount:41,
      shortDescription:"Rajput forts, stepwells and the Thar desert's caravan towns.",
      themes:["FORTS","DESERT","PALACES"], status:"verified", featured:true, image:sImg("assets/states/rajasthan.jpg","Rajput fort walls rising above the pink city, Rajasthan","photo") },
    { id:"sikkim", name:"Sikkim", type:"state", capital:"Gangtok", region:"Northeast", districtsCount:6,
      shortDescription:"Kanchenjunga's Buddhist kingdom of monasteries and ridges.",
      themes:["MOUNTAINS","MONASTERIES","NATURE"], status:"partial", featured:false, image:null },
    { id:"tamil-nadu", name:"Tamil Nadu", type:"state", capital:"Chennai", region:"South", districtsCount:38,
      shortDescription:"Great living temples of the Cholas and Pandyas, and the Coromandel coast.",
      themes:["TEMPLES","CULTURE","COAST"], status:"verified", featured:true, image:sImg("assets/states/tamil-nadu.jpg","Tall sculpted temple gopuram towers of Tamil Nadu","photo") },
    { id:"telangana", name:"Telangana", type:"state", capital:"Hyderabad", region:"South", districtsCount:33,
      shortDescription:"Kakatiya temples and the Qutb Shahi monuments of Hyderabad.",
      themes:["FORTS","TEMPLES","HERITAGE"], status:"partial", featured:false, image:sImg("assets/states/telangana.jpg","Ornate Kakatiya-era temple gateway, Telangana","photo") },
    { id:"tripura", name:"Tripura", type:"state", capital:"Agartala", region:"Northeast", districtsCount:8,
      shortDescription:"Ujjayanta palaces and temple lakes near the Bengal border.",
      themes:["PALACES","TEMPLES","LAKES"], status:"partial", featured:false, image:null },
    { id:"uttar-pradesh", name:"Uttar Pradesh", type:"state", capital:"Lucknow", region:"North", districtsCount:75,
      shortDescription:"Mughal monuments, sacred river cities and Buddhist ruins.",
      themes:["HERITAGE","TEMPLES","BUDDHIST"], status:"partial", featured:false, image:sImg("assets/states/uttar-pradesh.jpg","Frescoed Chaturbhuj temple architecture, Orchha, Uttar Pradesh","photo") },
    { id:"uttarakhand", name:"Uttarakhand", type:"state", capital:"Dehradun", region:"North", districtsCount:13,
      shortDescription:"Char Dham shrines, yoga towns and Himalayan trekking.",
      themes:["SPIRITUAL","MOUNTAINS","TREKKING"], status:"partial", featured:false, image:sImg("assets/states/uttarakhand.jpg","Evening aarti lamps on the Ganga at Rishikesh, Uttarakhand","generated") },
    { id:"west-bengal", name:"West Bengal", type:"state", capital:"Kolkata", region:"East", districtsCount:30,
      shortDescription:"Colonial Kolkata, Darjeeling's tea ridges and Sundarbans mangroves.",
      themes:["HERITAGE","TEA","WILDLIFE"], status:"partial", featured:false, image:sImg("assets/states/west-bengal.jpg","Victoria Memorial beside Kolkata's maidan at dusk, West Bengal","generated") },
    { id:"andaman-nicobar", name:"Andaman & Nicobar Islands", type:"union-territory", capital:"Port Blair", region:"East", districtsCount:3,
      shortDescription:"Emerald islands, coral reefs and a colonial cellular jail.",
      themes:["BEACHES","ISLANDS","HISTORY"], status:"partial", featured:false, image:sImg("assets/states/andaman-nicobar.jpg","Turquoise lagoon and mangrove coast of the Andaman Islands","generated") },
    { id:"chandigarh", name:"Chandigarh", type:"union-territory", capital:"Chandigarh", region:"North", districtsCount:1,
      shortDescription:"Le Corbusier's planned city and its famous Rock Garden.",
      themes:["ARCHITECTURE","GARDENS","CULTURE"], status:"partial", featured:false, image:null },
    { id:"dadra-nagar-haveli-daman-diu", name:"Dadra & Nagar Haveli and Daman & Diu", type:"union-territory", capital:"Daman", region:"West", districtsCount:3,
      shortDescription:"Portuguese sea forts and a forested mainland enclave.",
      themes:["FORTS","NATURE","BEACHES"], status:"partial", featured:false, image:null },
    { id:"delhi", name:"Delhi (NCT)", type:"union-territory", capital:"New Delhi", region:"North", districtsCount:11,
      shortDescription:"Seven historic cities — Mughal gardens, tombs and bazaars.",
      themes:["HERITAGE","FOOD","MUSEUMS"], status:"partial", featured:false, image:sImg("assets/states/delhi.jpg","India Gate arch at dusk against a monsoon sky, Delhi","generated") },
    { id:"jammu-kashmir", name:"Jammu & Kashmir", type:"union-territory", capital:"Srinagar", region:"North", districtsCount:20,
      shortDescription:"Dal Lake houseboats, Mughal gardens and valley meadows.",
      themes:["LAKES","MOUNTAINS","GARDENS"], status:"partial", featured:false, image:sImg("assets/states/jammu-kashmir.jpg","Shikara boats and wooden houseboats on Dal Lake at sunrise, Srinagar","generated") },
    { id:"ladakh", name:"Ladakh", type:"union-territory", capital:"Leh", region:"North", districtsCount:2,
      shortDescription:"High-desert monasteries between the Karakoram and the Himalaya.",
      themes:["MONASTERIES","MOUNTAINS","ADVENTURE"], status:"partial", featured:false, image:null },
    { id:"lakshadweep", name:"Lakshadweep", type:"union-territory", capital:"Kavaratti", region:"South", districtsCount:1,
      shortDescription:"Coral atolls and lagoons off the Kerala coast.",
      themes:["ISLANDS","CORAL","BEACHES"], status:"partial", featured:false, image:null },
    { id:"puducherry", name:"Puducherry", type:"union-territory", capital:"Puducherry", region:"South", districtsCount:4,
      shortDescription:"French-quarter streets on the Coromandel and Auroville's calm.",
      themes:["HERITAGE","BEACHES","CULTURE"], status:"partial", featured:false, image:null }
  ];

  const REGIONS = ["All", "North", "South", "East", "West", "Central", "Northeast"];

  /* ---------------- place normalization ---------------- */
  function normKAPlace(p, district, i) {
    return {
      id: p.id, districtId: district.id, stateId: "karnataka",
      name: p.name, type: p.categories && p.categories[0] || p.type || "place",
      shortDescription: p.desc || p.description || "",
      coords: p.coords || p.coordinates || null,
      tags: (p.tags || []).map(t => String(t).toLowerCase()),
      durationMin: p.durationMin || 45, bestTime: p.bestTime || "Daytime",
      photographyScore: p.photographyScore || 7.5,
      heritageScore: p.heritageScore || 8, cultureScore: p.cultureScore || 7,
      natureScore: p.natureScore || 5, familyScore: p.familyScore || 7,
      accessibilityScore: p.accessibilityScore || 7,
      priority: p.priority || i + 1, verified: true,
      image: p.image && p.image.src ? p.image : (p.image ? { src: p.image, alt: p.name + ", Karnataka", credit: "GEARUP N GOO dataset", source: "curated dataset", status: "photo" } : null),
      historyNote: p.historyNote || null
    };
  }

  function normCuratedPlace(p, district) {
    return Object.assign({}, p, {
      districtId: district.id, stateId: district.stateId,
      coords: p.coordinates || p.coords || null,
      tags: (p.tags || []).map(t => String(t).toLowerCase())
    });
  }

  /* Heritage-archive places -> top-place model (derived, partial). */
  const TAGMAP = { temples:"spiritual", temple:"spiritual", hindu:"spiritual", buddhist:"spiritual", jain:"spiritual", islam:"spiritual",
    archaeology:"history", "urban-heritage":"heritage", architecture:"architecture", caves:"heritage", forts:"heritage" };
  function normArchivePlace(p, district, i) {
    const raw = ((p.tags || []).concat(p.facets || [])).map(t => String(t).toLowerCase());
    const tags = new Set(["heritage", "history", "architecture", "photography"]);
    raw.forEach(t => { if (TAGMAP[t]) tags.add(TAGMAP[t]); });
    return {
      id: p.slug || p.id, districtId: district.id, stateId: district.stateId,
      name: p.name, type: p.classification === "UNESCO" ? "UNESCO site" : "Heritage site",
      shortDescription: p.tagline || p.description || "Heritage place from the GEARUP N GOO national archive.",
      coords: p.coordinates || null,
      tags: [...tags],
      durationMin: 75, bestTime: "Morning",
      photographyScore: 8.5, heritageScore: 10, cultureScore: 8, natureScore: 4,
      familyScore: 7, accessibilityScore: 7,
      priority: i + 1, verified: true,
      image: p.image ? { src: p.image, alt: p.name + " — " + (p.location || district.name + ", " + district.stateName), credit: "GEARUP N GOO heritage archive", source: "national heritage archive", status: "photo" } : null,
      archiveRef: { state: district.stateId, slug: p.slug || p.id }
    };
  }

  /* ---------------- districts(stateId) ---------------- */
  const curated = () => (window.GNGIndiaPlaces && GNGIndiaPlaces.districts) || {};
  let kaCache = null;

  function karnatakaDistricts() {
    if (kaCache) return kaCache;
    if (typeof getAllDistricts !== "function") return [];
    kaCache = getAllDistricts().map(d => ({
      id: d.id, stateId: "karnataka", name: d.name,
      description: d.description || d.microcopy || "",
      themes: (d.knownFor || []).slice(0, 3),
      coords: d.coords, bestTime: d.bestTime || "October – March",
      tags: (d.tags || []).map(t => t.toLowerCase()),
      heroGradient: d.heroGradient || null,
      historySummary: d.historySummary || "",
      image: { src: "assets/districts/" + d.id + ".png", alt: d.name + " district, Karnataka — " + (d.knownFor || []).slice(0,3).join(", ").toLowerCase(), credit: "GEARUP N GOO dataset", source: "curated dataset", status: "photo" },
      status: "verified", source: "districts.js (verified dataset)",
      places: (d.places || []).map((p, i) => normKAPlace(p, { id: d.id }, i))
    }));
    return kaCache;
  }

  /* Extract a district anchor from free-form archive location strings like
   * "Adalaj village, Gandhinagar district" or "Hirapur, near Bhubaneswar". */
  const CANON = { "aurangabad": "chhatrapati-sambhajinagar", "chhatrapati-sambhajinagar-aurangabad": "chhatrapati-sambhajinagar" };
  const CANON_NAME = { "chhatrapati-sambhajinagar": "Chhatrapati Sambhajinagar (Aurangabad)" };
  function districtAnchor(loc) {
    const s = String(loc || "").trim();
    let name = null;
    const dM = s.match(/([A-Za-z][A-Za-z ]*?)\s+district/i);
    if (dM) name = dM[1];
    else {
      const nM = [...s.matchAll(/near\s+([A-Za-z][A-Za-z ()]*?)(?:,|$)/g)];
      if (nM.length) name = nM[nM.length - 1][1];
      else name = s.split(",").pop();
    }
    name = name.replace(/\(.*?\)/g, "").replace(/\b(taluka|village|district)\b/ig, "").trim() || s;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const canon = CANON[slug] || slug;
    const display = CANON_NAME[canon] || name.replace(/\s+/g, " ");
    return { slug: canon, name: display };
  }

  const archiveCache = new Map();
  function archiveDistricts(stateId) {
    if (!window.GNGHeritage) return [];
    if (archiveCache.has(stateId)) return archiveCache.get(stateId);
    const st = GNGHeritage.getState(stateId);
    if (!st || !st.places || !st.places.length) { archiveCache.set(stateId, []); return []; }
    const groups = new Map();
    st.places.forEach((p, i) => {
      const a = districtAnchor(p.location || st.name);
      if (!groups.has(a.slug)) groups.set(a.slug, { key: a.slug, name: a.name, places: [] });
      groups.get(a.slug).places.push([p, i]);
    });
    const out = [...groups.values()].map(g => ({
      id: g.key, stateId, name: g.name,
      description: "Verified heritage places of the national archive in " + g.name + ".",
      themes: ["HERITAGE"],
      coords: g.places[0][0].coordinates || null,
      bestTime: "October – March", tags: ["heritage", "history", "architecture"],
      heroGradient: null,
      historySummary: st.description || "",
      image: null,
      status: "partial", source: "National Heritage Archive (derived districts)",
      places: g.places.map(([p, i]) => normArchivePlace(p, { id: g.key, stateId, stateName: st.name }, i))
    })).sort((a, b) => b.places.length - a.places.length);
    archiveCache.set(stateId, out);
    return out;
  }

  function districts(stateId) {
    try {
      let out;
      if (stateId === "karnataka") out = karnatakaDistricts();
      else {
        const c = curated()[stateId];
        out = (c && c.length) ? c.map(d => Object.assign({}, d, {
          places: d.places.map(p => normCuratedPlace(p, d))
            .sort((a, b) => (a.priority || 99) - (b.priority || 99))
        })) : [];
      }
      // Enrich curated states with archive-derived partial districts
      // (never overwrite a curated district with the same id).
      const curatedIds = new Set(out.map(d => d.id));
      archiveDistricts(stateId).forEach(d => { if (!curatedIds.has(d.id)) out.push(d); });
      return out;
    } catch (e) {
      console.warn("GNGIndiaDestinations.districts failed for " + stateId, e);
      return [];
    }
  }

  function district(stateId, districtId) {
    return districts(stateId).find(d => d.id === districtId) || null;
  }

  /* Global unique lookup by district id (for resolveTarget). */
  function districtById(id) {
    for (const s of STATES) {
      const hit = districts(s.id).find(d => d.id === id);
      if (hit) return hit;
    }
    return null;
  }

  /* ---------------- states ---------------- */
  const states = () => STATES.map(s => Object.assign({}, s, {
    curatedDistricts: districts(s.id).filter(d => d.status === "verified").length,
    heritageStories: (window.GNGHeritage && GNGHeritage.getState(s.id) ? (GNGHeritage.getState(s.id).places || []).length : 0)
  }));
  const getState = id => STATES.find(s => s.id === id) || null;
  const featuredStates = () => states().filter(s => s.featured);
  const regions = () => REGIONS.slice();

  /* ---------------- search ---------------- */
  function searchStates(q) {
    const t = String(q || "").trim().toLowerCase();
    if (!t) return states();
    return states().filter(s =>
      s.name.toLowerCase().includes(t) || s.capital.toLowerCase().includes(t) ||
      s.region.toLowerCase().includes(t) || s.themes.join(" ").toLowerCase().includes(t));
  }
  function searchDistricts(stateId, q) {
    const t = String(q || "").trim().toLowerCase();
    const list = districts(stateId);
    if (!t) return list;
    return list.filter(d => (d.name + " " + (d.themes || []).join(" ") + " " + (d.description || "")).toLowerCase().includes(t));
  }

  /* ---------------- circuits ---------------- */
  function resolvePlaceRef(ref) {
    const [kind, rest] = ref.split(":");
    if (kind === "legacy") {
      const d = (typeof getDestination === "function") ? getDestination(rest) : null;
      return d ? { name: d.name, href: "#/destination/" + d.id } : null;
    }
    if (kind === "archive") {
      const [st, slug] = rest.split("/");
      const e = window.GNGHeritage && GNGHeritage.getPlace(st, slug);
      return e ? { name: e.place.name, href: "#/history/" + st + "/" + slug } : null;
    }
    const [dId, pId] = rest.split("/");
    for (const s of STATES) {
      const d = districts(s.id).find(x => x.id === dId);
      if (d) {
        const p = d.places.find(x => x.id === pId);
        return p ? { name: p.name, href: null } : null;
      }
    }
    return null;
  }
  function circuits() {
    const list = (window.GNGIndiaPlaces && GNGIndiaPlaces.circuits) || [];
    return list.map(c => {
      const places = c.placeIds.map(resolvePlaceRef).filter(Boolean);
      return Object.assign({}, c, { resolvedPlaces: places, placeCount: places.length });
    }).filter(c => c.placeCount >= 2);
  }

  /* Health flag for error handling in the UI. */
  const ready = () => !!(window.GNGIndiaPlaces && GNGIndiaPlaces.districts && (typeof getAllDistricts === "function"));

  return { states, getState, featuredStates, regions, districts, district, districtById,
           searchStates, searchDistricts, circuits, resolvePlaceRef, ready };
})();
