GEARUP N GOO — Journey Intelligence Platform
Client-side SPA (hash routing, Leaflet maps, no build step).
Routes: #/ home · #/explore · #/guides · #/history · #/planner · #/destination/:slug · #/history/:state/:place

Step 02 — India-wide destination hierarchy
India → State / UT → District → Top tourist places → Place details → Add to journey → Interests → Generate.


india-destinations.js
 — the destination service: 36 states/UTs + merge logic + search + circuits API (GNGIndiaDestinations)

india-places.js
 — curated districts & top places (RJ · KL · TN · GA · HP) + heritage circuits data

india.css
 — drilldown UI styles (.in-* namespace)
Karnataka districts are imported live from 
districts.js
 (no duplication); states without curated data get archive-derived partial districts from the National Heritage Archive; states with no data at all show an honest "coming soon" panel.
Selection uses stable IDs: state.wizard.destination (district id, feeds the existing engine via resolveTarget) + state.wizard.destinationSelection ({country, stateId, districtId, selectedPlaceIds}).
Adding a state later = adding data objects; the UI is fully generic (no per-state code).
Adding a new state's districts (example)
Append to GNGIndiaPlaces.districts:

JavaScript

"kerala": [{ id: "ernakulam", stateId: "kerala", name: "Ernakulam (Kochi)",
  description, themes: ["HERITAGE","HARBOUR","CULTURE"], coords, bestTime, tags: [],
  heroGradient, historySummary, image: {src,alt,credit,source,status}, status: "verified",
  places: [{ id, name, priority: 1, type, shortDescription, coordinates, tags: [],
             durationMin, bestTime, photographyScore, …scores, verified: true, image }] }]
then flip the state's status: "verified" + featured in 
india-destinations.js
.

Run
Any static server, e.g. python3 -m http.server 5501 (matches 
settings.json
 / VS Code Live Server).

Asset layout (filenames are EXACT — see 
heritage-images.js
)
text

assets/
  brand-logo-cropped.png        # navbar + account modal + footer logo
  hero-hampi.jpg                # home hero background (also reused for hampi-vijayanagara.jpg)
  states/<state>.jpg            # 36 state cards            → 14 present (10 photos + 4 generated)
  districts/<district>.png|jpg  # district cards            → 8 present (7 KA photos + jaipur generated)
  places/<place>.jpg            # top-place hero cards      → 0 present (fallback covers)
  heritage/<state>/<place>.jpg  # 60 archive place photos   → 7/60 present (AP ×6 + hampi)
Missing images never break the UI: state/district/place cards fall back to a tinted
destination-name panel (__inImgFail in app.js); heritage archive shows its own
"Image pending" tile with the exact filename.

Image workflow
Bash

node tools/heritage-images.js sync     # copy uploads (exact names) into assets/heritage/<state>/
node tools/heritage-images.js inject   # add image: field to heritage-data-*.js (idempotent)
node tools/heritage-images.js verify   # report missing files
AI-generated images are labelled in data as status: "generated" with an explicit
credit line, and never presented as photographs.

Status — 2026-08-30 (after India-wide upgrade)
Data: 36 states/UTs · curated verified districts: Karnataka (7, imported), Rajasthan
(Jaipur, Udaipur), Kerala (Ernakulam, Idukki), Tamil Nadu (Madurai, Thanjavur), Goa
(North, South), Himachal (Shimla, Kullu-Manali) · archive-derived partial districts for
9 more states (MH, MP, GJ, OD, AP, TG, UP + KA/RJ extras) · 5 heritage circuits.

Images pending (generation limit hit; run next session): state cards — delhi,
west-bengal, punjab, uttarakhand, jammu-kashmir, andaman-nicobar; district cards —
ernakulam, udaipur, madurai, north-goa, south-goa, shimla, kullu-manali; place heroes —
amber-fort, meenakshi-temple, fort-kochi.

Heritage archive photos still missing (upload with exact names, then run sync):
karnataka (pattadakal, aihole, badami-cave-temples, belur, halebidu) · rajasthan
(chand-baori, bhangarh-fort, mandawa, kumbhalgarh-fort, harshnath-temple, neemrana-fort)
· madhya-pradesh (bhimbetka-rock-shelters, orchha, chanderi, bagh-caves, mandu, sanchi)
· gujarat (dholavira, lothal, champaner-pavagadh, rani-ki-vav, adalaj-stepwell,
polo-forest) · maharashtra (ajanta-caves, ellora-caves, daulatabad-devagiri-fort,
kanheri-caves, paithan, bibi-ka-maqbara) · odisha (udayagiri-khandagiri-caves,
ratnagiri, lalitgiri, chausathi-yogini-hirapur, barabati-fort, dhauli-ashokan-edicts)
· tamil-nadu (gingee-fort, sittannavasal, tharangambadi, gangaikonda-cholapuram,
kodumbalur-moovarkoil, thirumayam-fort) · uttar-pradesh (kalinjar-fort,
deogarh-dashavatara-temple, bateshwar, chunar-fort, sankisa, kaushambi) · telangana
(ramappa-temple, warangal-fort, thousand-pillar-temple, qutb-shahi-tombs,
elagandhal-fort, dharmapuri-buddhist-heritage)