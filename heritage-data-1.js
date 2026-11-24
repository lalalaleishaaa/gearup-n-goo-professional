/* ============================================================
 * GEARUP N GOO — NATIONAL HERITAGE ARCHIVE · Dataset 1/3
 * Karnataka · Rajasthan · Madhya Pradesh · Gujarat
 * Curated first-version dataset (10 states) — designed to scale
 * to all states & union territories. Content summarised from
 * public archaeology (ASI / UNESCO / state tourism); coordinates
 * are approximate.
 * ============================================================ */
window.__GNG_HD1 = [

/* ------------------------------------------------ KARNATAKA */
{
  id: "karnataka", slug: "karnataka", name: "Karnataka",
  description: "A crossroads of empires, sacred architecture, rock-cut monuments and living traditions.",
  tags: ["EMPIRES", "TEMPLES", "ARCHITECTURE"],
  heroImage: "assets/states/karnataka.jpg",
  aliases: ["Karnataka", "Karnatak", "Karunadu"],
  searchKeywords: "empires vijayanagara hoysala chalukya badami hampi belur halebidu pattadakal aihole temples mysore deccan",
  places: [
    {
      id: "hampi", slug: "hampi", name: "Hampi / Vijayanagara",
      image: "assets/heritage/karnataka/hampi-vijayanagara.jpg",
      tagline: "The lost imperial capital scattered across a boulder-strewn river landscape.",
      period: "14th–16th century CE", dynasty: "Vijayanagara Empire",
      heritageType: "Imperial capital · Temple city", classification: "UNESCO",
      location: "Ballari district", coordinates: [15.335, 76.460],
      tags: ["TEMPLES", "ARCHAEOLOGY", "URBAN HERITAGE"],
      facets: ["medieval", "hindu", "temples", "archaeology", "unesco", "architecture"],
      aliases: ["Hampi", "Hampii", "Hampe", "Vijayanagara", "Vijaynagar", "Vijayanagaram", "Virupaksha Temple", "Vittala Temple", "Hampi ruins"],
      searchKeywords: "vijayanagara empire krishnadevaraya stone chariot virupaksha temple ruined capital tungabhadra",
      why: [
        "Founded in 1336 by Harihara and Bukka of the Sangama dynasty, Vijayanagara — the City of Victory — grew into one of the largest cities of the medieval world. Persian and Portuguese visitors wrote in astonishment of its markets, festivals and wealth.",
        "The empire endured until 1565, when a coalition of Deccan sultanates won the Battle of Talikota. The capital was occupied and gradually abandoned, leaving temples, bazaars, aqueducts and palaces to the granite landscape. The Virupaksha Temple has remained a living place of worship throughout."
      ],
      timeline: [
        { stage: "BEFORE", year: "Early centuries CE", text: "The site is sacred as Pampa-kshetra, associated with the river goddess Pampa and Shiva as Virupaksha; inscriptions predate the empire." },
        { stage: "FORMATION", year: "1336 CE", text: "Harihara I and Bukka establish Vijayanagara on the south bank of the Tungabhadra." },
        { stage: "PEAK", year: "1509–1529", text: "Under Krishnadevaraya the city reaches its zenith — a fortified metropolis of temples, tanks and international trade." },
        { stage: "TRANSFORMATION", year: "1565", text: "Defeat at Talikota; the city is sacked and slowly abandoned to farmers, herders and stone." },
        { stage: "TODAY", year: "1986 →", text: "UNESCO World Heritage Site; a living landscape of monuments, worship and active conservation." }
      ],
      who: [
        { k: "Dynasty", v: "Vijayanagara (Sangama, Saluva, Tuluva, Aravidu lines)" },
        { k: "Ruler", v: "Krishnadevaraya, r. 1509–1529" },
        { k: "Religion", v: "Hinduism, with Jain and Muslim quarters in the urban core" },
        { k: "Visitors on record", v: "Persian ambassador Abdur Razzaq (1443); Portuguese chroniclers Domingo Paes and Fernao Nuniz" }
      ],
      lookCloser: [
        { t: "The Stone Chariot", d: "A Garuda shrine carved as a processional temple chariot — the emblem of Hampi." },
        { t: "Musical pillars", d: "Granite columns at the Vittala Temple that ring when struck." },
        { t: "Water systems", d: "Stone aqueducts, canals and stepped tanks that supplied a dry capital." },
        { t: "Royal Centre", d: "Lotus Mahal, elephant stables and stepped tank of the enclosed palace zone." }
      ],
      thenNow: {
        then: "A fortified imperial capital of several hundred thousand people — temples, gem markets and foreign trade quarters.",
        now: "Roughly 4,100 hectares of protected ruins across a sacred river landscape, still anchored by living worship at Virupaksha."
      },
      unesco: true, plan: { prefill: "vijayanagara" },
      sources: [
        { name: "UNESCO World Heritage Centre — Group of Monuments at Hampi", url: "https://whc.unesco.org/en/list/241", verified: "2026-08", confidence: "verified" },
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" }
      ]
    },
    {
      id: "pattadakal", slug: "pattadakal", name: "Pattadakal",
      image: "assets/heritage/karnataka/pattadakal.jpg",
      tagline: "Where northern and southern temple architectures were built side by side.",
      period: "7th–8th century CE", dynasty: "Chalukyas of Badami",
      heritageType: "Temple complex · Coronation site", classification: "UNESCO",
      location: "Bagalkot district", coordinates: [15.947, 75.822],
      tags: ["TEMPLES", "ARCHITECTURE", "UNESCO"],
      facets: ["medieval", "hindu", "temples", "unesco", "architecture"],
      aliases: ["Pattadakal", "Pattadakkal", "Pattada Kisuvolal", "Virupaksha Temple Pattadakal", "Raktapura"],
      searchKeywords: "chalukya nagara dravida fusion virupaksha temple lokamahadevi coronation unesco",
      why: [
        "Pattadakal was the ceremonial site where Chalukyan kings were crowned. Its ten monuments form a deliberate architectural debate: Dravida (southern) and Nagara (northern) style temples raised in the same complex, sometimes in the same building.",
        "The Virupaksha Temple, built around 740 by Queen Lokamahadevi to mark Vikramaditya II's triumphs, became a model that later Chola architects studied and adapted."
      ],
      timeline: [
        { stage: "BEFORE", year: "Badami era", text: "The Chalukyas make nearby Badami their capital; the Meguti hill inscription at Aihole dates 634 CE." },
        { stage: "FORMATION", year: "7th century", text: "Early temples (Sangameshvara, Kadasiddheshvara) rise at the Malaprabha river bend." },
        { stage: "PEAK", year: "c. 740 CE", text: "Lokamahadevi's Virupaksha Temple completes the sequence; Papanatha blends both styles." },
        { stage: "TRANSFORMATION", year: "8th–9th century", text: "Rashtrakuta patronage adds the Jain Narayana Temple; the coronation role fades." },
        { stage: "TODAY", year: "1987 →", text: "UNESCO World Heritage Site at the heart of the Badami–Aihole–Pattadakal circuit." }
      ],
      who: [
        { k: "Dynasty", v: "Chalukyas of Badami" },
        { k: "Patron", v: "Queen Lokamahadevi, consort of Vikramaditya II" },
        { k: "Tradition", v: "Dravida and Nagara temple architecture, deliberately juxtaposed" }
      ],
      lookCloser: [
        { t: "Two styles, one yard", d: "Nagara shikharas and Dravida vimanas standing within a few metres of each other." },
        { t: "Virupaksha reliefs", d: "Narrative carving of the Ramayana and Mahabharata on the temple walls." },
        { t: "Inscriptions", d: "The Virupaksha dedication record names the architect, Gunda — a rare signed medieval temple." },
        { t: "Riverfront setting", d: "Monuments aligned to the Malaprabha, part of a sacred geography shared with Aihole." }
      ],
      thenNow: {
        then: "A royal coronation ground where kings legitimised rule through monumental temple-building.",
        now: "A compact UNESCO-listed museum of early medieval Indian architecture in a village landscape."
      },
      unesco: true, plan: { prefill: "vijayanagara" },
      sources: [
        { name: "UNESCO World Heritage Centre — Monuments at Pattadakal", url: "https://whc.unesco.org/en/list/239", verified: "2026-08", confidence: "verified" },
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" }
      ]
    },
    {
      id: "aihole", slug: "aihole", name: "Aihole",
      image: "assets/heritage/karnataka/aihole.jpg",
      tagline: "An open-air laboratory where the Indian temple learned its forms.",
      period: "5th–8th century CE", dynasty: "Chalukyas of Badami",
      heritageType: "Temple experimentation site", classification: "ARCHAEOLOGICAL",
      location: "Bagalkot district", coordinates: [15.900, 75.875],
      tags: ["TEMPLES", "ARCHAEOLOGY", "ARCHITECTURE"],
      facets: ["medieval", "hindu", "temples", "archaeology", "architecture"],
      aliases: ["Aihole", "Aiholle", "Ayyavole", "Aivalli", "Aihole temples", "Durga Temple Aihole", "Lad Khan Temple"],
      searchKeywords: "chalukya temple experimentation cradle durga temple apsidal lad khan early indian architecture",
      why: [
        "With over a hundred surviving monuments, Aihole reads like a sketchbook: flat-roofed halls, apsidal plans, experimenting shikharas and early columned mandapas, all carved between the 5th and 8th centuries.",
        "The Chalukyan builders treated Aihole as a testing ground before perfecting Pattadakal. The famous Durga Temple — named after 'durg' (fortress), not the goddess — curves around an apsidal end like a stone boat."
      ],
      timeline: [
        { stage: "BEFORE", year: "Pre-6th century", text: "Megalithic and early shrine activity on the Meguti hill." },
        { stage: "FORMATION", year: "6th century", text: "Early flat-roofed temples (Lad Khan, Kontigudi group) establish the vocabulary." },
        { stage: "PEAK", year: "7th century", text: "The Durga Temple and Huchimalligudi push plans, towers and carving further." },
        { stage: "TRANSFORMATION", year: "8th–12th century", text: "Patronage shifts to Pattadakal and beyond; Aihole becomes a quiet town of ruins." },
        { stage: "TODAY", year: "—", text: "An ASI-protected spread of monuments wrapped inside a living village." }
      ],
      who: [
        { k: "Dynasty", v: "Chalukyas of Badami, with later Rashtrakuta additions" },
        { k: "Communities", v: "Guilds and merchant families named in Aihole's inscriptions" },
        { k: "Tradition", v: "Formative North and South Indian temple architecture" }
      ],
      lookCloser: [
        { t: "The apsidal Durga Temple", d: "A rare curved stone plan echoing Buddhist chaitya halls." },
        { t: "Lad Khan Temple", d: "A flat-roofed shrine built like a timber hall translated into stone." },
        { t: "Meguti Hill", d: "The 634 CE Sanskrit inscription — a dated anchor for all Chalukyan chronology." },
        { t: "Jain caves", d: "Hill-cut Jain sculpture beside Hindu groups, showing layered patronage." }
      ],
      thenNow: {
        then: "A school of architecture where masons, patrons and priests argued in stone.",
        now: "A village-scale heritage site where cows wander between 1,400-year-old experiments."
      },
      unesco: false, plan: { prefill: "vijayanagara" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" }
      ]
    },
    {
      id: "badami-cave-temples", slug: "badami-cave-temples", name: "Badami Cave Temples",
      image: "assets/heritage/karnataka/badami-cave-temples.jpg",
      tagline: "Rock-cut shrines carved into sandstone cliffs above an ancient capital.",
      period: "6th century CE", dynasty: "Chalukyas of Badami",
      heritageType: "Rock-cut caves", classification: "ICONIC",
      location: "Bagalkot district", coordinates: [15.916, 75.679],
      tags: ["CAVES", "TEMPLES", "SCULPTURE"],
      facets: ["medieval", "hindu", "caves", "temples", "architecture", "jain"],
      aliases: ["Badami", "Badami caves", "Vatapi", "Badami Cave Temples", "Vatapi caves"],
      searchKeywords: "chalukya rock cut caves vatapi nataraja eighteen arms varaha narasimha agastya lake badami",
      why: [
        "Badami — ancient Vatapi — was the first capital of the Chalukyas of Badami. Its cliffs hold four excavated caves: three Hindu and one Jain, carved in the second half of the 6th century.",
        "The sculpture is the story: an eighteen-armed Nataraja, giant Varaha and Narasimha panels, and a dated inscription of 578 CE inside Cave 3 make Badami one of early medieval India's most precisely documented sites."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Sandstone cliffs above the Agastya lake; earlier local shrine traditions." },
        { stage: "FORMATION", year: "543–566", text: "Pulakeshin I fortifies the hill; the capital of Vatapi takes shape." },
        { stage: "PEAK", year: "578 CE", text: "Cave 3, dedicated by Mangalesha, carries the site's dated foundation inscription." },
        { stage: "TRANSFORMATION", year: "8th century →", text: "The capital moves; Badami survives as a temple town under successive dynasties." },
        { stage: "TODAY", year: "—", text: "ASI-protected caves above one of Karnataka's most photographed lake-fronts." }
      ],
      who: [
        { k: "Dynasty", v: "Chalukyas of Badami" },
        { k: "Kings", v: "Pulakeshin I; Mangalesha (Cave 3 inscription, 578 CE)" },
        { k: "Faiths", v: "Shaiva and Vaishnava Hinduism, plus a Jain excavation" }
      ],
      lookCloser: [
        { t: "Eighteen-armed Nataraja", d: "Cave 1's dancing Shiva, carved in 19 dance poses." },
        { t: "Varaha panel", d: "Vishnu as boar lifting the earth goddess — early Chalukyan confidence at monumental scale." },
        { t: "Cave 4 (Jain)", d: "A later Jain excavation with a seated Mahavira, marking plural patronage." },
        { t: "The cliff tank", d: "Stepped water storage that still mirrors the caves at golden hour." }
      ],
      thenNow: {
        then: "The ceremonial heart of an aggressive young Deccan kingdom announcing itself in stone.",
        now: "Four quiet caves above Agastya lake, minutes from Pattadakal and Aihole."
      },
      unesco: false, plan: { prefill: "vijayanagara" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" }
      ]
    },
    {
      id: "belur", slug: "belur", name: "Belur",
      image: "assets/heritage/karnataka/belur.jpg",
      tagline: "Soapstone star-platforms carved with impossible, jewellery-fine detail.",
      period: "12th century CE", dynasty: "Hoysala Empire",
      heritageType: "Temple · Sculptural narrative", classification: "ICONIC",
      location: "Hassan district", coordinates: [13.166, 75.865],
      tags: ["TEMPLES", "SCULPTURE", "ARCHITECTURE"],
      facets: ["medieval", "hindu", "temples", "architecture", "culture"],
      aliases: ["Belur", "Belooru", "Chennakeshava Temple", "Chennakesava Temple Belur", "Belur temple"],
      searchKeywords: "hoysala chennakeshava temple vishnuvardhana soapstone star platform darpana sundari sculpture hassan",
      why: [
        "The Chennakeshava Temple at Belur was consecrated in 1117 under the Hoysala king Vishnuvardhana. Its stellate (star-shaped) platform and chloritic schist walls allowed carvers to work in detail impossible on hard granite.",
        "The result is sculpture that behaves like metalwork — the famed Darpana Sundari (beauty with the mirror), friezes of elephants, and 42 madanikas bracket figures that took over a century to complete."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Hoysalas begin as hill chieftains in the Karnataka uplands." },
        { stage: "FORMATION", year: "1117 CE", text: "Vishnuvardhana consecrates Chennakeshava at Belur, traditionally linked to victories in the south." },
        { stage: "PEAK", year: "12th century", text: "Workshops refine the Hoysala style across Belur and Halebidu." },
        { stage: "TRANSFORMATION", year: "14th century", text: "Delhi Sultanate raids destabilise the kingdom; votive additions continue." },
        { stage: "TODAY", year: "—", text: "A living Vaishnava temple and the twin peak, with Halebidu, of Hoysala art." }
      ],
      who: [
        { k: "Dynasty", v: "Hoysala Empire" },
        { k: "Ruler", v: "Vishnuvardhana, r. 1108–1152" },
        { k: "Craft", v: "Hoysala soapstone (chloritic schist) carving tradition" },
        { k: "Worship", v: "Vaishnavism — the temple honours Vijayanarayana/Chennakeshava (Vishnu)" }
      ],
      lookCloser: [
        { t: "The madanikas", d: "Bracket figures of dancers and musicians, each a masterclass in pose." },
        { t: "Star platform", d: "The jagati runs in zigzag courses, multiplying wall surface for sculpture." },
        { t: "Frieze bands", d: "Elephants, horses, epics and mythology in ascending registers." },
        { t: "Darpana Sundari", d: "The 'lady with the mirror' — Belur's most reproduced carving." }
      ],
      thenNow: {
        then: "A dynastic statement in stone, celebrating Hoysala power through Vishnu's temple.",
        now: "An active temple town and the standard stop on Karnataka's Hoysala circuit."
      },
      unesco: false, plan: { prefill: "chikkamagaluru" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" },
        { name: "Karnataka Tourism", url: "https://www.karnatakatourism.org", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "halebidu", slug: "halebidu", name: "Halebidu",
      image: "assets/heritage/karnataka/halebidu.jpg",
      tagline: "The Hoysala capital and its great, unfinished masterpiece.",
      period: "12th century CE", dynasty: "Hoysala Empire",
      heritageType: "Temple · Capital ruins", classification: "ICONIC",
      location: "Hassan district", coordinates: [13.209, 75.995],
      tags: ["TEMPLES", "SCULPTURE", "ARCHAEOLOGY"],
      facets: ["medieval", "hindu", "temples", "architecture", "archaeology"],
      aliases: ["Halebidu", "Halebid", "Halebeedu", "Hoysaleshwara Temple", "Hoysaleswara Temple", "Dwarasamudra"],
      searchKeywords: "hoysala hoysaleshwara temple dwara samudra nandi ketamalla vishnuvardhana star platform friezes hassan",
      why: [
        "Halebidu — ancient Dwarasamudra — was the Hoysala capital. Its Hoysaleshwara Temple, begun around 1121, carries two shrines, two Nandi pavilions and nearly a kilometre of carved friezes.",
        "Work stopped as the 14th century brought Delhi Sultanate raids; the unfinished tower bases let you see exactly how Hoysala temples were designed — and why the style died with the kingdom."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Dwarasamudra develops as a Hoysala seat before Belur's great temple." },
        { stage: "FORMATION", year: "c. 1121 CE", text: "Ketamalla, a wealthy officer, commissions the Hoysaleshwara Temple under Vishnuvardhana." },
        { stage: "PEAK", year: "12th–13th century", text: "The capital's sculptors produce some of the densest narrative carving in India." },
        { stage: "TRANSFORMATION", year: "1311 →", text: "Malik Kafur's campaign and later raids break Hoysala power; the temple is never completed." },
        { stage: "TODAY", year: "—", text: "An ASI-protected monument pair — with Belur — defining Hoysala artistry." }
      ],
      who: [
        { k: "Dynasty", v: "Hoysala Empire" },
        { k: "Patron", v: "Ketamalla, under King Vishnuvardhana" },
        { k: "Faith", v: "Shaivism — twin Shiva linga shrines" },
        { k: "Disruptor", v: "Delhi Sultanate campaigns, early 14th century" }
      ],
      lookCloser: [
        { t: "The twin Nandis", d: "Two monolithic bull pavilions facing the twin shrines — polished by centuries." },
        { t: "Epic friezes", d: "Ramayana, Mahabharata and Bhagavata running along the plinth." },
        { t: "Unfinished towers", d: "Bare superstructure that documents Hoysala building method." },
        { t: "Kedareshwara Temple", d: "The quieter second monument with softer, later carving." }
      ],
      thenNow: {
        then: "The political capital of a wealthy Deccan empire, decked in its best stone.",
        now: "A village of monumental ruins 16 km from Belur, usually experienced as a pair."
      },
      unesco: false, plan: { prefill: "chikkamagaluru" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" }
      ]
    }
  ]
},

/* ------------------------------------------------ RAJASTHAN */
{
  id: "rajasthan", slug: "rajasthan", name: "Rajasthan",
  description: "Where forts rise from the Aravallis, water architecture meets desert ingenuity, and royal histories survive in stone.",
  tags: ["FORTS", "ROYAL", "DESERT HERITAGE"],
  heroImage: "assets/states/rajasthan.jpg",
  aliases: ["Rajasthan", "Rajputana", "Land of kings"],
  searchKeywords: "rajput forts stepwells baori desert kingdoms mewar shekhawati havelis kumbhalgarh bhangarh abhaneri",
  places: [
    {
      id: "chand-baori", slug: "chand-baori", name: "Chand Baori, Abhaneri",
      image: "assets/heritage/rajasthan/chand-baori.jpg",
      tagline: "Thirteen storeys of steps plunging into one of India's deepest stepwells.",
      period: "8th–9th century CE", dynasty: "Nikumbh dynasty of Abhaneri (commonly credited)",
      heritageType: "Stepwell · Water architecture", classification: "ICONIC",
      location: "Dausa district, near Abhaneri village", coordinates: [27.007, 76.607],
      tags: ["STEPWELLS", "WATER", "ARCHITECTURE"],
      facets: ["medieval", "hindu", "architecture", "culture"],
      aliases: ["Chand Baori", "Chand Baodi", "Abhaneri", "Abhaneri stepwell", "Chand bawdi", "Chand Baori Abhaneri"],
      searchKeywords: "stepwell baori abhaneri 3500 steps thirteen storeys water architecture harshat mata dausa rajasthan",
      why: [
        "Chand Baori descends roughly 30 metres in 3,500 perfectly symmetrical steps — a ziggurat inverted into the earth. Stepwells like this stored monsoon water for the dry months and doubled as cool community gathering places.",
        "The well sits beside the Harshat Mata temple; together they formed the ceremonial centre of medieval Abhaneri. The colonnaded upper pavilions were added later under the Mughals — the site keeps its layers visible."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Semi-arid eastern Rajasthan depends on stored rainwater; local shrine traditions at Abhaneri." },
        { stage: "FORMATION", year: "8th–9th century", text: "The Nikumbh-era settlement builds the great baori and Harshat Mata temple (dating per ASI and common scholarship)." },
        { stage: "PEAK", year: "Medieval era", text: "Abhaneri prospers on trade routes; the stepwell anchors civic and ritual life." },
        { stage: "TRANSFORMATION", year: "Mughal era", text: "Chhatris and galleries added; the town's prominence declines." },
        { stage: "TODAY", year: "—", text: "One of India's most photographed monuments of water engineering, ASI-protected." }
      ],
      who: [
        { k: "Ruling house", v: "Nikumbh dynasty of Abhaneri (attribution per ASI)" },
        { k: "Later additions", v: "Mughal-era pavilions on the north side" },
        { k: "Faith", v: "Harshat Mata (Harsiddhi) temple adjacent" }
      ],
      lookCloser: [
        { t: "The geometry", d: "Double flights of steps meeting at diamond landings — an Escher drawing a millennium early." },
        { t: "Harshat Mata temple", d: "Rebuilt shrine with exquisitely carved 8th–9th century fragments." },
        { t: "Temperature drop", d: "The air at the bottom stays noticeably cooler — stepwells as desert air-conditioning." },
        { t: "Later chhatris", d: "Mughal pavilions showing continued use across centuries." }
      ],
      thenNow: {
        then: "A working reservoir and cool-town square for a trading settlement.",
        now: "A heritage monument between Jaipur and Agra that redefined how the world sees water architecture."
      },
      unesco: false, plan: { start: "Abhaneri" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "high" },
        { name: "Rajasthan Tourism", url: "https://tourism.rajasthan.gov.in", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "bhangarh", slug: "bhangarh", name: "Bhangarh Fort",
      image: "assets/heritage/rajasthan/bhangarh-fort.jpg",
      tagline: "A 17th-century town frozen mid-life — and a legend modern India adopted.",
      period: "17th century CE", dynasty: "Kachhwaha (Jaipur line)",
      heritageType: "Fort & abandoned town", classification: "HERITAGE",
      location: "Alwar district, edge of Sar Tiger Reserve", coordinates: [27.096, 76.287],
      tags: ["FORTS", "URBAN HERITAGE", "FOLKLORE"],
      facets: ["medieval", "hindu", "forts", "architecture", "culture"],
      aliases: ["Bhangarh", "Bhangarh Fort", "Bhangar", "Bhangadh"],
      searchKeywords: "bhangarh fort abandoned town alwar sariska haunted legend folklore kachhwaha madho singh",
      why: [
        "Bhangarh was a planned 17th-century town — fort, temples, bazaars and havelis — built under the Kachhwahas. It was gradually deserted as the dynasty's centre of power shifted to Jaipur; the Mughal-era decline of the route it served did the rest.",
        "Its modern fame as 'India's most haunted place' is folklore, not history: the magician-princess tales attached to it have no documentary basis. The ASI's legal restriction on entry after sunset — standard for protected monuments — fuelled the legend. Treat the ghosts as story; the town planning is the real record."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Forest-edge settlement near the Ghati ka Kund catchment in the Aravalli foothills." },
        { stage: "FORMATION", year: "1613 (commonly cited)", text: "Madho Singh raises the fort-town for the Kachhwaha line; palaces, temples and markets follow." },
        { stage: "PEAK", year: "17th century", text: "A functioning town on the Jaipur–Alwar frontier." },
        { stage: "TRANSFORMATION", year: "18th–19th century", text: "Decline and gradual abandonment as patronage moves to Jaipur." },
        { stage: "TODAY", year: "—", text: "ASI-protected ruins with restricted hours; the folklore is modern and unverified." }
      ],
      who: [
        { k: "Ruling house", v: "Kachhwaha Rajputs of Amber/Jaipur" },
        { k: "Founder", v: "Madho Singh (fort attributed per tradition and ASI signage)" },
        { k: "Faith", v: "Hindu and Jain temples within the town" },
        { k: "Folklore", v: "Modern 'haunted' reputation — legend, not documented history" }
      ],
      lookCloser: [
        { t: "The town plan", d: "Main street, shops, temples and residences readable in the ruins." },
        { t: "Gopinath Temple", d: "The surviving shrine that still anchors the site." },
        { t: "Silent bazaars", d: "Shop counters worn by hands, empty for centuries." },
        { t: "The tiger-edge", d: "Bhangarh borders Sariska — forest pressing into abandoned streets." }
      ],
      thenNow: {
        then: "A garrison town with temples, markets and a fort-palace on a trade frontier.",
        now: "A legally protected archaeological site wrapped in thoroughly modern mythology."
      },
      unesco: false, plan: { start: "Bhangarh" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "high" },
        { name: "Rajasthan Tourism", url: "https://tourism.rajasthan.gov.in", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "mandawa", slug: "mandawa", name: "Mandawa",
      image: "assets/heritage/rajasthan/mandawa.jpg",
      tagline: "A painted town — merchant mansions covered floor-to-roof in frescoes.",
      period: "18th–19th century CE", dynasty: "Shekhawati merchant era (Rajput-ruled)",
      heritageType: "Painted haveli town", classification: "HERITAGE",
      location: "Jhunjhunu district, Shekhawati", coordinates: [28.058, 75.072],
      tags: ["HERITAGE", "PAINTED TOWNS", "TRADE"],
      facets: ["colonial", "hindu", "architecture", "culture"],
      aliases: ["Mandawa", "Mandwa Rajasthan", "Shekhawati", "Mandawa havelis", "Shekhawati frescoes"],
      searchKeywords: "shekhawati mandawa haveli fresco marwari merchants painted town open air gallery jhunjhunu",
      why: [
        "Mandawa sits in Shekhawati, where Marwari trading families built havelis and competed in fresco: gods beside locomotives, telephones next to Krishna. The paintings record exactly what 19th-century India was absorbing — technology, empire, fashion — filtered through a merchant lens.",
        "As the families moved to Calcutta and Bombay, the mansions stood locked and painted. The result is an open-air archive of business wealth declaring itself in colour."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Shekhawati semi-desert trade route under Rajput thikanas." },
        { stage: "FORMATION", year: "mid-18th century", text: "Mandawa is established as a thikana; merchants begin building brick havelis." },
        { stage: "PEAK", year: "19th century", text: "Marwari trade wealth peaks; fresco workshops cover entire facades." },
        { stage: "TRANSFORMATION", year: "20th century", text: "Families relocate to metropolitan centres; many havelis close." },
        { stage: "TODAY", year: "—", text: "Heritage-stay economy; conservation of painted facades is an ongoing struggle." }
      ],
      who: [
        { k: "Rulers", v: "Shekhawati Rajput thikanas (Mandawa fort family)" },
        { k: "Patrons", v: "Marwari merchant families and trade guilds" },
        { k: "Tradition", v: "Rajasthani fresco (aara-gash) painting workshops" }
      ],
      lookCloser: [
        { t: "Fresco subject matter", d: "Trains, cars, aviation and European figures painted decades before they were common in India." },
        { t: "Chokhani Double Haveli", d: "Two mirrored mansions showing competitive facade-building." },
        { t: "Mandawa Fort", d: "The 18th-century fort at town centre, now a heritage hotel." },
        { t: "Baolis & chhatris", d: "Civic water structures and cenotaphs completing the townscape." }
      ],
      thenNow: {
        then: "Homes of absent financiers whose money moved empires from Calcutta to Rangoon.",
        now: "A walking museum where painted walls decay faster than they can be restored."
      },
      unesco: false, plan: { start: "Mandawa" },
      sources: [
        { name: "Rajasthan Tourism", url: "https://tourism.rajasthan.gov.in", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "kumbhalgarh", slug: "kumbhalgarh", name: "Kumbhalgarh Fort",
      image: "assets/heritage/rajasthan/kumbhalgarh-fort.jpg",
      tagline: "A mountain fortress behind one of the longest walls ever built.",
      period: "15th century CE", dynasty: "Sisodia Rajputs of Mewar",
      heritageType: "Hill fort", classification: "ICONIC",
      location: "Rajsamand district, Aravalli hills", coordinates: [25.145, 73.585],
      tags: ["FORTS", "MILITARY", "ARCHITECTURE"],
      facets: ["medieval", "hindu", "forts", "architecture"],
      aliases: ["Kumbhalgarh", "Kumbhalgadh", "Kumbhalgarh Fort", "Great Wall of India"],
      searchKeywords: "kumbhalgarh fort rana kumbha mewar 36 km wall maharana pratap birthplace aravalli badal mahal",
      why: [
        "Built by Rana Kumbha in the 1440s–50s, Kumbhalgarh's ramparts run about 36 kilometres across the Aravalli ridges — after the Great Wall of China, among the longest continuous walls on earth. The fort never fell to direct assault.",
        "It was Mewar's refuge in the worst of times — and the birthplace of Maharana Pratap in 1540. The 'Great Wall of India' label is modern marketing, but the engineering is genuinely medieval mastery."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Earlier hill fortifications on the strategic Aravalli crest; a Mauryan-era Shiva temple survives inside." },
        { stage: "FORMATION", year: "1443–1458", text: "Rana Kumbha raises the great wall and palaces; the fort becomes Mewar's second capital." },
        { stage: "PEAK", year: "15th–16th century", text: "Shelter for Mewar's royal line whenever Chittaur fell; birthplace of Maharana Pratap, 1540." },
        { stage: "TRANSFORMATION", year: "17th–19th century", text: "Withstands sieges, changes hands with Mewar's fortunes; additions under Shah Jahan era noted in records." },
        { stage: "TODAY", year: "—", text: "The most-visited fort of the Mewar triangle after Chittaurgarh; its wall walk is legendary." }
      ],
      who: [
        { k: "Dynasty", v: "Sisodia Rajputs of Mewar" },
        { k: "Builder", v: "Rana Kumbha, r. 1433–1468 — patron of forts and music alike" },
        { k: "Born here", v: "Maharana Pratap, 1540" },
        { k: "Legend vs fact", v: "'Great Wall of India' is a modern nickname, not a historical name" }
      ],
      lookCloser: [
        { t: "The wall", d: "36 km of rampart with seven fortified gates (pols)." },
        { t: "Badal Mahal", d: "The cloud palace at the summit — birthplace apartments of Pratap." },
        { t: "360+ temples", d: "Jain and Hindu shrines sheltered inside, including the Neelkanth Mahadev." },
        { t: "Terrain as defence", d: "The Aravalli knife-ridge approach is half the fort's strength." }
      ],
      thenNow: {
        then: "The unreachable backup capital of Mewar — where the kingdom survived its darkest decades.",
        now: "A forest-reserve fortress whose wall hike is one of Rajasthan's great walks."
      },
      unesco: false, plan: { start: "Kumbhalgarh" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "high" },
        { name: "Rajasthan Tourism", url: "https://tourism.rajasthan.gov.in", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "harshnath", slug: "harshnath", name: "Harshnath Temple",
      image: "assets/heritage/rajasthan/harshnath-temple.jpg",
      tagline: "A 10th-century Shaiva shrine on the hill above Sikar — old and new side by side.",
      period: "10th century CE", dynasty: "Chauhans (Chahamanas) of Shakambhari",
      heritageType: "Temple ruins", classification: "ARCHAEOLOGICAL",
      location: "Sikar district", coordinates: [27.589, 75.143],
      tags: ["TEMPLES", "ARCHAEOLOGY", "SCULPTURE"],
      facets: ["medieval", "hindu", "temples", "archaeology", "architecture"],
      aliases: ["Harshnath", "Harsh Nath", "Harshnath Temple", "Harshagiri", "Sikar temple"],
      searchKeywords: "harshnath temple sikar chauhan 971 ce shaiva tenth century ruined temple rajasthan archaeology",
      why: [
        "The original Harshnath temple, dated by inscription to 971 CE, was raised under the Chauhans of Shakambhari — the dynasty that would later produce Prithviraj III. Its sculpted fragments show the early Rajput-era temple style of eastern Rajasthan.",
        "Beside the ruins stands a newer Harshnath temple rebuilt in the 19th century by a local thakur. The pairing — a wounded original and its successor — makes the site an unusually legible lesson in how temples live, die and get reborn."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Harshagiri hill revered in local Shaiva tradition." },
        { stage: "FORMATION", year: "971 CE", text: "The temple is consecrated, dated by its stone inscription." },
        { stage: "PEAK", year: "10th–12th century", text: "A temple complex served by priests and supported by land grants." },
        { stage: "TRANSFORMATION", year: "medieval era", text: "Damaged and despoiled in the wars of the period (commonly attributed to Ghurid-era campaigns); worship lapses." },
        { stage: "TODAY", year: "—", text: "ASI-protected ruins with a 19th-century successor temple beside them." }
      ],
      who: [
        { k: "Dynasty", v: "Chauhans (Chahamanas) of Shakambhari" },
        { k: "Faith", v: "Shaiva Hinduism" },
        { k: "Rebuilt by", v: "Thakur of Sikar's line, 19th century" }
      ],
      lookCloser: [
        { t: "The inscription", d: "Dated 971 CE — a fixed point for Chauhan-era chronology." },
        { t: "Sculpted shards", d: "Frieze blocks reassembled around the platform." },
        { t: "Two temples, one hill", d: "10th-century ruin and 19th-century rebuild in one frame." },
        { t: "Aravalli panorama", d: "The hill looks across the whole Shekhawati plain." }
      ],
      thenNow: {
        then: "A dynastic hill temple announcing Chauhan power over the plains.",
        now: "A quiet ASI site above Sikar that most Rajasthan itineraries still miss."
      },
      unesco: false, plan: { start: "Sikar" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "medium" }
      ]
    },
    {
      id: "neemrana", slug: "neemrana", name: "Neemrana Fort",
      image: "assets/heritage/rajasthan/neemrana-fort.jpg",
      tagline: "A 15th-century fort-palace that became the blueprint for Indian heritage hotels.",
      period: "15th century CE (1464)", dynasty: "Chauhan lineage (descendants of Prithviraj III's line)",
      heritageType: "Fort-palace", classification: "HERITAGE",
      location: "Alwar district, Delhi–Jaipur corridor", coordinates: [27.999, 76.704],
      tags: ["FORTS", "HERITAGE", "RESTORATION"],
      facets: ["medieval", "hindu", "forts", "architecture", "culture"],
      aliases: ["Neemrana", "Neemrana Fort", "Neemrana Fort Palace", "Neemrana hotel"],
      searchKeywords: "neemrana fort 1464 chauhan heritage hotel restoration 1980s delhi jaipur alwar",
      why: [
        "Raised in 1464 by a Chauhan branch claiming descent from Prithviraj III's lineage, Neemrana guarded the Delhi–Rajputana corridor for centuries across nine palace levels cut into the hillside.",
        "Its second life is its modern significance: after decades of neglect it was restored from the 1980s by Francis Wacziarg and Aman Nath and opened as one of India's first heritage hotels. Neemrana proved conservation could pay for itself — and changed how Rajasthan treats its built past."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Hillside stronghold site on the Aravalli spurs below the plateau." },
        { stage: "FORMATION", year: "1464", text: "Prithvi Raj Chauhan's descendant line raises the fort (foundation date per the restoration trust's records)." },
        { stage: "PEAK", year: "15th–18th century", text: "A prosperous seat controlling the route between Delhi and the Rajput plains." },
        { stage: "TRANSFORMATION", year: "19th–20th century", text: "Decline and abandonment; by mid-20th century the palaces stand ruined." },
        { stage: "TODAY", year: "1986 →", text: "Restored and run as the pioneering Neemrana 'non-hotel' heritage experience." }
      ],
      who: [
        { k: "Lineage", v: "Chauhan descendants of Prithviraj III's family line" },
        { k: "Restorers", v: "Aman Nath & Francis Wacziarg (from 1980s)" },
        { k: "Legacy", v: "Catalyst of India's heritage-hotel movement" }
      ],
      lookCloser: [
        { t: "Nine levels", d: "Palaces stepped up the hillside over 2 hectares — vertical village planning." },
        { t: "Restoration grammar", d: "Where old fabric survives it is kept; new work is honestly distinguishable." },
        { t: "The hanging gardens", d: "Terraced courts with Persian wheel and step-tank waterworks." },
        { t: "Route location", d: "The fort's whole logic is visible from the Delhi–Jaipur road it once taxed." }
      ],
      thenNow: {
        then: "A toll-point fort of a minor Chauhan chiefdom on the imperial road.",
        now: "A hotel that taught India how to monetise restoration without demolishing history."
      },
      unesco: false, plan: { start: "Neemrana" },
      sources: [
        { name: "Neemrana Hotels (restoration history)", url: "https://www.neemranahotels.com", verified: "2026-08", confidence: "high" },
        { name: "Rajasthan Tourism", url: "https://tourism.rajasthan.gov.in", verified: "2026-08", confidence: "high" }
      ]
    }
  ]
},

/* ------------------------------------------- MADHYA PRADESH */
{
  id: "madhya-pradesh", slug: "madhya-pradesh", name: "Madhya Pradesh",
  description: "Prehistoric art, medieval kingdoms, Buddhist monuments and forgotten cities across the heart of India.",
  tags: ["ANCIENT", "ROCK ART", "KINGDOMS"],
  heroImage: "assets/states/madhya-pradesh.jpg",
  aliases: ["Madhya Pradesh", "MP", "Heart of India"],
  searchKeywords: "bhimbetka sanchi orchha mandu chanderi bagh caves rock art stupa buddhist bundela malwa",
  places: [
    {
      id: "bhimbetka", slug: "bhimbetka", name: "Bhimbetka Rock Shelters",
      image: "assets/heritage/madhya-pradesh/bhimbetka-rock-shelters.jpg",
      tagline: "Paintings on stone spanning from the Stone Age to recorded history.",
      period: "Mesolithic onward (paintings across ~10,000+ years)", dynasty: "— (prehistoric & later)",
      heritageType: "Rock art site", classification: "UNESCO",
      location: "Raisen district, near Bhopal", coordinates: [22.933, 77.617],
      tags: ["ROCK ART", "PREHISTORY", "ARCHAEOLOGY"],
      facets: ["ancient", "archaeology", "unesco", "culture"],
      aliases: ["Bhimbetka", "Bhimbetka Rock Shelters", "Bhim betka", "Bhimbetka caves", "Bhimbaithaka"],
      searchKeywords: "bhimbetka rock shelters paintings mesolithic prehistoric bhopal raisen wakankar unesco",
      why: [
        "Bhimbetka's sandstone shelters hold one of the oldest and densest concentrations of rock art in India — human figures, animals, hunts and dancers painted and repainted from Mesolithic times through later historical periods.",
        "The shelters show continuous occupation alongside the art: stone floors, tools and hearths. Discovered for science by V. S. Wakankar in 1957–58, the site turned central India into a primary source for understanding prehistoric life."
      ],
      timeline: [
        { stage: "BEFORE", year: "Deep prehistory", text: "Shelters occupied by hominin and early modern human groups; Acheulian tools occur here." },
        { stage: "FORMATION", year: "Mesolithic", text: "Earliest of the painted layers — small hunting and gathering scenes in mineral pigments." },
        { stage: "PEAK", year: "Mesolithic–Chalcolithic", text: "Rich multi-coloured compositions: dancers, animals, ritual scenes." },
        { stage: "TRANSFORMATION", year: "Historical period", text: "Later paintings include horse-and-rider figures, documenting changing worlds." },
        { stage: "TODAY", year: "2003 →", text: "UNESCO World Heritage Site within the Ratapani Wildlife Sanctuary." }
      ],
      who: [
        { k: "Artists", v: "Unnamed hunter-gatherer and early farming communities" },
        { k: "Discovery", v: "V. S. Wakankar, 1957–58" },
        { k: "Research", v: "ASI and Indian universities; ongoing documentation" }
      ],
      lookCloser: [
        { t: "The Zoo Rock", d: "A single panel crowded with deer, bison, elephants and horses across eras." },
        { t: "Pigment chemistry", d: "Mineral colours — haematite reds, charcoal blacks — still legible after millennia." },
        { t: "Superimposition", d: "Later painters worked over earlier art, giving archaeologists a relative timeline." },
        { t: "Living floor", d: "Excavated hearths and tools proving the galleries were home, not museum." }
      ],
      thenNow: {
        then: "Shelter, workshop and canvas for communities recording their world in ochre.",
        now: "A protected rock-art landscape inside a forest — art and tiger country in one walk."
      },
      unesco: true, plan: { start: "Bhimbetka" },
      sources: [
        { name: "UNESCO World Heritage Centre — Rock Shelters of Bhimbetka", url: "https://whc.unesco.org/en/list/925", verified: "2026-08", confidence: "verified" },
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" }
      ]
    },
    {
      id: "orchha", slug: "orchha", name: "Orchha",
      image: "assets/heritage/madhya-pradesh/orchha.jpg",
      tagline: "A Bundela capital where palaces, temples and cenotaphs share one riverbank.",
      period: "16th–17th century CE", dynasty: "Bundelas",
      heritageType: "Capital complex", classification: "HERITAGE",
      location: "Niwari district, on the Betwa", coordinates: [25.358, 78.641],
      tags: ["PALACES", "TEMPLES", "BUNDELA"],
      facets: ["medieval", "hindu", "palaces", "temples", "architecture", "culture"],
      aliases: ["Orchha", "Orcha", "Urchha", "Orchha fort", "Raja Ram Temple Orchha"],
      searchKeywords: "orchha bundela betwa jahangir mahal chaturbhuj raja ram temple chhatris cenotaphs niwari",
      why: [
        "Founded in 1501 by Rudra Pratap Singh, Orchha became the Bundela capital — a dense ensemble of palaces (Raja Mahal, Jahangir Mahal), the vast Chaturbhuj Temple, and riverside chhatris where kings are memorialised in stone boats on the Betwa.",
        "Orchha is also a religious curiosity: Rama is worshipped here as a king — the Ram Raja Temple's deity governs the town in a palace, the result of a 16th-century installation story the town still lives by."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Betwa river crossing and hunting grounds on Bundelkhand's edge." },
        { stage: "FORMATION", year: "1501", text: "Rudra Pratap Singh founds the Bundela capital at Orchha." },
        { stage: "PEAK", year: "16th–17th century", text: "Palaces and the Chaturbhuj Temple rise; the Mughal alliance produces Jahangir Mahal." },
        { stage: "TRANSFORMATION", year: "1783", text: "The capital shifts to Tikamgarh; Orchha settles into a temple town." },
        { stage: "TODAY", year: "—", text: "A heritage town of palaces, murals and river cenotaphs on the Bundelkhand circuit." }
      ],
      who: [
        { k: "Dynasty", v: "Bundelas of Orchha" },
        { k: "Notable", v: "Rani Ganeshkunwari (Ram Raja tradition); Bir Singh Deo, r. 1605–1627" },
        { k: "Imperial link", v: "Jahangir's stay commemorated in the Jahangir Mahal" },
        { k: "Faith", v: "Rama worshipped as king — a local theological tradition" }
      ],
      lookCloser: [
        { t: "Chaturbhuj Temple", d: "A cathedral-scale shrine with palace-inspired vaults — temple and fort in one." },
        { t: "Raja Mahal murals", d: "Bundela court painting covering ceilings with processions and mythology." },
        { t: "The fourteen chhatris", d: "Cenotaphs of the Bundela kings standing in the Betwa's shallows." },
        { t: "Jahangir Mahal", d: "A palace built to host an emperor — Bundela-Mughal politics in stone." }
      ],
      thenNow: {
        then: "The seat of a proud minor kingdom negotiating survival between Mughals and Marathas.",
        now: "A slow-heritage destination where the Betwa still reflects royal cenotaphs at dusk."
      },
      unesco: false, plan: { start: "Orchha" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "high" },
        { name: "Madhya Pradesh Tourism", url: "https://www.mptourism.com", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "chanderi", slug: "chanderi", name: "Chanderi",
      image: "assets/heritage/madhya-pradesh/chanderi.jpg",
      tagline: "A weavers' town layered with Malwa sultans, Bundelas and gates that never fell gently.",
      period: "11th–17th century CE", dynasty: "Malwa Sultans, then Bundelas",
      heritageType: "Fort town", classification: "HERITAGE",
      location: "Ashoknagar district", coordinates: [24.707, 78.138],
      tags: ["FORTS", "TEXTILES", "URBAN HERITAGE"],
      facets: ["medieval", "hindu", "islamic", "forts", "architecture", "culture"],
      aliases: ["Chanderi", "Chanderi fort", "Chanderi fabric", "Koshak Mahal Chanderi"],
      searchKeywords: "chanderi fort malwa sultan bundela koshak mahal badal mahal gate handloom weaving ashoknagar",
      why: [
        "Chanderi's fort watches the Malwa–Bundelkhand corridor, and every power that mattered in central India fought for it — Malwa sultans, the Sher Shah era, Mughals and Bundelas. The Koshak Mahal and the town's seven-tier gates still show that layered military history.",
        "Below the fort, the town lives its second history: Chanderi cloth. The fine weaving tradition, sustained by royal patronage, survives today in thousands of looms — heritage you can buy by the metre."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Chandela-era origins on the Malwa frontier; strategic plateau settlement." },
        { stage: "FORMATION", year: "15th century", text: "The Malwa Sultanate fortifies Chanderi; Koshak Mahal attributed to Mahmud Khilji's campaign works." },
        { stage: "PEAK", year: "15th–16th century", text: "A much-fought citadel between Malwa, Delhi and the Rajput-Bundela world." },
        { stage: "TRANSFORMATION", year: "17th century", text: "Bundela control; the 1528 Babur-era siege is remembered in chronicles; town grows around weaving." },
        { stage: "TODAY", year: "—", text: "Handloom economy plus fort-and-baoli heritage circuit; an MP heritage town programme site." }
      ],
      who: [
        { k: "Rulers", v: "Malwa Sultans; Mughals; Bundelas of Datia/Orchha orbit" },
        { k: "Craft", v: "Chanderi weaver communities (Ansari/Koli traditions)" },
        { k: "Notable siege", v: "1528 — recorded in Babur's memoirs" }
      ],
      lookCloser: [
        { t: "Koshak Mahal", d: "A squared palace of arches begun for a sultan — symmetry interrupted by history." },
        { t: "Hawa Paur & Badal Mahal gate", d: "Wind-catching gates of the fort's upper town." },
        { t: "Jama Masjid & madrasa", d: "Malwa-style pointed arches in local sandstone." },
        { t: "The looms", d: "Chanderi's living intangible heritage — silk-cotton fabric with gold checks." }
      ],
      thenNow: {
        then: "A citadel town that controlled the roads between Malwa and the north.",
        now: "A craft town where heritage policy is trying to keep weavers weaving."
      },
      unesco: false, plan: { start: "Chanderi" },
      sources: [
        { name: "Madhya Pradesh Tourism", url: "https://www.mptourism.com", verified: "2026-08", confidence: "high" },
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "bagh-caves", slug: "bagh-caves", name: "Bagh Caves",
      image: "assets/heritage/madhya-pradesh/bagh-caves.jpg",
      tagline: "Buddhist monastic halls whose murals once rivalled Ajanta's.",
      period: "Late 4th–6th century CE", dynasty: "Late Gupta / Vakataka-era patronage",
      heritageType: "Rock-cut viharas", classification: "ARCHAEOLOGICAL",
      location: "Dhar district", coordinates: [22.383, 74.783],
      tags: ["CAVES", "BUDDHISM", "MURALS"],
      facets: ["ancient", "buddhist", "caves", "archaeology", "culture"],
      aliases: ["Bagh Caves", "Bagh caves", "Bagh", "Bagh paintings"],
      searchKeywords: "bagh caves buddhist vihara murals paintings dhar gupta vakataka ajanta comparison madhya pradesh",
      why: [
        "Nine rock-cut viharas were excavated in the hills above the Baghini stream for Buddhist monks. Five survive, and their painted halls — lotus ponds, dancers, the Buddha in teaching poses — were among the finest murals of ancient India, close kin to Ajanta's.",
        "Time was crueler here: fragile shale and water damaged the caves, and in the 1980s the surviving murals were removed for conservation. Fragments and records now carry a painted tradition you can no longer see in place."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Natural shelters above a seasonal stream on the Malwa–Gujarat route." },
        { stage: "FORMATION", year: "late 4th century CE", text: "First viharas cut for Buddhist communities (dating per ASI studies)." },
        { stage: "PEAK", year: "5th–6th century", text: "Mural phase fills the halls — the 'Bagh Tarangini' and Bodhisattva scenes." },
        { stage: "TRANSFORMATION", year: "later centuries", text: "Monastic use fades; geological decay and seepage damage the paintings." },
        { stage: "TODAY", year: "1980s →", text: "Surviving murals transferred to conservation custody; caves protected by ASI." }
      ],
      who: [
        { k: "Community", v: "Buddhist monks (Sangha) of the Dhar region" },
        { k: "Era", v: "Late Gupta/Vakataka-period art traditions" },
        { k: "Conservation", v: "ASI removal of murals in the 1980s" }
      ],
      lookCloser: [
        { t: "The vihara plan", d: "Square monastic halls with cells opening off them — architecture for community life." },
        { t: "Mural ghosts", d: "Traces of the painted programme still readable on recovered fragments." },
        { t: "The stream setting", d: "Water management and solitude — why monks chose this gorge." },
        { t: "Material lesson", d: "Soft stone that made carving easy and survival hard." }
      ],
      thenNow: {
        then: "Painted monasteries on a trade route, hosting monks and merchants' gifts.",
        now: "Quiet excavations in a forested gorge; most of the painting now lives in museum custody."
      },
      unesco: false, plan: { start: "Bagh Caves" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "high" },
        { name: "Madhya Pradesh Tourism", url: "https://www.mptourism.com", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "mandu", slug: "mandu", name: "Mandu",
      image: "assets/heritage/madhya-pradesh/mandu.jpg",
      tagline: "A plateau city of palaces and water — the joyous capital of the Malwa sultans.",
      period: "13th–16th century CE", dynasty: "Malwa Sultanate (with earlier Paramara roots)",
      heritageType: "Fortified city", classification: "ICONIC",
      location: "Dhar district, Vindhya plateau", coordinates: [22.367, 75.417],
      tags: ["PALACES", "ARCHITECTURE", "WATER"],
      facets: ["medieval", "islamic", "palaces", "architecture", "culture"],
      aliases: ["Mandu", "Mandavgad", "Mandu fort", "Shadiabad", "Jahaz Mahal"],
      searchKeywords: "mandu jahaz mahal hindola mahal hoshang shah tomb roopmati baz bahadur mahmud khilji malwa water",
      why: [
        "Mandu is a 20-km plateau fortress-city. Under the Malwa sultans it was renamed Shadiabad — City of Joy — and its architecture shows why: the Jahaz Mahal 'ship palace' between two lakes, the sloping Hindola Mahal, and one of the most sophisticated water systems of any Indian hill fort.",
        "Hoshang Shah's marble tomb is locally credited as an inspiration for the Taj Mahal — a tradition repeated for centuries, though not documented. The Baz Bahadur-Roopmati romance belongs to the same genre: history braided with legend, on a plateau that earns both."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Paramara-era hill settlement with tanks and shrines." },
        { stage: "FORMATION", year: "13th–14th century", text: "Fortified by successive rulers; the Dilawar Khan era begins the sultanate." },
        { stage: "PEAK", year: "1401–1561", text: "Hoshang Shah shifts the capital; Jahaz Mahal, tombs and the water city are built." },
        { stage: "TRANSFORMATION", year: "1561→", text: "Annexation by Gujarat and then the Mughals; Baz Bahadur's defeat ends independence." },
        { stage: "TODAY", year: "—", text: "MP's great plateau monument — palaces, tombs and 60+ water bodies." }
      ],
      who: [
        { k: "Dynasty", v: "Malwa Sultanate (Ghuri and Khilji lines)" },
        { k: "Rulers", v: "Hoshang Shah; Mahmud Khilji I" },
        { k: "Later", v: "Baz Bahadur and the celebrated Roopmati (romanticised in later ballads)" },
        { k: "Tradition", v: "Taj Mahal 'inspiration' claim is a popular legend, not a documented fact" }
      ],
      lookCloser: [
        { t: "Jahaz Mahal", d: "A 110-metre palace that floats between Munj and Kapur tanks in the monsoon." },
        { t: "Water architecture", d: "Wells, baolis, channels and cisterns sustaining 10,000+ residents on a dry plateau." },
        { t: "Hoshang Shah's Tomb", d: "Ashlar marble dome — a step toward Indo-Islamic tomb architecture." },
        { t: "Roopmati Pavilion", d: "The watch-post over the Narmada plain attached to a princess of song." }
      ],
      thenNow: {
        then: "A monsoon capital of lakes, music and ceremony defended by cliffs.",
        now: "A heritage circuit where each monsoon refills the sultans' water design."
      },
      unesco: false, plan: { start: "Mandu" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "high" },
        { name: "Madhya Pradesh Tourism", url: "https://www.mptourism.com", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "sanchi", slug: "sanchi", name: "Sanchi",
      image: "assets/heritage/madhya-pradesh/sanchi.jpg",
      tagline: "The great stupa where Ashoka's Buddhism became architecture.",
      period: "3rd century BCE – 12th century CE", dynasty: "Mauryas, Sungas, Satavahanas, Guptas",
      heritageType: "Buddhist monument complex", classification: "UNESCO",
      location: "Raisen district", coordinates: [23.480, 77.737],
      tags: ["BUDDHISM", "STUPA", "SCULPTURE"],
      facets: ["ancient", "buddhist", "archaeology", "unesco", "architecture", "culture"],
      aliases: ["Sanchi", "Sanchi Stupa", "Great Stupa Sanchi", "Sanci", "Sanchi Tope"],
      searchKeywords: "sanchi stupa ashoka torana gateway buddhist relics sunga satavahana marshall raisen",
      why: [
        "Emperor Ashoka built the original brick stupa at Sanchi in the 3rd century BCE, and possibly stood here himself. Over the next 1,400 years the site grew — stone casing under the Sungas, the four carved torana gateways, monasteries, temples — into a complete history of Indian Buddhism in one place.",
        "Sanchi's gateways carry some of the greatest narrative relief sculpture ever made: Jataka tales, the Buddha's life told through symbols, and crowded scenes of ancient daily life. Rediscovered and restored from the 19th century under Marshall, it is UNESCO-listed and still central to Buddhist pilgrimage."
      ],
      timeline: [
        { stage: "BEFORE", year: "3rd c. BCE", text: "Ashoka orders the brick core and divides relics across the sangha's landscape." },
        { stage: "FORMATION", year: "2nd c. BCE", text: "Sunga-era stone casing and balustrade; the stupa reaches present scale." },
        { stage: "PEAK", year: "1st c. BCE – 1st c. CE", text: "Satavahana-era toranas carved with aniconic Buddha narratives; pilgrims' gifts recorded." },
        { stage: "TRANSFORMATION", year: "4th–12th c. CE", text: "Gupta temples and later monasteries; decline as Buddhism fades in its homeland." },
        { stage: "TODAY", year: "1989 →", text: "UNESCO World Heritage Site; excavated, restored and re-explained to the world." }
      ],
      who: [
        { k: "Founder", v: "Emperor Ashoka, c. 260 BCE" },
        { k: "Patrons", v: "Sungas; Satavahana donors (inscriptions name them); Gupta-era additions" },
        { k: "Discovery", v: "19th-century British officers; John Marshall's 1912–1919 restoration" },
        { k: "Faith", v: "Buddhism — stupa, vihara and temple complex" }
      ],
      lookCloser: [
        { t: "The toranas", d: "Four gateways of stacked Jataka and life-of-Buddha reliefs — read like a storyboard." },
        { t: "Aniconism", d: "The Buddha shown as footprints, tree, wheel and empty throne — never as a figure." },
        { t: "Donor inscriptions", d: "Names of monks, nuns and laypeople, including ivory-carvers of Vidisha." },
        { t: "The Ashoka pillar", d: "Its lion-capital stump still stands by the south gate." }
      ],
      thenNow: {
        then: "The premier Buddhist establishment of central India, living on trade-route gifts.",
        now: "The most complete single-site textbook of early Buddhist art in India."
      },
      unesco: true, plan: { start: "Sanchi" },
      sources: [
        { name: "UNESCO World Heritage Centre — Buddhist Monuments at Sanchi", url: "https://whc.unesco.org/en/list/524", verified: "2026-08", confidence: "verified" },
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" }
      ]
    }
  ]
},

/* -------------------------------------------------- GUJARAT */
{
  id: "gujarat", slug: "gujarat", name: "Gujarat",
  description: "From the Indus Valley to stepwells, fortified cities and ancient temples — a landscape shaped by trade and innovation.",
  tags: ["ANCIENT", "ARCHAEOLOGY", "WATER ARCHITECTURE"],
  heroImage: "assets/states/gujarat.jpg",
  aliases: ["Gujarat", "Gujrat"],
  searchKeywords: "dholavira lothal stepwell rani ki vav adalaj champaner pavagadh polo indus harappan patan",
  places: [
    {
      id: "dholavira", slug: "dholavira", name: "Dholavira",
      image: "assets/heritage/gujarat/dholavira.jpg",
      tagline: "A Harappan city engineered for water in a salt desert.",
      period: "3rd–2nd millennium BCE", dynasty: "Indus Valley Civilisation",
      heritageType: "Archaeological site", classification: "UNESCO",
      location: "Kutch district, Khadir island", coordinates: [23.889, 70.213],
      tags: ["ARCHAEOLOGY", "HARAPPAN", "URBAN PLANNING"],
      facets: ["ancient", "archaeology", "unesco", "architecture", "culture"],
      aliases: ["Dholavira", "Dholaveera", "Kotada Dholavira", "Kotada"],
      searchKeywords: "dholavira harappan indus water reservoirs signboard kutch khadir urban planning unesco",
      why: [
        "Dholavira is one of the great cities of the Indus Valley Civilisation — and the most dramatic site: a planned settlement on Khadir island in the Rann of Kutch, laid out in citadel, middle town and lower town with precise proportions.",
        "Its fame is water: massive rock-cut reservoirs and channels harvested every drop in a near-desert, letting thousands live where modern visitors struggle. The famous 'signboard' — an inscription of large Indus-script symbols — remains undeciphered, one of archaeology's standing challenges."
      ],
      timeline: [
        { stage: "BEFORE", year: "c. 3000 BCE", text: "Early village settlement on the island rise." },
        { stage: "FORMATION", year: "c. 2650 BCE", text: "The city takes its planned form with fortifications and divisions." },
        { stage: "PEAK", year: "c. 2500–1900 BCE", text: "Mature Harappan phase: reservoirs, ceremony ground, the signboard inscription." },
        { stage: "TRANSFORMATION", year: "c. 1900–1500 BCE", text: "Gradual decline and a late, impoverished reoccupation — the civilisation's fade visible in layers." },
        { stage: "TODAY", year: "2021 →", text: "UNESCO World Heritage Site; excavated by ASI from 1989 under R. S. Bisht." }
      ],
      who: [
        { k: "Civilisation", v: "Indus Valley (Harappan)" },
        { k: "Excavation", v: "ASI, directed by R. S. Bisht from 1989" },
        { k: "Script", v: "Indus script — undeciphered; the signboard is unique in scale" }
      ],
      lookCloser: [
        { t: "The reservoirs", d: "Sixteen water structures cut into rock, connected by drains — prehistoric water engineering." },
        { t: "The signboard", d: "Ten large symbols mounted above the gate — literacy, governance, or both." },
        { t: "Three-part city", d: "Citadel, middle and lower town — a strict social geometry." },
        { t: "Bead workshop", d: "Carnelian working — Dholavira as a manufacturing and trade node." }
      ],
      thenNow: {
        then: "A trading city of perhaps 15–20,000 people mastering a desert with geometry.",
        now: "White salt flats, excavated streets and a site museum telling a 4,500-year story."
      },
      unesco: true, plan: { start: "Dholavira" },
      sources: [
        { name: "UNESCO World Heritage Centre — Dholavira", url: "https://whc.unesco.org/en/list/1645", verified: "2026-08", confidence: "verified" },
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" }
      ]
    },
    {
      id: "lothal", slug: "lothal", name: "Lothal",
      image: "assets/heritage/gujarat/lothal.jpg",
      tagline: "A Harappan port with the ancient world's oldest known dockyard.",
      period: "3rd–2nd millennium BCE", dynasty: "Indus Valley Civilisation",
      heritageType: "Archaeological site", classification: "ARCHAEOLOGICAL",
      location: "Ahmedabad district, near Saragwala", coordinates: [22.524, 72.244],
      tags: ["ARCHAEOLOGY", "TRADE", "HARAPPAN"],
      facets: ["ancient", "archaeology", "culture"],
      aliases: ["Lothal", "Lothal dockyard", "Lothal archaeological site"],
      searchKeywords: "lothal harappan port dockyard bead factory fire altars indus trade s r rao ahmedabad bhal",
      why: [
        "Excavated from 1954 by S. R. Rao, Lothal was a Harappan town built around trade: a large brick basin interpreted by the excavator as a dockyard connected to tidal channels, workshops for carnelian beads, and a warehouse for export goods.",
        "Finds here — a bead factory, seals, weights, even a suspected 'joint burial' — sketch a mercantile society plugged into a trade network that reached Mesopotamia. The dockyard interpretation is debated by some scholars; the site's commercial character is not."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Sabarmati basin villages; rich agricultural and pastoral base." },
        { stage: "FORMATION", year: "c. 2400 BCE", text: "Planned Harappan town founded with the dock basin and warehouse." },
        { stage: "PEAK", year: "c. 2400–1900 BCE", text: "Bead production and river-sea trade at full scale." },
        { stage: "TRANSFORMATION", year: "c. 1900 BCE →", text: "Floods and channel shifts; late Harappan occupation contracts." },
        { stage: "TODAY", year: "—", text: "ASI site with an on-site museum displaying the bead and seal assemblages." }
      ],
      who: [
        { k: "Civilisation", v: "Indus Valley (Harappan)" },
        { k: "Excavation", v: "S. R. Rao, ASI, from 1954" },
        { k: "Trade links", v: "Harappan–Mesopotamian exchange documented in cuneiform records of Meluhha" }
      ],
      lookCloser: [
        { t: "The dock basin", d: "A trapezoid brick enclosure — dockyard per the excavator, wharf per some critics." },
        { t: "Bead factory", d: "Carnelian and shell working — Lothal's export engine." },
        { t: "The warehouse", d: "A podium platform where cargo was stacked and taxed." },
        { t: "Fire altars", d: "Evidence of ritual practice in the acropolis area." }
      ],
      thenNow: {
        then: "A manufacturing port shipping beads and ivory down the Sabarmati to the sea.",
        now: "An excavated town and museum 80 km from Ahmedabad, calm under guinea grass."
      },
      unesco: false, plan: { start: "Lothal" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "high" },
        { name: "Gujarat Tourism", url: "https://www.gujarattourism.com", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "champaner-pavagadh", slug: "champaner-pavagadh", name: "Champaner–Pavagadh",
      image: "assets/heritage/gujarat/champaner-pavagadh.jpg",
      tagline: "A complete pre-Mughal Islamic city preserved at the foot of a sacred hill.",
      period: "8th–16th century CE", dynasty: "Chavda/Rajput origins; Gujarat Sultanate",
      heritageType: "Fortified city & pilgrimage hill", classification: "UNESCO",
      location: "Panchmahal district, near Vadodara", coordinates: [22.486, 73.537],
      tags: ["ARCHITECTURE", "FORTS", "SACRED LANDSCAPE"],
      facets: ["medieval", "hindu", "islamic", "forts", "architecture", "unesco", "culture"],
      aliases: ["Champaner", "Pavagadh", "Champaner Pavagadh", "Muhammadabad", "Jami Masjid Champaner"],
      searchKeywords: "champaner pavagadh mahmud begada jami masjid gujarat sultanate kalika mata unesco panchmahal",
      why: [
        "Sultan Mahmud Begada conquered the Rajput hill-fort of Pavagadh in 1484 and rebuilt Champaner below it as his capital — a rare complete pre-Mughal city: mosques, gates, palaces, water works and streets, largely unplundered because the capital moved away within decades.",
        "Above it rises the same hill the Rajputs held sacred, crowned by the Kalika Mata temple. Hindu pilgrimage and sultanate city share one landscape — the UNESCO listing covers both stories."
      ],
      timeline: [
        { stage: "BEFORE", year: "8th–14th century", text: "Chavda and later Rajput chiefs hold the Pavagadh heights; the goddess temple grows." },
        { stage: "FORMATION", year: "1484", text: "Mahmud Begada takes the fort after a long siege; construction of the new capital begins." },
        { stage: "PEAK", year: "c. 1490–1535", text: "Champaner flourishes — Jami Masjid, royal precincts and gardens." },
        { stage: "TRANSFORMATION", year: "1535 →", text: "Mughal absorption shifts power to Ahmedabad; the city is deserted and swallowed by forest." },
        { stage: "TODAY", year: "2004 →", text: "UNESCO World Heritage Site — 114 protected monuments on hill and plain." }
      ],
      who: [
        { k: "Dynasties", v: "Chavda & Rajput chiefs; Gujarat Sultanate" },
        { k: "Builder-king", v: "Mahmud Begada, r. 1458–1511" },
        { k: "Faith", v: "Kalika Mata pilgrimage (Shakti) continuing beside mosque architecture" }
      ],
      lookCloser: [
        { t: "Jami Masjid", d: "A fusion masterpiece — minarets, domes and carving borrowing from temple workshops." },
        { t: "The hill ascent", d: "A paved pilgrimage path from the city gates to the goddess — ritual infrastructure." },
        { t: "Water works", d: "Stepwells and tanks serving the lower city." },
        { t: "Helical stepwell", d: "A spiral-railed baoli unlike almost any other in India." }
      ],
      thenNow: {
        then: "A short-lived sultanate capital beneath a fortress the sultans couldn't refuse.",
        now: "Archaeological park and living goddess pilgrimage — dual heritage, one hill."
      },
      unesco: true, plan: { start: "Champaner" },
      sources: [
        { name: "UNESCO World Heritage Centre — Champaner-Pavagadh", url: "https://whc.unesco.org/en/list/1101", verified: "2026-08", confidence: "verified" },
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" }
      ]
    },
    {
      id: "rani-ki-vav", slug: "rani-ki-vav", name: "Rani ki Vav",
      image: "assets/heritage/gujarat/rani-ki-vav.jpg",
      tagline: "A seven-storey inverted temple of water, drowned for centuries.",
      period: "11th century CE", dynasty: "Chaulukya (Solanki) dynasty",
      heritageType: "Stepwell", classification: "UNESCO",
      location: "Patan", coordinates: [23.853, 72.131],
      tags: ["STEPWELLS", "SCULPTURE", "WATER"],
      facets: ["medieval", "hindu", "architecture", "unesco", "culture"],
      aliases: ["Rani ki Vav", "Rani ki Bav", "Raniki vav", "Rani vav Patan", "Queen's stepwell", "Rani ki Vav Patan"],
      searchKeywords: "rani ki vav stepwell patan udayamati bhima solanki dasavatara unesco seven storeys saraswati",
      why: [
        "Built in the 11th century, traditionally attributed to Queen Udayamati in memory of her husband Bhima I, Rani ki Vav is a stepwell conceived as an inverted temple: seven storeys of carved galleries descending to the water level, with over 500 principal sculptures dominated by Vishnu's ten avatars.",
        "The Saraswati river flooded and buried the well for centuries — which preserved it. Excavated by the ASI in the 1980s, it is today the benchmark monument of Indian water architecture and a UNESCO World Heritage Site."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Saraswati-channel agriculture around the Solanki capital of Patan (Anhilwara)." },
        { stage: "FORMATION", year: "c. 1063", text: "Udayamati commissions the vav — queens leading temple-scale patronage." },
        { stage: "PEAK", year: "11th–13th century", text: "A functioning well and shrine used by the capital's population." },
        { stage: "TRANSFORMATION", year: "later centuries", text: "Silted by river flooding; disappears from view and memory." },
        { stage: "TODAY", year: "1980s →", text: "Excavated, conserved by ASI; UNESCO listed in 2014." }
      ],
      who: [
        { k: "Dynasty", v: "Chaulukya (Solanki) of Gujarat" },
        { k: "Patron", v: "Queen Udayamati, widow of Bhima I (attribution per ASI/UNESCO)" },
        { k: "Faith", v: "Vaishnava — Dasavatara programme with sacred water (Puranic imagery)" }
      ],
      lookCloser: [
        { t: "The apsaras", d: "Nayikas at mirror, at toilet, scolding — gallery after gallery of grace notes." },
        { t: "Dasavatara panels", d: "Vishnu's avatars in depth — the well as theology descending to water." },
        { t: "The water shrine", d: "At the deepest level, a subterranean garbhagriya where water itself is deity." },
        { t: "Engineering", d: "Stepped retention walls and seepage design keeping the structure stable for a millennium." }
      ],
      thenNow: {
        then: "A queen's memorial and a working reservoir for one of India's richest capitals.",
        now: "The definitive stepwell — excavated from the river's memory into world heritage."
      },
      unesco: true, plan: { start: "Patan" },
      sources: [
        { name: "UNESCO World Heritage Centre — Rani-ki-Vav", url: "https://whc.unesco.org/en/list/1052", verified: "2026-08", confidence: "verified" },
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "verified" }
      ]
    },
    {
      id: "adalaj-stepwell", slug: "adalaj-stepwell", name: "Adalaj Stepwell",
      image: "assets/heritage/gujarat/adalaj-stepwell.jpg",
      tagline: "Five storeys of carved air below the Gujarati plain.",
      period: "15th century CE (1499)", dynasty: "Vaghela-era commission, completed under Mahmud Begada",
      heritageType: "Stepwell", classification: "HERITAGE",
      location: "Adalaj village, Gandhinagar district", coordinates: [23.166, 72.581],
      tags: ["STEPWELLS", "WATER", "CARVING"],
      facets: ["medieval", "hindu", "islamic", "architecture", "culture"],
      aliases: ["Adalaj", "Adalaj Stepwell", "Adalaj ni Vav", "Adalaj vav", "Rani ni Vav Adalaj"],
      searchKeywords: "adalaj stepwell vav 1499 vaghela mahmud begada roopba legend five storeys gandhinagar",
      why: [
        "Adalaj descends five storeys in the classic Gujarati octagonal plan, its walls dense with gods, dancers and everyday scenes. Work begun in 1499 under Rana Veer Singh of the Vaghela line was completed under Sultan Mahmud Begada after his conquest — which is why Hindu and Islamic ornament share the same shaft.",
        "A well-known legend of Rani Roopba — the widow who completed her husband's well and then ended her life — is folklore told with feeling at the site; the documented history is the architecture itself, signed by both cultures."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Seasonal water needs of villages on the Sabarmati's dry margin." },
        { stage: "FORMATION", year: "1499", text: "Rana Veer Singh begins the vav; interrupted by war." },
        { stage: "PEAK", year: "early 16th century", text: "Completed under Mahmud Begada — dual ornament, working well." },
        { stage: "TRANSFORMATION", year: "—", text: "Village use continues at reduced scale as water tables fall." },
        { stage: "TODAY", year: "—", text: "ASI-protected monument 18 km from Ahmedabad; a standard heritage stop." }
      ],
      who: [
        { k: "Commissioner", v: "Rana Veer Singh (Vaghela line)" },
        { k: "Completed under", v: "Sultan Mahmud Begada" },
        { k: "Folklore", v: "The Rani Roopba legend — tradition, not record" }
      ],
      lookCloser: [
        { t: "The octagonal well", d: "A five-storey kunda with a chhatri at each landing." },
        { t: "Fusion ornament", d: "Floral Islamic filigree beside Hindu deities on single panels." },
        { t: "Air-conditioning", d: "Ventilation slots that made the well a summer gathering place." },
        { t: "The Ami khumb", d: "Pot-of-immortality carvings at water level — promise of endless water." }
      ],
      thenNow: {
        then: "Village reservoir, caravanserai stop and summer pavilion in one.",
        now: "A protected stepwell a short drive from Ahmedabad's airport."
      },
      unesco: false, plan: { start: "Adalaj" },
      sources: [
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "high" },
        { name: "Gujarat Tourism", url: "https://www.gujarattourism.com", verified: "2026-08", confidence: "high" }
      ]
    },
    {
      id: "polo-forest", slug: "polo-forest", name: "Polo Forest / Ancient Polo",
      image: "assets/heritage/gujarat/polo-forest.jpg",
      tagline: "A hidden valley of ruined Shiva and Jain temples inside the Aravalli forest.",
      period: "10th–15th century CE", dynasty: "Idar-era Rajput rulers (with earlier fragments)",
      heritageType: "Heritage landscape", classification: "LESSER-KNOWN",
      location: "Vijaynagar taluka, Sabarkantha", coordinates: [24.050, 73.450],
      tags: ["TEMPLES", "ARCHAEOLOGY", "NATURE"],
      facets: ["medieval", "hindu", "jain", "temples", "archaeology", "culture"],
      aliases: ["Polo Forest", "Polo", "Ancient Polo", "Vijaynagar Polo", "Polo forest temples"],
      searchKeywords: "polo forest ancient polo temples harnav vijaynagar sabarkantha shiv temple jain ruins hidden",
      why: [
        "The Harnav river cuts a gated valley through the Aravallis — 'pol' means gate — and inside it stand ruined medieval temples: the 15th-century Sharneshwar Shiva temple, Jain shrines, and scattered architectural members reclaimed by forest.",
        "Polo should be read as a heritage landscape rather than a picnic spot: a sequence of sacred sites tied to the medieval Idar kingdom, now inside a forest that has itself become rare Gujarat habitat. It is one of the state's genuinely lesser-known heritage areas — no marketing inflation needed."
      ],
      timeline: [
        { stage: "BEFORE", year: "—", text: "Forest corridor of the Aravallis along the Harnav." },
        { stage: "FORMATION", year: "10th–14th century", text: "Temples and Jain establishments arise under Idar's rulers." },
        { stage: "PEAK", year: "15th century", text: "Sharneshwar and nearby shrines completed as the valley's sacred core." },
        { stage: "TRANSFORMATION", year: "16th century →", text: "Political shifts empty the valley; forest takes the courtyards." },
        { stage: "TODAY", year: "—", text: "A forest-recreation area dotted with ASI-listed ruins — conservation still catching up." }
      ],
      who: [
        { k: "Rulers", v: "Idar Rajput line (medieval)" },
        { k: "Faiths", v: "Shaiva Hindu and Jain communities" },
        { k: "Setting", v: "Harnav valley, Aravalli dry-deciduous forest" }
      ],
      lookCloser: [
        { t: "Sharneshwar Temple", d: "A 15th-century Shiva shrine with a mandapa of worn columns." },
        { t: "Jain remains", d: "Small ruined shrines and icon fragments scattered through the trees." },
        { t: "The valley gate", d: "The cliff-gap 'pol' that named the place — approach matters." },
        { t: "Forest ecology", d: "Leopard-sloth-bird habitat that is part of the heritage experience." }
      ],
      thenNow: {
        then: "A protected sacred valley on a trade route through the hills.",
        now: "Weekend forest visits among unexcavated potential — heritage half-awake."
      },
      unesco: false, plan: { start: "Polo Forest" },
      sources: [
        { name: "Gujarat Tourism", url: "https://www.gujarattourism.com", verified: "2026-08", confidence: "medium" },
        { name: "Archaeological Survey of India", url: "https://asi.nic.in", verified: "2026-08", confidence: "medium" }
      ]
    }
  ]
}
];
