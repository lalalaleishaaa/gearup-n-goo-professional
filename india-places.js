/* ============================================================
 * GEARUP N GOO — INDIA CURATED DISTRICTS & TOP TOURIST PLACES
 * Companion module to india-destinations.js (which owns the
 * 36 states/UTs and the destination service API).
 *
 * Contents:
 *   GNGIndiaPlaces.districts  -> { stateId: [ districtRec, ... ] }
 *   GNGIndiaPlaces.circuits   -> heritage circuits (reusable collections)
 *
 * Data conventions (honest data policy of this project):
 *   - Only curated TOP tourist places (5-12 per district).
 *   - `priority: 1` = most important destination in the district
 *     (curated editorial ranking — no invented tourism statistics).
 *   - Coordinates are approximate real-world values (WGS84).
 *   - Durations/best-time are curated planning guidance.
 *   - image: { src, alt, credit, source, status }
 *       status: "photo" (uploaded real photo) | "generated"
 *               (AI editorial illustration, clearly labelled) | null
 *   - Scores are editorial 1-10 guidance used by the existing
 *     personalization engine — not measured statistics.
 *   - Karnataka districts live in districts.js and are imported
 *     by the service at runtime (no duplication).
 * ============================================================ */
window.GNGIndiaPlaces = (() => {

  /* Place factory: fills engine defaults so every place works with
   * GNGIntel.calculatePlaceMatch() without extra wiring. */
  function P(o) {
    return Object.assign({
      type: "place",
      shortDescription: "",
      tags: [],
      durationMin: 60,
      bestTime: "Daytime",
      photographyScore: 8,
      heritageScore: 6, cultureScore: 6, natureScore: 5,
      familyScore: 7, accessibilityScore: 7,
      verified: true,
      image: null
    }, o);
  }
  const GEN = "AI-generated editorial illustration — representative of the location";
  function img(src, alt, status) {
    return { src, alt, credit: status === "photo" ? "GEARUP N GOO dataset" : GEN, source: status === "photo" ? "curated dataset" : "generated", status: status || "generated" };
  }

  const districts = {

    /* ==================== RAJASTHAN ==================== */
    "rajasthan": [

      {
        id: "jaipur", stateId: "rajasthan", name: "Jaipur",
        description: "The heart of Rajasthan's royal heritage, architecture and living culture.",
        themes: ["PALACES", "FORTS", "CULTURE"],
        coords: [26.9124, 75.7873],
        bestTime: "October – March",
        tags: ["heritage", "architecture", "culture", "photography", "history", "markets"],
        heroGradient: "linear-gradient(135deg,#4a1f24 0%,#8a3a35 35%,#c07a4a 65%,#e8c8a0 100%)",
        historySummary: "Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur was one of India's first planned cities, designed on a nine-square grid by the architect Vidyadhar Bhattacharya. Its pink sandstone facades, royal palaces and observatory reflect a fusion of Rajput, Mughal and European design.",
        image: img("assets/districts/jaipur.jpg", "Hawa Mahal and Jaipur's pink-city rooftops at golden hour, Rajasthan", "generated"),
        status: "verified",
        places: [
          P({ id: "amber-fort", name: "Amber Fort", priority: 1, type: "Fort",
              shortDescription: "Hilltop fort-palace of mirrored halls, courtyards and gardens above Maota Lake.",
              coordinates: [26.9855, 75.8513], tags: ["heritage", "architecture", "photography", "history", "culture"],
              durationMin: 150, bestTime: "Morning", photographyScore: 9.5, heritageScore: 10, cultureScore: 8, accessibilityScore: 7,
              image: img("assets/places/amber-fort.jpg", "Amber Fort ramparts and mirrored palace walls above Maota Lake, Jaipur", "generated") }),
          P({ id: "city-palace-jaipur", name: "City Palace", priority: 2, type: "Palace",
              shortDescription: "Seat of the Jaipur royal family, with museums of textiles, arms and manuscripts.",
              coordinates: [26.9258, 75.8197], tags: ["heritage", "architecture", "culture", "photography", "history"],
              durationMin: 120, bestTime: "Morning", photographyScore: 8.5, heritageScore: 9 }),
          P({ id: "hawa-mahal", name: "Hawa Mahal", priority: 3, type: "Palace",
              shortDescription: "Five-storey pink sandstone screen built so royal women could watch street life unseen.",
              coordinates: [26.9239, 75.8267], tags: ["heritage", "architecture", "photography", "history"],
              durationMin: 45, bestTime: "Morning", photographyScore: 9, heritageScore: 9 }),
          P({ id: "jantar-mantar-jaipur", name: "Jantar Mantar", priority: 4, type: "Observatory",
              shortDescription: "UNESCO-listed astronomical park of giant stone instruments, including the world's largest stone sundial.",
              coordinates: [26.9247, 75.8246], tags: ["heritage", "architecture", "history", "science"],
              durationMin: 60, bestTime: "Daytime", photographyScore: 8, heritageScore: 9 }),
          P({ id: "nahargarh-fort", name: "Nahargarh Fort", priority: 5, type: "Fort",
              shortDescription: "Ridge fort whose walls frame the classic panoramic sunset over the pink city.",
              coordinates: [26.9374, 75.8153], tags: ["heritage", "photography", "sunset", "history", "nature"],
              durationMin: 90, bestTime: "Sunset", photographyScore: 9, heritageScore: 7 }),
          P({ id: "jal-mahal", name: "Jal Mahal", priority: 6, type: "Palace",
              shortDescription: "Sandstone water palace that appears to float on Man Sagar Lake.",
              coordinates: [26.9534, 75.8462], tags: ["heritage", "photography", "sunset", "architecture"],
              durationMin: 30, bestTime: "Sunset", photographyScore: 8.5, heritageScore: 7 }),
          P({ id: "albert-hall-museum", name: "Albert Hall Museum", priority: 7, type: "Museum",
              shortDescription: "Indo-Saracenic museum hall in Ram Niwas gardens, glowing warmly after dark.",
              coordinates: [26.9118, 75.8195], tags: ["heritage", "architecture", "culture", "photography"],
              durationMin: 60, bestTime: "Evening", photographyScore: 8 }),
          P({ id: "galtaji", name: "Galtaji (Monkey Temple)", priority: 8, type: "Temple",
              shortDescription: "Cluster of spring-fed tanks and pavilions tucked in a rocky gorge.",
              coordinates: [26.8930, 75.8570], tags: ["spiritual", "heritage", "hidden", "photography"],
              durationMin: 60, bestTime: "Morning", photographyScore: 8 })
        ]
      },

      {
        id: "udaipur", stateId: "rajasthan", name: "Udaipur",
        description: "White palaces, lakes and living Rajput heritage.",
        themes: ["LAKES", "PALACES", "HERITAGE"],
        coords: [24.5854, 73.7125],
        bestTime: "September – March",
        tags: ["heritage", "architecture", "culture", "photography", "couples", "sunset"],
        heroGradient: "linear-gradient(135deg,#16323f 0%,#2a5a6a 35%,#4a8a8a 65%,#c8e0dc 100%)",
        historySummary: "Founded in 1559 by Maharana Udai Singh II as the new capital of Mewar after Chittorgarh's fall, Udaipur grew around artificial lakes and white marble palaces. It remains the historic seat of the House of Mewar and one of India's most photographed cities.",
        image: img("assets/districts/udaipur.jpg", "Udaipur's Lake Pichola with City Palace and lake palaces at dusk, Rajasthan", "generated"),
        status: "verified",
        places: [
          P({ id: "city-palace-udaipur", name: "City Palace Udaipur", priority: 1, type: "Palace",
              shortDescription: "White palace complex rising over Lake Pichola — balconies, courtyards and the Mewar museums.",
              coordinates: [24.5764, 73.6835], tags: ["heritage", "architecture", "photography", "history", "culture"],
              durationMin: 150, bestTime: "Morning", photographyScore: 9.5, heritageScore: 10 }),
          P({ id: "lake-pichola", name: "Lake Pichola", priority: 2, type: "Lake",
              shortDescription: "Historic lake ride past Jag Mandir with the Aravalli hills behind the water.",
              coordinates: [24.5721, 73.6800], tags: ["nature", "photography", "sunset", "couples"],
              durationMin: 75, bestTime: "Sunset", photographyScore: 9, natureScore: 8 }),
          P({ id: "jagdish-temple-udaipur", name: "Jagdish Temple", priority: 3, type: "Temple",
              shortDescription: "17th-century Indo-Aryan temple with a carved stone tower.",
              coordinates: [24.5814, 73.6834], tags: ["spiritual", "heritage", "architecture"],
              durationMin: 45, bestTime: "Morning", heritageScore: 8 }),
          P({ id: "bagore-ki-haveli", name: "Bagore Ki Haveli", priority: 4, type: "Heritage",
              shortDescription: "18th-century haveli on Gangori Ghat, home to the evening Rajasthani dance show.",
              coordinates: [24.5794, 73.6827], tags: ["heritage", "culture", "photography"],
              durationMin: 75, bestTime: "Evening", cultureScore: 9 }),
          P({ id: "saheliyon-ki-bari", name: "Saheliyon Ki Bari", priority: 5, type: "Garden",
              shortDescription: "Fountain garden built for the royal ladies of the court.",
              coordinates: [24.6107, 73.7028], tags: ["nature", "heritage", "family", "couples"],
              durationMin: 45, bestTime: "Morning" }),
          P({ id: "fateh-sagar-lake", name: "Fateh Sagar Lake", priority: 6, type: "Lake",
              shortDescription: "Lakeside promenade and island restaurants beneath the hills.",
              coordinates: [24.6050, 73.6800], tags: ["nature", "sunset", "family", "food"],
              durationMin: 60, bestTime: "Sunset" }),
          P({ id: "sajjangarh-monsoon-palace", name: "Sajjangarh (Monsoon Palace)", priority: 7, type: "Palace",
              shortDescription: "Hilltop white palace with sweeping sunset views over Udaipur's lakes.",
              coordinates: [24.5950, 73.6550], tags: ["heritage", "photography", "sunset", "nature"],
              durationMin: 90, bestTime: "Sunset", photographyScore: 9 })
        ]
      }
    ],

    /* ==================== KERALA ==================== */
    "kerala": [

      {
        id: "ernakulam", stateId: "kerala", name: "Ernakulam (Kochi)",
        description: "Kochi's harbour heritage — spice-quarter streets, Chinese nets and island beaches.",
        themes: ["HERITAGE", "HARBOUR", "CULTURE"],
        coords: [9.9700, 76.2900],
        bestTime: "October – March",
        tags: ["heritage", "culture", "photography", "food", "sunset", "spiritual"],
        heroGradient: "linear-gradient(135deg,#1d3a2f 0%,#2f6a4a 35%,#6a9a5a 65%,#e0d8b8 100%)",
        historySummary: "Kochi grew as a spice-trading port where Arab, Chinese, Portuguese, Dutch and Jewish traders left layered heritage across Fort Kochi and Mattancherry. Its harbour, Chinese fishing nets and living syncretic culture make it Kerala's historic gateway.",
        image: img("assets/districts/ernakulam.jpg", "Chinese fishing nets silhouetted at sunset on the Kochi harbour front, Kerala", "generated"),
        status: "verified",
        places: [
          P({ id: "fort-kochi", name: "Fort Kochi", priority: 1, type: "Heritage",
              shortDescription: "Colonial harbour quarter of quiet lanes, cafés and centuries of traded heritage.",
              coordinates: [9.9650, 76.2420], tags: ["heritage", "culture", "photography", "history", "food"],
              durationMin: 120, bestTime: "Morning", photographyScore: 9, heritageScore: 9, cultureScore: 9,
              image: img("assets/places/fort-kochi.jpg", "Fort Kochi street with colonial façades and Chinese fishing nets, Kerala", "generated") }),
          P({ id: "chinese-fishing-nets", name: "Chinese Fishing Nets", priority: 2, type: "Landmark",
              shortDescription: "Iconic cantilevered shore nets — best silhouetted at sunset.",
              coordinates: [9.9680, 76.2430], tags: ["photography", "sunset", "culture", "heritage"],
              durationMin: 45, bestTime: "Sunset", photographyScore: 9 }),
          P({ id: "mattancherry-palace", name: "Mattancherry Palace", priority: 3, type: "Palace",
              shortDescription: "Portuguese-built palace housing Kerala's finest murals of the Ramayana.",
              coordinates: [9.9580, 76.2590], tags: ["heritage", "architecture", "history", "culture"],
              durationMin: 60, bestTime: "Morning", heritageScore: 9 }),
          P({ id: "paradesi-synagogue", name: "Paradesi Synagogue", priority: 4, type: "Heritage",
              shortDescription: "16th-century synagogue of the historic Jewish quarter, with hand-painted Cantonese tiles.",
              coordinates: [9.9585, 76.2592], tags: ["heritage", "history", "culture", "spiritual"],
              durationMin: 45, bestTime: "Morning", heritageScore: 9 }),
          P({ id: "st-francis-church", name: "St. Francis Church", priority: 5, type: "Church",
              shortDescription: "India's oldest European church, first resting place of Vasco da Gama.",
              coordinates: [9.9660, 76.2430], tags: ["heritage", "history", "spiritual", "architecture"],
              durationMin: 45, bestTime: "Morning", heritageScore: 9 }),
          P({ id: "marine-drive-kochi", name: "Marine Drive", priority: 6, type: "Promenade",
              shortDescription: "Harbour-front promenade with backwater cruises and evening breeze.",
              coordinates: [9.9860, 76.2760], tags: ["sunset", "food", "family", "culture"],
              durationMin: 60, bestTime: "Evening" }),
          P({ id: "cherai-beach", name: "Cherai Beach", priority: 7, type: "Beach",
              shortDescription: "Calm island beach where backwater lanes meet the sea.",
              coordinates: [10.1430, 76.2180], tags: ["nature", "sunset", "family", "couples"],
              durationMin: 90, bestTime: "Sunset", natureScore: 8 }),
          P({ id: "kathakali-centre-kochi", name: "Kathakali Performance", priority: 8, type: "Culture",
              shortDescription: "Evening performances of Kerala's classical dance-drama, with make-up demonstrations.",
              coordinates: [9.9650, 76.2440], tags: ["culture", "heritage", "family"],
              durationMin: 90, bestTime: "Evening", cultureScore: 10 })
        ]
      },

      {
        id: "idukki", stateId: "kerala", name: "Idukki (Munnar)",
        description: "Tea hills, shola grasslands and the high Western Ghats around Munnar.",
        themes: ["TEA", "MOUNTAINS", "NATURE"],
        coords: [10.0650, 77.0600],
        bestTime: "September – May",
        tags: ["nature", "trekking", "photography", "family", "sunrise"],
        heroGradient: "linear-gradient(135deg,#12281c 0%,#255c3a 35%,#4a8a4a 65%,#cfe0b8 100%)",
        historySummary: "Munnar's hills were planted with tea in the late 19th century, transforming high-altitude shola grasslands into one of the world's great tea landscapes. The district protects rare endemic wildlife, including the Nilgiri tahr of Eravikulam.",
        status: "verified",
        places: [
          P({ id: "eravikulam-national-park", name: "Eravikulam National Park", priority: 1, type: "National Park",
              shortDescription: "Rolling grassland park home to the endangered Nilgiri tahr.",
              coordinates: [10.2700, 77.0700], tags: ["nature", "wildlife", "trekking", "photography", "family"],
              durationMin: 120, bestTime: "Morning", natureScore: 10, photographyScore: 9 }),
          P({ id: "munnar-tea-museum", name: "KDHP Tea Museum", priority: 2, type: "Museum",
              shortDescription: "Working museum tracing Munnar's plantation history with tastings and demonstrations.",
              coordinates: [10.0830, 77.0620], tags: ["culture", "heritage", "food", "family"],
              durationMin: 60, bestTime: "Daytime", cultureScore: 8 }),
          P({ id: "mattupetty-dam", name: "Mattupetty Dam", priority: 3, type: "Lake",
              shortDescription: "Still lake and dairy hills framed by tea gardens.",
              coordinates: [10.0500, 77.0200], tags: ["nature", "photography", "family"],
              durationMin: 60, bestTime: "Morning" }),
          P({ id: "top-station", name: "Top Station", priority: 4, type: "Viewpoint",
              shortDescription: "Cliff-edge viewpoint at the Kerala–Tamil Nadu border looking into the Theni valley.",
              coordinates: [10.1000, 77.2760], tags: ["nature", "photography", "sunrise", "trekking"],
              durationMin: 90, bestTime: "Morning", photographyScore: 9 }),
          P({ id: "attukad-waterfalls", name: "Attukad Waterfalls", priority: 5, type: "Waterfall",
              shortDescription: "Broad waterfall between tea slopes, thunderous after the rains.",
              coordinates: [10.0350, 77.0450], tags: ["nature", "photography", "trekking"],
              durationMin: 60, bestTime: "Morning", natureScore: 8 }),
          P({ id: "pothamedu-viewpoint", name: "Pothamedu Viewpoint", priority: 6, type: "Viewpoint",
              shortDescription: "Ridge viewpoint over Munnar's tea carpet and deep valley mist.",
              coordinates: [10.0750, 77.0450], tags: ["nature", "photography", "sunrise", "couples"],
              durationMin: 45, bestTime: "Sunrise", photographyScore: 8.5 })
        ]
      }
    ],

    /* ==================== TAMIL NADU ==================== */
    "tamil-nadu": [

      {
        id: "madurai", stateId: "tamil-nadu", name: "Madurai",
        description: "One of India's oldest living cities, organised around the Meenakshi temple.",
        themes: ["TEMPLES", "CULTURE", "HERITAGE"],
        coords: [9.9252, 78.1198],
        bestTime: "November – February",
        tags: ["heritage", "spiritual", "architecture", "culture", "photography", "food"],
        heroGradient: "linear-gradient(135deg,#3a1420 0%,#7a2a3a 35%,#b85a3a 65%,#e8c090 100%)",
        historySummary: "Madurai has been a temple city and Tamil cultural capital for over two millennia, ruled by the Pandyas and later the Nayakas, whose 17th-century palace and city plan still shape it. The Meenakshi Amman temple remains one of India's great living pilgrimage centres.",
        image: img("assets/districts/madurai.jpg", "Meenakshi Amman temple gopurams rising over Madurai's old city, Tamil Nadu", "generated"),
        status: "verified",
        places: [
          P({ id: "meenakshi-temple", name: "Meenakshi Amman Temple", priority: 1, type: "Temple",
              shortDescription: "Vividly sculpted gopurams, a thousand-pillar hall and a living ritual economy.",
              coordinates: [9.9195, 78.1193], tags: ["spiritual", "heritage", "architecture", "photography", "culture"],
              durationMin: 150, bestTime: "Morning", photographyScore: 9.5, heritageScore: 10, cultureScore: 10,
              image: img("assets/places/meenakshi-temple.jpg", "Carved mythological figures covering a Meenakshi temple gopuram, Madurai", "generated") }),
          P({ id: "thirumalai-nayakkar-palace", name: "Thirumalai Nayakkar Palace", priority: 2, type: "Palace",
              shortDescription: "Grand 17th-century Nayaka palace court with massive pillars and stucco work.",
              coordinates: [9.9187, 78.1265], tags: ["heritage", "architecture", "history", "photography"],
              durationMin: 60, bestTime: "Daytime", heritageScore: 8 }),
          P({ id: "gandhi-memorial-museum", name: "Gandhi Memorial Museum", priority: 3, type: "Museum",
              shortDescription: "One of the five Gandhi museums of India, housing the blood-stained khadi of his assassination.",
              coordinates: [9.9290, 78.1210], tags: ["history", "culture", "heritage"],
              durationMin: 60, bestTime: "Daytime" }),
          P({ id: "alagar-kovil", name: "Alagar Kovil", priority: 4, type: "Temple",
              shortDescription: "Forest Vishnu temple in the Alagar hills, goal of the famous Chithirai festival procession.",
              coordinates: [9.9950, 78.1550], tags: ["spiritual", "heritage", "nature"],
              durationMin: 90, bestTime: "Morning" }),
          P({ id: "vandiyur-mariamman-teppakulam", name: "Vandiyur Mariamman Teppakulam", priority: 5, type: "Heritage",
              shortDescription: "Vast stone tank with a mid-water temple pavilion, stage of the float festival.",
              coordinates: [9.8990, 78.1350], tags: ["heritage", "spiritual", "photography"],
              durationMin: 45, bestTime: "Sunset" }),
          P({ id: "samanar-malai", name: "Samanar Malai", priority: 6, type: "Heritage",
              shortDescription: "Jain hill with ancient rock beds, inscriptions and carvings, quietly above the city.",
              coordinates: [9.9200, 78.1100], tags: ["heritage", "hidden", "trekking", "nature", "sunrise"],
              durationMin: 60, bestTime: "Sunrise", natureScore: 6 })
        ]
      },

      {
        id: "thanjavur", stateId: "tamil-nadu", name: "Thanjavur",
        description: "Chola imperial capital and India's great temple of Brihadeeswarar.",
        themes: ["TEMPLES", "ART", "HERITAGE"],
        coords: [10.7870, 79.1378],
        bestTime: "November – February",
        tags: ["heritage", "spiritual", "architecture", "culture", "history", "photography"],
        heroGradient: "linear-gradient(135deg,#2a1f14 0%,#5a4530 35%,#8a7a4a 65%,#e0d0a8 100%)",
        historySummary: "Thanjavur was the capital of the Chola empire at its height. Raja Raja I's Brihadeeswarar Temple (1010 CE) is a UNESCO World Heritage Site, and the city later became a centre of Tanjore painting, classical music and Tamil scholarship under the Nayakas and Marathas.",
        status: "verified",
        places: [
          P({ id: "brihadeeswarar-temple", name: "Brihadeeswarar Temple", priority: 1, type: "Temple",
              shortDescription: "UNESCO-listed Chola great temple — a 66-metre vimana raised over a thousand years ago.",
              coordinates: [10.7825, 79.1390], tags: ["heritage", "spiritual", "architecture", "photography", "history"],
              durationMin: 120, bestTime: "Morning", photographyScore: 9.5, heritageScore: 10 }),
          P({ id: "thanjavur-royal-palace", name: "Thanjavur Royal Palace", priority: 2, type: "Palace",
              shortDescription: "Maratha-Nayaka palace complex of halls, arsenal and the bell tower.",
              coordinates: [10.7845, 79.1350], tags: ["heritage", "architecture", "history"],
              durationMin: 90, bestTime: "Daytime", heritageScore: 8 }),
          P({ id: "saraswathi-mahal-library", name: "Saraswathi Mahal Library", priority: 3, type: "Museum",
              shortDescription: "One of Asia's oldest libraries, with palm-leaf manuscripts of the royal court.",
              coordinates: [10.7847, 79.1358], tags: ["history", "culture", "heritage"],
              durationMin: 45, bestTime: "Daytime" }),
          P({ id: "sivaganga-park", name: "Sivaganga Park", priority: 4, type: "Park",
              shortDescription: "Garden and tank beside the great temple, with a toy train for children.",
              coordinates: [10.7810, 79.1370], tags: ["family", "nature"],
              durationMin: 45, bestTime: "Evening" })
        ]
      }
    ],

    /* ==================== GOA ==================== */
    "goa": [

      {
        id: "north-goa", stateId: "goa", name: "North Goa",
        description: "Beach villages, Portuguese-era Old Goa and headland forts.",
        themes: ["BEACHES", "FORTS", "HERITAGE"],
        coords: [15.5527, 73.7517],
        bestTime: "November – February",
        tags: ["beaches", "heritage", "food", "sunset", "family", "couples", "adventure"],
        heroGradient: "linear-gradient(135deg,#15303a 0%,#2a6a6a 35%,#5aaa8a 65%,#e8d8a8 100%)",
        historySummary: "North Goa holds Old Goa, the 16th-century capital of Portuguese Asia whose churches are a UNESCO World Heritage Site, alongside fishing-village coast that became India's most famous beach belt.",
        image: img("assets/districts/north-goa.jpg", "Palm-lined North Goa beach with white chapel façade and wooden fishing boats", "generated"),
        status: "verified",
        places: [
          P({ id: "basilica-of-bom-jesus", name: "Basilica of Bom Jesus", priority: 1, type: "Church",
              shortDescription: "UNESCO-listed baroque basilica holding the tomb of St. Francis Xavier.",
              coordinates: [15.5005, 73.9115], tags: ["heritage", "spiritual", "architecture", "history", "photography"],
              durationMin: 60, bestTime: "Morning", heritageScore: 10, photographyScore: 8.5 }),
          P({ id: "se-cathedral", name: "Se Cathedral", priority: 2, type: "Church",
              shortDescription: "One of Asia's largest churches, dedicated to St. Catherine of Alexandria.",
              coordinates: [15.5027, 73.9100], tags: ["heritage", "spiritual", "architecture", "history"],
              durationMin: 45, bestTime: "Morning", heritageScore: 9 }),
          P({ id: "fort-aguada", name: "Fort Aguada", priority: 3, type: "Fort",
              shortDescription: "Portuguese headland fort and lighthouse guarding the Mandovi mouth.",
              coordinates: [15.6459, 73.7546], tags: ["heritage", "photography", "sunset", "history"],
              durationMin: 75, bestTime: "Sunset", photographyScore: 8.5 }),
          P({ id: "calangute-beach", name: "Calangute Beach", priority: 4, type: "Beach",
              shortDescription: "The long 'queen of beaches' — water sports, shacks and family crowds.",
              coordinates: [15.5390, 73.7530], tags: ["beaches", "family", "adventure", "sunset", "food"],
              durationMin: 120, bestTime: "Afternoon", natureScore: 7 }),
          P({ id: "baga-beach", name: "Baga Beach", priority: 5, type: "Beach",
              shortDescription: "Beach shacks, creek and the liveliest nightlife strip in Goa.",
              coordinates: [15.5553, 73.7520], tags: ["beaches", "food", "sunset", "adventure"],
              durationMin: 120, bestTime: "Evening" }),
          P({ id: "anjuna-beach", name: "Anjuna Beach", priority: 6, type: "Beach",
              shortDescription: "Rock-fringed beach of the long-running Wednesday flea market.",
              coordinates: [15.5740, 73.7410], tags: ["beaches", "markets", "sunset", "food", "couples"],
              durationMin: 90, bestTime: "Sunset" }),
          P({ id: "chapora-fort", name: "Chapora Fort", priority: 7, type: "Fort",
              shortDescription: "Riverside headland fort with wide views over Vagator's red cliffs.",
              coordinates: [15.6067, 73.7367], tags: ["heritage", "photography", "sunset", "hidden"],
              durationMin: 60, bestTime: "Sunset", photographyScore: 8.5 }),
          P({ id: "mapusa-friday-market", name: "Mapusa Market", priority: 8, type: "Market",
              shortDescription: "Goan town market of spiced sausages, cashew feni, chouriço and pottery.",
              coordinates: [15.5930, 73.8130], tags: ["markets", "food", "culture"],
              durationMin: 60, bestTime: "Morning", cultureScore: 8 })
        ]
      },

      {
        id: "south-goa", stateId: "goa", name: "South Goa",
        description: "Quieter sands, forest waterfalls and temple villages.",
        themes: ["BEACHES", "NATURE", "HERITAGE"],
        coords: [15.2283, 74.0180],
        bestTime: "November – February",
        tags: ["beaches", "nature", "spiritual", "couples", "family", "adventure"],
        heroGradient: "linear-gradient(135deg,#0f2a26 0%,#1f5a4a 35%,#4a9a7a 65%,#e8e2c8 100%)",
        historySummary: "South Goa keeps the state's quieter side — long white-sand beaches, sacred groves and Bhagwan Mahaveer sanctuary, where the Dudhsagar falls drop through the Western Ghats on the Karnataka border.",
        image: img("assets/districts/south-goa.jpg", "Empty white-sand crescent of Palolem beach fringed by coconut palms, South Goa", "generated"),
        status: "verified",
        places: [
          P({ id: "palolem-beach", name: "Palolem Beach", priority: 1, type: "Beach",
              shortDescription: "Crescent bay of gentle water, kayak hire and beach huts.",
              coordinates: [15.0093, 74.0220], tags: ["beaches", "couples", "family", "sunset", "nature"],
              durationMin: 120, bestTime: "Sunset", natureScore: 9 }),
          P({ id: "dudhsagar-falls", name: "Dudhsagar Falls", priority: 2, type: "Waterfall",
              shortDescription: "Four-tiered 'sea of milk' waterfall plunging 310 metres inside Bhagwan Mahaveer sanctuary.",
              coordinates: [15.3144, 74.3144], tags: ["nature", "adventure", "photography", "trekking"],
              durationMin: 240, bestTime: "Morning", natureScore: 10, photographyScore: 9.5 }),
          P({ id: "colva-beach", name: "Colva Beach", priority: 3, type: "Beach",
              shortDescription: "Long white beach and village promenade of South Goa.",
              coordinates: [15.2794, 73.9200], tags: ["beaches", "family", "sunset", "food"],
              durationMin: 90, bestTime: "Sunset" }),
          P({ id: "cabo-de-rama", name: "Cabo de Rama Fort", priority: 4, type: "Fort",
              shortDescription: "Cliff fort with rampart walks and a chapel above two empty coves.",
              coordinates: [15.0080, 74.0250], tags: ["heritage", "hidden", "photography", "sunset"],
              durationMin: 60, bestTime: "Sunset", photographyScore: 8.5 }),
          P({ id: "agonda-beach", name: "Agonda Beach", priority: 5, type: "Beach",
              shortDescription: "Quiet turtle-nesting beach with a single lane of cafés.",
              coordinates: [14.9720, 74.0350], tags: ["beaches", "couples", "nature", "hidden"],
              durationMin: 90, bestTime: "Sunset" }),
          P({ id: "sri-mangueshi-temple", name: "Sri Mangueshi Temple", priority: 6, type: "Temple",
              shortDescription: "White-and-ochre Goan temple with its distinctive deepa stambha lamp tower.",
              coordinates: [15.4780, 74.0280], tags: ["spiritual", "heritage", "architecture"],
              durationMin: 45, bestTime: "Morning" })
        ]
      }
    ],

    /* ==================== HIMACHAL PRADESH ==================== */
    "himachal-pradesh": [

      {
        id: "shimla", stateId: "himachal-pradesh", name: "Shimla",
        description: "The former summer capital of British India, wrapped around a Himalayan ridge.",
        themes: ["COLONIAL", "MOUNTAINS", "NATURE"],
        coords: [31.1048, 77.1734],
        bestTime: "March – June, December – January (snow)",
        tags: ["heritage", "nature", "photography", "family", "trekking", "food", "markets"],
        heroGradient: "linear-gradient(135deg,#1a2436 0%,#3a5a7a 35%,#7a9ab8 65%,#e8eef4 100%)",
        historySummary: "Shimla began as a hill village, became the summer capital of British India from 1864, and grew into a town of colonial institutions, churches and the Kalka–Shimla railway — a UNESCO World Heritage line.",
        image: img("assets/districts/shimla.jpg", "Snow-dusted deodar ridges above Shimla's colonial rooftops, Himachal Pradesh", "generated"),
        status: "verified",
        places: [
          P({ id: "the-ridge-shimla", name: "The Ridge", priority: 1, type: "Viewpoint",
              shortDescription: "Open promenade at the top of town with a stage-set mountain backdrop.",
              coordinates: [31.1044, 77.1734], tags: ["photography", "sunset", "culture", "family"],
              durationMin: 60, bestTime: "Sunset", photographyScore: 9 }),
          P({ id: "mall-road-shimla", name: "Mall Road", priority: 2, type: "Market",
              shortDescription: "Pedestrian spine of cafés, bakeries and colonial shopfronts.",
              coordinates: [31.1040, 77.1720], tags: ["markets", "food", "culture", "photography"],
              durationMin: 90, bestTime: "Evening" }),
          P({ id: "jakhoo-temple", name: "Jakhoo Temple", priority: 3, type: "Temple",
              shortDescription: "Hilltop Hanuman temple above the tallest statue in the region, wrapped in cedar forest.",
              coordinates: [31.1110, 77.1770], tags: ["spiritual", "trekking", "nature", "photography"],
              durationMin: 90, bestTime: "Morning" }),
          P({ id: "christ-church-shimla", name: "Christ Church", priority: 4, type: "Church",
              shortDescription: "Neo-gothic church of 1857 whose clock tower defines the Ridge skyline.",
              coordinates: [31.1046, 77.1710], tags: ["heritage", "architecture", "photography", "spiritual"],
              durationMin: 45, bestTime: "Morning", heritageScore: 8 }),
          P({ id: "viceregal-lodge", name: "Viceregal Lodge (IIAS)", priority: 5, type: "Heritage",
              shortDescription: "Elizabethan-style summer residence of the Viceroys, now an institute of advanced study.",
              coordinates: [31.1110, 77.1580], tags: ["heritage", "architecture", "history"],
              durationMin: 75, bestTime: "Daytime", heritageScore: 9 }),
          P({ id: "kufri", name: "Kufri", priority: 6, type: "Hill Station",
              shortDescription: "Snow-point hill station with pony trails and an apple orchard zoo park.",
              coordinates: [31.0960, 77.2650], tags: ["nature", "family", "adventure", "photography"],
              durationMin: 120, bestTime: "Morning", natureScore: 8 }),
          P({ id: "annandale-shimla", name: "Annandale", priority: 7, type: "Nature",
              shortDescription: "Horseshoe meadow that was Simla's racecourse, now a golf and recreation ground.",
              coordinates: [31.1070, 77.1620], tags: ["nature", "family", "adventure"],
              durationMin: 60, bestTime: "Morning" })
        ]
      },

      {
        id: "kullu-manali", stateId: "himachal-pradesh", name: "Kullu / Manali",
        description: "Cedar valleys, snow passes and river-side villages of the Beas.",
        themes: ["SNOW", "VALLEYS", "ADVENTURE"],
        coords: [31.9578, 77.1887],
        bestTime: "October – June",
        tags: ["adventure", "nature", "trekking", "spiritual", "food", "couples", "family"],
        heroGradient: "linear-gradient(135deg,#141c2e 0%,#2e4a6a 35%,#6a8aa8 65%,#e4ecf2 100%)",
        historySummary: "The Kullu valley was a cluster of mountain kingdoms tied together by the Raghunath deity's processions. Manali, at the head of the valley on the old trade route to Ladakh, became India's adventure-tourism capital for skiing, paragliding and trekking.",
        image: img("assets/districts/kullu-manali.jpg", "Deodar forest slopes and snow peaks above the Beas river at Manali, Himachal Pradesh", "generated"),
        status: "verified",
        places: [
          P({ id: "hadimba-temple", name: "Hadimba Temple", priority: 1, type: "Temple",
              shortDescription: "1553 cedar-wood pagoda shrine to Hadimba in a deodar grove.",
              coordinates: [32.2430, 77.1780], tags: ["spiritual", "heritage", "architecture", "nature", "photography"],
              durationMin: 60, bestTime: "Morning", heritageScore: 8 }),
          P({ id: "solang-valley", name: "Solang Valley", priority: 2, type: "Adventure",
              shortDescription: "Meadow adventure arena — paragliding, zorbing and winter skiing.",
              coordinates: [32.3190, 77.1560], tags: ["adventure", "nature", "family", "photography"],
              durationMin: 180, bestTime: "Morning", natureScore: 9 }),
          P({ id: "rohtang-pass", name: "Rohtang Pass", priority: 3, type: "Mountain Pass",
              shortDescription: "3,978-metre pass with snow fields most of the year (seasonal access, permits required).",
              coordinates: [32.3710, 77.2450], tags: ["adventure", "nature", "photography", "trekking"],
              durationMin: 240, bestTime: "Morning", natureScore: 10, accessibilityScore: 5 }),
          P({ id: "old-manali", name: "Old Manali", priority: 4, type: "Village",
              shortDescription: "Village lanes, orchards and bakeries upstream of the town bridge.",
              coordinates: [32.2530, 77.1760], tags: ["food", "hidden", "sunset", "nature", "couples"],
              durationMin: 120, bestTime: "Evening" }),
          P({ id: "vashisht-village", name: "Vashisht Village & Baths", priority: 5, type: "Village",
              shortDescription: "Old stone village with hot-spring bath houses and carved temples.",
              coordinates: [32.2590, 77.1890], tags: ["spiritual", "heritage", "hidden"],
              durationMin: 90, bestTime: "Morning" }),
          P({ id: "naggar-castle", name: "Naggar Castle", priority: 6, type: "Heritage",
              shortDescription: "Stone-and-timber castle of the Kullu kings, now a heritage museum.",
              coordinates: [32.1230, 77.1730], tags: ["heritage", "history", "architecture"],
              durationMin: 75, bestTime: "Daytime", heritageScore: 8 })
        ]
      }
    ]
  };

  /* ---------- Heritage circuits (reusable collections) ----------
   * placeIds use prefixed references resolved by india-destinations.js:
   *   "legacy:<id>"        -> data.js heritage-circuit destination
   *   "kd:<district>/<place>" -> districts.js Karnataka place
   *   "in:<district>/<place>" -> this module's curated place
   *   "archive:<state>/<slug>" -> national heritage archive place
   * Only circuits with sufficient verified destination data are defined. */
  const circuits = [
    {
      id: "hoysala-heritage-circuit",
      name: "Hoysala Heritage Circuit",
      theme: "12th-century temple architecture",
      description: "Belur, Halebidu and Somanathapura — the star-platform temples of the Hoysala empire.",
      estimatedDuration: "2 days",
      anchorDistrictId: "halebidu",
      placeIds: ["legacy:belur", "legacy:halebidu", "kd:mysuru/somanathapura"]
    },
    {
      id: "chalukya-heritage-circuit",
      name: "Chalukya Heritage Circuit",
      theme: "Early & Kalyani Chalukya architecture",
      description: "Badami's cave temples with Aihole's workshop-town and Pattadakal's UNESCO ensemble.",
      estimatedDuration: "2 days",
      anchorDistrictId: "badami",
      placeIds: ["legacy:badami", "legacy:aihole", "legacy:pattadakal", "legacy:haveri"]
    },
    {
      id: "vijayanagara-circuit",
      name: "Vijayanagara Circuit",
      theme: "Imperial capital of the Deccan",
      description: "Hampi's boulder landscape of temples, bazaars and royal enclosures.",
      estimatedDuration: "2–3 days",
      anchorDistrictId: "hampi",
      placeIds: ["legacy:hampi", "kd:vijayanagara/virupaksha", "kd:vijayanagara/vittala", "kd:vijayanagara/royal-enclosure"]
    },
    {
      id: "rajasthan-fort-circuit",
      name: "Rajasthan Fort Circuit",
      theme: "Rajput forts of the Aravallis",
      description: "Amber and Nahargarh in Jaipur, linking to Kumbhalgarh's 36-km wall in the heritage archive.",
      estimatedDuration: "3 days",
      anchorDistrictId: "jaipur",
      placeIds: ["in:jaipur/amber-fort", "in:jaipur/nahargarh-fort", "archive:rajasthan/kumbhalgarh"]
    },
    {
      id: "kerala-heritage-circuit",
      name: "Kerala Heritage Circuit",
      theme: "Spice-port heritage of Malabar",
      description: "Fort Kochi, Mattancherry and the Paradesi synagogue — seven centuries of harbour trade.",
      estimatedDuration: "2 days",
      anchorDistrictId: "ernakulam",
      placeIds: ["in:ernakulam/fort-kochi", "in:ernakulam/mattancherry-palace", "in:ernakulam/paradesi-synagogue", "in:ernakulam/st-francis-church"]
    }
  ];

  return { districts, circuits };
})();
