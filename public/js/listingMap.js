(function () {
  const DEFAULT_CENTER = [28.6139, 77.209];
  const DEFAULT_ZOOM = 12;

  function createTileLayer(apiKey) {
    return L.tileLayer(
      `https://maps.geoapify.com/v1/tile/carto/{z}/{x}/{y}.png?apiKey=${apiKey}`,
      {
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Powered by <a href="https://www.geoapify.com/">Geoapify</a>',
      }
    );
  }

  function setMarker(map, markerRef, lat, lng, popupText) {
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    markerRef.current = L.marker([lat, lng]).addTo(map);
    if (popupText) {
      markerRef.current.bindPopup(popupText).openPopup();
    }
    map.setView([lat, lng], DEFAULT_ZOOM);
  }

  async function fetchAutocomplete(text, apiKey) {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      text
    )}&limit=5&apiKey=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data?.features || [];
  }

  function initFormMap(config) {
    const {
      mapId,
      locationInputId,
      suggestionsId,
      latInputId,
      lngInputId,
      apiKey,
      initialCenter,
    } = config;

    if (!apiKey) return;
    const mapEl = document.getElementById(mapId);
    const locationInput = document.getElementById(locationInputId);
    const suggestionsEl = document.getElementById(suggestionsId);
    const latInput = document.getElementById(latInputId);
    const lngInput = document.getElementById(lngInputId);
    if (!mapEl || !locationInput || !suggestionsEl || !latInput || !lngInput) return;

    const center = initialCenter || DEFAULT_CENTER;
    const map = L.map(mapEl).setView(center, DEFAULT_ZOOM);
    createTileLayer(apiKey).addTo(map);

    const markerRef = { current: null };
    setMarker(map, markerRef, center[0], center[1]);
    latInput.value = center[0];
    lngInput.value = center[1];

    map.on("click", function (event) {
      const { lat, lng } = event.latlng;
      latInput.value = lat.toFixed(6);
      lngInput.value = lng.toFixed(6);
      setMarker(map, markerRef, lat, lng, `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
    });

    let debounceTimer;
    locationInput.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      const query = locationInput.value.trim();
      if (query.length < 3) {
        suggestionsEl.innerHTML = "";
        return;
      }

      debounceTimer = setTimeout(async () => {
        const results = await fetchAutocomplete(query, apiKey);
        suggestionsEl.innerHTML = "";

        results.forEach((feature) => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "list-group-item list-group-item-action";
          item.textContent = feature.properties.formatted;

          item.addEventListener("click", () => {
            const [lng, lat] = feature.geometry.coordinates;
            locationInput.value = feature.properties.formatted;
            latInput.value = lat;
            lngInput.value = lng;
            setMarker(map, markerRef, lat, lng, feature.properties.formatted);
            suggestionsEl.innerHTML = "";
          });

          suggestionsEl.appendChild(item);
        });
      }, 300);
    });
  }

  function initDisplayMap(config) {
    const { mapId, apiKey, lat, lng, popupTitle, popupDescription } = config;
    if (!apiKey) return;
    const mapEl = document.getElementById(mapId);
    if (!mapEl) return;

    const map = L.map(mapEl).setView([lat, lng], DEFAULT_ZOOM);
    createTileLayer(apiKey).addTo(map);

    const popup = `<b>${popupTitle}</b><br>${popupDescription}`;
    L.marker([lat, lng]).addTo(map).bindPopup(popup).openPopup();
  }

  window.ListingMap = {
    initFormMap,
    initDisplayMap,
  };
})();
