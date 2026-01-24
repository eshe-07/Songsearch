const API_URL = "https://eshe.app.n8n.cloud/webhook/search-lyrics";
let selectedEra = "all";

/* ================================
   SEARCH FUNCTION
================================ */

async function searchLyrics() {
  const input = document.getElementById("query");
  const resultsDiv = document.getElementById("results");

  const keyword = input.value.trim();
  resultsDiv.innerHTML = "";

  if (!keyword) {
    resultsDiv.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  resultsDiv.innerHTML = "<p>🌌 Searching the music universe...</p>";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: keyword,
        filters: {
          era: selectedEra || "all"
        }
      })
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const data = await response.json();
    console.log("RAW API DATA:", data);

    // ✅ Handle backend returning array with single object
    const payload = Array.isArray(data) ? data[0] : data;
    const songs = Array.isArray(payload?.results) ? payload.results : [];

    if (songs.length === 0) {
      resultsDiv.innerHTML = "<p>No songs found for this era.</p>";
      return;
    }

    resultsDiv.innerHTML = "";

    songs.forEach(song => {
      const card = document.createElement("div");
      card.className = "song-card";

      card.innerHTML = `
        <img src="${song.image || 'https://via.placeholder.com/300'}" />
        <h4>${song.title || "Unknown Title"}</h4>
        <p>${song.artist || "Unknown Artist"}</p>
        ${song.year ? `<p><small>Year: ${song.year}</small></p>` : ""}
        <a href="${song.url || "#"}" target="_blank" style="color:#caa7ff">
          View lyrics
        </a>
      `;

      resultsDiv.appendChild(card);
    });

  } catch (error) {
    console.error("Search error:", error);
    resultsDiv.innerHTML = "<p>🚨 Something went wrong. Please try again.</p>";
  }
}

/* ================================
   FILTER BUTTON LOGIC
================================ */

document.addEventListener("DOMContentLoaded", () => {
  // Enter key support
  const input = document.getElementById("query");
  if (input) {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") searchLyrics();
    });
  }

  // Era filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      selectedEra = btn.dataset.era || "all";
      console.log("Selected era:", selectedEra);
    });
  });
});

/* ================================
   PARALLAX SCROLL EFFECT
================================ */

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  const back = document.querySelector(".layer-back");
  const mid = document.querySelector(".layer-mid");
  const front = document.querySelector(".layer-front");

  if (back) back.style.transform = `translateY(${scrollY * 0.1}px)`;
  if (mid) mid.style.transform = `translateY(${scrollY * 0.2}px)`;
  if (front) front.style.transform = `translateY(${scrollY * 0.3}px)`;
});
