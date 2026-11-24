/* ============================================================
 * GEARUP N GOO — LIVE JOURNEY ENGINE
 *
 * Adds:
 *  - START JOURNEY / PAUSE / RESUME / END
 *  - Real Geolocation (navigator.geolocation.watchPosition)
 *  - DEMO MODE simulation along route geometry when GPS unavailable
 *  - Current location marker with heading & pulse
 *  - Route segment rendering (completed / active / upcoming)
 *  - Stop state machine: UPCOMING → NEXT → ACTIVE → ARRIVED →
 *                        VISITING → COMPLETED / SKIPPED
 *  - Map ↔ timeline sync (click marker → scroll timeline; click
 *    timeline → focus map)
 *  - Marker hover preview & click compact popup
 *  - Nearby discovery layer
 *  - Live stats (distance remaining, ETA, elapsed time, progress)
 *  - Follow mode / recenter / pause / resume / skip / complete
 *  - Mobile Map/Journey toggle
 *  - Journey complete summary
 *  - GPS smoothing, accuracy filter, heading tracking
 * ============================================================ */

(() => {
  "use strict";

  // Expose the live state on window so app.js can initialize us after render
  window.GngLiveJourney = (function(){

    // ---------- State ----------
    const live = {
      isStarted: false,
      isPaused: false,
      isComplete: false,
      mode: "idle", // idle | gps | demo
      currentLocation: null,  // {lat, lng, heading, accuracy, timestamp}
      smoothedLocation: null,
      currentStopIndex: 0,
      visitStartTime: null,
      completedStopIds: new Set(),
      skippedStopIds: new Set(),
      visiting: false,
      arrivedAt: null,
      elapsedMs: 0,
      startTimestamp: 0,
      pauseTimestamp: 0,
      totalPausedMs: 0,
      followMode: true,
      userDraggedMap: false,
      watchId: null,
      demoTimer: null,
      demoProgress: 0,    // 0..1 along route (cumulative distance)
      demoSegmentIdx: 0,
      lastFrameTs: 0,
      hoverPreviewEl: null,
      markerElements: [], // {marker, stopIndex, leafletMarker, id}
      routePolylines: {completed:null, active:null, upcoming:null},
      currentMarker: null,
      currentHeadingLine: null,
      nearbyDiscoveryMarkers: [],
      arrivalOverlayOpen: false,
      pendingSkipIdx: null
    };

    // ---------- DOM helpers ----------
    const $ = (s, c=document) => c.querySelector(s);
    const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

    // ---------- Initialization called after renderJourney paints ----------
    function init(J, map){
      // J = state.currentJourney; map = Leaflet map instance
      live.J = J;
      live.map = map;
      live.stops = J.stops.slice();
      live.isStarted = false;
      live.isPaused = false;
      live.isComplete = false;
      live.mode = "idle";
      live.currentLocation = null;
      live.smoothedLocation = null;
      live.currentStopIndex = 0;
      live.visitStartTime = null;
      live.completedStopIds = new Set();
      live.skippedStopIds = new Set();
      live.visiting = false;
      live.arrivedAt = null;
      live.elapsedMs = 0;
      live.followMode = true;
      live.userDraggedMap = false;
      live.hoverPreviewEl = null;
      live.markerElements = [];
      live.demoProgress = 0;
      live.demoSegmentIdx = 0;
      live.arrivalOverlayOpen = false;
      live.pendingSkipIdx = null;
      live.gpsRouteOriginApplied = false;
      live.liveRouteRequest = false;

      // Compute total route length
      live.totalDistance = J.stats.totalKm;

      // Build route geometry: array of [lat,lng] coords for all segment endpoints (start + stops)
      buildRouteGeometry();

      // Inject START JOURNEY UI + live state containers into dash-summary
      injectStartControls();

      // Add mobile view toggle
      injectMobileToggle();

      // Wire timeline ↔ map sync on existing timeline items
      bindTimelineClicks();

      // Override marker popups to use premium style
      upgradeMarkerPopups();

      // Add follow / locate controls to map
      addMapControls();

      // Add initial Next-Stop card placeholder (hidden until start)
      injectNextStopCard();

      // Inject discovery section placeholder
      injectDiscoverySection();

      // Add map drag tracking for follow mode
      map.on("dragstart", () => {
        if (live.isStarted && !live.userDraggedMap) {
          live.userDraggedMap = true;
          live.followMode = false;
          updateFollowBtn();
        }
      });

      // Hook into existing layer toggles so visibility sync works
      syncLayerVisibility();
    }

    // ---------- Build route geometry (array of L.latLng from start + stops) ----------
    function buildRouteGeometry(){
      const J = live.J;
      const pts = [L.latLng(J.startCoord)];
      J.stops.forEach(s => pts.push(L.latLng(s.coords)));
      setRoutePoints(pts);
    }

    function setRoutePoints(pts){
      if (!pts || pts.length < 2) return;
      live.routePoints = pts;
      // Cumulative distance along the polyline
      const cum = [0];
      let total = 0;
      for (let i=1; i<pts.length; i++){
        total += pts[i-1].distanceTo(pts[i]) / 1000;
        cum.push(total);
      }
      live.routeCumulativeKm = cum;
      live.routeTotalKm = total;
    }

    // Given a distance along the route (km), return interpolated latLng and segment index
    function pointAtRouteDistance(km){
      const cum = live.routeCumulativeKm;
      const pts = live.routePoints;
      if (km <= 0) return {latLng: pts[0], segIdx: 0, segProgress: 0};
      if (km >= cum[cum.length-1]) return {latLng: pts[pts.length-1], segIdx: pts.length-2, segProgress: 1};
      for (let i=1; i<cum.length; i++){
        if (cum[i] >= km){
          const segLen = cum[i] - cum[i-1];
          const t = segLen > 0 ? (km - cum[i-1]) / segLen : 0;
          const a = pts[i-1], b = pts[i];
          return {
            latLng: L.latLng(a.lat + (b.lat-a.lat)*t, a.lng + (b.lng-a.lng)*t),
            segIdx: i-1,
            segProgress: t
          };
        }
      }
      return {latLng: pts[pts.length-1], segIdx: pts.length-2, segProgress: 1};
    }

    // Project a latlng to distance along route (approx: nearest segment + proj)
    function distanceAlongRoute(latlng){
      const pts = live.routePoints;
      let bestKm = 0, bestDist = Infinity;
      for (let i=1; i<pts.length; i++){
        const a = pts[i-1], b = pts[i];
        const res = projectToSegment(latlng, a, b);
        if (res.distToLine < bestDist){
          bestDist = res.distToLine;
          bestKm = live.routeCumulativeKm[i-1] + res.t * a.distanceTo(b)/1000;
        }
      }
      return {alongKm: Math.max(0, Math.min(live.routeTotalKm, bestKm)), offRouteMeters: bestDist*1000};
    }

    function projectToSegment(p, a, b){
      // p,a,b: L.latLng; returns {t in [0,1], distToLine in km}
      // Use equirectangular approx locally
      const R = 6371;
      const toRad = d => d*Math.PI/180;
      const lat0 = a.lat, cos0 = Math.cos(toRad(lat0));
      const ax = (a.lng)*R*cos0*Math.PI/180, ay = a.lat*R*Math.PI/180;
      const bx = (b.lng)*R*cos0*Math.PI/180, by = b.lat*R*Math.PI/180;
      const px = (p.lng)*R*cos0*Math.PI/180, py = p.lat*R*Math.PI/180;
      const abx = bx-ax, aby = by-ay;
      const apx = px-ax, apy = py-ay;
      const ab2 = abx*abx+aby*aby;
      let t = ab2 > 0 ? (apx*abx+apy*aby)/ab2 : 0;
      t = Math.max(0, Math.min(1, t));
      const cx = ax+abx*t, cy = ay+aby*t;
      const dx = px-cx, dy = py-cy;
      return {t, distToLine: Math.sqrt(dx*dx+dy*dy)};
    }

    // ---------- Inject START JOURNEY button & live stats into dash-summary ----------
    function injectStartControls(){
      const summary = $(".dash-summary");
      if (!summary) return;
      // Don't re-inject
      if ($("#journeyStartBtn", summary)) return;

      // Insert the start button after h2
      const h2 = $("h2", summary);
      const startBtn = document.createElement("div");
      startBtn.innerHTML = `
        <button id="journeyStartBtn" class="journey-start">
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2v12l10-6z"/></svg>
          <span>Start Journey</span>
        </button>
        <div id="journeyProgressWrap" class="journey-progress" hidden>
          <div class="journey-progress__bar"><div id="journeyProgressFill" class="journey-progress__fill"></div></div>
          <div class="journey-progress__meta">
            <span id="journeyProgressLabel">0 / 0 stops</span>
            <span id="journeyProgressPct">0%</span>
          </div>
        </div>
        <div id="journeyLiveStats" class="live-stats" hidden>
          <div class="live-stat"><strong id="liveRemaining">—</strong><span>Remaining</span></div>
          <div class="live-stat"><strong id="liveElapsed">00:00</strong><span>Elapsed</span></div>
          <div class="live-stat"><strong id="liveETA">—</strong><span>ETA Next</span></div>
        </div>
      `;
      h2.after(startBtn);

      // Bind start button
      $("#journeyStartBtn").addEventListener("click", onStartJourney);
    }

    function injectMobileToggle(){
      if ($(".mobile-view-toggle")) return;
      if (window.innerWidth > 900) return;
      const dash = $(".dashboard");
      if (!dash) return;
      const toggle = document.createElement("div");
      toggle.className = "mobile-view-toggle";
      toggle.innerHTML = `
        <button class="active" data-mview="map">Map</button>
        <button data-mview="journey">Journey</button>
      `;
      $(".dash-right").before(toggle);
      $$(".mobile-view-toggle button").forEach(b => b.addEventListener("click", () => {
        $$(".mobile-view-toggle button").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        const v = b.dataset.mview;
        $(".dash-left").classList.toggle("panel-hidden", v==="map");
        $(".dash-right").classList.toggle("panel-hidden", v==="journey");
        if (v==="map" && live.map) setTimeout(()=>live.map.invalidateSize(),100);
      }));
      // Default show map
      $(".dash-left").classList.add("panel-hidden");
    }

    function injectNextStopCard(){
      // Insert a "Next Stop" card at top of timeline section (or before .tl-list)
      const dashLeft = $(".dash-left");
      if (!dashLeft) return;
      if ($("#nextStopCard")) return;
      const tlSection = $("#tlList")?.parentElement;
      if (!tlSection) return;
      const card = document.createElement("div");
      card.id = "nextStopCard";
      card.hidden = true;
      tlSection.parentNode.insertBefore(card, tlSection);
    }

    function injectDiscoverySection(){
      const intel = $(".intel");
      if (!intel) return;
      if ($("#discoverySection")) return;
      const sec = document.createElement("div");
      sec.id = "discoverySection";
      sec.className = "discovery";
      sec.hidden = true;
      sec.innerHTML = `
        <div class="discovery__eyebrow">Along your route</div>
        <h4>Nearby discoveries</h4>
        <div id="discoveryList"></div>
      `;
      intel.parentNode.insertBefore(sec, intel.nextSibling);
    }

    function addMapControls(){
      // Add "Follow" and "Locate me" buttons to map container
      const dashRight = $(".dash-right");
      if (!dashRight) return;
      if ($("#followBtn")) return;

      const follow = document.createElement("button");
      follow.id = "followBtn";
      follow.className = "follow-btn active";
      follow.title = "Recenter map to journey";
      follow.innerHTML = `<span class="follow-btn__ico">◎</span><span>Recenter</span>`;
      follow.addEventListener("click", () => {
        live.followMode = true;
        live.userDraggedMap = false;
        if (live.currentMarker) {
          live.map.flyTo(live.currentMarker.getLatLng(), 15, {duration:0.8});
        }
        updateFollowBtn();
      });
      dashRight.appendChild(follow);
      live.followBtn = follow;
      updateFollowBtn();
    }

    function updateFollowBtn(){
      if (!live.followBtn) return;
      live.followBtn.classList.toggle("active", live.followMode);
      live.followBtn.querySelector("span").textContent = live.followMode ? "Following" : "Recenter";
    }

    // ---------- Bind timeline ↔ map clicks ----------
    function bindTimelineClicks(){
      $$(".tl-item").forEach((el, i) => {
        el.style.cursor = "pointer";
        el.addEventListener("click", (ev) => {
          if (ev.target.closest("button")) return;
          focusStopOnMap(i);
          highlightTimeline(i);
        });
      });
    }

    function highlightTimeline(i){
      $$(".tl-item").forEach(x => x.classList.remove("m-active-map"));
      const el = $$(".tl-item")[i];
      if (el){
        el.classList.add("m-active-map");
        el.scrollIntoView({behavior:"smooth", block:"center"});
      }
    }

    function focusStopOnMap(i){
      if (!live.map || !live.J) return;
      const s = live.J.stops[i];
      if (!s) return;
      live.map.flyTo(s.coords, 15, {duration:0.7});
      // Open the popup if we have a marker for it
      const m = live.markerElements.find(m => m.stopIndex === i);
      if (m && m.leafletMarker) m.leafletMarker.openPopup();
    }
    window.focusStop = function(i){ highlightTimeline(i); focusStopOnMap(i); };

    // ---------- START JOURNEY ----------
    function onStartJourney(){
      if (live.isComplete) {
        // If journey is complete, reset and start again
        resetJourney();
        return;
      }
      // If paused, resume
      if (live.isPaused){
        resumeJourney();
        return;
      }
      // Live Journey is intentionally GPS-first. We never simulate a user
      // moving along the route when a real location is unavailable.
      enterNavigationMode();
      showStartingLoader(async () => {
        const gpsAvailable = await tryStartGPS();
        if (!gpsAvailable){
          stopGPS();
          exitNavigationMode();
          showLocationRequired();
          return;
        }
        beginJourney();
      });
    }

    function showStartingLoader(done){
      const dashRight = $(".dash-right");
      if (!dashRight) return done();
      const overlay = document.createElement("div");
      overlay.className = "starting-loader";
      overlay.innerHTML = `
        <div class="starting-loader__inner">
          <div class="starting-loader__spinner"></div>
          <h3>Starting your journey</h3>
          <div class="starting-loader__steps">
            <div id="sl1" class="active">Preparing your route…</div>
            <div id="sl2">Locating you…</div>
            <div id="sl3">Updating your next stop…</div>
            <div id="sl4">Loading map…</div>
          </div>
        </div>
      `;
      dashRight.appendChild(overlay);
      const steps = ["sl1","sl2","sl3","sl4"];
      steps.forEach((id, i) => setTimeout(() => {
        const el = document.getElementById(id);
        if (el){ el.classList.remove("active"); el.classList.add("done"); }
        if (steps[i+1]){
          const next = document.getElementById(steps[i+1]);
          if (next) next.classList.add("active");
        }
      }, 350*(i+1)));
      setTimeout(() => {
        overlay.remove();
        done();
      }, 1500);
    }

    function tryStartGPS(){
      return new Promise(resolve => {
        if (!("geolocation" in navigator)) return resolve(false);
        let settled = false;
        const finish = value => { if (!settled) { settled = true; resolve(value); } };
        try {
          live.watchId = navigator.geolocation.watchPosition(
            (pos) => {
              const loc = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                heading: pos.coords.heading || null,
                accuracy: pos.coords.accuracy || null,
                timestamp: pos.timestamp
              };
              // Store the first accurate fix before beginJourney runs. The
              // previous implementation ignored it because isStarted was false.
              live.mode = "gps";
              live.currentLocation = loc;
              live.smoothedLocation = {...loc};
              setGpsRouteOrigin(loc);
              finish(true);
              if (live.isStarted) onLocationUpdate(loc);
            },
            (err) => {
              if (!live.isStarted) finish(false);
              else setLiveBanner("paused", "Location unavailable", "Tracking paused — check location permission");
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
          );
          // Do not invent a location; ask the user to enable permission.
          setTimeout(() => {
            if (!live.currentLocation) finish(false);
          }, 10000);
        } catch(e){ finish(false); }
      });
    }

    function setGpsRouteOrigin(loc){
      if (!loc || !live.J || live.gpsRouteOriginApplied) return;
      live.gpsRouteOriginApplied = true;
      // The active journey begins at the traveller's device position, never
      // from the destination's placeholder/start-point coordinate.
      live.J.startCoord = [loc.lat, loc.lng];
      buildRouteGeometry();
      refreshRoadRouteFromGps(loc);
    }

    // Rebuild the road geometry from the traveller's actual position. The
    // service is optional: the GPS dot remains live even if it is offline.
    function refreshRoadRouteFromGps(loc){
      if (!window.fetch || !live.J || live.liveRouteRequest) return;
      const waypoints = [[loc.lng, loc.lat], ...live.J.stops.map(s => [s.coords[1], s.coords[0]])];
      if (waypoints.length < 2) return;
      live.liveRouteRequest = true;
      const path = waypoints.map(p => `${p[0]},${p[1]}`).join(";");
      fetch(`https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson`)
        .then(r => r.ok ? r.json() : Promise.reject(new Error("Road route unavailable")))
        .then(data => {
          const coordinates = data && data.routes && data.routes[0] && data.routes[0].geometry && data.routes[0].geometry.coordinates;
          if (!coordinates || coordinates.length < 2) return;
          setRoutePoints(coordinates.map(p => L.latLng(p[1], p[0])));
          if (live.isStarted) {
            drawRouteSegments();
            updateJourneyLogic();
            updateLiveStats();
          }
          setMapGlass(true);
        })
        .catch(() => setMapGlass(false))
        .finally(() => { live.liveRouteRequest = false; });
    }

    function startDemoMode(){
      if (live.mode === "demo") return;
      stopGPS();
      live.mode = "demo";
      live.demoProgress = 0;
      live.demoSegmentIdx = 0;
      setLiveBanner("demo", "Demo Journey", "Simulated movement along your route");
      // Use the first point on route as starting location
      live.currentLocation = {
        lat: live.routePoints[0].lat,
        lng: live.routePoints[0].lng,
        heading: 0, accuracy: 10, timestamp: Date.now()
      };
      live.smoothedLocation = {...live.currentLocation};
      startDemoLoop();
    }

    function startDemoLoop(){
      cancelAnimationFrame(live.demoRaf);
      live.lastFrameTs = performance.now();
      const DEMO_SPEED_KMH = 35; // simulated speed ~ city bike/car
      const step = (ts) => {
        if (!live.isStarted || live.isPaused || live.mode !== "demo" || live.isComplete){
          live.demoRaf = requestAnimationFrame(step);
          return;
        }
        const dt = Math.min(0.1,(ts - live.lastFrameTs)/1000); // seconds; cap
        live.lastFrameTs = ts;
        // advance along route
        const deltaKm = DEMO_SPEED_KMH * dt / 3600;
        live.demoProgress += deltaKm;
        if (live.demoProgress >= live.routeTotalKm){
          live.demoProgress = live.routeTotalKm;
        }
        const pt = pointAtRouteDistance(live.demoProgress);
        // Compute heading
        const next = pointAtRouteDistance(Math.min(live.routeTotalKm, live.demoProgress + 0.01));
        const heading = Math.atan2(
          next.latLng.lng - pt.latLng.lng,
          next.latLng.lat - pt.latLng.lat
        ) * 180/Math.PI;
        live.currentLocation = {
          lat: pt.latLng.lat,
          lng: pt.latLng.lng,
          heading: heading,
          accuracy: 10,
          timestamp: Date.now()
        };
        live.smoothedLocation = {...live.currentLocation};
        updateCurrentMarker();
        updateJourneyLogic();
        updateCamera();
        updateLiveStats();
        live.demoRaf = requestAnimationFrame(step);
      };
      live.demoRaf = requestAnimationFrame(step);
    }

    function stopGPS(){
      if (live.watchId != null){
        try{ navigator.geolocation.clearWatch(live.watchId); }catch(e){}
        live.watchId = null;
      }
    }

    function beginJourney(){
      live.isStarted = true;
      live.isPaused = false;
      live.startTimestamp = Date.now();
      live.totalPausedMs = 0;

      // Replace start button text
      const btn = $("#journeyStartBtn");
      btn.classList.remove("journey-start--complete");
      btn.classList.add("journey-start--progress");
      btn.querySelector("span").textContent = "Journey in Progress";
      btn.onclick = onPauseJourney;
      btn.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="3.5" height="12"/><rect x="9.5" y="2" width="3.5" height="12"/></svg><span>Pause Journey</span>`;
      btn.onclick = onPauseJourney;

      $("#journeyProgressWrap").hidden = false;
      $("#journeyLiveStats").hidden = false;

      // Render live banner on map
      renderLiveBanner();

      // Draw route segments (completed/active/upcoming)
      if (live.map.__gngRouteLine) live.map.removeLayer(live.map.__gngRouteLine);
      drawRouteSegments();

      // Add current-location marker
      addCurrentLocationMarker();

      // Draw state classes on markers & timeline
      renderStopStates();
      renderNextStopCard();
      renderDiscovery();

      // GPS is required for a live journey. This remains only as a defensive
      // guard if a browser reports a position after the start transition.
      if (!live.currentLocation){
        live.currentLocation = {
          lat: live.routePoints[0].lat,
          lng: live.routePoints[0].lng,
          heading:0, accuracy:10, timestamp:Date.now()
        };
        live.smoothedLocation = {...live.currentLocation};
      }
      updateCurrentMarker();
      updateCamera();
      updateLiveStats();
      setMapGlass(false);

      // Kick elapsed time timer
      live.elapsedTimer = setInterval(tickElapsed, 1000);

      // Center map immediately on start
      if (live.map){
        live.map.setView([live.currentLocation.lat, live.currentLocation.lng], 17, {animate:true});
      }
    }

    function enterNavigationMode(){
      const dash = $(".dashboard");
      if (!dash) return;
      dash.classList.add("journey-active");
      document.body.classList.add("journey-map-active");
      if (!$("#exitNavigation", dash)) {
        const hud = document.createElement("div");
        hud.id = "navigationHud";
        hud.className = "navigation-hud";
        hud.innerHTML = `<div><span>LIVE NAVIGATION</span><strong>${escapeHtml(live.J.destination.name)}</strong><small id="navigationNext">Locating your first stop…</small></div><button id="exitNavigation" aria-label="Exit full-screen map">✕<span>Itinerary</span></button>`;
        dash.appendChild(hud);
        $("#exitNavigation", hud).addEventListener("click", exitNavigationMode);
      }
      setTimeout(() => live.map && live.map.invalidateSize(), 80);
    }

    function exitNavigationMode(){
      const dash = $(".dashboard");
      if (dash) dash.classList.remove("journey-active");
      document.body.classList.remove("journey-map-active");
      $("#navigationHud")?.remove();
      setTimeout(() => live.map && live.map.invalidateSize(), 80);
    }

    function showLocationRequired(){
      const dash = $(".dashboard");
      if (!dash) return;
      const notice = document.createElement("div");
      notice.className = "location-required";
      notice.innerHTML = `<strong>Location access is needed to start live navigation.</strong><span>Allow precise location in your browser, then start again. No simulated route has been started.</span><button class="btn btn--primary btn--sm">Got it</button>`;
      dash.appendChild(notice);
      $("button", notice).addEventListener("click", () => notice.remove());
    }

    function setMapGlass(isRouteReady){
      const mg = $(".map-glass");
      if (!mg) return;
      if (live.isStarted){
        mg.innerHTML = `<span class="map-glass__dot"></span> ${isRouteReady?"Following route":"Tracking…"} · ${live.J.destination.name}`;
      }
    }

    function onPauseJourney(){
      if (!live.isStarted) return;
      live.isPaused = true;
      live.pauseTimestamp = Date.now();
      const btn = $("#journeyStartBtn");
      btn.classList.remove("journey-start--progress");
      btn.classList.add("journey-start--paused");
      btn.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2v12l10-6z"/></svg><span>Resume Journey</span>`;
      btn.onclick = resumeJourney;
      setLiveBanner(live.mode==="demo"?"demo":"paused", "Journey Paused", "Tracking is paused");
    }

    function resumeJourney(){
      live.isPaused = false;
      live.totalPausedMs += Date.now() - live.pauseTimestamp;
      const btn = $("#journeyStartBtn");
      btn.classList.remove("journey-start--paused");
      btn.classList.add("journey-start--progress");
      btn.innerHTML = `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="3.5" height="12"/><rect x="9.5" y="2" width="3.5" height="12"/></svg><span>Pause Journey</span>`;
      btn.onclick = onPauseJourney;
      setLiveBanner(live.mode==="demo"?"demo":"gps", "Journey in progress", live.mode==="demo"?"Demo mode":"GPS tracking active");
    }

    function resetJourney(){
      location.reload();
    }

    function tickElapsed(){
      if (!live.isStarted || live.isPaused || live.isComplete) return;
      live.elapsedMs = Date.now() - live.startTimestamp - live.totalPausedMs;
      updateLiveStats();
      if (live.visiting && live.visitStartTime){
        const visitElapsed = Date.now() - live.visitStartTime;
        const el = $(".tl-item.m-visiting .tl-item__timer");
        if (el){
          const m = Math.floor(visitElapsed/60000);
          const s = Math.floor((visitElapsed%60000)/1000);
          el.textContent = `⏱ Visiting · ${m}:${s.toString().padStart(2,"0")}`;
        }
      }
    }

    // ---------- Geolocation update ----------
    function onLocationUpdate(loc){
      if (!live.isStarted) return;
      // Smooth the movement (simple low-pass)
      if (!live.smoothedLocation){
        live.smoothedLocation = {...loc};
      } else {
        const a = 0.25;
        // Ignore bad accuracy (>100m)
        if (loc.accuracy && loc.accuracy > 100){
          return;
        }
        live.smoothedLocation = {
          lat: live.smoothedLocation.lat*(1-a) + loc.lat*a,
          lng: live.smoothedLocation.lng*(1-a) + loc.lng*a,
          heading: loc.heading || live.smoothedLocation.heading,
          accuracy: loc.accuracy,
          timestamp: loc.timestamp
        };
      }
      live.currentLocation = live.smoothedLocation;
      updateCurrentMarker();
      updateJourneyLogic();
      updateCamera();
      updateLiveStats();
    }

    // ---------- Current location marker ----------
    function addCurrentLocationMarker(){
      if (live.currentMarker) { live.map.removeLayer(live.currentMarker); }
      const icon = L.divIcon({
        className: "",
        html: `<div class="marker-icon--current"><div class="current-bearing"></div></div>`,
        iconSize: [40,40], iconAnchor: [20,20]
      });
      live.currentMarker = L.marker([live.currentLocation.lat, live.currentLocation.lng], {icon, zIndexOffset:1200}).addTo(live.map);
    }

    function updateCurrentMarker(){
      if (!live.currentMarker || !live.currentLocation) return;
      const latlng = [live.currentLocation.lat, live.currentLocation.lng];
      live.currentMarker.setLatLng(latlng);
      live.currentMarkergetZIndex && live.currentMarker.setZIndexOffset(1200);
      // Apply heading rotation
      const el = live.currentMarker.getElement();
      if (el){
        const bearing = el.querySelector(".current-bearing");
        if (bearing && live.currentLocation.heading != null && !isNaN(live.currentLocation.heading)){
          bearing.style.display = "block";
          bearing.style.transform = `translateX(-50%) rotate(${live.currentLocation.heading}deg)`;
        }
      }
    }

    // ---------- Route segments ----------
    function drawRouteSegments(){
      // Remove existing
      Object.values(live.routePolylines).forEach(l => l && live.map.removeLayer(l));
      const pts = live.routePoints;
      // We can't easily split by completion without re-rendering on update; we'll
      // instead update them in updateRouteSegments() called from updateJourneyLogic()
      live.routePolylines.completed = L.polyline([], {className:"route-completed", color:"#b0a898", weight:4, opacity:.55}).addTo(live.map);
      live.routePolylines.active = L.polyline([], {className:"route-active", color:"#C96A3D", weight:5, opacity:1}).addTo(live.map);
      live.routePolylines.upcoming = L.polyline([], {className:"route-upcoming", color:"#c8bfa8", weight:3.5, opacity:.5, dashArray:"8 10"}).addTo(live.map);
      updateRouteSegments();
    }

    function updateRouteSegments(){
      if (!live.isStarted) return;
      // Determine how far along the route we are
      const loc = live.currentLocation;
      if (!loc) return;
      const ll = L.latLng(loc.lat, loc.lng);
      const proj = distanceAlongRoute(ll);
      const curKm = proj.alongKm;
      const curPt = pointAtRouteDistance(curKm);
      const pts = live.routePoints;

      // Build completed: from start to current location
      const completed = [pts[0]];
      for (let i=1; i<=curPt.segIdx+1 && i<pts.length; i++) completed.push(pts[i]);
      // replace last point with current position
      completed[completed.length-1] = ll;

      // Active: from current location to current stop (or segment end)
      const curStop = live.stops[live.currentStopIndex];
      let activeEnd, upcomingStart;
      if (curStop){
        activeEnd = L.latLng(curStop.coords);
        upcomingStart = L.latLng(curStop.coords);
      } else {
        activeEnd = pts[pts.length-1];
        upcomingStart = pts[pts.length-1];
      }
      const active = [ll, activeEnd];

      // Upcoming: after current stop
      const upcoming = [];
      for (let i = live.currentStopIndex; i<live.stops.length; i++){
        upcoming.push(L.latLng(live.stops[i].coords));
      }

      live.routePolylines.completed.setLatLngs(completed);
      live.routePolylines.active.setLatLngs(active);
      live.routePolylines.upcoming.setLatLngs(upcoming);

      // Update marker states
      renderStopStates();
    }

    // ---------- Core journey logic: determine arrival, visit, next stop ----------
    function updateJourneyLogic(){
      if (!live.isStarted || live.isPaused || live.isComplete) return;
      const loc = live.currentLocation;
      if (!loc) return;
      const ll = L.latLng(loc.lat, loc.lng);
      const proj = distanceAlongRoute(ll);
      live.remainingKm = Math.max(0, live.routeTotalKm - proj.alongKm);

      updateRouteSegments();

      if (live.visiting){
        // Currently at a stop; waiting for user to complete
        return;
      }

      // Check if arrived at current stop
      const curStop = live.stops[live.currentStopIndex];
      if (curStop){
        const stopDist = ll.distanceTo(L.latLng(curStop.coords)) / 1000; // km
        if (stopDist < 0.10 || (arrivalByProgress(curStop, proj.alongKm))){
          // Arrived
          onArriveAtStop(live.currentStopIndex);
          return;
        }
      } else {
        // No more stops — journey complete
        completeJourney();
        return;
      }
    }

    function arrivalByProgress(stop, alongKm){
      // When demo/sim has passed the stop by distance, also trigger arrival
      const idx = live.stops.indexOf(stop);
      if (idx < 0) return false;
      // stop is at routeCumulativeKm[idx+1] (since routePoints[0]=start)
      const stopKm = live.routeCumulativeKm[idx+1];
      return alongKm >= stopKm - 0.05;
    }

    function onArriveAtStop(idx){
      if (live.arrivalOverlayOpen) return;
      live.arrivalOverlayOpen = true;
      const stop = live.stops[idx];
      showArrivalOverlay(stop, idx);
    }

    function showArrivalOverlay(stop, idx){
      const dashRight = $(".dash-right");
      if (!dashRight) { beginVisit(idx); return; }
      const overlay = document.createElement("div");
      overlay.className = "arrival-overlay";
      overlay.innerHTML = `
        <div class="arrival-card">
          <div class="arrival-card__eyebrow">You've arrived</div>
          <h2>${escapeHtml(stop.name)}</h2>
          <p>${stop.why||"Enjoy your visit."}</p>
          <div class="arrival-card__meta">
            <span>${stop.durationMin||30} min recommended</span>
            <span>${(stop.tags||[]).slice(0,2).map(t=>t.replace(/\b\w/g,c=>c.toUpperCase())).join(" · ")}</span>
          </div>
          <div class="arrival-card__actions">
            <button id="arriveStart" class="btn btn--primary btn--sm">Start Visit</button>
            <button id="arriveSkip" class="btn btn--ghost btn--sm">Skip</button>
          </div>
        </div>
      `;
      dashRight.appendChild(overlay);
      $("#arriveStart", overlay).addEventListener("click", () => {
        overlay.remove(); live.arrivalOverlayOpen = false; beginVisit(idx);
      });
      $("#arriveSkip", overlay).addEventListener("click", () => {
        overlay.remove(); live.arrivalOverlayOpen = false; skipStop(idx);
      });
    }

    function beginVisit(idx){
      live.visiting = true;
      live.arrivedAt = idx;
      live.visitStartTime = Date.now();
      renderStopStates();
      renderNextStopCard();
      // Fly to stop
      const stop = live.stops[idx];
      if (live.map && stop) live.map.flyTo(stop.coords, 16, {duration:0.6});
    }

    function completeVisit(idx){
      live.completedStopIds.add(live.stops[idx].id || idx);
      // Feature F/H hook: passport stamp + achievements + progress persistence
      try {
        if (window.GNGIntel) {
          const msg = GNGIntel.onStopCompleted(live.stops[idx], live.J);
          if (window.toast) window.toast(msg, "success");
          GNGIntel.saveJourneyProgress({
            journeyKey: (live.J && live.J.destination ? live.J.destination.id : "") + ":" + live.stops.length,
            currentStopIndex: live.currentStopIndex,
            completedStopIds: [...live.completedStopIds],
            startedAt: live.startTimestamp || Date.now(),
            savedAt: new Date().toISOString()
          });
        }
      } catch (e) { console.warn("intel hook", e); }
      live.visiting = false;
      live.visitStartTime = null;
      live.arrivedAt = null;
      // Advance
      live.currentStopIndex = findNextStopIndex(idx+1);
      // Check if complete
      if (live.currentStopIndex >= live.stops.length){
        completeJourney();
        return;
      }
      renderStopStates();
      renderNextStopCard();
      renderDiscovery();
      updateRouteSegments();
      updateLiveStats();
      // Focus next stop
      const next = live.stops[live.currentStopIndex];
      if (next && live.map && live.followMode){
        live.map.flyTo(next.coords, 14, {duration:0.7});
      }
    }

    function skipStop(idx){
      live.skippedStopIds.add(live.stops[idx].id || idx);
      live.visiting = false;
      live.visitStartTime = null;
      live.arrivedAt = null;
      live.currentStopIndex = findNextStopIndex(idx+1);
      if (live.currentStopIndex >= live.stops.length){
        completeJourney();
        return;
      }
      renderStopStates();
      renderNextStopCard();
      updateRouteSegments();
      updateLiveStats();
    }

    function findNextStopIndex(from){
      // Skip detours? No, all stops count.
      for (let i=from; i<live.stops.length; i++){
        const s = live.stops[i];
        if (!live.skippedStopIds.has(s.id || i) && !live.completedStopIds.has(s.id || i)) return i;
      }
      return live.stops.length;
    }

    function completeJourney(){
      live.isComplete = true;
      live.isPaused = false;
      if (live.watchId) stopGPS();
      if (live.demoRaf) cancelAnimationFrame(live.demoRaf);
      clearInterval(live.elapsedTimer);

      const btn = $("#journeyStartBtn");
      btn.classList.remove("journey-start--progress","journey-start--paused");
      btn.classList.add("journey-start--complete");
      btn.innerHTML = `<span>Journey Complete</span>`;
      btn.onclick = null;
      setLiveBanner("paused", "Journey Complete", `${live.J.stats.stopsCount} stops visited`);

      renderStopStates();
      renderCompleteCard();
      updateLiveStats();
      if (live.map && live.currentMarker){
        const last = live.stops[live.stops.length-1];
        if (last) live.map.flyTo(last.coords, 14, {duration:0.8});
      }
    }

    function renderCompleteCard(){
      const card = $("#nextStopCard");
      if (!card) return;
      card.hidden = false;
      const elapsed = formatDuration(live.elapsedMs);
      const visited = live.completedStopIds.size;
      card.innerHTML = `
        <div class="complete-card">
          <div class="complete-card__check">✓</div>
          <h2>Journey Complete</h2>
          <p>You visited ${visited} of ${live.J.stats.stopsCount} stops across ${live.J.stats.totalKm.toFixed(1)} km.</p>
          <div class="complete-card__stats">
            <div class="complete-card__stat"><strong>${visited}/${live.J.stats.stopsCount}</strong><span>Stops</span></div>
            <div class="complete-card__stat"><strong>${live.J.stats.totalKm.toFixed(1)} km</strong><span>Distance</span></div>
            <div class="complete-card__stat"><strong>${elapsed}</strong><span>Duration</span></div>
            <div class="complete-card__stat"><strong>${live.J.stats.experiences}</strong><span>Experiences</span></div>
          </div>
          <div class="complete-card__actions">
            <button class="btn btn--light btn--sm" onclick="localStorage.setItem('gng_journeys',JSON.stringify([...(JSON.parse(localStorage.getItem('gng_journeys')||'[]')),{savedAt:new Date().toISOString(),data:window.__gngCurrentJourney}]));window.toast&&toast('Journey saved.','success')">Save</button>
            <button class="btn btn--outline-light btn--sm" onclick="if(navigator.share){navigator.share({title:'My GEARUP N GOO Journey',url:location.href})}else{navigator.clipboard&&navigator.clipboard.writeText(location.href);window.toast&&toast('Link copied.','success')}">Share</button>
            <button class="btn btn--outline-light btn--sm" onclick="location.hash='#/history/${live.J.destination.id}'">History</button>
            <button class="btn btn--primary btn--sm" onclick="location.hash='#/planner'">New Trip</button>
          </div>
        </div>
      `;
    }

    // ---------- Stop state markers & timeline classes ----------
    function renderStopStates(){
      // Markers
      live.stops.forEach((s, i) => {
        const el = $$(".tl-item")[i];
        if (!el) return;
        // Remove all state classes
        el.classList.remove("m-completed","m-current","m-next","m-visiting","m-active-map");
        // Inject check if missing
        if (!el.querySelector(".tl-item__check")){
          const c = document.createElement("span");
          c.className = "tl-item__check";
          c.textContent = "✓";
          el.appendChild(c);
        }
        // Inject live indicator
        if (!el.querySelector(".tl-item__live-indicator")){
          const li = document.createElement("div");
          li.className = "tl-item__live-indicator";
          li.textContent = live.visiting && live.arrivedAt===i ? "Currently Exploring" : "You are here";
          const nm = el.querySelector(".tl-item__name");
          nm.parentNode.insertBefore(li, nm);
        }
        // You-are-here pill
        if (!el.querySelector(".tl-item__you-here")){
          const y = document.createElement("span");
          y.className = "tl-item__you-here";
          y.textContent = "You are here";
          const li = el.querySelector(".tl-item__live-indicator");
          li.parentNode.insertBefore(y, li.nextSibling);
        }
        // Distance to current stop
        if (!el.querySelector(".tl-item__distance")){
          const d = document.createElement("div");
          d.className = "tl-item__distance";
          el.insertBefore(d, el.querySelector(".tl-item__meta"));
        }
        // Visit timer
        if (!el.querySelector(".tl-item__timer")){
          const t = document.createElement("div");
          t.className = "tl-item__timer";
          el.appendChild(t);
        }

        // Apply state
        if (live.completedStopIds.has(s.id || i) || live.skippedStopIds.has(s.id || i)){
          el.classList.add("m-completed");
        } else if (live.visiting && live.arrivedAt === i){
          el.classList.add("m-visiting");
          el.querySelector(".tl-item__live-indicator").textContent = "Currently Exploring";
        } else if (i === live.currentStopIndex){
          el.classList.add("m-current");
        } else if (i === live.currentStopIndex + 1 && !live.visiting){
          el.classList.add("m-next");
        }

        // Update distance text for current
        if (i === live.currentStopIndex && live.currentLocation && !live.visiting){
          const d = L.latLng(live.currentLocation.lat, live.currentLocation.lng).distanceTo(L.latLng(s.coords))/1000;
          const etaMin = Math.max(1, Math.round(d / 35 * 60));
          el.querySelector(".tl-item__distance").textContent = `${d.toFixed(1)} km · ~${etaMin} min away`;
        } else {
          el.querySelector(".tl-item__distance").textContent = "";
        }
      });

      // Also update marker icons by reading DOM and adding classes via Leaflet
      // We don't have direct references to stop markers from initMap, so
      // we reach into the DOM of .marker-icon elements via class names is hard —
      // we instead upgrade markers once after map init via upgradeMarkerPopups.
      // For stateful markers we'll track our own array separately.
      updateMarkerStates();
    }

    function updateMarkerStates(){
      // Use a simple approach: re-style markers by stop index via DOM traversal of leaflet markers
      // We store our references in live.markerElements the first time we scan
      if (!live.markerElements.length){
        live.map.eachLayer(layer => {
          if (layer.options && layer.options.gngStopIndex != null){
            live.markerElements.push({leafletMarker: layer, stopIndex: layer.options.gngStopIndex});
          }
        });
      }
      live.markerElements.forEach(m => {
        const el = m.leafletMarker.getElement();
        if (!el) return;
        const icon = el.querySelector(".marker-icon") || el;
        icon.classList.remove("m-completed","m-next","m-active","m-visiting","m-arrived");
        const i = m.stopIndex;
        const s = live.stops[i];
        if (live.completedStopIds.has(s.id || i) || live.skippedStopIds.has(s.id || i)) icon.classList.add("m-completed");
        else if (live.visiting && live.arrivedAt === i) icon.classList.add("m-visiting");
        else if (i === live.currentStopIndex) icon.classList.add("m-active");
        else if (i === live.currentStopIndex + 1 && !live.visiting) icon.classList.add("m-next");
      });
    }

    // ---------- Next Stop Card ----------
    function renderNextStopCard(){
      const card = $("#nextStopCard");
      if (!card) return;
      if (!live.isStarted || live.isComplete){ card.hidden = !live.isComplete; return; }
      card.hidden = false;
      if (live.visiting){
        const stop = live.stops[live.arrivedAt];
        const hudNext = $("#navigationNext");
        if (hudNext) hudNext.textContent = `Exploring: ${stop.name}`;
        card.innerHTML = `
          <div class="next-stop">
            <div class="next-stop__eyebrow">Currently Exploring</div>
            <div class="next-stop__name">${escapeHtml(stop.name)}</div>
            <div class="next-stop__info">
              <div><strong>${stop.durationMin||30}m</strong><span>Allocated</span></div>
              <div><strong id="currentVisitTime">0:00</strong><span>Elapsed</span></div>
              <div><strong>${(stop.tags||[]).slice(0,1).map(t=>t.replace(/\b\w/g,c=>c.toUpperCase()))[0]||"Visit"}</strong><span>Type</span></div>
            </div>
            <div class="next-stop__cta">
              <button class="next-show" id="completeVisitBtn">Complete Visit</button>
              <button class="next-skip" id="skipVisitBtn">Skip</button>
            </div>
          </div>
        `;
        $("#completeVisitBtn").addEventListener("click", () => completeVisit(live.arrivedAt));
        $("#skipVisitBtn").addEventListener("click", () => skipStop(live.arrivedAt));
        return;
      }
      const next = live.stops[live.currentStopIndex];
      if (!next){ card.hidden = true; return; }
      const hudNext = $("#navigationNext");
      if (hudNext) hudNext.textContent = `Next: ${next.name}`;
      const distKm = live.currentLocation
        ? (L.latLng(live.currentLocation.lat, live.currentLocation.lng).distanceTo(L.latLng(next.coords))/1000)
        : 0;
      const etaMin = Math.max(1, Math.round(distKm / 35 * 60));
      const etaTime = addMinutesNow(etaMin);
      card.innerHTML = `
        <div class="next-stop">
          <div class="next-stop__eyebrow">Next Stop ${live.mode==="demo"?'<span class="demo-pill">Demo</span>':''}</div>
          <div class="next-stop__name">${escapeHtml(next.name)}</div>
          <div class="next-stop__info">
            <div><strong>${distKm.toFixed(1)} km</strong><span>Distance</span></div>
            <div><strong>~${etaMin}m</strong><span>Duration</span></div>
            <div><strong>${etaTime}</strong><span>ETA</span></div>
          </div>
          <div class="next-stop__tags">
            ${(next.tags||[]).slice(0,3).map(t => `<span class="tl-badge ${window.tagColor?window.tagColor(t):''}">${t.replace(/\b\w/g,c=>c.toUpperCase())}</span>`).join("")}
          </div>
          <div class="next-stop__cta">
            <button class="next-show" id="showNextBtn">Show Route</button>
            <button class="next-show" id="navNextBtn" aria-label="Navigate to this stop">Navigate →</button>
            <button class="next-skip" id="hearNextBtn" aria-label="Hear the heritage story">🔊 Hear the story</button>
          </div>
        </div>
      `;
      $("#showNextBtn").addEventListener("click", () => {
        live.map.flyTo(next.coords, 15, {duration:.7});
        highlightTimeline(live.currentStopIndex);
      });
      const navBtn = $("#navNextBtn");
      if (navBtn) navBtn.addEventListener("click", () => {
        const from = live.currentLocation ? [live.currentLocation.lat, live.currentLocation.lng] : null;
        window.open(GNGIntel.navigationUrl(from, next.coords), "_blank", "noopener");
      });
      const hearBtn = $("#hearNextBtn");
      if (hearBtn) hearBtn.addEventListener("click", () => {
        if (!window.GNGIntel) return;
        const story = GNGIntel.buildStory(window.__gngFindStopStory ? window.__gngFindStopStory(next) : next);
        if (story && story.audioText && GNGIntel.speech.speak(story.audioText, "en-IN")) {
          GNGIntel.onStoryHeard(next.name);
          hearBtn.textContent = "🔊 Playing…";
        } else {
          if (window.toast) window.toast("No narration available for this stop yet — stories are being added.", "default");
        }
      });
    }

    function addMinutesNow(min){
      const d = new Date(Date.now()+min*60000);
      return d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0");
    }

    // ---------- Live stats ----------
    function updateLiveStats(){
      if (!live.isStarted) return;
      const prog = $("#journeyProgressFill");
      const lbl = $("#journeyProgressLabel");
      const pct = $("#journeyProgressPct");
      const rem = $("#liveRemaining");
      const el = $("#liveElapsed");
      const eta = $("#liveETA");

      const totalStops = live.stops.length;
      const done = live.completedStopIds.size + live.skippedStopIds.size + (live.visiting?1:0);
      const pctVal = Math.round((done/totalStops)*100);
      if (prog) prog.style.width = pctVal+"%";
      if (lbl) lbl.textContent = `${done} / ${totalStops} stops`;
      if (pct) pct.textContent = pctVal+"%";

      if (el) el.textContent = formatDuration(live.elapsedMs);
      if (rem && live.remainingKm != null) rem.textContent = live.remainingKm.toFixed(1)+" km";

      if (eta){
        const next = live.stops[live.currentStopIndex];
        if (next && live.currentLocation && !live.visiting){
          const d = L.latLng(live.currentLocation.lat, live.currentLocation.lng).distanceTo(L.latLng(next.coords))/1000;
          const m = Math.max(1, Math.round(d/35*60));
          eta.textContent = addMinutesNow(m);
        } else if (live.visiting){
          eta.textContent = "Visiting";
        } else {
          eta.textContent = "—";
        }
      }

      // Update start button to show pause/resume
    }

    function formatDuration(ms){
      const s = Math.floor(ms/1000);
      const h = Math.floor(s/3600);
      const m = Math.floor((s%3600)/60);
      const sec = s%60;
      if (h>0) return `${h}h ${m}m`;
      return `${m}:${sec.toString().padStart(2,"0")}`;
    }

    // ---------- Camera ----------
    function updateCamera(){
      if (!live.map || !live.followMode || live.userDraggedMap || !live.currentLocation) return;
      // Smooth pan to current location
      live.map.panTo([live.currentLocation.lat, live.currentLocation.lng], {animate:true, duration:0.6, easeLinearity:0.25});
    }

    // ---------- Live banner ----------
    function renderLiveBanner(){
      const container = $(".dash-right");
      if (!container) return;
      // Remove existing
      const old = $("#liveBanner");
      if (old) old.remove();
      const banner = document.createElement("div");
      banner.id = "liveBanner";
      banner.className = "live-banner";
      banner.innerHTML = `
        <span class="live-banner__dot"></span>
        <div class="live-banner__text">
          <strong id="liveBannerTitle">Journey in progress</strong>
          <div class="live-banner__sub" id="liveBannerSub">Tracking active</div>
        </div>
      `;
      container.appendChild(banner);
    }
    function setLiveBanner(kind, title, sub){
      const b = $("#liveBanner");
      if (!b) return;
      b.classList.remove("live-banner--demo","live-banner--paused");
      if (kind === "demo") b.classList.add("live-banner--demo");
      if (kind === "paused") b.classList.add("live-banner--paused");
      const t = $("#liveBannerTitle", b); const s = $("#liveBannerSub", b);
      if (t) t.textContent = title;
      if (s) s.textContent = sub;
    }

    // ---------- Nearby discovery ----------
    function renderDiscovery(){
      const sec = $("#discoverySection");
      if (!sec) return;
      if (!live.isStarted) { sec.hidden = true; return; }
      sec.hidden = false;
      const list = $("#discoveryList", sec);
      // Pull from detours in journey that aren't yet added
      const detours = (live.J.detours||[]).filter(d => !d.added).slice(0,3);
      if (!detours.length){
        sec.hidden = true;
        return;
      }
      list.innerHTML = detours.map((d,i) => `
        <div class="discovery-item">
          <div class="discovery-item__icon">✦</div>
          <div class="discovery-item__body">
            <div class="discovery-item__name">${escapeHtml(d.name)}</div>
            <div class="discovery-item__meta">+${d.detourKm} km · ${d.visitMin||15} min · ${(d.bestFor||[]).join(" · ")}</div>
          </div>
          <button class="discovery-item__add" data-detour="${live.J.detours.indexOf(d)}">Add</button>
        </div>
      `).join("");
      $$(".discovery-item__add", list).forEach(b => b.addEventListener("click", () => {
        const di = parseInt(b.dataset.detour, 10);
        if (typeof window.addDetourFromMap === "function"){
          window.addDetourFromMap(di);
          b.textContent = "Added";
          b.classList.add("discovery-item__added");
        }
      }));
    }

    // ---------- Marker popup upgrade ----------
    // We hook into Leaflet by monkey-patching bindPopup for stop markers so
    // popups use the premium .gng-popup style. We also attach hover preview.
    function upgradeMarkerPopups(){
      // Iterate existing markers and add gngStopIndex + custom popup
      if (!live.map) return;
      let stopIdx = 0;
      live.map.eachLayer(layer => {
        if (layer instanceof L.Marker){
          const icon = layer.options.icon;
          if (!icon) return;
          const opts = icon.options || {};
          const html = opts.html || "";
          // Detect numbered stop markers (e.g. <div class="marker-icon marker-icon--stop">1</div>)
          if (/marker-icon--stop/.test(html)){
            const m = html.match(/>(\d+)</);
            if (m){
              const idx = parseInt(m[1],10)-1;
              layer.options.gngStopIndex = idx;
              customizeStopPopup(layer, idx);
              attachMarkerHover(layer, idx);
              stopIdx++;
            }
          }
        }
      });
    }

    function customizeStopPopup(marker, idx){
      const s = live.J.stops[idx];
      if (!s) return;
      const dist = live.currentLocation
        ? (L.latLng(live.currentLocation.lat, live.currentLocation.lng).distanceTo(L.latLng(s.coords))/1000).toFixed(1)
        : s.travelKm.toFixed(1);
      const distLabel = live.isStarted ? `${dist} km from you` : `${s.travelKm.toFixed(1)} km from previous`;
      const whyShort = s.why || "";
      const tags = (s.tags||[]).slice(0,3).map(t=>`<span class="pop-tag">${t.replace(/\b\w/g,c=>c.toUpperCase())}</span>`).join("");
      const html = `
        <div class="gng-popup">
          <div class="gng-popup__banner"></div>
          <div class="gng-popup__body">
            <div class="gng-popup__name">${escapeHtml(s.name)}</div>
            <div class="gng-popup__meta">${tags}</div>
            <div class="gng-popup__desc">${escapeHtml((s.desc||"").slice(0,90))}${(s.desc||"").length>90?"…":""}</div>
            <div class="gng-popup__distance">
              <span>Distance</span><strong>${distLabel}</strong>
            </div>
            <div class="gng-popup__actions">
              <button class="gng-popup__btn gng-popup__btn--ghost" data-gng-action="close">Close</button>
              <button class="gng-popup__btn gng-popup__btn--primary" data-gng-action="route" data-idx="${idx}">Show on Timeline</button>
            </div>
          </div>
        </div>`;
      marker.unbindPopup();
      marker.bindPopup(html, {maxWidth:300, minWidth:240, className:"gng-popup-wrap", offset:[0,-18]});
      marker.on("popupopen", (e) => {
        setTimeout(() => {
          const popEl = marker.getPopup().getElement();
          if (!popEl) return;
          const close = popEl.querySelector("[data-gng-action=close]");
          const show = popEl.querySelector("[data-gng-action=route]");
          if (close) close.addEventListener("click", () => marker.closePopup());
          if (show) show.addEventListener("click", () => {
            marker.closePopup();
            highlightTimeline(idx);
            focusStopOnMap(idx);
          });
        }, 10);
      });
    }

    function attachMarkerHover(marker, idx){
      marker.on("mouseover", (e) => {
        showHoverPreview(marker, idx);
      });
      marker.on("mouseout", () => {
        hideHoverPreview();
      });
    }

    function showHoverPreview(marker, idx){
      hideHoverPreview();
      const s = live.J.stops[idx]; if (!s) return;
      const el = document.createElement("div");
      el.className = "hover-preview";
      const dist = live.currentLocation
        ? (L.latLng(live.currentLocation.lat, live.currentLocation.lng).distanceTo(L.latLng(s.coords))/1000).toFixed(1)
        : s.travelKm.toFixed(1);
      el.innerHTML = `
        <div class="hover-preview__name">${escapeHtml(s.name)}</div>
        <div class="hover-preview__meta">${(s.tags||[]).slice(0,2).map(t=>t.replace(/\b\w/g,c=>c.toUpperCase())).join(" · ")} · ${s.durationMin||30} min · ${dist} km</div>
      `;
      const mapEl = $(".dash-right") || $("#map").parentElement;
      mapEl.appendChild(el);
      live.hoverPreviewEl = el;
      // Position near the marker — use leaflet's container point
      const pt = live.map.latLngToContainerPoint(marker.getLatLng());
      const rect = mapEl.getBoundingClientRect();
      el.style.left = pt.x + "px";
      el.style.top = pt.y + "px";
    }
    function hideHoverPreview(){
      if (live.hoverPreviewEl){ live.hoverPreviewEl.remove(); live.hoverPreviewEl = null; }
    }

    function syncLayerVisibility(){
      // The existing map-toggle buttons show/hide layer groups; we don't need
      // to change them, but we re-apply when in live mode
    }

    // ---------- Utils ----------
    function escapeHtml(s){
      return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    }

    // ---------- Public API ----------
    return { init };
  })();

})();
