/* ============================================================
 * GEARUP N GOO — NATIONAL HERITAGE ARCHIVE · Engine
 * Merges state datasets, provides:
 *   GNGHeritage.states()            -> all states
 *   GNGHeritage.getState(slug)      -> state object
 *   GNGHeritage.getPlace(s,p)       -> place object
 *   GNGHeritage.facets(state)       -> filter facets for a state
 *   GNGHeritage.nearby(place, km)   -> nearby heritage places
 *   GNGHeritage.contexts()          -> historical context records
 *   GNGHeritage.search(q)           -> full grouped results {places,states,contexts,didYouMean}
 *   GNGHeritage.suggest(q)          -> compact autocomplete list
 * Deterministic, client-side, typo-tolerant. No network, no AI.
 * ============================================================ */
(() => {
  "use strict";

  /* ---------------- Historical context records ---------------- */
  const CONTEXTS = [
    { id:"vijayanagara-empire", name:"Vijayanagara Empire", type:"dynasty", period:"1336–1646 CE",
      description:"The Deccan's last great Hindu-imperial state; capital at Hampi, with later seats at Penukonda and Chandragiri.",
      aliases:["Vijayanagara","Vijayanagar","Vijaynagar empire","Vijayanagaram","Karnata empire","Rayas"],
      refs:[["karnataka","hampi"],["andhra-pradesh","lepakshi"],["andhra-pradesh","gandikota"],["andhra-pradesh","chandragiri-fort"],["andhra-pradesh","penukonda"]] },
    { id:"chalukyas-of-badami", name:"Chalukyas of Badami", type:"dynasty", period:"6th–8th century CE",
      description:"Early medieval Deccan dynasty; capital Vatapi (Badami); patrons of Aihole and Pattadakal's architectural experiments.",
      aliases:["Chalukya","Chalukyan","Badami Chalukya","Vatapi dynasty","Western Chalukyas of Badami"],
      refs:[["karnataka","badami-cave-temples"],["karnataka","aihole"],["karnataka","pattadakal"]] },
    { id:"hoysala-empire", name:"Hoysala Empire", type:"dynasty", period:"11th–14th century CE",
      description:"Karnataka dynasty famed for soapstone star-platform temples at Belur and Halebidu.",
      aliases:["Hoysala","Hoysalas","Hoysala style"],
      refs:[["karnataka","belur"],["karnataka","halebidu"]] },
    { id:"kakatiya-dynasty", name:"Kakatiya Dynasty", type:"dynasty", period:"12th–14th century CE",
      description:"Warangal-based dynasty whose temples and forts define Telangana; patrons of Ramappa.",
      aliases:["Kakatiya","Kakatiyas","Kakatiya style"],
      refs:[["telangana","ramappa"],["telangana","warangal-fort"],["telangana","thousand-pillar-temple"],["andhra-pradesh","gandikota"]] },
    { id:"chola-empire", name:"Chola Empire", type:"dynasty", period:"9th–13th century CE",
      description:"Tamil naval empire; Rajaraja and Rajendra's Brihadisvara temples are UNESCO-listed 'Great Living Chola Temples'.",
      aliases:["Chola","Cholas","Chola empire","Rajendra Chola","Rajaraja"],
      refs:[["tamil-nadu","gangaikonda-cholapuram"],["tamil-nadu","kodumbalur"]] },
    { id:"pandya-dynasty", name:"Pandya Dynasty", type:"dynasty", period:"ancient–14th century CE",
      description:"Ancient Tamil dynasty of Madurai; Pandya-era Jain patronage survives at Sittannavasal.",
      aliases:["Pandya","Pandyas","Madurai kingdom"],
      refs:[["tamil-nadu","sittannavasal"],["tamil-nadu","thirumayam"]] },
    { id:"maurya-ashoka", name:"Maurya Empire & Ashoka", type:"dynasty", period:"322–185 BCE",
      description:"India's first pan-subcontinental empire; Ashoka's edicts at Sanchi and Dhauli mark Buddhism's state adoption.",
      aliases:["Maurya","Mauryan","Ashoka","Asoka","Ashokan"],
      refs:[["madhya-pradesh","sanchi"],["odisha","dhauli"],["uttar-pradesh","sankisa"]] },
    { id:"indus-valley", name:"Indus Valley Civilisation", type:"period", period:"c. 3300–1300 BCE",
      description:"The Harappan urban civilisation; Gujarat holds Dholavira and Lothal among its greatest cities.",
      aliases:["Harappan","Indus Valley","Harappa","Indus civilisation","Sindhu Saraswati"],
      refs:[["gujarat","dholavira"],["gujarat","lothal"]] },
    { id:"rajput-kingdoms", name:"Rajput Kingdoms", type:"culture", period:"8th–16th century CE",
      description:"Clan kingdoms of Rajasthan and north India; their forts and patronage define the desert state's heritage.",
      aliases:["Rajput","Rajputs","Rajputana","Kachhwaha","Sisodia","Chauhan","Rana"],
      refs:[["rajasthan","kumbhalgarh"],["rajasthan","bhangarh"],["rajasthan","harshnath"],["rajasthan","neemrana"]] },
    { id:"shekhawati-merchants", name:"Shekhawati Merchant Culture", type:"culture", period:"18th–19th century CE",
      description:"Marwari trading families whose painted havelis made Mandawa an open-air gallery.",
      aliases:["Shekhawati","Marwari","painted havelis","fresco town"],
      refs:[["rajasthan","mandawa"]] },
    { id:"malwa-sultanate", name:"Malwa Sultanate", type:"dynasty", period:"1401–1562 CE",
      description:"Sharqi-adjacent sultanate of Mandu and Chanderi; Indo-Islamic architecture of the central Indian plateau.",
      aliases:["Malwa","Malwa sultan","Khilji of Malwa","Mahmud Khilji"],
      refs:[["madhya-pradesh","mandu"],["madhya-pradesh","chanderi"]] },
    { id:"bundela-dynasty", name:"Bundela Dynasty", type:"dynasty", period:"16th–18th century CE",
      description:"Bundelkhand's Rajput dynasty; Orchha's palaces and cenotaphs are their signature.",
      aliases:["Bundela","Bundelas","Bundelkhand"],
      refs:[["madhya-pradesh","orchha"],["uttar-pradesh","kalinjar-fort"]] },
    { id:"chandela-dynasty", name:"Chandela Dynasty", type:"dynasty", period:"9th–13th century CE",
      description:"Bundelkhand dynasty of Khajuraho fame; Kalinjar fort was their stronghold.",
      aliases:["Chandela","Chandelas","Jejakabhukti"],
      refs:[["uttar-pradesh","kalinjar-fort"]] },
    { id:"delhi-sultanate", name:"Delhi Sultanate", type:"dynasty", period:"1206–1526 CE",
      description:"Five successive dynasties whose Deccan campaigns reshaped Warangal, Halebidu and Devagiri.",
      aliases:["Sultanate","Khilji","Tughlaq","Malik Kafur","Muhammad bin Tughlaq","Sher Shah Suri"],
      refs:[["maharashtra","daulatabad"],["uttar-pradesh","chunar-fort"],["uttar-pradesh","kalinjar-fort"],["telangana","warangal-fort"]] },
    { id:"vakataka-court", name:"Vakataka Court", type:"dynasty", period:"c. 250–500 CE",
      description:"Deccan dynasty under whose patronage Ajanta's later caves and murals were funded.",
      aliases:["Vakataka","Harishena","Harishena court"],
      refs:[["maharashtra","ajanta-caves"],["madhya-pradesh","bagh-caves"]] },
    { id:"satavahana-empire", name:"Satavahana Empire", type:"dynasty", period:"c. 1st c. BCE–2nd c. CE",
      description:"The first great Deccan empire; capital Pratishthana (Paithan); patrons of early cave monasteries.",
      aliases:["Satavahana","Satavahanas","Satakarni","Andhra dynasty"],
      refs:[["maharashtra","paithan"],["maharashtra","kanheri-caves"]] },
    { id:"qutb-shahi-dynasty", name:"Qutb Shahi Dynasty", type:"dynasty", period:"1518–1687 CE",
      description:"Golconda-Hyderabad's founding dynasty; their garden necropolis survives beside the fort.",
      aliases:["Qutb Shahi","Qutub Shahi","Golconda","Muhammad Quli Qutb Shah"],
      refs:[["telangana","qutb-shahi-tombs"]] },
    { id:"buddhist-deccan", name:"Buddhist Deccan & Coast", type:"culture", period:"3rd c. BCE–13th c. CE",
      description:"The monastic networks of Sanchi, the Krishna-Godavari valleys and the Vizag coast — Buddhism's southern and eastern spread.",
      aliases:["Buddhism","Buddhist","Buddhist circuit","Theravada","Mahayana","Vajrayana","Diamond Triangle"],
      refs:[["odisha","ratnagiri"],["odisha","lalitgiri"],["andhra-pradesh","bavikonda"],["andhra-pradesh","undavalli"],["maharashtra","kanheri-caves"],["telangana","dharmapuri"]] },
    { id:"solanki-chaulukya", name:"Chaulukya (Solanki) Dynasty", type:"dynasty", period:"10th–13th century CE",
      description:"Gujarat's great temple-and-stepwell dynasty; Rani ki Vav is their memorial masterpiece.",
      aliases:["Solanki","Chaulukya","Chaulukyas","Bhima I"],
      refs:[["gujarat","rani-ki-vav"]] },
    { id:"gupta-empire", name:"Gupta Empire", type:"dynasty", period:"c. 320–550 CE",
      description:"Classical India's template empire; Deogarh's Dashavatara temple is among its earliest stone shrines.",
      aliases:["Gupta","Guptas","Gupta era","classical age"],
      refs:[["uttar-pradesh","deogarh"],["uttar-pradesh","kaushambi"]] },
    { id:"colonial-coast", name:"Colonial Trading Posts", type:"period", period:"16th–20th century CE",
      description:"European factory-towns on Indian coasts — Danish Tranquebar among the most intact.",
      aliases:["Colonial","Danish India","East India Company","Tranquebar era"],
      refs:[["tamil-nadu","tharangambadi"],["rajasthan","mandawa"]] },
    { id:"vatsa-mahajanapada", name:"Vatsa Mahajanapada", type:"period", period:"c. 6th c. BCE",
      description:"One of the sixteen great states of the Buddha's era; capital Kaushambi.",
      aliases:["Vatsa","Mahajanapada","Udayana","sixteen kingdoms"],
      refs:[["uttar-pradesh","kaushambi"]] },
    { id:"kalinga", name:"Kalinga & the Ashokan Turn", type:"period", period:"3rd century BCE",
      description:"The war whose remorse remade an empire; Dhauli's edicts record the pivot to dhamma.",
      aliases:["Kalinga","Kalinga war","Kharavela","Chedi dynasty"],
      refs:[["odisha","dhauli"],["odisha","udayagiri-khandagiri"],["odisha","barabati-fort"]] }
  ];

  /* ---------------- Merge datasets ---------------- */
  const STATES = [].concat(window.__GNG_HD1 || [], window.__GNG_HD2 || [], window.__GNG_HD3 || []);
  const PLACE_INDEX = new Map();   // "stateSlug/placeSlug" -> {place, state}
  const STATE_INDEX = new Map();   // slug -> state
  STATES.forEach(st => {
    STATE_INDEX.set(st.slug, st);
    (st.places || []).forEach(p => {
      p.stateId = st.id; p.stateSlug = st.slug; p.stateName = st.name;
      PLACE_INDEX.set(st.slug + "/" + p.slug, { place: p, state: st });
    });
  });
  const ALL_PLACES = [...PLACE_INDEX.values()];

  /* ---------------- Normalization ---------------- */
  function norm(s) {
    return String(s || "").toLowerCase()
      .replace(/[’'`]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  /* folding for transliteration variance: aa->a, ee->i, oo->u, w->v, ph->f */
  function fold(s) {
    return norm(s)
      .replace(/aa/g, "a").replace(/ee/g, "i").replace(/oo/g, "u")
      .replace(/kh/g, "k").replace(/gh/g, "g").replace(/chh/g, "ch")
      .replace(/ph/g, "f").replace(/w/g, "v").replace(/z/g, "j")
      .replace(/\s+/g, " ").trim();
  }

  /* ---------------- Levenshtein (bounded) ---------------- */
  function lev(a, b) {
    if (a === b) return 0;
    const al = a.length, bl = b.length;
    if (!al) return bl; if (!bl) return al;
    if (Math.abs(al - bl) > 3) return 99;
    let prev = new Array(bl + 1), cur = new Array(bl + 1);
    for (let j = 0; j <= bl; j++) prev[j] = j;
    for (let i = 1; i <= al; i++) {
      cur[0] = i;
      let rowMin = cur[0];
      for (let j = 1; j <= bl; j++) {
        const cost = a[i-1] === b[j-1] ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j-1] + 1, prev[j-1] + cost);
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > 3) return 99;
      [prev, cur] = [cur, prev];
    }
    return prev[bl];
  }
  function maxDist(s) { const n = s.length; return n <= 3 ? 0 : n <= 5 ? 1 : n <= 8 ? 2 : 3; }
  function fuzzyHit(query, target) {
    if (!query || !target) return -1;
    const d = lev(query, target);
    const md = Math.max(maxDist(query), maxDist(target));
    return d <= md ? d : -1;
  }

  /* ---------------- Scoring ----------------
     Rank order (spec): place exact > state exact > alias > prefix >
     partial > fuzzy > related context. Tiebreak: shorter name first. */
  function scoreEntity(q, qn, qf, names, keywords) {
    // names: [{text, weightExact, isAlias}]
    let best = { score: 0, via: null };
    for (const n of names) {
      const nn = norm(n.text);
      const nf = fold(n.text);
      if (nn === qn || nf === qf) { const s = n.w; if (s > best.score) best = { score: s, via: "exact:" + n.text }; continue; }
      if (nn.startsWith(qn) || nf.startsWith(qf)) { const s = n.w - 15; if (s > best.score) best = { score: s, via: "prefix:" + n.text }; continue; }
      // token-level: query matches a whole word start inside the name
      const toks = nn.split(" ");
      if (toks.some(t => t.startsWith(qn) || t === qn) && qn.length >= 2) { const s = n.w - 22; if (s > best.score) best = { score: s, via: "token:" + n.text }; continue; }
      if (nn.includes(qn) && qn.length >= 3) { const s = n.w - 28; if (s > best.score) best = { score: s, via: "partial:" + n.text }; continue; }
    }
    if (!best.score || best.score < 40) {
      for (const n of names) {
        const d = fuzzyHit(qn, norm(n.text));
        const df = d < 0 ? fuzzyHit(qf, fold(n.text)) : d;
        const dd = Math.min(d < 0 ? 99 : d, df < 0 ? 99 : df);
        if (dd >= 0 && dd <= 3) { const s = 55 - dd * 6; if (s > best.score) best = { score: s, via: "fuzzy:" + n.text + ":" + dd }; }
      }
    }
    if ((!best.score || best.score < 45) && keywords) {
      const kn = norm(keywords);
      if (kn.includes(qn) && qn.length >= 3) best = best.score < 46 ? { score: 46, via: "keyword" } : best;
    }
    return best;
  }

  function placeNames(p) {
    return [
      { text: p.name, w: 100 },
      ...(p.aliases || []).map(a => ({ text: a, w: 92 }))
    ];
  }

  /* ---------------- Public search ---------------- */
  function search(rawQ) {
    const qn = norm(rawQ);
    const qf = fold(rawQ);
    const out = { query: rawQ, normalized: qn, places: [], states: [], contexts: [], didYouMean: null };
    if (!qn) return out;

    ALL_PLACES.forEach(({ place: p }) => {
      const r = scoreEntity(qn, qn, qf, placeNames(p), p.searchKeywords);
      if (r.score > 0) out.places.push({ item: p, score: r.score, via: r.via });
    });
    STATES.forEach(st => {
      const names = [{ text: st.name, w: 95 }, ...(st.aliases || []).map(a => ({ text: a, w: 88 }))];
      const r = scoreEntity(qn, qn, qf, names, st.searchKeywords);
      if (r.score > 0) out.states.push({ item: st, score: r.score, via: r.via });
    });
    CONTEXTS.forEach(cx => {
      const names = [{ text: cx.name, w: 90 }, ...(cx.aliases || []).map(a => ({ text: a, w: 85 }))];
      const r = scoreEntity(qn, qn, qf, names, null);
      if (r.score > 0) out.contexts.push({ item: cx, score: r.score, via: r.via });
    });

    out.places.sort((a, b) => b.score - a.score || a.item.name.length - b.item.name.length);
    out.states.sort((a, b) => b.score - a.score);
    out.contexts.sort((a, b) => b.score - a.score);

    // Did-you-mean: no direct hits, but a high-confidence fuzzy candidate
    if (!out.places.length && !out.states.length && !out.contexts.length) {
      let cands = [];
      ALL_PLACES.forEach(({ place: p }) => {
        const names = placeNames(p);
        names.forEach(n => {
          const d = fuzzyHit(qn, norm(n.text));
          const df = d < 0 ? fuzzyHit(qf, fold(n.text)) : d;
          const dd = Math.min(d < 0 ? 99 : d, df < 0 ? 99 : df);
          if (dd >= 0 && (qn.length >= 4 || n.text.length <= 10)) cands.push({ d: dd, name: n.text, place: p });
        });
      });
      STATES.forEach(st => {
        [{ text: st.name }, ...(st.aliases || []).map(a => ({ text: a }))].forEach(n => {
          const d = fuzzyHit(qn, norm(n.text));
          if (d >= 0) cands.push({ d, name: n.text, state: st });
        });
      });
      cands.sort((a, b) => a.d - b.d || a.name.length - b.name.length);
      if (cands.length && cands[0].d <= 3 && (cands[0].d <= 1 || cands[0].name.toLowerCase().startsWith(qn.slice(0, 3)))) {
        out.didYouMean = cands[0];
      }
    }
    return out;
  }

  function suggest(rawQ, limit = 8) {
    const res = search(rawQ);
    const items = [];
    res.places.slice(0, 4).forEach(r => items.push({ kind: "place", score: r.score, item: r.item }));
    res.states.slice(0, 2).forEach(r => items.push({ kind: "state", score: r.score, item: r.item }));
    res.contexts.slice(0, 2).forEach(r => items.push({ kind: "context", score: r.score, item: r.item }));
    items.sort((a, b) => b.score - a.score);
    return { items: items.slice(0, limit), didYouMean: res.didYouMean, query: rawQ };
  }

  /* ---------------- Geo ---------------- */
  function haversineKm(a, b) {
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(b[0]-a[0]), dLon = toRad(b[1]-a[1]);
    const s = Math.sin(dLat/2)**2 + Math.cos(toRad(a[0]))*Math.cos(toRad(b[0]))*Math.sin(dLon/2)**2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }
  function nearby(place, km = 150, n = 5) {
    return ALL_PLACES
      .filter(({ place: p }) => p !== place)
      .map(({ place: p, state: st }) => ({ place: p, state: st, km: haversineKm(place.coordinates, p.coordinates) }))
      .filter(x => x.km <= km)
      .sort((a, b) => a.km - b.km)
      .slice(0, n);
  }

  /* ---------------- Facets (for /history state filtering) ---------------- */
  const ALL_FACETS = ["ancient","medieval","colonial","buddhist","hindu","jain","forts","temples","caves","archaeology","unesco","architecture","culture"];
  function stateFacets(st) {
    const set = new Set();
    (st.places || []).forEach(p => (p.facets || []).forEach(f => set.add(f)));
    return [...set];
  }

  window.GNGHeritage = {
    states: () => STATES,
    getState: slug => STATE_INDEX.get(slug) || null,
    getPlace: (sSlug, pSlug) => PLACE_INDEX.get(sSlug + "/" + pSlug) || null,
    allPlaces: () => ALL_PLACES,
    contexts: () => CONTEXTS,
    getContext: id => CONTEXTS.find(c => c.id === id) || null,
    facets: stateFacets,
    ALL_FACETS,
    nearby,
    search,
    suggest,
    _norm: norm, _fold: fold, _lev: lev
  };
})();
