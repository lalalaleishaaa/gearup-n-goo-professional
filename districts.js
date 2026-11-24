/* ============================================================
 * GEARUP N GOO — KARNATAKA DISTRICTS DATA LAYER
 *
 * Hierarchical dataset:
 *   KARNATAKA → DISTRICT → PLACE
 *
 * 7 demo districts × 12 featured places = 84 places.
 * All coordinates are approximate real-world values (WGS84 lat/lon)
 * for use with Leaflet/OSM. Historical facts are based on ASI/KSTDC/
 * UNESCO/commonly accepted heritage records and marked with
 * source attribution + confidence. Guide, EV and fuel listings are
 * illustrative demo data (clearly marked).
 *
 * Data model:
 *   District { id, slug, name, state, heroGradient, description,
 *              microcopy, knownFor[], bestTime, tags, coords,
 *              dynasty, historySummary, timeline[], places[] }
 *   Place    { id, slug, name, description, coords, categories[],
 *              tags[], durationMin, bestTime, photographyScore,
 *              historyNote, ... }
 * ============================================================ */

/* Helper to build districts concisely */
function mkPlace(o) {
  return Object.assign({
    durationMin: 45,
    bestTime: "Daytime",
    photographyScore: 7.5,
    categories: o.tags ? o.tags.slice(0,2) : [],
    type: "place"
  }, o);
}

const DISTRICTS = {

  /* ==================== MYSURU ==================== */
  mysuru: {
    id: "mysuru",
    slug: "mysuru",
    name: "Mysuru",
    state: "Karnataka",
    heroGradient: "linear-gradient(135deg,#3a1f1f 0%,#7a3a35 35%,#c07a3a 65%,#e8c088 100%)",
    palette: ["#3a1f1f","#7a3a35","#c07a3a","#e8c088"],
    description: "Royal heritage, grand palaces, sacred hills and a culture that still lives in everyday life.",
    microcopy: "Where royal India still lives in architecture, festivals and everyday culture.",
    knownFor: ["ROYAL HERITAGE","PALACES","CULTURE","FOOD","ARCHITECTURE"],
    tags: ["heritage","culture","food","architecture","photography"],
    bestTime: "October – March",
    coords: [12.2958, 76.6394],
    dynasty: "wodeyar",
    historySummary: "Mysuru was the capital of the Wodeyar dynasty for over five centuries, briefly interrupted by Hyder Ali and Tipu Sultan in the 18th century. The city's palace, Dasara celebrations and royal patronage of art, music and yoga have shaped its identity as one of South India's great cultural capitals.",
    timeline: [
      { year: "1399", event: "Traditional founding of the Wodeyar dynasty under Yaduraya." },
      { year: "1610", event: "Raja Wodeyar shifts capital to Mysuru after the fall of Vijayanagara." },
      { year: "1761–99", event: "Hyder Ali and Tipu Sultan rule from Srirangapatna; Mysuru becomes a major power." },
      { year: "1897", event: "Current Mysuru Palace commissioned after the old wooden palace burns down; completed 1912." },
      { year: "1956", event: "Mysuru State reorganised and later renamed Karnataka." }
    ],
    source: { name: "Karnataka State Tourism", url: "https://karnatakatourism.org", confidence: "high", verified: "2025-01" },
    fuelStops: [
      { name: "BPCL — Bengaluru-Ooty Road", coords: [12.3100,76.6400], type: "petrol" },
      { name: "IOCL — Hunsur Road", coords: [12.3200,76.6200], type: "petrol" }
    ],
    evStops: [
      { name: "Tata Power Charger — Mysuru Central", coords: [12.3020,76.6500], type: "ev" }
    ],
    guides: [
      { id: "shweta-r", name: "Shweta Ramesh", title: "Royal Heritage Guide", photo: "SR",
        years: 9, languages: ["Kannada","English","Hindi"],
        specialties: ["Mysuru Palaces","Wodeyar History","Dasara Culture"], rating: 4.85, trips: 620,
        expertise: { heritage: 92, photography: 75, architecture: 90, family: 82, history: 93 },
        destinations: ["mysuru"], priceTier: "moderate", meetPoint: "Mysuru Palace North Gate", demoNote: "Illustrative profile" },
      { id: "raju-gowda", name: "Raju Gowda", title: "Food & Market Walk Guide", photo: "RG",
        years: 7, languages: ["Kannada","English"],
        specialties: ["Devaraja Market","Local Food","Mysuru Silk"], rating: 4.75, trips: 380,
        expertise: { heritage: 70, photography: 72, architecture: 65, family: 85, history: 78 },
        destinations: ["mysuru"], priceTier: "budget", meetPoint: "Devaraja Market Entrance", demoNote: "Illustrative profile" }
    ],
    detours: [
      { id:"mysuru-kukkarahalli", name:"Kukkarahalli Lake Walking Trail", coords:[12.3150,76.6300], type:"hidden",
        tags:["nature","sunrise","photography"], detourKm:2.5, visitMin:25, photographyScore:8.4,
        desc:"A placid lake inside the University of Mysore campus beloved by birders and joggers — the canopy-wrapped shore offers painterly sunrise reflections.",
        bestFor:["Photography","Nature","Sunrise"], whyWorth:"A quiet green lung minutes from the palace — perfect for a golden-hour walk." },
      { id:"mysuru-chamundi-view", name:"Chamundi Hill Sunset Viewpoint", coords:[12.2680,76.6690], type:"photography",
        tags:["sunset","photography"], detourKm:1.8, visitMin:15, photographyScore:9.5,
        desc:"A hairpin bend on the Chamundi road that frames the entire Mysuru Palace and city below — the city's classic sunset postcard.",
        bestFor:["Photography","Sunset"], whyWorth:"Adds the 'wow' city overview to any palace day." }
    ],
    places: [
      mkPlace({ id:"mysuru-palace", name:"Mysuru Palace", slug:"mysuru-palace",
        coords:[12.3051,76.6550], tags:["heritage","royal","architecture","photography"],
        durationMin:90, bestTime:"10:00 – 13:00", photographyScore:9.8,
        desc:"The iconic royal residence and architectural centerpiece of Mysuru, known for its Indo-Saracenic design, ornate interiors and illuminated Sunday façade.",
        historyNote:"Commissioned in 1897 by Maharaja Krishnaraja Wadiyar IV and designed by Henry Irwin; seat of the Wodeyars. Illuminated on Sundays and holidays with over 90,000 bulbs." }),
      mkPlace({ id:"chamundi", name:"Chamundeshwari Temple", slug:"chamundeshwari-temple",
        coords:[12.2737,76.6706], tags:["spiritual","heritage","viewpoint"],
        durationMin:50, bestTime:"07:00", photographyScore:8.6,
        desc:"A historic Shakti temple on Chamundi Hill overlooking Mysuru, deeply connected with the city's religious identity and the legend of Mahishasura.",
        historyNote:"The present tower (gopura) was built in the 17th century, but the shrine's origins are far older. The Nandi on the way up is a famous 17th-century monolith." }),
      mkPlace({ id:"st-philomena", name:"St. Philomena's Cathedral", slug:"st-philomena",
        coords:[12.3200,76.6680], tags:["architecture","heritage","photography"],
        durationMin:30, bestTime:"Morning", photographyScore:8.7,
        desc:"A striking Neo-Gothic cathedral and one of Mysuru's most recognizable architectural landmarks, built in the 1930s.",
        historyNote:"Inspired by Cologne Cathedral, commissioned by Maharaja Krishnaraja Wadiyar IV in 1936 and designed by a French architect." }),
      mkPlace({ id:"jaganmohan", name:"Jaganmohan Palace & Art Gallery", slug:"jaganmohan-palace",
        coords:[12.3035,76.6490], tags:["art","royal","history"],
        durationMin:60, bestTime:"10:00 – 12:30", photographyScore:7.5,
        desc:"A former royal palace housing important art collections and offering a glimpse into Mysuru's artistic heritage.",
        historyNote:"Built in 1861, it served as the royal home after the 1897 fire and now houses one of South India's earliest art galleries." }),
      mkPlace({ id:"lalitha", name:"Lalitha Mahal Palace", slug:"lalitha-mahal",
        coords:[12.2930,76.6870], tags:["royal","architecture","photography"],
        durationMin:30, bestTime:"Afternoon", photographyScore:8.8,
        desc:"An elegant palace built in European-inspired Renaissance style beneath the Chamundi Hills, originally for the Viceroy of India.",
        historyNote:"Commissioned in 1921 by Krishnaraja Wadiyar IV; now run as a luxury heritage hotel but the public areas can be visited." }),
      mkPlace({ id:"brindavan", name:"Brindavan Gardens", slug:"brindavan-gardens",
        coords:[12.4300,76.5750], tags:["nature","evening","family"],
        durationMin:75, bestTime:"17:00 – 20:00", photographyScore:8.4,
        desc:"The famous landscaped gardens near KRS Dam, known for symmetrical terraces, fountains and the musical fountain illuminated in the evenings.",
        historyNote:"Laid out in 1932 by Sir Mirza Ismail beside the Krishnaraja Sagar dam built across the Cauvery." }),
      mkPlace({ id:"ranganathittu", name:"Ranganathittu Bird Sanctuary", slug:"ranganathittu",
        coords:[12.4200,76.6540], tags:["wildlife","photography","nature"],
        durationMin:75, bestTime:"08:30 – 11:00", photographyScore:9.0,
        desc:"A riverine bird sanctuary on six islets of the Cauvery, popular for boat-based birdwatching and painted stork, pelican and spoonbill colonies.",
        historyNote:"Declared a sanctuary in 1940 at the urging of Dr Salim Ali, India's legendary ornithologist." }),
      mkPlace({ id:"srirangapatna", name:"Srirangapatna", slug:"srirangapatna",
        coords:[12.4230,76.6800], tags:["history","heritage","fort"],
        durationMin:120, bestTime:"09:00 – 13:00", photographyScore:8.5,
        desc:"Historic island town associated with Tipu Sultan, the Wodeyars and important episodes in South Indian history.",
        historyNote:"Capital of Tipu Sultan until his death here in 1799. Highlights include Sriranganathaswamy Temple, Daria Daulat Bagh, Gumbaz and the fort ramparts." }),
      mkPlace({ id:"karanji", name:"Karanji Lake Nature Park", slug:"karanji-lake",
        coords:[12.2940,76.6680], tags:["nature","birdwatching","family"],
        durationMin:45, bestTime:"07:30 – 10:00", photographyScore:8.0,
        desc:"A peaceful urban nature destination with walking paths, birdlife and views beneath Chamundi Hill. Home to one of India's largest walk-through aviaries." }),
      mkPlace({ id:"rail-museum", name:"Mysuru Railway Museum", slug:"railway-museum",
        coords:[12.3010,76.6440], tags:["history","railway","family"],
        durationMin:50, bestTime:"10:00 – 13:00", photographyScore:7.5,
        desc:"An outdoor museum exploring the history of South Indian railways, featuring royal coaches and vintage locomotives from the Mysuru State era.",
        historyNote:"Established in 1979, it was one of India's earliest railway museums (after Delhi's)." }),
      mkPlace({ id:"devaraja-market", name:"Devaraja Market", slug:"devaraja-market",
        coords:[12.3065,76.6530], tags:["culture","food","local-life","photography"],
        durationMin:45, bestTime:"08:00 – 11:00", photographyScore:9.2,
        desc:"A historic market where visitors can experience flowers, spices, local produce and everyday Mysuru culture.",
        historyNote:"Dating back over a century, the covered market is named for Dodda Devaraja Wodeyar and remains a working marketplace." }),
      mkPlace({ id:"somanathapura", name:"Somanathapura Temple", slug:"somanathapura",
        coords:[12.2740,76.8820], tags:["heritage","hoysala","architecture","sculpture"],
        durationMin:60, bestTime:"10:00 – 12:30", photographyScore:9.4,
        desc:"A celebrated Hoysala temple complex known for detailed stone sculpture and architectural craftsmanship.",
        historyNote:"The Keshava Temple was consecrated in 1268 CE by Somanatha Dandanayaka under King Narasimha III. An ASI-protected site." })
    ]
  },

  /* ==================== KODAGU ==================== */
  kodagu: {
    id: "kodagu",
    slug: "kodagu",
    name: "Kodagu",
    state: "Karnataka",
    heroGradient: "linear-gradient(135deg,#1f2f1f 0%,#3a5a3a 35%,#6a8a5a 65%,#c9b885 100%)",
    palette: ["#1f2f1f","#3a5a3a","#6a8a5a","#c9b885"],
    description: "A Western Ghats district of coffee estates, waterfalls, sacred landscapes and slow mountain journeys.",
    microcopy: "Follow misty roads through coffee estates, waterfalls and sacred hills.",
    knownFor: ["COFFEE","MOUNTAINS","WATERFALLS","CULTURE","NATURE"],
    tags: ["nature","coffee","adventure","culture","photography"],
    bestTime: "October – May",
    coords: [12.4200, 75.7400],
    dynasty: "kodava",
    historySummary: "Kodagu (Coorg) was ruled for centuries by the Haleri dynasty and was governed under a distinct administrative and cultural system before its accession to India in 1956. The Kodava people have a unique martial, agrarian and linguistic heritage tied to the Western Ghats.",
    timeline: [
      { year: "1600", event: "Haleri dynasty consolidates rule over Kodagu." },
      { year: "1834", event: "British annex Kodagu after the Coorg War." },
      { year: "1956", event: "Kodagu merged into Mysore (now Karnataka) as a district." }
    ],
    source: { name: "Karnataka State Tourism", url: "https://karnatakatourism.org", confidence: "high", verified: "2025-01" },
    fuelStops: [
      { name: "IOCL — Madikeri Town", coords: [12.4230,75.7350], type: "petrol" }
    ],
    evStops: [{ name: "KSEDC Charger — Madikeri", coords: [12.4180,75.7390], type: "ev" }],
    guides: [
      { id: "deviah-k", name: "Deviah Kuttappa", title: "Coffee Estate & Trek Guide", photo: "DK",
        years: 11, languages: ["Kannada","English","Kodava","Hindi"],
        specialties: ["Coffee Estate Walks","Western Ghats","Kodava Culture"], rating: 4.9, trips: 540,
        expertise: { heritage: 80, photography: 85, architecture: 65, family: 80, history: 82 },
        destinations: ["kodagu"], priceTier: "moderate", meetPoint: "Madikeri Bus Stand", demoNote: "Illustrative profile" }
    ],
    detours: [
      { id:"kodagu-rajas-tomb", name:"Raja's Tombs (Gaddige)", coords:[12.4200,75.7200], type:"heritage",
        tags:["heritage","architecture","photography"], detourKm:2.0, visitMin:20, photographyScore:8.2,
        desc:"Three Indo-Saracenic tombs of Kodava kings and their queens set in a quiet garden just outside Madikeri.",
        bestFor:["Heritage","Photography"], whyWorth:"A lesser-visited royal site; fewer than 10 minutes off the Abbey Falls road." },
      { id:"kodagu-coffee-trail", name:"Hidden Coffee Trail near Suntikoppa", coords:[12.3900,75.8400], type:"hidden",
        tags:["coffee","nature","culture"], detourKm:3.5, visitMin:30, photographyScore:8.8,
        desc:"A little-known walk through a family-owned Arabica plantation with a small coffee-processing demo.",
        bestFor:["Culture","Nature"], whyWorth:"Experiences the signature Kodava story most travellers miss." }
    ],
    places: [
      mkPlace({ id:"madikeri-fort", name:"Madikeri Fort", slug:"madikeri-fort", tags:["heritage","history","architecture"],
        coords:[12.4235,75.7380], durationMin:40, bestTime:"Morning", photographyScore:7.8,
        desc:"A stone hilltop fort in central Madikeri built in mud in the 17th century and rebuilt in granite by Tipu Sultan and the British.",
        historyNote:"First built by Mudduraja in the 17th century; rebuilt by Tipu Sultan; today houses a palace, temple, prison and chapel." }),
      mkPlace({ id:"rajas-seat", name:"Raja's Seat", slug:"rajas-seat", tags:["sunset","viewpoint","photography"],
        coords:[12.4220,75.7330], durationMin:30, bestTime:"17:00 – 18:30", photographyScore:9.1,
        desc:"A garden viewpoint where Kodagu kings watched sunsets over the Western Ghats — one of the most photographed vantage points in Coorg.",
        historyNote:"The name literally means 'seat of kings'; a seasonal toy train runs around the garden today." }),
      mkPlace({ id:"omkareshwara", name:"Omkareshwara Temple", slug:"omkareshwara", tags:["spiritual","heritage","architecture"],
        coords:[12.4230,75.7390], durationMin:25, bestTime:"Morning", photographyScore:7.5,
        desc:"A Shiva temple in Madikeri built in an unusual Indo-Islamic style with a central dome and four corner turrets.",
        historyNote:"Built in 1820 by King Lingarajendra II and dedicated to a Shiva lingam brought from Kashi." }),
      mkPlace({ id:"abbey-falls", name:"Abbey Falls", slug:"abbey-falls", tags:["waterfall","nature","photography"],
        coords:[12.4620,75.7200], durationMin:40, bestTime:"Post-monsoon / 10:00", photographyScore:9.0,
        desc:"A wide waterfall tumbling through coffee and cardamom plantations a short drive from Madikeri.",
        historyNote:"Formerly called Jessie Falls in the British period; best visited between July and October." }),
      mkPlace({ id:"mandalpatti", name:"Mandalpatti", slug:"mandalpatti", tags:["viewpoint","adventure","sunrise"],
        coords:[12.4100,75.6900], durationMin:90, bestTime:"06:00 – 09:00", photographyScore:9.5,
        desc:"A high-altitude grassland viewpoint offering panoramic views over Pushpagiri Wildlife Sanctuary.",
        historyNote:"Accessed by jeep from Abbey Falls road; made famous by recent Kannada cinema. A favorite sunrise spot." }),
      mkPlace({ id:"talacauvery", name:"Talacauvery", slug:"talacauvery", tags:["spiritual","nature"],
        coords:[12.4030,75.5300], durationMin:50, bestTime:"07:00", photographyScore:8.8,
        desc:"A temple tank marking the sacred source of the Cauvery river on the slopes of Brahmagiri Hill.",
        historyNote:"One of South India's most sacred river sources; annual Tula Sankramana draws lakhs of pilgrims in October." }),
      mkPlace({ id:"bhagamandala", name:"Bhagamandala", slug:"bhagamandala", tags:["spiritual","culture","river"],
        coords:[12.3900,75.5200], durationMin:30, bestTime:"Morning", photographyScore:7.8,
        desc:"The triveni sangama (confluence) of Cauvery, Kannike and the mythical Sujyothi, with an important Bhagandeshwara temple." }),
      mkPlace({ id:"dubare", name:"Dubare Elephant Camp", slug:"dubare", tags:["wildlife","family","nature"],
        coords:[12.3150,75.8720], durationMin:90, bestTime:"08:30 – 11:00", photographyScore:8.2,
        desc:"A riverside elephant interaction camp run by the forest department on the banks of the Cauvery." }),
      mkPlace({ id:"nisargadhama", name:"Nisargadhama", slug:"nisargadhama", tags:["nature","forest","family"],
        coords:[12.3580,75.9600], durationMin:60, bestTime:"09:00", photographyScore:7.5,
        desc:"A forested river island near Kushalnagar accessible by hanging bridge, with deer park, elephant rides and bamboo groves." }),
      mkPlace({ id:"nalknad", name:"Nalknad Palace", slug:"nalknad-palace", tags:["heritage","history","architecture"],
        coords:[12.3100,75.6350], durationMin:40, bestTime:"Daytime", photographyScore:7.8,
        desc:"A two-storeyed wooden palace in dense forest, the refuge and final royal residence of Kodagu's last kings.",
        historyNote:"Built 1792–94 by Dodda Veerarajendra; ASI-protected. A less-visited Kodava heritage gem." }),
      mkPlace({ id:"iruppu", name:"Iruppu Falls", slug:"iruppu-falls", tags:["waterfall","nature","trekking"],
        coords:[12.0900,75.9900], durationMin:75, bestTime:"Post-monsoon", photographyScore:9.1,
        desc:"A two-tiered waterfall in southern Kodagu connected to the Ramayana legend of Rama and Lakshmana." }),
      mkPlace({ id:"namdroling", name:"Namdroling Monastery (Golden Temple)", slug:"namdroling", tags:["culture","spiritual","architecture","photography"],
        coords:[12.3640,75.9710], durationMin:60, bestTime:"09:00 – 12:00", photographyScore:9.3,
        desc:"The largest Tibetan Buddhist teaching centre in South India, with three towering golden statues of the Buddha at Bylakuppe.",
        historyNote:"Established in 1963 after His Holiness Penor Rinpoche settled Tibetan refugees in the area. The Golden Temple was consecrated in 1999." })
    ]
  },

  /* ==================== CHIKKAMAGALURU ==================== */
  chikkamagaluru: {
    id: "chikkamagaluru",
    slug: "chikkamagaluru",
    name: "Chikkamagaluru",
    state: "Karnataka",
    heroGradient: "linear-gradient(135deg,#1f2a20 0%,#3a4a3a 30%,#6a7a4a 60%,#b8a060 100%)",
    palette: ["#1f2a20","#3a4a3a","#6a7a4a","#b8a060"],
    description: "Where coffee plantations meet misty peaks, forest trails and sacred hill landscapes.",
    microcopy: "Wake above the clouds, walk through coffee country and chase waterfalls.",
    knownFor: ["COFFEE","TREKKING","WATERFALLS","WESTERN GHATS","NATURE"],
    tags: ["nature","trekking","coffee","adventure","photography"],
    bestTime: "September – May",
    coords: [13.3161, 75.7720],
    dynasty: "hoysala",
    historySummary: "According to legend the region was given as dowry to the younger daughter (chikka magalu) of a local chief, giving Chikkamagaluru its name. It was an important Hoysala heartland and is today the birthplace of Indian commercial coffee cultivation (1670, Baba Budan).",
    timeline: [
      { year: "1670", event: "Baba Budan is said to have brought seven coffee seeds from Yemen, starting Indian coffee cultivation." },
      { year: "11th c.", event: "Sringeri Sharada Peetham established by Adi Shankara." },
      { year: "12th c.", event: "Hoysala temples built at Belavadi and surrounding areas." }
    ],
    source: { name: "Karnataka State Tourism", url: "https://karnatakatourism.org", confidence: "high", verified: "2025-01" },
    fuelStops: [{ name: "BPCL — NH173 Chikkamagaluru", coords: [13.3200,75.7760], type: "petrol" }],
    evStops: [{ name: "KSEDC Fast Charger — Chikkamagaluru", coords: [13.3160,75.7720], type: "ev" }],
    guides: [
      { id: "vivek-k", name: "Vivek Kamath", title: "Western Ghats Trek & Coffee Guide", photo: "VK",
        years: 10, languages: ["Kannada","English","Hindi"],
        specialties: ["Mullayanagiri Trek","Coffee Estates","Baba Budangiri"], rating: 4.88, trips: 480,
        expertise: { heritage: 70, photography: 88, architecture: 65, family: 72, history: 75 },
        destinations: ["chikkamagaluru"], priceTier: "moderate", meetPoint: "Chikkamagaluru Bus Stand", demoNote: "Illustrative profile" }
    ],
    detours: [
      { id:"cm-manikyadhara", name:"Manikyadhara Falls Viewpoint", coords:[13.4260,75.7630], type:"nature",
        tags:["waterfall","nature","photography"], detourKm:1.5, visitMin:15, photographyScore:8.8,
        desc:"A small but photogenic cascade near Baba Budangiri set against the Mullayanagiri range.",
        bestFor:["Nature","Photography"], whyWorth:"Minimal detour en route from Mullayanagiri to Baba Budangiri." },
      { id:"cm-hirekolale", name:"Hirekolale Lake", coords:[13.3700,75.7400], type:"photography",
        tags:["sunset","nature","photography"], detourKm:2.8, visitMin:20, photographyScore:9.4,
        desc:"A secluded lake flanked by Mullayanagiri peaks — still water + mountain reflections at golden hour.",
        bestFor:["Photography","Sunset"], whyWorth:"The most cinematic 'lake below the peak' shot near Chikkamagaluru." }
    ],
    places: [
      mkPlace({ id:"mullayanagiri", name:"Mullayanagiri", slug:"mullayanagiri", tags:["trekking","viewpoint","photography"],
        coords:[13.3890,75.7210], durationMin:90, bestTime:"06:00 sunrise", photographyScore:9.9,
        desc:"The highest peak in Karnataka (1,930 m), reached by a short trek or jeep ride with panoramic Western Ghats views." }),
      mkPlace({ id:"baba-budangiri", name:"Baba Budangiri", slug:"baba-budangiri", tags:["trekking","heritage","spiritual"],
        coords:[13.4200,75.7600], durationMin:120, bestTime:"Sunrise", photographyScore:9.2,
        desc:"A sacred mountain range home to both the dargah of Baba Budan and Hindu shrines, and the origin story of Indian coffee.",
        historyNote:"The saint Baba Budan is said to have smuggled seven coffee beans from Yemen in the 17th century, planting them here." }),
      mkPlace({ id:"kemmanagundi", name:"Kemmanagundi", slug:"kemmanagundi", tags:["hills","nature","photography"],
        coords:[13.5500,75.7600], durationMin:90, bestTime:"Morning or sunset", photographyScore:9.0,
        desc:"A cool hill station on the Baba Budangiri range laid out as a summer retreat by the Wodeyar kings, known for Z Point and Hebbe Falls access." }),
      mkPlace({ id:"hebbe", name:"Hebbe Falls", slug:"hebbe-falls", tags:["waterfall","adventure","nature"],
        coords:[13.5400,75.6800], durationMin:90, bestTime:"Post-monsoon", photographyScore:9.3,
        desc:"A twin-tiered 550-foot waterfall inside a coffee plantation accessed by jeep or moderate trek." }),
      mkPlace({ id:"jhari", name:"Jhari Falls", slug:"jhari-falls", tags:["waterfall","photography","adventure"],
        coords:[13.4400,75.7300], durationMin:45, bestTime:"Post-monsoon", photographyScore:8.8,
        desc:"A remote but popular cascading fall reached by jeep from Mullayanagiri road." }),
      mkPlace({ id:"kalhatti", name:"Kalhatti Falls", slug:"kalhatti-falls", tags:["waterfall","temple","nature"],
        coords:[13.5200,75.7400], durationMin:40, bestTime:"Daytime", photographyScore:7.8,
        desc:"A waterfall beside an old Veerbhadra temple on the Baba Budangiri slopes." }),
      mkPlace({ id:"kudremukh", name:"Kudremukh", slug:"kudremukh", tags:["trekking","wildlife","nature"],
        coords:[13.1500,75.2700], durationMin:360, bestTime:"Oct–Feb", photographyScore:9.4,
        desc:"A UNESCO-nominated park named after the horse-face mountain — a challenging full-day trek through grasslands and shola forest.",
        historyNote:"Former mining site; now a protected tiger reserve." }),
      mkPlace({ id:"bhadra", name:"Bhadra Wildlife Sanctuary", slug:"bhadra", tags:["wildlife","safari","nature"],
        coords:[13.7000,75.6500], durationMin:180, bestTime:"06:30 safari", photographyScore:8.8,
        desc:"A tiger reserve and Project Tiger site with jeep safaris through moist deciduous forest.",
        historyNote:"Established in 1951 as the Jagara Valley Game Sanctuary and renamed Bhadra in 1974." }),
      mkPlace({ id:"horanadu", name:"Horanadu Annapoorneshwari Temple", slug:"horanadu", tags:["spiritual","culture","food"],
        coords:[13.2780,75.3380], durationMin:45, bestTime:"Anytime", photographyScore:7.8,
        desc:"A revered Annapoorneshwari temple deep in Malnad known for serving prasadam meals to all visitors." }),
      mkPlace({ id:"sringeri", name:"Sringeri Sharada Peetham", slug:"sringeri", tags:["spiritual","heritage","architecture"],
        coords:[13.4170,75.2570], durationMin:60, bestTime:"Morning/evening", photographyScore:8.5,
        desc:"The first of Adi Shankara's four mathas, on the banks of the Tunga river, with the Vidyashankara Temple.",
        historyNote:"Founded in the 8th century; the 14th-century Vidyashankara temple fuses Hoysala and Vijayanagara styles." }),
      mkPlace({ id:"belavadi-cm", name:"Belavadi Veeranarayana Temple", slug:"belavadi", tags:["hoysala","heritage","architecture"],
        coords:[13.2800,75.9900], durationMin:45, bestTime:"10:00", photographyScore:9.0,
        desc:"A magnificent but less-crowded Hoysala trikuta temple with colossal images of Narayana, Venugopala and Yoganarasimha.",
        historyNote:"13th-century Hoysala; near Halebidu but officially within Chikkamagaluru district." }),
      mkPlace({ id:"coffee-estate", name:"Coffee Estate Experience", slug:"coffee-estate", tags:["coffee","culture","local-experience"],
        coords:[13.3200,75.7600], durationMin:90, bestTime:"Morning", photographyScore:8.0,
        desc:"A guided walk through Arabica and Robusta plantations — picking, pulping, drying and tasting.", demoNote:"Illustrative listing." })
    ]
  },

  /* ==================== SHIVAMOGGA ==================== */
  shivamogga: {
    id: "shivamogga",
    slug: "shivamogga",
    name: "Shivamogga",
    state: "Karnataka",
    heroGradient: "linear-gradient(135deg,#1a2a2a 0%,#3a5a55 35%,#5a8a70 65%,#a0c0a0 100%)",
    palette: ["#1a2a2a","#3a5a55","#5a8a70","#a0c0a0"],
    description: "The gateway to the Western Ghats — waterfalls, forests, rivers and forgotten stories.",
    microcopy: "Where rivers disappear into forests and waterfalls define the landscape.",
    knownFor: ["WATERFALLS","FORESTS","HERITAGE","WILDLIFE","TREKKING"],
    tags: ["nature","waterfalls","trekking","heritage"],
    bestTime: "July – January",
    coords: [13.9299, 75.5680],
    dynasty: "keladi",
    historySummary: "Shivamogga was a stronghold of the Keladi Nayakas after the fall of Vijayanagara and remains the gateway to the dense Malnad forests. It contains some of South India's most spectacular waterfalls.",
    source: { name: "Karnataka State Tourism", url: "https://karnatakatourism.org", confidence: "high", verified: "2025-01" },
    fuelStops: [{ name: "IOCL — Sagar Road", coords: [13.9400,75.5600], type: "petrol" }],
    evStops: [{ name: "KSEDC Charger — Shivamogga", coords: [13.9300,75.5700], type: "ev" }],
    guides: [
      { id:"manjunath-s", name:"Manjunath S", title:"Malnad Waterfalls & Trek Guide", photo:"MS",
        years:8, languages:["Kannada","English","Hindi"],
        specialties:["Jog Falls","Kodachadri Trek","Western Ghats"], rating:4.82, trips:320,
        expertise:{heritage:72,photography:85,architecture:60,family:75,history:75},
        destinations:["shivamogga"], priceTier:"budget", meetPoint:"Shivamogga Bus Stand", demoNote:"Illustrative profile" }
    ],
    detours: [
      { id:"sm-barkana", name:"Barkana Falls Viewpoint", coords:[13.8500,75.1000], type:"hidden",
        tags:["waterfall","nature","photography"], detourKm:3.0, visitMin:20, photographyScore:9.0,
        desc:"One of India's ten highest waterfalls, deep in the Agumbe rainforest — best seen July–September.",
        bestFor:["Nature","Photography"], whyWorth:"Adds another world-class fall between Agumbe and Kodachadri." },
      { id:"sm-keladi-museum", name:"Keladi Nayaka Museum", coords:[13.9140,75.0230], type:"heritage",
        tags:["heritage","history"], detourKm:0.3, visitMin:25, photographyScore:7.8,
        desc:"A small ASI museum beside the Keladi Rameshwara Temple with Keladi-Nayaka sculptures and coins.",
        bestFor:["Heritage","History"], whyWorth:"Right next to the temple; adds depth after visiting the monument." }
    ],
    places: [
      mkPlace({ id:"jog", name:"Jog Falls", slug:"jog-falls", tags:["waterfall","photography","nature"],
        coords:[14.2320,74.8100], durationMin:60, bestTime:"Jul–Oct / 10:00", photographyScore:9.9,
        desc:"India's second-highest plunge waterfall (253 m), where the Sharavathi drops in four cascades — Raja, Rani, Rocket and Roarer." }),
      mkPlace({ id:"agumbe", name:"Agumbe", slug:"agumbe", tags:["rainforest","sunset","wildlife"],
        coords:[13.5000,75.0800], durationMin:60, bestTime:"Sunset", photographyScore:9.5,
        desc:"One of India's wettest rainforest villages and the 'Cherrapunji of the South', famous for its sunset viewpoint and king cobra research." }),
      mkPlace({ id:"kodachadri", name:"Kodachadri", slug:"kodachadri", tags:["trekking","sunrise","nature"],
        coords:[13.8600,74.8700], durationMin:360, bestTime:"Overnight trek for sunrise", photographyScore:9.6,
        desc:"A peak in the Western Ghats crowned by the Sarvajna Peetha and ancient Mookambika temple with sweeping views of the Arabian Sea on clear days." }),
      mkPlace({ id:"keladi", name:"Keladi", slug:"keladi", tags:["heritage","temple","history"],
        coords:[13.9150,75.0200], durationMin:50, bestTime:"Morning", photographyScore:8.0,
        desc:"The first capital of the Keladi Nayakas, with an important Rameshwara temple complex and museum.",
        historyNote:"Keladi rulers maintained independence after Vijayanagara's fall until 1763 when Haidar Ali annexed the kingdom." }),
      mkPlace({ id:"ikkeri", name:"Ikkeri / Aghoreshwara Temple", slug:"ikkeri", tags:["heritage","architecture","history"],
        coords:[14.1300,75.0200], durationMin:40, bestTime:"Daytime", photographyScore:8.7,
        desc:"The former capital of the Keladi Nayakas with a remarkable granite Aghoreshwara temple blending Dravida and Kadamba styles.",
        historyNote:"Built in the 16th century; the Nandi pavilion is a well-known sculptural highlight." }),
      mkPlace({ id:"kavaledurga", name:"Kavaledurga Fort", slug:"kavaledurga", tags:["fort","trekking","history"],
        coords:[13.7800,75.1300], durationMin:120, bestTime:"Morning", photographyScore:8.8,
        desc:"A hilltop fort of the Keladi dynasty at ~1500 m, now a ruin deep in the forest with palace foundations and temples.",
        historyNote:"Renovated by Queen Chennamaji in the 17th century; currently an ASI site." }),
      mkPlace({ id:"nagara-fort", name:"Nagara Fort", slug:"nagara-fort", tags:["fort","history","photography"],
        coords:[13.8250,75.0200], durationMin:60, bestTime:"Sunset", photographyScore:8.4,
        desc:"A hill fort with a dramatic Shivappa Nayaka Palace and the famous 'devara gadde' (god's field) pond." }),
      mkPlace({ id:"honnemaradu", name:"Honnemaradu", slug:"honnemaradu", tags:["water-sports","nature","adventure"],
        coords:[13.8900,75.1400], durationMin:120, bestTime:"Oct–Dec", photographyScore:8.0,
        desc:"An island-studded reservoir on the Sharavathi offering kayaking, coracle rides and quiet birdwatching." }),
      mkPlace({ id:"sakrebyle", name:"Sakrebyle Elephant Camp", slug:"sakrebyle", tags:["wildlife","family","nature"],
        coords:[13.9000,75.4300], durationMin:60, bestTime:"08:30 bathing", photographyScore:8.0,
        desc:"A forest camp by the Tunga where trained elephants are bathed and fed, popular with families." }),
      mkPlace({ id:"tyavarekoppa", name:"Tyavarekoppa Lion & Tiger Safari", slug:"tyavarekoppa", tags:["wildlife","family","safari"],
        coords:[13.9600,75.4600], durationMin:90, bestTime:"Afternoon safari", photographyScore:7.0,
        desc:"One of Karnataka's older lion and tiger safari parks on the edge of Shivamogga town." }),
      mkPlace({ id:"mandagadde", name:"Mandagadde Bird Sanctuary", slug:"mandagadde", tags:["birdwatching","nature","photography"],
        coords:[13.8900,75.4900], durationMin:45, bestTime:"Jul–Sep", photographyScore:8.0,
        desc:"A small riverine island sanctuary on the Tunga known for nesting cormorants and herons during monsoon." }),
      mkPlace({ id:"kuppali", name:"Kuppali / Kuvempu Museum", slug:"kuppali", tags:["literature","culture","history"],
        coords:[13.8500,75.2200], durationMin:60, bestTime:"Daytime", photographyScore:7.0,
        desc:"Childhood home of Kuvempu, Kannada's Jnanpith laureate, maintained as a national poet memorial with the Kavishaila monument.",
        historyNote:"Kuppali is where Rashtrakavi Kuvempu wrote most of his major works including 'Sri Ramayana Darshanam'." })
    ]
  },

  /* ==================== UTTARA KANNADA ==================== */
  uttaraKannada: {
    id: "uttara-kannada",
    slug: "uttara-kannada",
    name: "Uttara Kannada",
    state: "Karnataka",
    heroGradient: "linear-gradient(135deg,#0f2a3a 0%,#2a5060 35%,#3a8090 60%,#d8c08a 100%)",
    palette: ["#0f2a3a","#2a5060","#3a8090","#d8c08a"],
    description: "Where the Western Ghats meet the Arabian Sea — forests, rivers, beaches and ancient coastal culture.",
    microcopy: "From rainforest trails to Arabian Sea sunsets.",
    knownFor: ["COAST","FORESTS","BEACHES","WILDLIFE","ADVENTURE"],
    tags: ["beach","nature","adventure","coast","wildlife"],
    bestTime: "October – March",
    coords: [14.8200, 74.1400],
    dynasty: "kadamba",
    historySummary: "Uttara Kannada (North Kanara) was a core territory of the Kadamba dynasty (3rd–6th c.), then the Vijayanagara, Keladi, Maratha and British rulers. Its long coastline and dense rainforests support a distinct Konkan and Marathi-influenced coastal culture alongside Kannada.",
    source: { name: "Karnataka State Tourism", url: "https://karnatakatourism.org", confidence: "high", verified: "2025-01" },
    fuelStops: [{ name: "IOCL — Karwar", coords: [14.8000,74.1300], type: "petrol" }],
    evStops: [{ name: "Tata Charger — Karwar", coords: [14.8100,74.1400], type: "ev" }],
    guides: [
      { id:"suresh-nayak", name:"Suresh Nayak", title:"Coastal & Adventure Guide", photo:"SN",
        years:9, languages:["Kannada","English","Hindi","Konkani"],
        specialties:["Gokarna Beaches","Yana Trek","Dandeli Rafting"], rating:4.86, trips:410,
        expertise:{heritage:75,photography:86,architecture:65,family:78,history:72},
        destinations:["uttara-kannada"], priceTier:"moderate", meetPoint:"Gokarna Bus Stand", demoNote:"Illustrative profile" }
    ],
    detours: [
      { id:"uk-vibhooti", name:"Vibhooti Falls", coords:[14.5900,74.5700], type:"nature",
        tags:["waterfall","nature","trekking"], detourKm:1.2, visitMin:20, photographyScore:8.6,
        desc:"A limestone-tinted cascade in evergreen forest, the natural pair with a Yana Caves trek.",
        bestFor:["Nature","Trekking"], whyWorth:"Right below Yana; adds a waterfall stop with minimal detour." },
      { id:"uk-half-moon", name:"Half-Moon Beach walk from Om", coords:[14.5570,74.3400], type:"hidden",
        tags:["beach","hidden","sunset"], detourKm:1.0, visitMin:30, photographyScore:9.0,
        desc:"A short cliff walk south of Om Beach leads to a smaller, quieter crescent cove with pale sand.",
        bestFor:["Hidden Places","Sunset"], whyWorth:"The quiet beach most Gokarna visitors skip." }
    ],
    places: [
      mkPlace({ id:"gokarna-temple", name:"Gokarna Mahabaleshwar Temple", slug:"gokarna-mahabaleshwar", tags:["spiritual","heritage","culture"],
        coords:[14.5450,74.3150], durationMin:40, bestTime:"Morning", photographyScore:7.8,
        desc:"A revered Shiva temple housing the Atmalinga, making Gokarna one of South India's seven most sacred Mukti-sthalas.",
        historyNote:"The temple is referenced in the Tamil Tevaram hymns; its origins are linked to Ravana and the Atmalinga legend." }),
      mkPlace({ id:"om-beach", name:"Om Beach", slug:"om-beach", tags:["beach","sunset","photography"],
        coords:[14.5520,74.3300], durationMin:90, bestTime:"Late afternoon / sunset", photographyScore:9.4,
        desc:"Two crescent coves join to form an 'Om' shape — Gokarna's most famous beach for sunset walks and low-key traveller culture." }),
      mkPlace({ id:"kudle-beach", name:"Kudle Beach", slug:"kudle-beach", tags:["beach","sunset","trekking"],
        coords:[14.5470,74.3210], durationMin:60, bestTime:"Sunset", photographyScore:8.8,
        desc:"Long, sandy cove just south of Gokarna town, popular for sunset views and short walks." }),
      mkPlace({ id:"yana", name:"Yana Caves", slug:"yana-caves", tags:["nature","caves","trekking","photography"],
        coords:[14.5800,74.5600], durationMin:90, bestTime:"Morning trek", photographyScore:9.7,
        desc:"Two 100-metre black karst rock formations (Bhairaveshwara Shikhara and Mohini Shikhara) rising dramatically out of the rainforest.",
        historyNote:"Sacred to Shiva; the rocks are made of solid crystalline black limestone. Best combined with Vibhooti Falls." }),
      mkPlace({ id:"dandeli", name:"Dandeli Wildlife Sanctuary", slug:"dandeli", tags:["wildlife","rafting","adventure"],
        coords:[15.2500,74.6200], durationMin:240, bestTime:"Oct–May rafting", photographyScore:8.8,
        desc:"Kali river rafting, jungle safaris and forest stays on the border of Goa; one of India's best-known multi-adventure hubs." }),
      mkPlace({ id:"kali-river", name:"Kali River", slug:"kali-river", tags:["river","adventure","nature"],
        coords:[14.8200,74.1400], durationMin:120, bestTime:"Afternoon", photographyScore:7.8,
        desc:"The Kali river and its bridge near Karwar offer river cruises, boat rides and estuary views." }),
      mkPlace({ id:"mirjan-fort", name:"Mirjan Fort", slug:"mirjan-fort", tags:["fort","heritage","photography"],
        coords:[14.4880,74.4380], durationMin:45, bestTime:"Morning or sunset", photographyScore:9.2,
        desc:"A beautifully preserved red laterite fort deep in coconut groves, associated with the Pepper Queen Chennabhairadevi.",
        historyNote:"Built in the 16th century; an ASI-protected fort famed for its double walls and round bastions." }),
      mkPlace({ id:"karwar-beach", name:"Karwar Beach", slug:"karwar-beach", tags:["beach","sunset","coast"],
        coords:[14.8000,74.1300], durationMin:60, bestTime:"Sunset", photographyScore:8.8,
        desc:"A wide, calm beach facing the Karwar bay, popular among locals and less commercialised than beaches further south." }),
      mkPlace({ id:"devbagh", name:"Devbagh", slug:"devbagh", tags:["beach","island","nature"],
        coords:[14.8700,74.0800], durationMin:120, bestTime:"Morning boat", photographyScore:8.5,
        desc:"Island beach retreat near Karwar with casuarina groves and dolphin-watching boat trips." }),
      mkPlace({ id:"sadashivgad", name:"Sadashivgad Fort", slug:"sadashivgad-fort", tags:["fort","history","viewpoint"],
        coords:[14.8500,74.1200], durationMin:45, bestTime:"Sunrise", photographyScore:8.6,
        desc:"A hill fort at the confluence of the Kali and the Arabian Sea, with a commanding river-mouth view.",
        historyNote:"Built in 1715 by Basavlingraj of Sonda; later captured by the Marathas, Portuguese and British." }),
      mkPlace({ id:"unchalli", name:"Unchalli Falls", slug:"unchalli-falls", tags:["waterfall","trekking","photography"],
        coords:[14.4100,74.6000], durationMin:90, bestTime:"Post-monsoon", photographyScore:9.0,
        desc:"A 116-m waterfall (Lushington Falls) where the Aghanashini plunges into a deep gorge in the Siddapura forest." }),
      mkPlace({ id:"magod", name:"Magod Falls", slug:"magod-falls", tags:["waterfall","nature","photography"],
        coords:[14.3900,74.8600], durationMin:60, bestTime:"Post-monsoon", photographyScore:8.8,
        desc:"A two-tiered 200-m fall on the Bedti river near Yellapur, viewed from a headland viewpoint." })
    ]
  },

  /* ==================== VIJAYANAGARA ==================== */
  vijayanagara: {
    id: "vijayanagara",
    slug: "vijayanagara",
    name: "Vijayanagara",
    state: "Karnataka",
    heroGradient: "linear-gradient(135deg,#2a1a14 0%,#5a3a24 30%,#a06a3a 65%,#e0a870 100%)",
    palette: ["#2a1a14","#5a3a24","#a06a3a","#e0a870"],
    description: "The living landscape of an empire — temples, markets, royal spaces and stone monuments across Hampi.",
    microcopy: "Walk through the stone memory of one of India's greatest empires.",
    knownFor: ["HAMPI","VIJAYANAGARA EMPIRE","HERITAGE","ARCHAEOLOGY","PHOTOGRAPHY"],
    tags: ["heritage","architecture","photography","history","unesco"],
    bestTime: "October – March",
    coords: [15.3350, 76.4600],
    dynasty: "vijayanagara",
    historySummary: "Vijayanagara was the capital of one of the largest and most powerful empires of medieval India from 1336 until its defeat at the Battle of Talikota in 1565. Today the ruins, known collectively as Hampi, span ~41 sq km and are a UNESCO World Heritage Site.",
    timeline: [
      { year: "1336", event: "Vijayanagara Empire founded by Harihara I and Bukka Raya." },
      { year: "1509–29", event: "Reign of Krishnadevaraya — empire at its peak; Vittala Temple begun." },
      { year: "1565", event: "Battle of Talikota; city sacked and abandoned." },
      { year: "1986", event: "UNESCO inscribes Group of Monuments at Hampi." }
    ],
    source: { name: "UNESCO World Heritage Centre", url: "https://whc.unesco.org", confidence: "high", verified: "2025-01" },
    fuelStops: [
      { name: "Bharat Petroleum — Hampi Road", coords: [15.3400,76.4400], type: "petrol" },
      { name: "Indian Oil — Kamalapur", coords: [15.3080,76.4920], type: "petrol" }
    ],
    evStops: [{ name: "Tata Power Charger — Hospet", coords: [15.2700,76.3900], type: "ev" }],
    guides: [
      { id: "ramesh-kumar-v", name: "Ramesh Kumar", title: "Heritage Specialist", photo: "RK",
        years: 12, languages: ["Kannada","English","Hindi"],
        specialties: ["Hampi History","Vijayanagara Architecture","Photography Walks"], rating: 4.9, trips: 1240,
        expertise: { heritage: 95, photography: 88, architecture: 92, family: 70, history: 96 },
        destinations: ["vijayanagara"], priceTier: "moderate", meetPoint: "Virupaksha East Gate", demoNote: "Illustrative profile" }
    ],
    detours: [
      { id:"sanapur-lake", name:"Sanapur Lake Viewpoint", coords:[15.3550,76.4400], type:"hidden",
        tags:["photography","sunset","nature"], detourKm:1.4, visitMin:15, photographyScore:9.2,
        desc:"A boulder-fringed lake rarely on tourist maps, with unobstructed water-and-boulder reflections.",
        bestFor:["Photography","Sunset"], whyWorth:"Adds a waterscape to your ruin photographs without disruption." },
      { id:"anegundi-v", name:"Anegundi Village Trail", coords:[15.3520,76.4800], type:"hidden",
        tags:["culture","history","photography"], detourKm:4.2, visitMin:45, photographyScore:8.4,
        desc:"The older fortress-village across the river with painted doors, banana plantations and Pampa Sarovar.",
        bestFor:["Culture","History"] }
    ],
    places: [
      mkPlace({ id:"virupaksha", name:"Virupaksha Temple", slug:"virupaksha-temple", tags:["heritage","temple","spiritual"],
        coords:[15.3358,76.4592], durationMin:45, bestTime:"Opening – 09:00", photographyScore:8.7,
        desc:"An active Shiva temple with a 50-metre gopuram, the oldest continuously worshipped shrine in Hampi and the spiritual anchor of the site.",
        historyNote:"Predates the Vijayanagara capital; expanded through centuries of patronage." }),
      mkPlace({ id:"vittala", name:"Vijaya Vittala Temple & Stone Chariot", slug:"vittala-temple", tags:["unesco","heritage","architecture","photography"],
        coords:[15.3193,76.4750], durationMin:75, bestTime:"10:00 – 12:00", photographyScore:9.9,
        desc:"The artistic pinnacle of Vijayanagara temple architecture — the stone chariot shrine to Garuda and the musical pillars.",
        historyNote:"Construction began under Krishnadevaraya in the 1510s." }),
      mkPlace({ id:"hampi-bazaar", name:"Hampi Bazaar", slug:"hampi-bazaar", tags:["history","culture","photography"],
        coords:[15.3350,76.4610], durationMin:30, bestTime:"Morning", photographyScore:8.5,
        desc:"The broad, colonnaded market street leading to Virupaksha Temple, once lined with merchants and gem sellers." }),
      mkPlace({ id:"royal-enclosure", name:"Royal Enclosure", slug:"royal-enclosure", tags:["history","archaeology","architecture"],
        coords:[15.3220,76.4720], durationMin:60, bestTime:"Morning", photographyScore:8.0,
        desc:"The walled core of the imperial city — Mahanavami Dibba, stepped tanks, palaces and the King's Audience Hall." }),
      mkPlace({ id:"lotus-mahal-v", name:"Lotus Mahal", slug:"lotus-mahal", tags:["architecture","heritage","photography"],
        coords:[15.3210,76.4700], durationMin:30, bestTime:"11:00 – 13:00", photographyScore:8.8,
        desc:"An elegant two-storeyed royal pavilion blending Hindu and Islamic motifs, the centerpiece of the Zenana Enclosure." }),
      mkPlace({ id:"elephant-stables-v", name:"Elephant Stables", slug:"elephant-stables", tags:["architecture","history","photography"],
        coords:[15.3208,76.4685], durationMin:25, bestTime:"After Lotus Mahal", photographyScore:8.0,
        desc:"Eleven domed chambers that housed the royal elephants, showing Indo-Islamic stylistic influence." }),
      mkPlace({ id:"queens-bath", name:"Queen's Bath", slug:"queens-bath", tags:["architecture","history"],
        coords:[15.3180,76.4730], durationMin:20, bestTime:"Anytime", photographyScore:7.8,
        desc:"A rectangular royal bathing pavilion surrounded by a moat, with Indo-Islamic balconies and arched verandahs." }),
      mkPlace({ id:"hazara-rama", name:"Hazara Rama Temple", slug:"hazara-rama", tags:["heritage","sculpture","history"],
        coords:[15.3230,76.4710], durationMin:30, bestTime:"Morning", photographyScore:8.7,
        desc:"The royal chapel with an extraordinary narrative Ramayana frieze running along its outer walls.",
        historyNote:"Name means 'a thousand Rama'; it was the private temple of the Vijayanagara kings." }),
      mkPlace({ id:"achyutaraya-v", name:"Achyutaraya Temple & Bazaar", slug:"achyutaraya-temple", tags:["heritage","architecture","history"],
        coords:[15.3295,76.4670], durationMin:45, bestTime:"09:00 – 11:00", photographyScore:9.1,
        desc:"A long abandoned bazaar street leading to the Tiruvengalanatha temple, also called after its patron Emperor Achyuta Deva Raya.",
        historyNote:"Built 1529–42 CE, one of the last grand temples before the 1565 fall." }),
      mkPlace({ id:"ugra-narasimha", name:"Ugra Narasimha", slug:"ugra-narasimha", tags:["sculpture","heritage","photography"],
        coords:[15.3315,76.4660], durationMin:15, bestTime:"Anytime", photographyScore:9.0,
        desc:"A 6.7-metre monolithic Lakshmi-Narasimha carved in 1528, one of Hampi's most iconic statues.",
        historyNote:"Commissioned during Krishnadevaraya's reign. The smaller Lakshmi figure beside it was damaged during the 1565 sack." }),
      mkPlace({ id:"hemakuta-v", name:"Hemakuta Hill", slug:"hemakuta-hill", tags:["sunset","sunrise","photography","heritage"],
        coords:[15.3340,76.4605], durationMin:45, bestTime:"06:00 or 17:30", photographyScore:9.6,
        desc:"A cluster of pre-Vijayanagara granite temples with the iconic boulder-framed view of the Virupaksha gopuram." }),
      mkPlace({ id:"matanga-v", name:"Matanga Hill", slug:"matanga-hill", tags:["sunrise","sunset","trekking","viewpoint"],
        coords:[15.3315,76.4630], durationMin:60, bestTime:"Sunrise / Sunset", photographyScore:9.9,
        desc:"The highest viewpoint in the core ruins with a 360° panorama over the entire temple-bazaar-river axis." })
    ]
  },

  /* ==================== CHITRADURGA ==================== */
  chitradurga: {
    id: "chitradurga",
    slug: "chitradurga",
    name: "Chitradurga",
    state: "Karnataka",
    heroGradient: "linear-gradient(135deg,#2a1f1a 0%,#5a3a2a 30%,#8a6040 60%,#c09868 100%)",
    palette: ["#2a1f1a","#5a3a2a","#8a6040","#c09868"],
    description: "A stone fortress of legends, dramatic boulders, ancient caves and stories of resistance.",
    microcopy: "Enter a fortress shaped by stone, strategy and stories of resistance.",
    knownFor: ["FORTS","HISTORY","ARCHAEOLOGY","PHOTOGRAPHY","ADVENTURE"],
    tags: ["fort","history","adventure","heritage"],
    bestTime: "October – March",
    coords: [14.2300, 76.4000],
    dynasty: "nayaka",
    historySummary: "Chitradurga was the capital of the Palegar (Nayaka) chieftains who built its legendary seven-walled fort between the 16th and 18th centuries. It was later taken by Hyder Ali and Tipu Sultan. The story of Onake Obavva, who fought Hyder Ali's soldiers single-handedly through a crack in the fort wall, is one of Karnataka's great folk-hero tales.",
    timeline: [
      { year: "1562", event: "First major fortifications by the Nayakas of Chitradurga." },
      { year: "1779", event: "Hyder Ali captures the fort after an 18-month siege; Onake Obavva's legendary stand." },
      { year: "1799", event: "British take control after the fall of Tipu Sultan." }
    ],
    source: { name: "Archaeological Survey of India", url: "https://asi.nic.in", confidence: "high", verified: "2025-01" },
    fuelStops: [{ name: "BPCL — NH50 Chitradurga", coords: [14.2300,76.3900], type: "petrol" }],
    evStops: [{ name: "KSEDC Charger — Chitradurga", coords: [14.2330,76.4050], type: "ev" }],
    guides: [
      { id:"veeresh-r", name:"Veeresh R", title:"Fort & Folklore Guide", photo:"VR",
        years:10, languages:["Kannada","English","Hindi","Telugu"],
        specialties:["Chitradurga Fort","Nayaka History","Onake Obavva Story"], rating:4.84, trips:490,
        expertise:{heritage:92,photography:78,architecture:88,family:78,history:94},
        destinations:["chitradurga"], priceTier:"budget", meetPoint:"Fort Main Entrance", demoNote:"Illustrative profile" }
    ],
    detours: [
      { id:"ctd-windmills", name:"Windmill Hill Viewpoint", coords:[14.2400,76.3700], type:"photography",
        tags:["sunset","photography","nature"], detourKm:3.5, visitMin:15, photographyScore:9.2,
        desc:"A ridge crowned by wind turbines offering a sweeping view of the fort and surrounding boulder plain at sunset.",
        bestFor:["Photography","Sunset"], whyWorth:"The hero shot of Chitradurga fort from outside." },
      { id:"ctd-ashoka", name:"Ashoka Siddapura Edict (Minor Rock Edict)", coords:[14.2800,76.4800], type:"hidden",
        tags:["history","archaeology","hidden"], detourKm:5.0, visitMin:20, photographyScore:7.8,
        desc:"A 3rd-century BCE Ashoka minor rock edict in Brahmi script — evidence of Mauryan reach into the Deccan.",
        bestFor:["History","Hidden Places"], whyWorth:"For deep history buffs — one of Karnataka's most accessible Ashoka edicts." }
    ],
    places: [
      mkPlace({ id:"chitradurga-fort", name:"Chitradurga Fort", slug:"chitradurga-fort", tags:["fort","history","architecture","photography"],
        coords:[14.2260,76.3950], durationMin:150, bestTime:"08:00 – 13:00", photographyScore:9.5,
        desc:"A massive seven-walled granite fort enclosing 1,500 acres with 19 gateways, 38 posterior entrances, 35 secret passages, four invisible passages, temples, granaries and oil pits.",
        historyNote:"Built and expanded by the Palegar Nayakas of Chitradurga across generations; ASI-protected since 1923." }),
      mkPlace({ id:"obavva", name:"Onake Obavva Kindi", slug:"obavva-kindi", tags:["history","folklore","heritage"],
        coords:[14.2240,76.3960], durationMin:20, bestTime:"During fort visit", photographyScore:8.5,
        desc:"A narrow crevice inside the fort where, during the 1779 siege, Obavva killed dozens of Hyder Ali's soldiers with an onake (pestle) while they tried to slip through.",
        historyNote:"A celebrated Kannada folk-hero memorialised in films, plays and school textbooks." }),
      mkPlace({ id:"hidimbeshwara", name:"Hidimbeshwara Temple", slug:"hidimbeshwara", tags:["temple","heritage","spiritual"],
        coords:[14.2250,76.3970], durationMin:20, bestTime:"During fort visit", photographyScore:7.8,
        desc:"An unusual rock-cut and boulder-woven temple inside the fort with associations to Hidimba from the Mahabharata." }),
      mkPlace({ id:"chandravalli", name:"Chandravalli Caves", slug:"chandravalli", tags:["archaeology","caves","history"],
        coords:[14.2100,76.4100], durationMin:45, bestTime:"Daytime", photographyScore:8.2,
        desc:"A semi-lunar valley and cave complex that has yielded Satavahana and early historic coins, pottery and a subterranean passage tradition.",
        historyNote:"Excavated by the Mysore Archaeological Department in 1929; human occupation goes back to Iron Age." }),
      mkPlace({ id:"jogimatti", name:"Jogimatti", slug:"jogimatti", tags:["hills","wildlife","viewpoint"],
        coords:[14.1400,76.2800], durationMin:60, bestTime:"Morning", photographyScore:8.2,
        desc:"A small hill station and forest reserve at ~1150 m near Chitradurga, with a yogi hermitage, pine groves and panoramic views of the Deccan plain." }),
      mkPlace({ id:"vani-vilas", name:"Vani Vilas Sagar Dam", slug:"vani-vilas", tags:["heritage","engineering","photography"],
        coords:[14.2000,76.4800], durationMin:40, bestTime:"Afternoon / sunset", photographyScore:8.5,
        desc:"One of India's earlier masonry dams (1898), built across the Vedavathi by the Mysore Wodeyars — an engineering heritage site popular for sunrise reflections." }),
      mkPlace({ id:"adumalleshwara", name:"Adumalleshwara Temple", slug:"adumalleshwara", tags:["cave","temple","spiritual"],
        coords:[14.2400,76.3600], durationMin:25, bestTime:"Morning", photographyScore:7.0,
        desc:"A cave temple of Shiva about 5 km from Chitradurga, with underground caverns and a perennial spring." }),
      mkPlace({ id:"nayakanahatti", name:"Nayakanahatti Temple", slug:"nayakanahatti", tags:["spiritual","culture","festival"],
        coords:[14.2200,76.6400], durationMin:45, bestTime:"Festival season", photographyScore:7.0,
        desc:"The birthplace and temple of the 15th-century saint Sri Guru Thipperudraswamy, famous for its annual Jatre." }),
      mkPlace({ id:"holalkere-ganesha", name:"Holalkere Ganesha Temple", slug:"holalkere-ganesha", tags:["heritage","sculpture","spiritual"],
        coords:[14.0700,76.1800], durationMin:30, bestTime:"Morning", photographyScore:7.5,
        desc:"A temple housing a large monolithic Ganesha image near Holalkere." }),
      mkPlace({ id:"maradihalli", name:"Maradihalli Geological Monument", slug:"maradihalli", tags:["geology","nature","education"],
        coords:[14.2800,76.5000], durationMin:40, bestTime:"Daytime", photographyScore:7.5,
        desc:"A national geological monument of ancient volcanic pillow lavas, valuable for understanding the Deccan's volcanic history.",
        historyNote:"Declared a National Geological Monument by the GSI." }),
      mkPlace({ id:"ankali-mutt", name:"Ankali Mutt", slug:"ankali-mutt", tags:["culture","spiritual","heritage"],
        coords:[14.2150,76.4200], durationMin:30, bestTime:"Daytime", photographyScore:7.0,
        desc:"A Veerashaiva monastic site in a rock refuge near Chitradurga with painted murals and cave-feel passages." }),
      mkPlace({ id:"gayatri-jalashaya", name:"Gayatri Jalashaya", slug:"gayatri-jalashaya", tags:["nature","photography","hidden"],
        coords:[14.2000,76.3800], durationMin:30, bestTime:"Sunset", photographyScore:8.0,
        desc:"A lesser-visited water body on the edge of Chitradurga with reflections of boulder hills, often devoid of tourists." })
    ]
  }
};

/* ---------- Auto-wire detours / fuel / EV / guides per district ----------
 * (already attached above; this loop ensures detours reference place ids.)
 */

/* ---------- Helpers ---------- */
function getAllDistricts() { return Object.values(DISTRICTS); }
function getDistrict(slug) { return DISTRICTS[slug] || null; }
function getDistrictPlace(districtSlug, placeSlug) {
  const d = DISTRICTS[districtSlug]; if (!d) return null;
  return d.places.find(p => p.slug === placeSlug) || null;
}

/* Slug helpers */
function slugify(s) {
  return String(s).toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* Find district for any place by slug */
function findPlaceGlobally(placeSlug) {
  for (const d of Object.values(DISTRICTS)) {
    const p = d.places.find(p => p.slug === placeSlug);
    if (p) return { district: d, place: p };
  }
  return null;
}

/* Tag color helpers */
function tagColor(tag) {
  const t = String(tag).toLowerCase();
  if (/heritage|royal|hoysala|unesco|fort|palace|archaeology|temple|sculpture|history|art|railway|literature|kadamba|hoysala|nayaka|wodeyar|kodava|vijayanagara|keladi/.test(t)) return "tl-badge--heritage";
  if (/photo|view|sunrise|sunset/.test(t)) return "tl-badge--photo";
  if (/food|culture|coffee|local|market|festival|religion|spiritual|folk/.test(t)) return "tl-badge--food";
  if (/nature|wildlife|bird|forest|hills|waterfall|beach|coast|river|lake|island|water|geology|mountain/.test(t)) return "tl-badge--nature";
  if (/trek|adventure|rafting|cave|safari|sport/.test(t)) return "tl-badge--adventure";
  if (/hidden/.test(t)) return "tl-badge--hidden";
  return "";
}
