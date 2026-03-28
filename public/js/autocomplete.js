(() => {
  const searchInput = document.querySelector(".search-inp");
  const suggestionsBox = document.getElementById("search-suggestions");
  if (!searchInput || !suggestionsBox) return;

  let debounceTimer = null;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();

    if (query.length < 2) {
      suggestionsBox.innerHTML = "";
      suggestionsBox.classList.remove("show");
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/listings/search/suggestions?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!data.length) {
          suggestionsBox.innerHTML = "";
          suggestionsBox.classList.remove("show");
          return;
        }

        suggestionsBox.innerHTML = data
          .map(
            (item) => `
          <a href="/listings/${item._id}" class="suggestion-item">
            <i class="fa-solid fa-location-dot suggestion-icon"></i>
            <div>
              <span class="suggestion-title">${highlightMatch(item.title, query)}</span>
              <span class="suggestion-location">${item.location}, ${item.country}</span>
            </div>
          </a>`
          )
          .join("");

        suggestionsBox.classList.add("show");
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }, 300);
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
      suggestionsBox.innerHTML = "";
      suggestionsBox.classList.remove("show");
    }
  });

  // Highlight matched text
  function highlightMatch(text, query) {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }
})();
