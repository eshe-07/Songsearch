const API_URL = "https://eshe.app.n8n.cloud/webhook/search-lyrics";
<<<<<<< HEAD
const TRACK_URL = "https://eshe.app.n8n.cloud/webhook/track-event";

let selectedEra = "all";

/* ================================
   ANALYTICS TRACKING
================================ */

function trackEvent(event, data = {}) {
  fetch(TRACK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, data })
  }).catch(() => {}); // never block UI
}

/* ================================
=======
let selectedEra = "all";

/* ================================
>>>>>>> fe6aa82ac4eb32efde24565eb062cfe718fe8865
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
<<<<<<< HEAD
        filters: { era: selectedEra }
=======
        filters: {
          era: selectedEra || "all"
        }
>>>>>>> fe6aa82ac4eb32efde24565eb062cfe718fe8865
      })
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const data = await response.json();
    console.log("RAW API DATA:", data);

<<<<<<< HEAD
    const songs = Array.isArray(data.results) ? data.results : [];

    // 🔍 Track search event
    trackEvent("search", {
      keyword,
      era: selectedEra,
      resultsCount: songs.length
    });
=======
    // ✅ Handle backend returning array with single object
    const payload = Array.isArray(data) ? data[0] : data;
    const songs = Array.isArray(payload?.results) ? payload.results : [];
>>>>>>> fe6aa82ac4eb32efde24565eb062cfe718fe8865

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
<<<<<<< HEAD
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
        ${song.year ? `<p><small>Year: ${song.year}</small></p>` : ""}
        <a href="${song.url}" target="_blank"
           onclick="trackEvent('result_click', {
             keyword: '${keyword}',
             era: '${selectedEra}',
             title: '${song.title}',
             artist: '${song.artist}'
           })"
           style="color:#caa7ff">
=======
        <h4>${song.title || "Unknown Title"}</h4>
        <p>${song.artist || "Unknown Artist"}</p>
        ${song.year ? `<p><small>Year: ${song.year}</small></p>` : ""}
        <a href="${song.url || "#"}" target="_blank" style="color:#caa7ff">
>>>>>>> fe6aa82ac4eb32efde24565eb062cfe718fe8865
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
<<<<<<< HEAD
   PAGE LOAD + ERA FILTERS
================================ */

document.addEventListener("DOMContentLoaded", () => {
  // 📊 Track page visit
  trackEvent("page_visit", {
    page: "lyrics_finder"
  });

=======
   FILTER BUTTON LOGIC
================================ */

document.addEventListener("DOMContentLoaded", () => {
>>>>>>> fe6aa82ac4eb32efde24565eb062cfe718fe8865
  // Enter key support
  const input = document.getElementById("query");
  if (input) {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") searchLyrics();
    });
  }

  // Era filter buttons
<<<<<<< HEAD
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      selectedEra = btn.dataset.era || "all";
=======
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      selectedEra = btn.dataset.era || "all";
      console.log("Selected era:", selectedEra);
>>>>>>> fe6aa82ac4eb32efde24565eb062cfe718fe8865
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
<<<<<<< HEAD

/* ================================
   SHOOTING STARS
================================ */

function createShootingStar() {
  const container = document.querySelector(".shooting-stars");
  const star = document.createElement("div");
  star.className = "star";

  star.style.top = Math.random() * window.innerHeight + "px";
  star.style.left = window.innerWidth + "px";

  container.appendChild(star);
  setTimeout(() => star.remove(), 1500);
}

setInterval(createShootingStar, 3000 + Math.random() * 3000);

/* ================================
   AUDIO REACTIVE WAVES
================================ */

async function initAudioReactiveWaves() {
  const spans = document.querySelectorAll(".audio-waves span");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);

    source.connect(analyser);
    analyser.fftSize = 64;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function animate() {
      analyser.getByteFrequencyData(dataArray);

      spans.forEach((span, i) => {
        const value = dataArray[i * 2] || 0;
        span.style.height = `${20 + value}px`;
      });

      requestAnimationFrame(animate);
    }

    animate();
  } catch (err) {
    console.warn("Microphone access denied – using default animation.");
  }
}

initAudioReactiveWaves();
=======
>>>>>>> fe6aa82ac4eb32efde24565eb062cfe718fe8865
