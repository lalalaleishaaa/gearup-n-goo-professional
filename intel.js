/* ============================================================
 * GEARUP N GOO — INTELLIGENCE CORE (intel.js)
 * A) Personalization engine  · deterministic, explainable 0–100
 * B) routeService            · OSRM adapter + honest fallback
 * G) weatherService/conditions · Open-Meteo + labelled estimates
 * C) Budget engine + optimizer
 * D) "Why should I go?" generator + modal
 * E) Story builder + speech + Story Mode UI
 * F) Journey Mode hooks (navigate, arrive, passport, progress)
 * H) Passport achievements
 * Loaded after data.js, before app.js. No framework, no keys.
 * ============================================================ */
(() => {
  "use strict";

  const ENRICH = window.GNG_ENRICH || { destinations: {}, places: {}, defaults: {} };
  const DEF = ENRICH.defaults || {};

  const $ = (s, c = document) => c.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const clamp01 = (x) => Math.max(0, Math.min(1, x));

  function destEnrich(id) { return ENRICH.destinations[id] || null; }
  function placeEnrich(id) { return ENRICH.places[id] || null; }

  /* =======================================================
   * FEATURE A — PERSONALIZATION ENGINE (deterministic)
   * Weighted model; every component normalized 0–1.
   * ======================================================= */
  const WEIGHTS = { interest:.30, photography:.10, heritage:.10, pace:.10, traveller:.10, time:.10, budget:.05, weather:.05, signature:.10 };

  function prefsFromWizard(w) {
    return {
      interests: [...(w.interests || [])],
      pace: w.pace || "Balanced",
      traveller: w.travellers || "Solo",
      budget: w.budget || "moderate",
      transport: w.transport || "car",
      date: w.date || "",
      time: w.time || "08:00",
      level: w.level || "quick"
    };
  }
  function savedPrefs() {
    try {
      const raw = localStorage.getItem("gng_preferences");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { interests: ["photography", "heritage"], pace: "Balanced", traveller: "Solo", budget: "moderate", transport: "car", date: "", time: "08:00", level: "quick" };
  }
  function savePrefs(w) { try { localStorage.setItem("gng_preferences", JSON.stringify(prefsFromWizard(w))); } catch (e) {} }

  /* Resolve personalization metadata for a place — enrichment first,
     then deterministic inference from its own tags. Never random. */
  function placeMeta(p, destId) {
    const de = destEnrich(destId);
    const pe = placeEnrich(p.id) || {};
    const tags = (p.tags || []).map(t => t.toLowerCase());
    const idealFor = (pe.personalization && pe.personalization.idealFor) ||
      (de && de.personalization && de.personalization.idealFor && tags.some(t => de.personalization.idealFor.includes(t)) ? de.personalization.idealFor : null) ||
      tags;
    return {
      idealFor,
      travellerTypes: (de && de.personalization && de.personalization.travellerTypes) || ["Solo","Friends","Couple","Family","Group"],
      paceFit: (de && de.personalization && de.personalization.paceFit) || ["Relaxed","Balanced","Fast-paced"],
      budgetFit: (de && de.personalization && de.personalization.budgetFit) || ["budget","moderate","premium"],
      bestMoments: pe.bestMoments || (de && de.personalization && de.personalization.bestMoments) || [],
      signature: !!(p.UNESCO || (p.photographyScore >= 9) || tags.includes("heritage") && tags.includes("architecture") || (de && de.personalization && de.personalization.signature && tags.includes("heritage"))),
      outdoor: pe.outdoor === true || tags.includes("trekking") || tags.includes("nature") || tags.includes("sunrise") || tags.includes("sunset"),
      reasons: (de && de.personalization && de.personalization.reasons) || {},
      entryFee: pe.entryFee ?? null,
      openingHours: pe.openingHours || (de && de.openingHours && de.openingHours.default) || DEF.openingHours || null
    };
  }

  function timeToMinutes(t) { const m = String(t || "").match(/(\d{1,2}):(\d{2})/); return m ? +m[1]*60 + +m[2] : null; }

  /* Core: score one place for one preference set. Pure & deterministic. */
  function calculatePlaceMatch(place, prefs, ctx = {}) {
    const meta = placeMeta(place, ctx.destId);
    const tags = (place.tags || []).map(t => t.toLowerCase());
    const interests = (prefs.interests || []).map(i => i.toLowerCase());

    // 1) Interest match — overlap of selected interests with place tags/idealFor (30%)
    const matched = interests.filter(i => tags.includes(i) || meta.idealFor.includes(i));
    const interest = interests.length ? clamp01(matched.length / interests.length * 0.82 + (matched.length ? 0.18 : 0)) : 0.6;

    // 2) Photography / experience quality (10%)
    const photography = clamp01(((place.photographyScore || 7) - 1) / 9);

    // 3) Heritage relevance (10%)
    const heritage = tags.includes("heritage") || tags.includes("history") || tags.includes("architecture") || tags.includes("spiritual") ? 1 : 0.35;

    // 4) Pace compatibility (10%) — duration vs pace; walking-pace bonus for relaxed
    const dur = place.durationMin || 30;
    const paceTarget = prefs.pace === "Relaxed" ? 70 : prefs.pace === "Fast-paced" ? 30 : 50;
    const pace = clamp01(1 - Math.abs(dur - paceTarget) / 90) * (meta.paceFit.includes(prefs.pace) ? 1 : 0.72);

    // 5) Traveller compatibility (10%)
    const traveller = meta.travellerTypes.includes(prefs.traveller) ? 1 :
      (prefs.traveller === "Family" && tags.includes("family")) || (prefs.traveller === "Couple" && (tags.includes("couples") || tags.includes("sunset"))) ? 0.9 : 0.55;

    // 6) Time-of-day compatibility (10%) — planned/typical hour vs place's best window
    const startMin = timeToMinutes(ctx.arrive) ?? timeToMinutes(prefs.time) ?? 540;
    const bt = timeToMinutes(place.bestTime);
    let time = 0.62;
    if (bt != null) time = clamp01(1 - Math.min(Math.abs(bt - startMin), 1440 - Math.abs(bt - startMin)) / 480);
    if (meta.bestMoments.length) {
      const sunriseish = (startMin <= 8*60 || startMin >= 16.5*60);
      const wantsGolden = meta.bestMoments.some(m => ["sunrise","sunset","golden-hour"].includes(m));
      time = clamp01(time * 0.6 + (wantsGolden && sunriseish ? 0.4 : 0.22));
    }

    // 7) Budget compatibility (5%)
    const budget = meta.budgetFit.includes(prefs.budget) ? 1 : 0.6;

    // 8) Weather compatibility (5%) — neutral when no weather is loaded
    let weather = 0.75, weatherKnown = false;
    if (ctx.weather && ctx.weather.status === "LIVE") {
      weatherKnown = true;
      const wet = (ctx.weather.precipitationProbability || 0) >= 55 || (ctx.weather.rain || 0) >= 4;
      weather = wet ? (meta.outdoor ? 0.25 : 0.85) : (meta.outdoor ? 1 : 0.8);
    }

    // 9) Signature value (10%)
    const signature = meta.signature ? 1 : tags.includes("hidden") ? 0.55 : 0.45;

    const components = { interest, photography, heritage, pace, traveller, time, budget, weather, signature };
    const totalW = WEIGHTS.interest + WEIGHTS.photography + WEIGHTS.heritage + WEIGHTS.pace + WEIGHTS.traveller + WEIGHTS.time + WEIGHTS.budget + WEIGHTS.weather + WEIGHTS.signature;
    const raw = Object.entries(WEIGHTS).reduce((s, [k, w]) => s + w * components[k], 0);
    const finalScore = Math.round((raw / totalW) * 100);

    const breakdown = {}; Object.keys(components).forEach(k => breakdown[k] = Math.round(components[k] * 100));

    // Explainable reasons from actual matches (no filler)
    const reasons = [];
    matched.slice(0, 3).forEach(i => {
      const r = meta.reasons[i];
      if (r) reasons.push(r);
      else reasons.push(`${cap(i)} match — this place is tagged for ${cap(i).toLowerCase()}.`);
    });
    if (meta.signature && !reasons.some(r => /signature|iconic|unesco/i.test(r))) reasons.push(place.UNESCO ? "A UNESCO-recognised signature site of this destination." : "A signature stop of this destination.");
    if (breakdown.pace >= 75) reasons.push(`Fits your ${prefs.pace.toLowerCase()} pace (${dur} min visit).`);
    if (breakdown.traveller >= 90 && prefs.traveller !== "Solo") reasons.push(`Well suited to ${prefs.traveller.toLowerCase()} travellers.`);
    if (weatherKnown && breakdown.weather <= 40) reasons.push("Weather-sensitive stop — see the conditions advisory.");

    return { placeId: place.id, finalScore, scoreBreakdown: breakdown, matchedInterests: matched, recommendationReasons: reasons.slice(0, 4), _meta: meta };
  }

  function cap(s) { return String(s).charAt(0).toUpperCase() + String(s).slice(1); }

  function calculateDestinationMatch(dest, prefs, ctx = {}) {
    const places = (dest.places || []).slice(0, 12);
    if (!places.length) return { finalScore: 60, reasons: [], topPlaces: [] };
    const scored = places.map(p => calculatePlaceMatch(p, prefs, { ...ctx, destId: dest.id })).sort((a, b) => b.finalScore - a.finalScore);
    const top = scored.slice(0, 6);
    const avg = Math.round(top.reduce((s, x) => s + x.finalScore, 0) / top.length);
    const de = destEnrich(dest.id);
    const reasons = [];
    (de && de.personalization && de.personalization.reasons ? prefs.interests : []).forEach(i => {
      const r = de.personalization.reasons[i]; if (r) reasons.push(r); });
    top.slice(0, 2).forEach(t => { if (t.finalScore >= 80) reasons.push(`${t.placeId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} scores ${t.finalScore}% against your interests.`); });
    if (de && de.personalization && !de.personalization.paceFit.includes(prefs.pace)) reasons.splice(0, 0, "Note: most stops here favour a " + de.personalization.paceFit.join(" or ").toLowerCase() + " pace.");
    return { finalScore: avg, reasons: reasons.slice(0, 4), topPlaces: top.map(t => ({ placeId: t.placeId, finalScore: t.finalScore })) };
  }

  /* FEATURE D — "Why should I go?" payload */
  function generateWhyThisPlace(entity, prefs) {
    // entity: {kind:'place', place, destId} | {kind:'destination', dest}
    if (entity.kind === "destination") {
      const m = calculateDestinationMatch(entity.dest, prefs);
      const de = destEnrich(entity.dest.id);
      return {
        title: `Why ${entity.dest.name} for you?`, matchPct: m.finalScore,
        usedInterests: prefs.interests, reasons: m.reasons,
        paceFit: (de && de.personalization && de.personalization.paceFit.includes(prefs.pace)) ? prefs.pace : (de && de.personalization && de.personalization.paceFit[0]) || prefs.pace,
        travellerFit: !(de && de.personalization) || de.personalization.travellerTypes.includes(prefs.traveller) ? prefs.traveller : "Most types",
        bestMoment: bestMomentLabel(entity.dest, prefs), signature: !!(de && de.personalization && de.personalization.signature)
      };
    }
    const m = calculatePlaceMatch(entity.place, prefs, { destId: entity.destId });
    return {
      title: `Why ${entity.place.name} for you?`, matchPct: m.finalScore,
      usedInterests: prefs.interests, reasons: m.recommendationReasons,
      paceFit: m._meta.paceFit.includes(prefs.pace) ? prefs.pace : m._meta.paceFit[0],
      travellerFit: m._meta.travellerTypes.includes(prefs.traveller) ? prefs.traveller : "Most types",
      bestMoment: bestMomentLabel(entity.place, prefs), signature: m._meta.signature
    };
  }
  function bestMomentLabel(entity, prefs) {
    const de = destEnrich(entity.id) || (entity.id ? null : null);
    const pe = placeEnrich(entity.id);
    const moments = (pe && pe.bestMoments) || (de && de.personalization && de.personalization.bestMoments) || [];
    const map = { sunrise: "06:15 – 07:15", morning: "08:00 – 10:30", "golden-hour": "16:30 – 17:45", sunset: "17:30 – 18:30" };
    if (prefs.interests.includes("sunrise") && moments.includes("sunrise")) return map.sunrise;
    if (prefs.interests.includes("sunset") && moments.includes("sunset")) return map.sunset;
    if (moments[0] && map[moments[0]]) return map[moments[0]];
    return "Early morning (light + crowds)";
  }

  /* =======================================================
   * FEATURE B — ROUTE SERVICE (provider adapter)
   * Prototype provider: public OSRM. Swap by editing PROVIDERS.
   * ======================================================= */
  const PROVIDERS = {
    osrm: {
      id: "osrm", label: "OSRM · OpenStreetMap routing",
      url: (coords, profile) => `https://routing.openstreetmap.de/${profile}/route/v1/driving/${coords.map(c => `${c[1].toFixed(5)},${c[0].toFixed(5)}`).join(";")}?overview=full&geometries=geojson`,
      profiles: { car: "routed-car", bike: "routed-bike", public: "routed-car", walking: "routed-foot" }
    }
  };
  let routeCache = new Map();

  const routeService = {
    provider: PROVIDERS.osrm,
    async getRoute({ profile = "car", coordinates = [] }) {
      if (!coordinates || coordinates.length < 2) return null;
      const key = profile + "|" + coordinates.map(c => c.map(x => +x.toFixed(4)).join(",")).join(";");
      if (routeCache.has(key)) return routeCache.get(key);
      const prov = this.provider;
      const prof = prov.profiles[profile] || "driving";
      try {
        const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 7000);
        const res = await fetch(prov.url(coordinates, prof), { signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error("route http " + res.status);
        const j = await res.json();
        const r = j.routes && j.routes[0];
        if (!r) throw new Error("no route");
        const out = {
          distanceKm: +(r.distance / 1000).toFixed(1),
          durationMin: Math.round(r.duration / 60),
          geometry: (r.geometry.coordinates || []).map(c => [c[1], c[0]]),
          legs: (r.legs || []).map(l => ({ distanceKm: +(l.distance / 1000).toFixed(2), durationMin: Math.round(l.duration / 60) })),
          provider: prov.label, isLive: true
        };
        routeCache.set(key, out);
        return out;
      } catch (e) {
        return null; // caller falls back — never fake a live route
      }
    },
    fallbackRoute(coords, transport) {
      const R = 6371, rad = d => d * Math.PI / 180;
      let km = 0; const legs = [];
      for (let i = 1; i < coords.length; i++) {
        const dLat = rad(coords[i][0]-coords[i-1][0]), dLon = rad(coords[i][1]-coords[i-1][1]);
        const s = Math.sin(dLat/2)**2 + Math.cos(rad(coords[i-1][0]))*Math.cos(rad(coords[i][0]))*Math.sin(dLon/2)**2;
        const d = 2*R*Math.asin(Math.sqrt(s)); km += d;
        legs.push({ distanceKm: +d.toFixed(2), durationMin: 0 });
      }
      return { distanceKm: +km.toFixed(1), durationMin: 0, geometry: null, legs, provider: "Straight-line estimate", isLive: false };
    },
    navigationUrl(from, to) {
      const dest = `destination=${to[0]},${to[1]}`;
      const org = from ? `&origin=${from[0]},${from[1]}` : "";
      return `https://www.google.com/maps/dir/?api=1${org}&${dest}`;
    }
  };

  /* =======================================================
   * FEATURE G — WEATHER + CONDITIONS (honest status labels)
   * ======================================================= */
  let weatherCache = new Map();
  const WMO = { 0:"Clear", 1:"Mostly clear", 2:"Partly cloudy", 3:"Overcast", 45:"Fog", 48:"Fog", 51:"Light drizzle", 53:"Drizzle", 55:"Drizzle", 61:"Light rain", 63:"Rain", 65:"Heavy rain", 80:"Showers", 81:"Showers", 82:"Heavy showers", 95:"Thunderstorm", 96:"Thunderstorm" };

  const weatherService = {
    label: "Open-Meteo",
    async fetchWeather(coords, dateStr) {
      const date = dateStr ? new Date(dateStr + "T00:00:00") : new Date();
      if (isNaN(date)) return { status: "UNAVAILABLE", reason: "invalid-date" };
      const today = new Date(); today.setHours(0,0,0,0);
      const diffDays = Math.round((date - today) / 86400000);
      if (diffDays < 0 || diffDays > 16) {
        return { status: "UNAVAILABLE", reason: diffDays < 0 ? "past-date" : "beyond-forecast-range", source: this.label };
      }
      const key = coords.map(c => c.toFixed(3)).join(",") + "|" + dateStr;
      if (weatherCache.has(key)) return weatherCache.get(key);
      const iso = d => d.toISOString().slice(0,10);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords[0]}&longitude=${coords[1]}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,rain_sum,wind_speed_10m_max,weathercode&timezone=auto&start_date=${iso(date)}&end_date=${iso(date)}`;
      try {
        const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 6000);
        const res = await fetch(url, { signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) throw new Error("weather http " + res.status);
        const j = await res.json();
        const d = j.daily || {};
        const out = {
          status: "LIVE", source: this.label,
          temperature: Math.round(d.temperature_2m_max?.[0] ?? 0),
          temperatureMin: Math.round(d.temperature_2m_min?.[0] ?? 0),
          precipitationProbability: d.precipitation_probability_max?.[0] ?? 0,
          rain: d.rain_sum?.[0] ?? 0,
          windSpeed: d.wind_speed_10m_max?.[0] ?? 0,
          condition: WMO[d.weathercode?.[0]] || "—",
          fetchedAt: new Date().toISOString()
        };
        weatherCache.set(key, out);
        return out;
      } catch (e) {
        return { status: "UNAVAILABLE", reason: "fetch-failed", source: this.label };
      }
    }
  };

  function calculateCrowdEstimate(destOrPlace, dateStr, hour) {
    const de = destEnrich(destOrPlace.id);
    const profile = (de && de.crowdProfile) || { base: destOrPlace.UNESCO ? "High" : "Moderate", weekendBoost: true, peakHours: [[10,13]] };
    const date = dateStr ? new Date(dateStr + "T00:00:00") : new Date();
    const dow = isNaN(date) ? new Date().getDay() : date.getDay();
    const weekend = dow === 0 || dow === 6;
    const baseScore = profile.base === "High" ? 2 : profile.base === "Moderate" ? 1 : 0;
    let score = baseScore + (weekend && profile.weekendBoost ? 1 : 0);
    const h = hour ?? 10;
    const inPeak = (profile.peakHours || []).some(([a, b]) => h >= a && h <= b);
    if (inPeak) score += 1;
    if (h <= 8 || h >= 17) score -= 1;
    const level = score >= 3 ? "High" : score >= 1.5 ? "Moderate" : "Low";
    const bestWindow = level === "High" ? (h <= 10 ? "06:30 – 08:30" : "16:30 – 18:00") : "09:00 – 11:00";
    return { level, confidence: "Estimated", bestWindow, basis: "weekday, time-of-day and destination popularity" };
  }

  const roadService = {
    getConditions(weather) {
      // No live road provider configured — say so, and only pass on
      // the weather-derived advisory (which IS grounded).
      const advisory = weather && weather.status === "LIVE" && ((weather.precipitationProbability || 0) >= 55 || (weather.rain || 0) >= 4)
        ? "Rain may affect driving conditions." : null;
      return { status: "UNAVAILABLE", live: false, advisory };
    }
  };

  function eventsFor(destId, dateStr) {
    const de = destEnrich(destId);
    if (!de || !de.events || !de.events.length || !dateStr) return [];
    const m = (new Date(dateStr + "T00:00:00")).getMonth() + 1;
    if (isNaN(m)) return [];
    return de.events.filter(ev => (ev.months || []).includes(m));
  }

  function calculateBestVisitingTime(place, prefs, weather) {
    const meta = placeMeta(place, null);
    const reasons = [];
    let start = "08:00", end = "10:00";
    const wantsSunset = prefs.interests.includes("sunset"), wantsSunrise = prefs.interests.includes("sunrise");
    if (wantsSunrise && (meta.bestMoments.includes("sunrise"))) { start = "06:15"; end = "07:15"; reasons.push("Sunrise photography match"); }
    else if (wantsSunset && meta.bestMoments.includes("sunset")) { start = "17:15"; end = "18:15"; reasons.push("Sunset photography match"); }
    else if (meta.bestMoments.includes("golden-hour")) { start = "16:30"; end = "17:45"; reasons.push("Destination's golden-hour window"); }
    else if (place.bestTime) { start = place.bestTime.split("–")[0] || "08:00"; end = addMinutes(start, 90); reasons.push("Matches the place's preferred visiting window"); }
    if (weather && weather.status === "LIVE" && (weather.precipitationProbability || 0) >= 55 && start >= "12:00") {
      start = "09:00"; end = "11:00"; reasons.push("Moved out of the rainy afternoon window");
    }
    reasons.push("Lower estimated crowd in this window");
    return { start, end, reasons: reasons.slice(0, 3), confidence: "Estimated" };
  }
  function addMinutes(hhmm, min) {
    const m = timeToMinutes(hhmm); if (m == null) return "09:00";
    const t = m + min; return `${String(Math.floor(t/60)%24).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`;
  }

  /* Adaptive warnings — user stays in control */
  function calculateAdaptiveWarnings(journey) {
    const out = [];
    const w = journey.weather, prefs = prefsFromWizard(journey.wizard);
    (journey.stops || []).forEach(s => {
      const meta = s.__meta || placeMeta(s, journey.destination.id);
      // weather conflict on outdoor stops
      if (w && w.status === "LIVE" && (w.precipitationProbability || 0) >= 55 && meta.outdoor) {
        const hour = timeToMinutes(s.arrive);
        if (hour != null && hour >= 13*60) out.push({ type: "weather", stopName: s.name, planned: s.arrive, recommended: "morning window", reason: `Rain probability ${w.precipitationProbability}% in the afternoon`, action: "move-earlier" });
      }
      // opening conflict
      const open = meta.openingHours && meta.openingHours[0];
      if (open) {
        const o = timeToMinutes(open[0]), c = timeToMinutes(open[1]);
        const arriveM = timeToMinutes(s.arrive);
        if (arriveM != null && o != null && (arriveM < o - 20 || arriveM > c - 30)) {
          out.push({ type: "opening", stopName: s.name, planned: s.arrive, recommended: `${open[0]}–${open[1]}`, reason: "Planned arrival is outside the dataset opening window", action: "move" });
        }
      }
      // crowd on signature stops at peak
      const cr = calculateCrowdEstimate(journey.destination, prefs.date, timeToMinutes(s.arrive) != null ? timeToMinutes(s.arrive)/60 : 10);
      if (cr.level === "High" && meta.signature) {
        out.push({ type: "crowd", stopName: s.name, planned: s.arrive, recommended: cr.bestWindow, reason: "High estimated crowd at this hour", action: "move" });
      }
    });
    return out;
  }

  function adaptJourneyToConditions(journey) {
    // Conservative, user-invoked: shift conflicted stops to recommended windows
    // by swapping with a same-day non-conflicted stop when possible.
    const warnings = calculateAdaptiveWarnings(journey);
    let applied = 0;
    warnings.forEach(warn => {
      if (warn.type === "weather" && warn.action === "move-earlier") {
        const idx = journey.stops.findIndex(s => s.name === warn.stopName);
        if (idx > 0) {
          const earlier = journey.stops.findIndex((s, i) => i < idx && !(s.__meta || placeMeta(s, journey.destination.id)).outdoor);
          if (earlier >= 0) {
            const tmp = journey.stops[earlier]; journey.stops[earlier] = journey.stops[idx]; journey.stops[idx] = tmp;
            applied++;
          }
        }
      } else if (warn.action === "move") {
        const idx = journey.stops.findIndex(s => s.name === warn.stopName);
        if (idx > 0) {
          const [s] = journey.stops.splice(idx, 1);
          journey.stops.unshift(s); applied++;
        }
      }
    });
    if (applied) reschedule(journey);
    return { applied, warnings: calculateAdaptiveWarnings(journey) };
  }

  function reschedule(journey) {
    const [sh, sm] = (journey.wizard.time || "08:00").split(":").map(n => +n);
    let clock = new Date(); clock.setHours(sh, sm, 0, 0);
    const pace = journey.wizard.pace === "Relaxed" ? 1.25 : journey.wizard.pace === "Fast-paced" ? 0.8 : 1;
    let prev = journey.startCoord;
    journey.stops.forEach((s, i) => {
      const dKm = haversine(prev, s.coords);
      const travelMin = s.travelMin || Math.max(3, Math.round(dKm / 30 * 60 * pace));
      clock = new Date(clock.getTime() + travelMin * 60000);
      s.arrive = `${String(clock.getHours()).padStart(2,"0")}:${String(clock.getMinutes()).padStart(2,"0")}`;
      clock = new Date(clock.getTime() + (s.durationMin || 30) * 60000);
      s.depart = `${String(clock.getHours()).padStart(2,"0")}:${String(clock.getMinutes()).padStart(2,"0")}`;
      s.travelKm = dKm; prev = s.coords; s.index = i;
    });
  }
  function haversine(a, b) {
    const R = 6371, r = d => d * Math.PI / 180;
    const dLat = r(b[0]-a[0]), dLon = r(b[1]-a[1]);
    const s = Math.sin(dLat/2)**2 + Math.cos(r(a[0]))*Math.cos(r(b[0]))*Math.sin(dLon/2)**2;
    return 2*R*Math.asin(Math.sqrt(s));
  }

  /* =======================================================
   * FEATURE C — SMART BUDGET ENGINE (all values ESTIMATED)
   * ======================================================= */
  const TRAVELLER_COUNT = { Solo: 1, Couple: 2, Friends: 4, Family: 4, Group: 6 };
  function calculateBudget(journey) {
    const w = journey.wizard, tier = w.budget || "moderate";
    const persons = TRAVELLER_COUNT[w.travellers] || 2;
    const level = (w.level === "weekend") ? 2 : (w.level === "deep") ? 3 : 1;
    const days = level === 1 ? 1 : level === 2 ? 2 : 4;
    const nights = Math.max(0, days - 1);
    const de = destEnrich(journey.destination.id);
    const bud = (de && de.budget) || {};
    const pick = (obj, dflt) => (obj && obj[tier] != null) ? obj[tier] : (dflt && dflt[tier] != null ? dflt[tier] : null);

    const km = journey.stats.totalKm || 0;
    const fuelPerKm = (DEF.fuelPerKm || {})[w.transport] ?? 8;
    let transport = 0, fuel = 0;
    if (w.transport === "public") transport = Math.round(persons * days * (DEF.publicPerPersonDay || 150));
    else if (w.transport === "walking") transport = 0;
    else fuel = Math.round(km * fuelPerKm);

    const stayPerNight = pick(bud.stayPerNight, DEF.stayPerNight) || 0;
    const rooms = Math.max(1, Math.ceil(persons / 2));
    const accommodation = stayPerNight * nights * rooms;
    const foodPP = pick(bud.foodPerPerson, DEF.foodPerPerson) || 0;
    const food = foodPP * persons * days;
    const entryFees = (journey.stops || []).reduce((s, p) => {
      const pe = placeEnrich(p.id);
      return s + (pe && pe.entryFee != null ? pe.entryFee : (pick(DEF.entryFee) || 0));
    }, 0) * persons;
    const experience = (pick(bud.experience, DEF.experience) || 0) * persons;
    const guide = journey.bestGuide && tier !== "budget" ? (tier === "premium" ? 2500 : 1200) : 0;
    const parking = (w.transport === "car" || w.transport === "bike") ? (DEF.parkingPerDay || 80) * days : 0;
    const subtotal = transport + fuel + parking + accommodation + food + entryFees + experience + guide;
    const contingency = Math.round(subtotal * 0.08);
    const total = subtotal + contingency;
    return {
      currency: "INR", status: "Estimated",
      transport, fuel, parking, accommodation, food, entryFees, experiences: experience, guide, contingency,
      total, perPerson: Math.round(total / persons),
      meta: { persons, days, nights, tier, rooms }
    };
  }

  function budgetStatus(budget) {
    const pp = budget.perPerson, days = budget.meta.days;
    const perDay = pp / days;
    if (perDay < 1200) return { label: "UNDER BUDGET", tone: "good" };
    if (perDay <= 3200) return { label: "ON TARGET", tone: "ok" };
    if (perDay <= 5000) return { label: "SLIGHTLY OVER", tone: "warn" };
    return { label: "SIGNIFICANTLY OVER", tone: "warn" };
  }

  function budgetOptimizeSuggestions(budget) {
    const out = []; let save = 0;
    if (budget.accommodation > 0) { save += Math.round(budget.accommodation * 0.35); out.push("Choose the moderate accommodation estimate instead of premium"); }
    if (budget.experiences > 0) { save += Math.round(budget.experiences * 0.4); out.push("Remove one paid experience"); }
    if (budget.food > 0) { save += Math.round(budget.food * 0.2); out.push("Prefer recommended local food stops over tourist restaurants"); }
    if (budget.guide > 0) { save += budget.guide; out.push("Skip the private guide — use our heritage stories instead"); }
    if (budget.transport > 0 && budget.fuel === 0) { save += Math.round(budget.transport * 0.3); out.push("Walk or share transport for short hops"); }
    return { save, tips: out.slice(0, 4) };
  }

  /* =======================================================
   * FEATURE E — STORY BUILDER + SPEECH
   * ======================================================= */
  function buildStory(entity) {
    // entity: data.js place/destination, or heritage place {__heritage:true}
    if (entity.__heritage) {
      const who = (entity.who || []).map(w => `${w.k}: ${w.v}`).join(" · ");
      const tl = (entity.timeline || []).map(t => ({ year: t.year, text: t.text }));
      return {
        id: entity.id, name: entity.name,
        era: entity.period || entity.dynasty || "",
        builtBy: entity.dynasty || who || "—",
        chapters: [
          { k: "WHAT STOOD HERE", v: (entity.thenNow && entity.thenNow.then) || (entity.why && entity.why[0]) || null },
          { k: "WHO BUILT IT", v: who || entity.dynasty || null },
          { k: "WHY IT MATTERED", v: (entity.why && entity.why[1]) || entity.tagline || null },
          { k: "WHAT REMAINS TODAY", v: (entity.thenNow && entity.thenNow.now) || null }
        ],
        timeline: tl,
        audioText: ((entity.why || []).join(" ")) || entity.tagline || ""
      };
    }
    const de = destEnrich(entity.id);
    if (de && de.story) {
      const s = de.story;
      return {
        id: entity.id, name: entity.name, era: s.era, builtBy: s.builtBy,
        chapters: [
          { k: "WHAT STOOD HERE", v: s.whatStoodHere },
          { k: "WHO BUILT IT", v: s.builtBy },
          { k: "WHY IT MATTERED", v: s.whyItMattered },
          { k: "WHAT REMAINS TODAY", v: s.whatRemains }
        ],
        timeline: (entity.timeline || []).map(t => ({ year: t.year, text: t.event })),
        audioText: (s.audioText && (s.audioText[localStorage.getItem("gng_lang") || "English"])) || (s.audioText && s.audioText.English) || [s.whatStoodHere, s.whyItMattered].filter(Boolean).join(" ")
      };
    }
    const pe = placeEnrich(entity.id);
    if (pe && pe.story) {
      return { id: entity.id, name: entity.name, era: "", builtBy: "", chapters: [{ k: "THE PLACE", v: entity.why || entity.shortDesc || "" }], timeline: [], audioText: pe.story.audioText.English };
    }
    // generic fallback from existing fields — never fabricate
    return {
      id: entity.id, name: entity.name,
      era: entity.heritagePeriod || "",
      builtBy: entity.dynasty || "",
      chapters: [{ k: "HISTORICAL CONTEXT", v: entity.historicalSummary || entity.shortDesc || "Historical information for this place is still being verified." }],
      timeline: (entity.timeline || []).map(t => ({ year: t.year, text: t.event })),
      audioText: entity.historicalSummary || ""
    };
  }

  const speech = {
    supported: typeof window !== "undefined" && "speechSynthesis" in window,
    speak(text, lang = "en-IN") {
      if (!this.supported || !text) return false;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang; u.rate = 0.95; u.pitch = 1;
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find(v => v.lang && v.lang.startsWith(lang.slice(0, 2))) || voices.find(v => /en-IN|en-GB|en-US/.test(v.lang));
        if (v) u.voice = v;
        window.speechSynthesis.speak(u);
        return true;
      } catch (e) { return false; }
    },
    stop() { if (this.supported) try { window.speechSynthesis.cancel(); } catch (e) {} }
  };

  /* =======================================================
   * FEATURE F/H — JOURNEY MODE HOOKS + PASSPORT
   * ======================================================= */
  function passport() {
    try { return JSON.parse(localStorage.getItem("gng_passport") || "{}"); } catch (e) { return {}; }
  }
  function writePassport(p) {
    try { localStorage.setItem("gng_passport", JSON.stringify(p)); } catch (e) {}
    if (window.__gngPassportRefresh) try { window.__gngPassportRefresh(); } catch (e) {}
  }
  function onStopCompleted(stop, journey) {
    const p = passport();
    p.visited = p.visited || []; p.completedStops = p.completedStops || []; p.achievements = p.achievements || []; p.experiences = p.experiences || [];
    const rec = { id: stop.id || stop.name, name: stop.name, at: new Date().toISOString() };
    if (!p.completedStops.some(x => x.id === rec.id)) p.completedStops.push(rec);
    const destId = journey && journey.destination && journey.destination.id;
    if (destId && !p.visited.includes(destId)) p.visited.push(destId);
    p.achievements = computeAchievements(p).filter(a => a.done).map(a => a.id);
    writePassport(p);
    return `✓ ${stop.name} added to your Heritage Passport.`;
  }
  function onStoryHeard(name) {
    const p = passport();
    p.storiesHeard = p.storiesHeard || [];
    if (!p.storiesHeard.some(s => s.name === name)) p.storiesHeard.push({ name, at: new Date().toISOString() });
    p.achievements = computeAchievements(p).filter(a => a.done).map(a => a.id);
    writePassport(p);
  }

  const ACHIEVEMENT_DEFS = [
    { id: "heritage-explorer", icon: "🏛", name: "Heritage Explorer", need: 5, of: p => (p.completedStops || []).length, unit: "heritage places", verb: "Visited" },
    { id: "dynasty-hunter", icon: "📜", name: "Dynasty Hunter", need: 3, of: p => new Set((p.completedStops || []).map(s => s.dynasty).filter(Boolean)).size, unit: "dynasties", verb: "Discovered" },
    { id: "golden-hour", icon: "📷", name: "Golden Hour", need: 3, of: p => (p.completedStops || []).filter(s => (s.tags || []).some(t => ["photography","sunset","sunrise"].includes(t))).length, unit: "photography stops", verb: "Completed" },
    { id: "off-the-map", icon: "🗺", name: "Off The Map", need: 5, of: p => (p.completedStops || []).filter(s => (s.tags || []).includes("hidden") || s.isDetour).length, unit: "hidden places", verb: "Completed" },
    { id: "taste-of-india", icon: "🍛", name: "Taste of India", need: 5, of: p => (p.completedStops || []).filter(s => s.type === "food" || (s.tags || []).includes("food")).length, unit: "food experiences", verb: "Completed" },
    { id: "story-keeper", icon: "📖", name: "Story Keeper", need: 5, of: p => (p.storiesHeard || []).length, unit: "heritage stories", verb: "Heard" }
  ];
  function computeAchievements(p) {
    return ACHIEVEMENT_DEFS.map(d => {
      const cur = d.of(p || passport());
      return { id: d.id, icon: d.icon, name: d.name, current: cur, need: d.need, done: cur >= d.need, unit: d.unit, verb: d.verb };
    });
  }

  /* Journey progress persistence (Journey Mode state) */
  function saveJourneyProgress(prog) {
    try { localStorage.setItem("gng_journey_progress", JSON.stringify(prog)); } catch (e) {}
  }
  function loadJourneyProgress() {
    try { return JSON.parse(localStorage.getItem("gng_journey_progress") || "null"); } catch (e) { return null; }
  }

  /* =======================================================
   * ENHANCE — async live layer over the generated journey
   * (road route + weather + assembled conditions). Falls back
   * gracefully; never blocks the dashboard.
   * ======================================================= */
  async function enhanceJourney(journey) {
    if (!journey) return;
    const coords = [journey.startCoord, ...(journey.stops || []).map(s => s.coords)];
    const prefs = prefsFromWizard(journey.wizard);
    const [route, weather] = await Promise.all([
      routeService.getRoute({ profile: prefs.transport === "walking" ? "walking" : "car", coordinates: coords }),
      weatherService.fetchWeather(journey.destination.coords, prefs.date)
    ]);

    if (route) {
      journey.route = route;
      journey.stats.totalKm = route.distanceKm;
      journey.stats.totalTravelTimeMin = route.durationMin;
      journey.stats.totalTimeMin = route.durationMin + journey.stats.totalVisitTimeMin;
      // re-time the itinerary with real leg durations
      const [sh, sm] = (prefs.time || "08:00").split(":").map(n => +n);
      let clock = new Date(); clock.setHours(sh, sm, 0, 0);
      let prev = journey.startCoord;
      journey.stops.forEach((s, i) => {
        const leg = route.legs[i] || { distanceKm: haversine(prev, s.coords), durationMin: Math.max(3, Math.round(haversine(prev, s.coords) / 30 * 60)) };
        s.travelKm = leg.distanceKm; s.travelMin = leg.durationMin;
        clock = new Date(clock.getTime() + leg.durationMin * 60000);
        s.arrive = `${String(clock.getHours()).padStart(2,"0")}:${String(clock.getMinutes()).padStart(2,"0")}`;
        clock = new Date(clock.getTime() + (s.durationMin || 30) * 60000);
        s.depart = `${String(clock.getHours()).padStart(2,"0")}:${String(clock.getMinutes()).padStart(2,"0")}`;
        prev = s.coords;
      });
    } else {
      journey.route = routeService.fallbackRoute(coords, prefs.transport);
    }

    journey.weather = weather;

    const firstStop = (journey.stops || [])[0];
    const crowd = calculateCrowdEstimate(journey.destination, prefs.date, prefs.time ? timeToMinutes(prefs.time)/60 : 9);
    journey.conditions = {
      weather, crowd,
      opening: firstStop ? (placeEnrich(firstStop.id) || {}).openingHours || (destEnrich(journey.destination.id) || {}).openingHours || null : null,
      road: roadService.getConditions(weather),
      events: eventsFor(journey.destination.id, prefs.date),
      bestStart: crowd.bestWindow.split(" – ")[0],
      bestVisit: firstStop ? calculateBestVisitingTime(firstStop, prefs, weather) : null
    };
    journey.adaptiveWarnings = calculateAdaptiveWarnings(journey);

    if (typeof window !== "undefined" && window.__gngRefreshJourney) {
      try { window.__gngRefreshJourney(); } catch (e) {}
    }
  }

  /* =======================================================
   * UI — modals (Why this place · Story Mode)
   * ======================================================= */
  function openModal(html, { label = "Dialog" } = {}) {
    closeModal();
    const ov = document.createElement("div");
    ov.className = "gng-modal"; ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true"); ov.setAttribute("aria-label", label);
    ov.innerHTML = `<div class="gng-modal__backdrop" data-close></div><div class="gng-modal__panel" role="document">${html}<button class="gng-modal__x" aria-label="Close dialog" data-close>✕</button></div>`;
    document.body.appendChild(ov);
    const prevFocus = document.activeElement;
    ov.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
    document.addEventListener("keydown", function esc(e) { if (e.key === "Escape") { closeModal(); document.removeEventListener("keydown", esc); } });
    const focusable = ov.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    if (focusable) focusable.focus();
    ov.__prevFocus = prevFocus;
    document.body.style.overflow = "hidden";
    return ov;
  }
  function closeModal() {
    const ov = document.querySelector(".gng-modal");
    if (ov) { speech.stop(); if (ov.__prevFocus && ov.__prevFocus.focus) try { ov.__prevFocus.focus(); } catch (e) {} ov.remove(); document.body.style.overflow = ""; }
  }

  function openWhyModal(entity, prefsOverride) {
    const prefs = prefsOverride || savedPrefs();
    const why = generateWhyThisPlace(entity, prefs);
    const m = entity.kind === "destination" ? calculateDestinationMatch(entity.dest, prefs) : null;
    const bars = entity.kind === "destination"
      ? m && m.topPlaces.length ? [["Top places", Math.round(m.topPlaces.reduce((s, x) => s + x.finalScore, 0) / m.topPlaces.length)]] : []
      : Object.entries({ Interest: "interest", Photography: "photography", Heritage: "heritage", Pace: "pace", Traveller: "traveller", Time: "time", Budget: "budget", Weather: "weather", Signature: "signature" })
          .map(([label, k]) => [label, whyBreakdown(entity, prefs, k)]);
    const interestIcons = { photography: "📷", history: "📜", heritage: "🏛", architecture: "🏗", sunset: "🌇", sunrise: "🌅", food: "🍛", culture: "🎭", nature: "🌿", spiritual: "🕉", hidden: "🗝", markets: "🏪" };
    openModal(`
      <div class="why-modal">
        <span class="eyebrow">Personalized recommendation</span>
        <h3 class="why-modal__title">${esc(why.title)}</h3>
        <div class="why-modal__score"><span class="why-modal__pct">${why.matchPct}%</span><span class="why-modal__scorelabel">Personal match<br>for your current preferences</span></div>
        ${why.usedInterests.length ? `<div class="why-modal__used">You selected: ${why.usedInterests.map(i => `${interestIcons[i] || "•"} ${cap(i)}`).join(" · ")}</div>` : ""}
        ${why.reasons.length ? `<h4 class="why-modal__h">${esc(entity.kind === "destination" ? entity.dest.name : entity.place.name)} matches your journey because:</h4>
        <ul class="why-modal__reasons">${why.reasons.map(r => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        <div class="why-modal__bars">
          ${bars.map(([label, v]) => `<div class="why-modal__bar"><span class="why-modal__barlabel">${esc(label)}</span><span class="bar"><i style="width:${v}%"></i></span><span class="why-modal__barval">${v}</span></div>`).join("")}
        </div>
        <div class="why-modal__fits">
          <div><strong>Pace fit</strong>${esc(why.paceFit)} ✓</div>
          <div><strong>Traveller fit</strong>${esc(why.travellerFit)} ✓</div>
          <div><strong>Best moment</strong>${esc(why.bestMoment)}</div>
        </div>
        <div class="why-modal__note">Score is deterministic — generated from your planner preferences by the GEARUP N GOO matching engine. Change your interests in the planner to see it move.</div>
        <div class="why-modal__cta">
          <button class="btn btn--primary" onclick="location.hash='#/planner';GNGIntel.close()">Plan this trip</button>
          <button class="btn btn--ghost" data-close>Close</button>
        </div>
      </div>`, { label: why.title });
  }
  function whyBreakdown(entity, prefs, key) {
    const m = entity.kind === "destination" ? calculateDestinationMatch(entity.dest, prefs) : calculatePlaceMatch(entity.place, prefs, { destId: entity.destId });
    return key === "interest" && entity.kind === "destination" ? m.finalScore : (m.scoreBreakdown ? m.scoreBreakdown[key] : 0);
  }

  function openStoryModal(entity) {
    const story = buildStory(entity);
    const years = story.timeline || [];
    openModal(`
      <div class="story-modal">
        <span class="eyebrow">Story mode</span>
        <h3 class="story-modal__title">${esc(story.name)}</h3>
        <div class="story-modal__era">${esc(story.era || "")}${story.builtBy && story.builtBy !== story.era ? (story.era ? " · " : "") + esc(story.builtBy) : ""}</div>
        ${years.length ? `
        <div class="story-modal__tl" role="tablist" aria-label="Historical timeline">
          ${years.map((y, i) => `<button class="story-tl__btn${i === 0 ? " active" : ""}" data-tl="${i}" role="tab" aria-selected="${i === 0}">${esc(String(y.year))}</button>`).join("")}
        </div>
        <div class="story-modal__event" aria-live="polite">
          <strong id="storyTlYear">${esc(String(years[0].year))}</strong>
          <p id="storyTlText">${esc(years[0].text)}</p>
        </div>` : ""}
        <div class="story-modal__chapters">
          ${story.chapters.filter(c => c.v).map((c, i) => `
            <div class="story-chapter" style="--i:${i}">
              <span class="story-chapter__k">${esc(c.k)}</span>
              <p>${esc(c.v)}</p>
            </div>`).join("")}
        </div>
        <div class="story-modal__thennow">
          <div><strong>THEN</strong><p>${esc((story.chapters.find(c => c.k === "WHAT STOOD HERE") || {}).v || "Historical context being verified.")}</p></div>
          <div><strong>NOW</strong><p>${esc((story.chapters.find(c => c.k === "WHAT REMAINS TODAY") || {}).v || "")}</p></div>
        </div>
        <div class="story-modal__cta">
          ${story.audioText ? `<button class="btn btn--primary" id="storyHearBtn">🔊 Hear the story</button>` : ""}
          <button class="btn btn--ghost" data-close>Close</button>
        </div>
        <div class="story-modal__note" id="storyHearNote" aria-live="polite"></div>
      </div>`, { label: "Story mode — " + story.name });
    const ov = document.querySelector(".gng-modal");
    if (ov) {
      ov.querySelectorAll("[data-tl]").forEach(btn => btn.addEventListener("click", () => {
        ov.querySelectorAll("[data-tl]").forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
        btn.classList.add("active"); btn.setAttribute("aria-selected", "true");
        const y = years[+btn.dataset.tl];
        const yr = $("#storyTlYear", ov), tx = $("#storyTlText", ov);
        if (yr) yr.textContent = y.year; if (tx) tx.textContent = y.text;
      }));
      const hear = $("#storyHearBtn", ov);
      if (hear) hear.addEventListener("click", () => {
        const note = $("#storyHearNote", ov);
        if (!speech.supported) { if (note) note.textContent = "Speech synthesis is not available in this browser — the story is fully readable above."; return; }
        const ok = speech.speak(story.audioText);
        if (note) note.textContent = ok ? "Playing narration via your browser's voice. Language: English." : "Narration unavailable.";
        onStoryHeard(story.name);
        hear.textContent = "🔊 Playing…";
      });
    }
  }

  /* ---- public API ---- */
  window.GNGIntel = {
    prefsFromWizard, savedPrefs, savePrefs,
    calculatePlaceMatch, calculateDestinationMatch, generateWhyThisPlace, placeMeta,
    routeService, weatherService, calculateCrowdEstimate, roadService, eventsFor,
    calculateBestVisitingTime, calculateAdaptiveWarnings, adaptJourneyToConditions,
    calculateBudget, budgetStatus, budgetOptimizeSuggestions,
    buildStory, speech, openStoryModal, openWhyModal, closeModal, openModal,
    onStopCompleted, onStoryHeard, computeAchievements,
    saveJourneyProgress, loadJourneyProgress,
    enhanceJourney, navigationUrl: routeService.navigationUrl.bind(routeService),
    esc
  };
})();
