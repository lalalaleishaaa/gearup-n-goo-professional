/* ============================================================
 * GEARUP N GOO — DATA LAYER
 * Structured demo dataset for Karnataka heritage circuit.
 * All data is clearly demo/seed data. Coordinates are approximate
 * real-world values; guide profiles are illustrative; EV/petrol
 * stops are representative. Source attributions included.
 * ============================================================ */

/* ---------- Design tokens mirrored for JS ---------- */
const BRAND = {
  accent: "#C96A3D",
  ivory: "#F7F3EC",
  dark: "#171717",
  olive: "#66705A",
  sand: "#E8DFD0",
  muted: "#8A8178"
};

/* ---------- Interest categories ---------- */
const INTERESTS = [
  { id: "photography",  label: "Photography",   icon: "📷" },
  { id: "heritage",     label: "Heritage",      icon: "🏛" },
  { id: "architecture", label: "Architecture",  icon: "🏗" },
  { id: "trekking",     label: "Trekking",      icon: "🥾" },
  { id: "nature",       label: "Nature",        icon: "🌿" },
  { id: "food",         label: "Food",          icon: "🍛" },
  { id: "culture",      label: "Culture",       icon: "🎭" },
  { id: "history",      label: "History",       icon: "📜" },
  { id: "sunrise",      label: "Sunrise",       icon: "🌅" },
  { id: "sunset",       label: "Sunset",        icon: "🌇" },
  { id: "hidden",       label: "Hidden Places", icon: "🗝" },
  { id: "markets",      label: "Markets",       icon: "🏪" },
  { id: "spiritual",    label: "Spiritual",     icon: "🕉" },
  { id: "adventure",    label: "Adventure",     icon: "🧗" },
  { id: "family",       label: "Family",        icon: "👨‍👩‍👧" },
  { id: "couples",      label: "Couples",       icon: "💞" }
];

/* ---------- Trip levels ---------- */
const TRIP_LEVELS = [
  {
    id: "quick",
    number: "01",
    title: "Quick Escape",
    duration: "1 Day",
    desc: "See the highlights without rushing.",
    ideal: ["First-time visitors", "Short trips", "Most important attractions"],
    hourBudget: 10
  },
  {
    id: "weekend",
    number: "02",
    title: "Weekend Explorer",
    duration: "2–3 Days",
    desc: "Go beyond the highlights.",
    ideal: ["Major attractions", "Hidden places", "Food & Culture", "Nearby towns"],
    hourBudget: 24
  },
  {
    id: "deep",
    number: "03",
    title: "Deep Explorer",
    duration: "4–7+ Days",
    desc: "Take your time. Follow the story.",
    ideal: ["Heritage", "Nature", "Local experiences", "Multiple towns", "Detailed history"],
    hourBudget: 56
  }
];

/* ---------- Transport options ---------- */
const TRANSPORTS = [
  { id: "bike",      label: "Bike",            icon: "🏍",  speedKmh: 35 },
  { id: "car",       label: "Car",             icon: "🚗",  speedKmh: 45 },
  { id: "public",    label: "Public Transport",icon: "🚌",  speedKmh: 25 },
  { id: "walking",   label: "Walking",         icon: "🚶",  speedKmh: 4  }
];

/* ---------- Budget tiers ---------- */
const BUDGETS = [
  { id: "budget",   label: "Budget",   multiplier: 0.7 },
  { id: "moderate", label: "Moderate", multiplier: 1.0 },
  { id: "premium",  label: "Premium",  multiplier: 1.6 }
];

/* ---------- Languages ---------- */
const LANGUAGES = [
  "Kannada","English","Hindi","Tamil","Telugu","Marathi","Bengali","Gujarati","Malayalam"
];

/* ---------- Traveller types ---------- */
const TRAVELLER_TYPES = ["Solo","Friends","Couple","Family","Group"];
const PACES = ["Relaxed","Balanced","Fast-paced"];

/* ---------- Dynasties ---------- */
const DYNASTIES = [
  { id: "vijayanagara", name: "Vijayanagara Empire", period: "1336–1646 CE", region: "Deccan" },
  { id: "hoysala",      name: "Hoysala Empire",      period: "1026–1343 CE", region: "Karnataka" },
  { id: "chalukya",     name: "Chalukya Dynasty",    period: "543–753 CE",   region: "Badami" },
  { id: "rashtrakuta",  name: "Rashtrakuta Dynasty", period: "753–982 CE",   region: "Deccan" },
  { id: "wodeyar",      name: "Wodeyar Dynasty",     period: "1399–1950 CE", region: "Mysuru" },
  { id: "kodava",      name: "Haleri / Kodava Rulers", period: "1600–1834 CE", region: "Kodagu" },
  { id: "nayaka",       name: "Palegar Nayakas",     period: "1562–1779 CE", region: "Chitradurga" },
  { id: "keladi",       name: "Keladi Nayaka Dynasty", period: "1500–1763 CE", region: "Shivamogga / Malnad" },
  { id: "kadamba",      name: "Kadamba Dynasty",     period: "345–525 CE",   region: "Uttara Kannada / Banavasi" }
];

/* ---------- Source attribution template ---------- */
const SOURCES = {
  asi:  { name: "Archaeological Survey of India", url: "https://asi.nic.in", confidence: "high" },
  kstdc:{ name: "Karnataka State Tourism",        url: "https://karnatakatourism.org", confidence: "high" },
  unesco:{name: "UNESCO World Heritage Centre",   url: "https://whc.unesco.org", confidence: "high" }
};

/* ---------- DESTINATIONS ----------
 * Rich structured data for the 7 Karnataka circuit destinations.
 * Each place includes: name, coords, type, tags, duration(min),
 * bestTime, description, heritage info, photography score,
 * detourKm (from typical route), hidden flag, image (gradient/CSS).
 */
const DESTINATIONS = {

  hampi: {
    id: "hampi",
    name: "Hampi",
    state: "Karnataka",
    tagline: "Where an empire became a landscape.",
    shortDesc: "The ruined capital of the Vijayanagara Empire — a boulder-strewn open-air museum of temples, bazaars and royal precincts spread along the Tungabhadra.",
    heroGradient: "linear-gradient(135deg,#3a2a1a 0%,#8a5a3a 45%,#c9884a 100%)",
    accent: "#C96A3D",
    tags: ["HERITAGE","PHOTOGRAPHY","SUNSET"],
    heritagePeriod: "Vijayanagara, 14th–16th c.",
    coords: [15.3350, 76.4600],
    experiences: ["heritage","photography","sunset","sunrise","history","architecture","culture"],
    UNESCO: true,
    source: { ...SOURCES.unesco, verified: "2024-11" },
    historicalSummary: "Hampi was the capital of the Vijayanagara Empire from the 14th century until its defeat at the Battle of Talikota in 1565. At its peak it was one of the largest cities in the world, described by Portuguese and Persian visitors as a city of jewels and temples. Today its ruins span roughly 41 sq km and are a UNESCO World Heritage Site.",
    timeline: [
      { year: "1336", event: "Vijayanagara Empire founded by Harihara I and Bukka Raya." },
      { year: "1440s", event: "Virupaksha Temple expanded; Hemakuta hill temples in active worship." },
      { year: "1509–29",event: "Reign of Krishnadevaraya — peak of the empire; Vittala Temple complex begun." },
      { year: "1565", event: "Battle of Talikota; Deccan sultanates sack and abandon the city." },
      { year: "1800", event: "Colin Mackenzie first surveys and documents the ruins for the East India Company." },
      { year: "1986", event: "UNESCO inscribes Group of Monuments at Hampi as World Heritage." }
    ],
    dynasty: "vijayanagara",
    places: [
      {
        id: "virupaksha",
        name: "Virupaksha Temple",
        coords: [15.3358, 76.4592],
        type: "heritage",
        tags: ["heritage","architecture","spiritual"],
        durationMin: 45,
        bestTime: "Opening – 09:00",
        photographyScore: 8.7,
        desc: "An active Shiva temple and the oldest continuously worshipped shrine in Hampi. Its towering gopuram anchors the site and predates the Vijayanagara capital itself.",
        historyNote: "Dedicated to Virupaksha (a form of Shiva), expanded through Vijayanagara patronage. The main gopuram rises ~50m.",
        dynasty: "vijayanagara"
      },
      {
        id: "hemakuta",
        name: "Hemakuta Hill",
        coords: [15.3340, 76.4605],
        type: "heritage",
        tags: ["photography","sunrise","sunset","heritage"],
        durationMin: 35,
        bestTime: "06:00 or 17:30",
        photographyScore: 9.6,
        desc: "A cluster of pre-Vijayanagara and early Vijayanagara temples perched on a granite hill overlooking Virupaksha. The iconic boulder-framed view of the gopuram lives here.",
        historyNote: "Some shrines predate the empire and show early Chalukya-Ganga influence.",
        dynasty: "vijayanagara"
      },
      {
        id: "achyutaraya",
        name: "Achyutaraya Bazaar & Temple",
        coords: [15.3295, 76.4670],
        type: "heritage",
        tags: ["history","photography","architecture"],
        durationMin: 40,
        bestTime: "09:00 – 11:00",
        photographyScore: 9.1,
        desc: "A long, abandoned bazaar street leading to the Tiruvengalanatha temple, now known by the name of its patron, Emperor Achyuta Deva Raya.",
        historyNote: "Built 1529–42 CE, one of the last grand temples before the 1565 fall.",
        dynasty: "vijayanagara"
      },
      {
        id: "vittala",
        name: "Vittala Temple & Stone Chariot",
        coords: [15.3193, 76.4750],
        type: "heritage",
        tags: ["heritage","architecture","history","photography"],
        durationMin: 60,
        bestTime: "10:00 – 12:00",
        photographyScore: 9.8,
        desc: "The artistic pinnacle of Vijayanagara temple architecture. The stone chariot shrine to Garuda and the musical pillars are its most famed features.",
        historyNote: "Construction began under Krishnadevaraya in the 1510s; several dynasties added to it.",
        dynasty: "vijayanagara"
      },
      {
        id: "lotus",
        name: "Lotus Mahal & Zenana Enclosure",
        coords: [15.3210, 76.4700],
        type: "heritage",
        tags: ["architecture","history","culture"],
        durationMin: 40,
        bestTime: "11:00 – 13:00",
        photographyScore: 8.8,
        desc: "An elegant two-storeyed pavilion in the royal women's quarter, blending Hindu and Islamic architectural motifs.",
        historyNote: "Used as a recreational pavilion for royal women of the court.",
        dynasty: "vijayanagara"
      },
      {
        id: "elephant-stables",
        name: "Elephant Stables",
        coords: [15.3208, 76.4685],
        type: "heritage",
        tags: ["history","architecture"],
        durationMin: 25,
        bestTime: "After Lotus Mahal",
        photographyScore: 8.0,
        desc: "A long row of eleven domed chambers that housed the royal elephants.",
        historyNote: "Distinctly Indo-Islamic in style, reflecting the empire's plural architectural culture.",
        dynasty: "vijayanagara"
      },
      {
        id: "matanga",
        name: "Matanga Hill (Sunset Point)",
        coords: [15.3315, 76.4630],
        type: "viewpoint",
        tags: ["sunset","photography","trekking","sunrise"],
        durationMin: 45,
        bestTime: "17:00 – 18:30",
        photographyScore: 9.9,
        desc: "The highest viewpoint in the core ruins, offering a panoramic sweep over the entire Virupaksha–Achyutaraya–Vittala axis at golden hour.",
        historyNote: "Associated with the sage Matanga from the Ramayana, giving the hill its sacred character."
      },
      {
        id: "lunch-mango-tree",
        name: "Mango Tree Restaurant",
        coords: [15.3355, 76.4620],
        type: "food",
        tags: ["food","culture"],
        durationMin: 45,
        bestTime: "12:30 – 14:00",
        photographyScore: 6.0,
        desc: "Long-running riverside thali and traveller's café serving North Karnataka classics.",
        demoNote: "Listing is illustrative."
      }
    ],
    detours: [
      {
        id: "sanapur-lake",
        name: "Sanapur Lake Hidden Viewpoint",
        coords: [15.3550, 76.4400],
        type: "hidden",
        tags: ["photography","sunset","nature"],
        detourKm: 1.4,
        visitMin: 15,
        photographyScore: 9.2,
        desc: "A boulder-fringed irrigation lake rarely marked on tourist maps — the unobstructed coracle-and-water reflection shot is here.",
        bestFor: ["Photography","Sunset"],
        whyWorth: "Adds a water-scape to your ruin photographs without meaningful route disruption."
      },
      {
        id: "anegundi",
        name: "Anegundi Village Trail",
        coords: [15.3520, 76.4800],
        type: "hidden",
        tags: ["culture","history","photography"],
        detourKm: 4.2,
        visitMin: 45,
        photographyScore: 8.4,
        desc: "Across the river, the original fortress-village of Anegundi predates Hampi itself. Old painted doors, banana plantations and the Pampa Sarovar.",
        bestFor: ["Culture","History"],
        whyWorth: "A quiet counterpoint to the ruins; worth the extra time on a 2+ day trip."
      },
      {
        id: "hemakuta-gopuram",
        name: "Hemakuta Boulder Frame",
        coords: [15.3343, 76.4608],
        type: "photography",
        tags: ["photography","sunrise"],
        detourKm: 0.6,
        visitMin: 10,
        photographyScore: 9.5,
        desc: "A gap between two gneiss boulders on Hemakuta that perfectly frames the Virupaksha gopuram — a celebrated Instagram / editorial angle.",
        bestFor: ["Photography","Sunrise"],
        whyWorth: "Two-minute walk from the main Hemakuta circuit."
      }
    ],
    fuelStops: [
      { name: "Bharat Petroleum — Hampi Road", coords: [15.3400, 76.4400], type: "petrol" },
      { name: "Indian Oil — Kamalapur",       coords: [15.3080, 76.4920], type: "petrol" }
    ],
    evStops: [
      { name: "Tata Power Charger — Hospet", coords: [15.2700, 76.3900], type: "ev" }
    ],
    guides: [
      {
        id: "ramesh-kumar",
        name: "Ramesh Kumar",
        title: "Heritage Specialist",
        photo: "RK",
        years: 12,
        languages: ["Kannada","English","Hindi"],
        specialties: ["Hampi History","Vijayanagara Architecture","Photography Walks"],
        rating: 4.9,
        trips: 1240,
        expertise: { heritage: 95, photography: 88, architecture: 92, family: 70, history: 96 },
        destinations: ["hampi"],
        priceTier: "moderate",
        meetPoint: "Virupaksha Temple East Gate",
        demoNote: "Illustrative profile"
      },
      {
        id: "sharada-devi",
        name: "Sharada Devi",
        title: "Cultural & Family Guide",
        photo: "SD",
        years: 8,
        languages: ["Kannada","English","Tamil","Telugu"],
        specialties: ["Family Heritage Walks","Local Cuisine","Temple Stories"],
        rating: 4.8,
        trips: 780,
        expertise: { heritage: 85, photography: 70, architecture: 80, family: 96, history: 82 },
        destinations: ["hampi"],
        priceTier: "budget",
        meetPoint: "Hampi Bazaar Parking",
        demoNote: "Illustrative profile"
      },
      {
        id: "arjun-acharya",
        name: "Arjun Acharya",
        title: "Photography & Sunrise Guide",
        photo: "AA",
        years: 6,
        languages: ["English","Hindi","Kannada"],
        specialties: ["Sunrise Photography","Hidden Boulders","Golden-Hour Routes"],
        rating: 4.95,
        trips: 540,
        expertise: { heritage: 75, photography: 97, architecture: 78, family: 50, history: 70 },
        destinations: ["hampi"],
        priceTier: "premium",
        meetPoint: "Hemakuta Hill Steps (5:30 AM)",
        demoNote: "Illustrative profile"
      }
    ]
  },

  /* -------------------- BELUR -------------------- */
  belur: {
    id: "belur",
    name: "Belur",
    state: "Karnataka",
    tagline: "Where stone was turned into sculpture.",
    shortDesc: "The first Hoysala capital — home to the Chennakeshava Temple, whose walls narrate epics through every bracket, frieze and pillar.",
    heroGradient: "linear-gradient(135deg,#2f3a28 0%,#5a6a4a 50%,#a08a5a 100%)",
    accent: "#66705A",
    tags: ["HERITAGE","ARCHITECTURE","SCULPTURE"],
    heritagePeriod: "Hoysala, 12th c.",
    coords: [13.1625, 75.8611],
    experiences: ["heritage","architecture","history","photography","culture","spiritual"],
    UNESCO: false,
    source: { ...SOURCES.asi, verified: "2024-11" },
    historicalSummary: "Belur was the first capital of the Hoysala dynasty before it moved to Halebidu. The Chennakeshava Temple was commissioned in 1117 CE by King Vishnuvardhana to commemorate a military victory and took 103 years to complete.",
    timeline: [
      { year: "1026", event: "Hoysala dynasty consolidates power in the Malnad region." },
      { year: "1117", event: "King Vishnuvardhana commissions Chennakeshava Temple at Belur." },
      { year: "1220",event: "Temple complex completed after three generations of artisans." },
      { year: "14th c.",event: "Vijayanagara rulers add the towering gopuram." }
    ],
    dynasty: "hoysala",
    places: [
      { id: "chennakeshava", name: "Chennakeshava Temple", coords: [13.1628, 75.8613], type: "heritage",
        tags: ["heritage","architecture","history","spiritual","photography"], durationMin: 90,
        bestTime: "08:00 – 11:00", photographyScore: 9.7,
        desc: "The finest and earliest of the great Hoysala triad. Star-shaped platform, 48 bracket figures (madanikas) and friezes running around the base.",
        historyNote: "Dedicated to Vijayanarayana/Vishnu. Includes rare signatures of the sculptors — Dasoja, Chavana and Mallitamma.",
        dynasty: "hoysala" },
      { id: "veeranarayana", name: "Veeranarayana Temple", coords: [13.1635, 75.8608], type: "heritage",
        tags: ["heritage","spiritual"], durationMin: 25, bestTime: "After main temple", photographyScore: 7.5,
        desc: "A smaller but exquisitely carved Vaishnava shrine within the Belur complex.",
        dynasty: "hoysala" },
      { id: "belur-lunch", name: "Local Jolada Roti Lunch", coords: [13.1640, 75.8625], type: "food",
        tags: ["food","culture"], durationMin: 40, bestTime: "12:30", photographyScore: 5.5,
        desc: "North Karnataka jowar roti meal with brinjal curry and jaggery at one of the family-run eateries opposite the temple." }
    ],
    detours: [
      { id: "chikmagalur-view", name: "Baba Budangiri Ghat Road Bend", coords: [13.2500, 75.7800],
        type: "photography", tags: ["photography","nature","sunrise"], detourKm: 8.2, visitMin: 15, photographyScore: 8.8,
        desc: "A sharp bend on the road up the coffee hills with an expansive plantation-and-valley view.",
        bestFor: ["Photography","Nature"], whyWorth: "If you are driving on to Chikmagalur." }
    ],
    fuelStops: [{ name: "IOCL Belur Bypass", coords: [13.1550, 75.8690], type: "petrol" }],
    evStops:   [{ name: "KSEDC Fast Charger — Chikmagalur", coords: [13.3200, 75.7700], type: "ev" }],
    guides: [
      { id: "mohan-shastry", name: "Mohan Shastry", title: "Sculpture & Epigraphy Guide", photo: "MS",
        years: 15, languages: ["Kannada","English","Hindi","Sanskrit"],
        specialties: ["Hoysala Sculpture","Inscriptions","Temple Ritual"],
        rating: 4.9, trips: 960,
        expertise: { heritage: 96, photography: 72, architecture: 98, family: 75, history: 94 },
        destinations: ["belur","halebidu"], priceTier: "moderate",
        meetPoint: "Chennakeshava Main Gate", demoNote: "Illustrative profile" }
    ]
  },

  /* -------------------- HALEBIDU -------------------- */
  halebidu: {
    id: "halebidu",
    name: "Halebidu",
    state: "Karnataka",
    tagline: "A temple that reads like a stone epic.",
    shortDesc: "The Hoysaleshwara Temple — 12th-century twin shrine dedicated to Shiva with the densest sculptural narrative in Indian art.",
    heroGradient: "linear-gradient(135deg,#1f2a20 0%,#4a5544 45%,#8a7a5a 100%)",
    accent: "#66705A",
    tags: ["HERITAGE","ARCHITECTURE","HISTORY"],
    heritagePeriod: "Hoysala, 12th c.",
    coords: [13.2147, 75.9939],
    experiences: ["heritage","architecture","history","photography","spiritual"],
    UNESCO: false,
    source: { ...SOURCES.asi, verified: "2024-11" },
    historicalSummary: "Dwarasamudra (modern Halebidu) became the Hoysala capital in the 12th century. The Hoysaleshwara Temple was begun in 1121 CE but never finished, its detail the most exuberant in the Hoysala canon. The city was sacked twice by the Delhi Sultanate in the 14th century.",
    timeline: [
      { year: "1121", event: "Hoysaleshwara Temple construction begins under Ketamalla, a Hoysala officer." },
      { year: "1311", event: "Malik Kafur raids and sacks Dwarasamudra." },
      { year: "1326", event: "Second sack by Muhammad bin Tughluq; capital abandoned." }
    ],
    dynasty: "hoysala",
    places: [
      { id: "hoysaleshwara", name: "Hoysaleshwara Temple", coords: [13.2148, 75.9940], type: "heritage",
        tags: ["heritage","architecture","history","photography","spiritual"], durationMin: 90,
        bestTime: "08:30 – 11:30", photographyScore: 9.6,
        desc: "Twin-shrine Shiva temple with at least 240 carved wall images and an extraordinary Ramayana/Mahabharata frieze cycle.",
        historyNote: "Notable for the largest sculptured Nandi bull in South India and the unfinished north-side sculptures that reveal the carvers' process.",
        dynasty: "hoysala" },
      { id: "kedareshwara", name: "Kedareshwara Temple", coords: [13.2150, 75.9915], type: "heritage",
        tags: ["heritage","architecture"], durationMin: 25, bestTime: "After Hoysaleshwara", photographyScore: 8.2,
        desc: "A smaller, highly ornate trikuta shrine in the same archaeological park.",
        dynasty: "hoysala" },
      { id: "jain-basadi", name: "Jain Basadis of Halebidu", coords: [13.2160, 75.9930], type: "heritage",
        tags: ["heritage","history","spiritual"], durationMin: 20, bestTime: "Afternoon", photographyScore: 7.8,
        desc: "Three Jain shrines — Parsvanatha, Shantinatha and Adinatha — attesting to Hoysala religious pluralism.",
        dynasty: "hoysala" }
    ],
    detours: [
      { id: "belavadi", name: "Belavadi Veeranarayana", coords: [13.2800, 75.9900], type: "hidden",
        tags: ["heritage","architecture","hidden"], detourKm: 6.0, visitMin: 30, photographyScore: 8.5,
        desc: "A less-visited but grand Hoysala trikuta shrine with 10-foot-tall images of Narayana, Venugopala and Yoganarasimha.",
        bestFor: ["Heritage","Hidden Places"], whyWorth: "Minimal crowds, maximum sculpture." }
    ],
    fuelStops: [{ name: "HP Halebidu Main Road", coords: [13.2110, 76.0000], type: "petrol" }],
    evStops:   [{ name: "KSEDC Charger — Hassan", coords: [13.0070, 76.1000], type: "ev" }],
    guides: [
      { id: "ramesh-bhat", name: "Ramesh Bhat", title: "Hoysala Epigraphy Specialist", photo: "RB",
        years: 18, languages: ["Kannada","English","Hindi"],
        specialties: ["Hoysala Inscriptions","Temple Plan","Sculpture Identification"],
        rating: 4.92, trips: 1100,
        expertise: { heritage: 97, photography: 68, architecture: 96, family: 65, history: 98 },
        destinations: ["halebidu","belur"], priceTier: "moderate",
        meetPoint: "ASI Ticket Counter", demoNote: "Illustrative profile" }
    ]
  },

  /* -------------------- BADAMI -------------------- */
  badami: {
    id: "badami",
    name: "Badami",
    state: "Karnataka",
    tagline: "Cities carved out of the living cliff.",
    shortDesc: "The Vatapi of the Chalukyas — four spectacular rock-cut cave temples overlooking a red-sandstone fort and Agastya lake.",
    heroGradient: "linear-gradient(135deg,#5a2a1a 0%,#a0553a 45%,#d08a5a 100%)",
    accent: "#C96A3D",
    tags: ["HERITAGE","CAVES","PHOTOGRAPHY"],
    heritagePeriod: "Early Chalukya, 6th–8th c.",
    coords: [15.9176, 75.6755],
    experiences: ["heritage","trekking","photography","architecture","history","spiritual"],
    UNESCO: false,
    source: { ...SOURCES.asi, verified: "2024-11" },
    historicalSummary: "Badami (Vatapi) was the capital of the Early Western Chalukyas from 543 CE onwards. Pulakeshin I is credited with founding the fortified capital; his successors carved the four great rock-cut cave temples, beginning with Cave 3 in 578 CE — the earliest dated Hindu cave temple in India.",
    timeline: [
      { year: "543", event: "Pulakeshin I makes Vatapi (Badami) the Chalukya capital." },
      { year: "578", event: "Cave 3 (Vaishnava) dedicated by Mangalesha — first dated Hindu cave." },
      { year: "642", event: "Pallava Narasimhavarman captures and briefly occupies Vatapi." },
      { year: "757", event: "Rashtrakuta Dantidurga overthrows the Chalukyas; city declines." }
    ],
    dynasty: "chalukya",
    places: [
      { id: "cave-1", name: "Cave 1 — Shiva", coords: [15.9185, 75.6800], type: "heritage",
        tags: ["heritage","architecture","spiritual"], durationMin: 25, bestTime: "08:30", photographyScore: 8.5,
        desc: "The first of four caves — an 18-armed Nataraja and Harihara fusion sculpture guard the entrance.",
        dynasty: "chalukya" },
      { id: "cave-3", name: "Cave 3 — Vishnu (578 CE)", coords: [15.9183, 75.6790], type: "heritage",
        tags: ["heritage","architecture","history","photography"], durationMin: 45, bestTime: "09:00–11:00",
        photographyScore: 9.3,
        desc: "The largest and oldest dated cave, adorned with Vishnu in his Narasimha, Varaha, Trivikrama and Vamana avatars. The 578 CE inscription is a landmark in Indian epigraphy.",
        dynasty: "chalukya" },
      { id: "cave-4-jain", name: "Cave 4 — Jain", coords: [15.9186, 75.6810], type: "heritage",
        tags: ["heritage","spiritual","history"], durationMin: 20, bestTime: "After Cave 3", photographyScore: 8.0,
        desc: "The smallest cave, dedicated to Bahubali and Parshvanatha, added later in the 7th–8th c.",
        dynasty: "chalukya" },
      { id: "fort-trail", name: "Badami Fort & North Temples", coords: [15.9210, 75.6840], type: "heritage",
        tags: ["trekking","heritage","photography","sunset"], durationMin: 60, bestTime: "16:30",
        photographyScore: 9.4,
        desc: "A steep climb past granaries, a cannon and the 6th-c. Lower and Upper Shivalayas — the best sunset overlook across the Agastya Teertha lake." },
      { id: "agastya-lake", name: "Agastya Teertha Lake Shore", coords: [15.9160, 75.6800], type: "viewpoint",
        tags: ["photography","sunrise"], durationMin: 15, bestTime: "06:30", photographyScore: 8.8,
        desc: "The sandstone cliff reflected in the lake is the postcard Badami frame." }
    ],
    detours: [
      { id: "banashankari", name: "Banashankari Temple", coords: [15.8850, 75.7010], type: "hidden",
        tags: ["spiritual","culture","heritage"], detourKm: 5.0, visitMin: 20, photographyScore: 7.8,
        desc: "Ancient Shakti shrine in a forested ravine, with a chariot-shaped lamp tower.",
        bestFor: ["Spiritual","Culture"], whyWorth: "Quick detour en route from Badami to Gadag." }
    ],
    fuelStops: [{ name: "BPCL Badami Main Road", coords: [15.9160, 75.6700], type: "petrol" }],
    evStops:   [{ name: "KSEDC Charger — Bagalkot", coords: [16.1850, 75.6960], type: "ev" }],
    guides: [
      { id: "shankar-pujari", name: "Shankar Pujari", title: "Chalukya Caves Guide", photo: "SP",
        years: 14, languages: ["Kannada","English","Hindi","Marathi"],
        specialties: ["Chalukya Rock-cut","Iconography","Fort Trail"],
        rating: 4.88, trips: 820,
        expertise: { heritage: 94, photography: 80, architecture: 93, family: 78, history: 90 },
        destinations: ["badami","aihole","pattadakal"], priceTier: "budget",
        meetPoint: "Cave 3 Entrance", demoNote: "Illustrative profile" }
    ]
  },

  /* -------------------- AIHOLE -------------------- */
  aihole: {
    id: "aihole",
    name: "Aihole",
    state: "Karnataka",
    tagline: "Where temple architecture learned to stand.",
    shortDesc: "A 1,500-year-old laboratory of temple-building — over 100 shrines spanning a century of Chalukya architectural experiment.",
    heroGradient: "linear-gradient(135deg,#3a2f1a 0%,#7a6a44 50%,#c0a77a 100%)",
    accent: "#C96A3D",
    tags: ["HERITAGE","ARCHITECTURE","HISTORY"],
    heritagePeriod: "Early Chalukya, 5th–8th c.",
    coords: [16.0193, 75.8817],
    experiences: ["heritage","architecture","history","photography"],
    UNESCO: false,
    source: { ...SOURCES.asi, verified: "2024-11" },
    historicalSummary: "Aihole (Ayyavole) was the first experimental cradle of South Indian temple architecture. More than 120 stone temples — Buddhist, Hindu and Jain — were built here from the 5th century, marking the transition from rock-cut caves to structural stone shrines. The 634 CE Meguti inscription of Ravikirti is one of the most important historical records of the Deccan.",
    timeline: [
      { year: "450", event: "Earliest structural shrines at Aihole (Lad Khan, Kontigudi group)." },
      { year: "634", event: "Ravikirti's inscription on Meguti Jain temple records Pulakeshin II's victories." },
      { year: "7th–8th c.",event: "Durga Temple and Hucchimalli Gudi built in fully developed southern style." }
    ],
    dynasty: "chalukya",
    places: [
      { id: "durga-temple", name: "Durga Temple", coords: [16.0200, 75.8820], type: "heritage",
        tags: ["heritage","architecture","history","photography"], durationMin: 40, bestTime: "09:00",
        photographyScore: 9.4,
        desc: "Iconic apsidal shrine with a colonnaded ambulatory — the most photographed monument in Aihole, borrowing the shape of a Buddhist chaitya hall.",
        dynasty: "chalukya" },
      { id: "lad-khan", name: "Lad Khan Temple", coords: [16.0185, 75.8800], type: "heritage",
        tags: ["history","architecture"], durationMin: 20, bestTime: "After Durga", photographyScore: 8.0,
        desc: "One of the earliest stone temples, showing a remarkably primitive plan adapted from wooden village meeting halls.",
        dynasty: "chalukya" },
      { id: "meguti", name: "Meguti Jain Temple", coords: [16.0230, 75.8840], type: "heritage",
        tags: ["heritage","history"], durationMin: 25, bestTime: "Late morning", photographyScore: 8.3,
        desc: "Hilltop Jain shrine carrying the famous 634 CE eulogy of Pulakeshin II by his court poet Ravikirti.",
        dynasty: "chalukya" },
      { id: "hucchimalli", name: "Hucchimalli Gudi", coords: [16.0210, 75.8790], type: "heritage",
        tags: ["architecture","heritage"], durationMin: 15, bestTime: "Morning", photographyScore: 7.5,
        desc: "Small early shrine with one of the first fully developed southern-style tower (shikhara).",
        dynasty: "chalukya" }
    ],
    detours: [
      { id: "rameshwar-temple", name: "Ramalingeshwara Group", coords: [16.0250, 75.8900], type: "hidden",
        tags: ["hidden","heritage"], detourKm: 1.2, visitMin: 15, photographyScore: 7.5,
        desc: "A quiet cluster of shrines outside the ticketed ASI enclosure, mostly unvisited.",
        bestFor: ["Hidden Places","Heritage"], whyWorth: "A quiet walk for true architecture enthusiasts." }
    ],
    fuelStops: [{ name: "IOCL Aihole Road", coords: [16.0150, 75.8750], type: "petrol" }],
    evStops:   [{ name: "KSEDC Charger — Bagalkot", coords: [16.1850, 75.6960], type: "ev" }],
    guides: [
      { id: "mallikarjun", name: "Mallikarjun Hiremath", title: "Chalukya History Guide", photo: "MH",
        years: 11, languages: ["Kannada","English","Hindi"],
        specialties: ["Aihole Inscriptions","Structural Evolution","Epigraphy"],
        rating: 4.86, trips: 540,
        expertise: { heritage: 95, photography: 65, architecture: 97, family: 60, history: 96 },
        destinations: ["aihole","badami","pattadakal"], priceTier: "budget",
        meetPoint: "Durga Temple ASI Gate", demoNote: "Illustrative profile" }
    ]
  },

  /* -------------------- PATTADAKAL -------------------- */
  pattadakal: {
    id: "pattadakal",
    name: "Pattadakal",
    state: "Karnataka",
    tagline: "Where two architectures meet in stone.",
    shortDesc: "UNESCO World Heritage Site where the Chalukyas of Badami crowned their kings — nine temples that fused southern and northern Indian styles.",
    heroGradient: "linear-gradient(135deg,#3a1f20 0%,#7a3a35 45%,#c07060 100%)",
    accent: "#C96A3D",
    tags: ["HERITAGE","UNESCO","ARCHITECTURE"],
    heritagePeriod: "Chalukya, 7th–8th c.",
    coords: [15.9463, 75.8169],
    experiences: ["heritage","architecture","history","photography","culture"],
    UNESCO: true,
    source: { ...SOURCES.unesco, verified: "2024-11" },
    historicalSummary: "Pattadakal was the 'coronation city' of the Chalukyas. The complex is a living dialogue between the Dravida (southern) and Nagara (northern) temple styles, and its crowning monument, the Virupaksha Temple of 740 CE, was built by Queen Lokamahadevi to commemorate her husband's victory over the Pallavas.",
    timeline: [
      { year: "680", event: "Earliest temples at Pattadakal (Sangameshwara)."},
      { year: "740", event: "Queen Lokamahadevi commissions Virupaksha Temple after Vikramaditya II's Kanchi victory."},
      { year: "745", event: "Mallikarjuna Temple built by Queen Trailokyamahadevi."},
      { year: "1987", event: "UNESCO inscribes Pattadakal as World Heritage Site."}
    ],
    dynasty: "chalukya",
    places: [
      { id: "virupaksha-p", name: "Virupaksha Temple (740 CE)", coords: [15.9460, 75.8170], type: "heritage",
        tags: ["heritage","architecture","history","photography","unesco"], durationMin: 60,
        bestTime: "09:00 – 11:00", photographyScore: 9.6,
        desc: "The grandest Dravida monument at Pattadakal; sculptural friezes include scenes from the Ramayana, Mahabharata and Bhagavata.",
        dynasty: "chalukya" },
      { id: "mallikarjuna", name: "Mallikarjuna Temple", coords: [15.9465, 75.8172], type: "heritage",
        tags: ["architecture","heritage"], durationMin: 20, bestTime: "After Virupaksha", photographyScore: 8.2,
        desc: "A smaller, slightly later cousin to Virupaksha with distinctive pierced window grilles.",
        dynasty: "chalukya" },
      { id: "papanatha", name: "Papanatha Temple", coords: [15.9450, 75.8200], type: "heritage",
        tags: ["architecture","heritage"], durationMin: 25, bestTime: "Late morning", photographyScore: 8.0,
        desc: "A Nagara (northern style) temple with rich narrative friezes, showing the fusion of design traditions.",
        dynasty: "chalukya" },
      { id: "kadasiddheshwar", name: "Kadasiddheshwara & Galaganatha", coords: [15.9468, 75.8160], type: "heritage",
        tags: ["heritage","architecture"], durationMin: 15, bestTime: "Morning", photographyScore: 7.0,
        desc: "Two smaller Nagara shrines at the east end of the complex.",
        dynasty: "chalukya" }
    ],
    detours: [
      { id: "pattadakal-ghat", name: "Malaprabha River Ghat", coords: [15.9475, 75.8140], type: "photography",
        tags: ["photography","sunrise"], detourKm: 0.4, visitMin: 10, photographyScore: 8.4,
        desc: "Step down to the Malaprabha at the back of the complex for unobstructed temple-across-river silhouettes.",
        bestFor: ["Photography"], whyWorth: "Two-minute walk; often empty." }
    ],
    fuelStops: [{ name: "IOCL Pattadakal Road", coords: [15.9400, 75.8300], type: "petrol" }],
    evStops:   [{ name: "KSEDC Charger — Badami", coords: [15.9160, 75.6700], type: "ev" }],
    guides: [
      { id: "parvati-ajja", name: "Parvati Ajja", title: "UNESCO Site Guide", photo: "PA",
        years: 16, languages: ["Kannada","English","Hindi","Telugu"],
        specialties: ["Chalukya Style-Fusion","UNESCO Interpretation","Narrative Friezes"],
        rating: 4.91, trips: 1080,
        expertise: { heritage: 96, photography: 78, architecture: 96, family: 80, history: 93 },
        destinations: ["pattadakal","badami","aihole"], priceTier: "moderate",
        meetPoint: "Virupaksha Temple North Gate", demoNote: "Illustrative profile" }
    ]
  },

  /* -------------------- HAVERI -------------------- */
  haveri: {
    id: "haveri",
    name: "Haveri",
    state: "Karnataka",
    tagline: "The quiet crossroads of forgotten temples.",
    shortDesc: "A lesser-known district with the most intricate Western Chalukya and Kalyani Chalukya temples — Siddhesvara, Tarakeshwara and the open-air gallery at Sudi.",
    heroGradient: "linear-gradient(135deg,#2f2a1f 0%,#6a5a3a 50%,#a89060 100%)",
    accent: "#8A7050",
    tags: ["HERITAGE","HIDDEN PLACES"],
    heritagePeriod: "Western & Kalyani Chalukya, 10th–12th c.",
    coords: [14.7928, 75.3982],
    experiences: ["heritage","architecture","hidden","history","photography"],
    UNESCO: false,
    source: { ...SOURCES.kstdc, verified: "2024-11" },
    historicalSummary: "Haveri was a provincial centre under the Later (Kalyani) Chalukyas in the 11th century and contains superb but little-visited temples that bridge the gap between Badami Chalukya and Hoysala design. It is also the birthplace of the poet Kanaka Dasa.",
    timeline: [
      { year: "1060", event: "Siddhesvara Temple at Haveri built under Kalyani Chalukya patronage."},
      { year: "1080", event: "Tarakeshwara Temple at Hangal constructed with its famous octagonal hall."},
      { year: "1509", event: "Birth of Kanaka Dasa, poet-saint of the Dasa tradition."}
    ],
    dynasty: "chalukya",
    places: [
      { id: "siddhesvara", name: "Siddhesvara Temple", coords: [14.7930, 75.4000], type: "heritage",
        tags: ["heritage","architecture","history","hidden"], durationMin: 35, bestTime: "09:00",
        photographyScore: 8.6,
        desc: "A square-plan temple with exuberantly carved doorways and pillars; its bull on the south side is a local icon.",
        dynasty: "chalukya" },
      { id: "sudi", name: "Sudi Stone Park & Temples", coords: [14.8300, 75.4300], type: "heritage",
        tags: ["hidden","history","architecture"], durationMin: 45, bestTime: "10:30", photographyScore: 8.0,
        desc: "Two large Chalukya temples (Mallikarjuna and Jodi-kalasa) and a magnificent open Nandi carved from a single boulder.",
        dynasty: "chalukya" },
      { id: "hangal-tarakeshwar", name: "Tarakeshwara Temple — Hangal", coords: [14.7680, 75.3200], type: "heritage",
        tags: ["heritage","architecture"], durationMin: 40, bestTime: "Afternoon", photographyScore: 8.4,
        desc: "Famed for its 9-metre-wide domed octagonal ceiling, the peak of Chalukya stone engineering.",
        dynasty: "chalukya" }
    ],
    detours: [
      { id: "bankapur-peacock", name: "Bankapur Peacock Sanctuary", coords: [14.8700, 75.2900], type: "hidden",
        tags: ["nature","hidden","photography"], detourKm: 12.0, visitMin: 45, photographyScore: 8.6,
        desc: "A small ASI-managed reserve inside a ruined fort, home to more than 1,000 peafowl.",
        bestFor: ["Nature","Hidden Places"], whyWorth: "Only if you have an extra morning and enjoy bird photography." }
    ],
    fuelStops: [{ name: "BPCL Haveri NH48", coords: [14.7900, 75.4050], type: "petrol" }],
    evStops:   [{ name: "Tata Charger — Haveri Bypass", coords: [14.7900, 75.4100], type: "ev" }],
    guides: [
      { id: "veeresh-gouda", name: "Veeresh Gouda", title: "Deccan Hidden-Heritage Guide", photo: "VG",
        years: 9, languages: ["Kannada","English","Hindi"],
        specialties: ["Lesser-known Chalukya","Kalyan Chalukya Temples","Deccan History"],
        rating: 4.8, trips: 310,
        expertise: { heritage: 92, photography: 75, architecture: 90, family: 72, history: 92 },
        destinations: ["haveri"], priceTier: "budget",
        meetPoint: "Siddhesvara Temple Gate", demoNote: "Illustrative profile" }
    ]
  }
};

/* ---------- Helper accessors ---------- */
function getAllDestinations() {
  return Object.values(DESTINATIONS);
}
function getDestination(id) {
  return DESTINATIONS[id] || null;
}
function getPlace(destId, placeId) {
  const d = DESTINATIONS[destId]; if (!d) return null;
  return d.places.find(p => p.id === placeId) ||
         d.detours.find(p => p.id === placeId) || null;
}
function getDynasty(id) { return DYNASTIES.find(d => d.id === id) || null; }
