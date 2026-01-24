const API_URL = "https://eshe.app.n8n.cloud/webhook/search-lyrics";
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
        filters: { era: selectedEra }
      })
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const data = await response.json();

    const songs = Array.isArray(data.results) ? data.results : [];

    // 🔍 Track search event
    trackEvent("search", {
      keyword,
      era: selectedEra,
      resultsCount: songs.length
    });

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
          View lyrics
        </a>
      `;

      resultsDiv.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = "<p>🚨 Something went wrong. Please try again.</p>";
  }
}

/* ================================
   PAGE LOAD + ERA FILTERS
================================ */

document.addEventListener("DOMContentLoaded", () => {
  // 📊 Track page visit
  trackEvent("page_visit", {
    page: "lyrics_finder"
  });

  // Enter key support
  const input = document.getElementById("query");
  if (input) {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") searchLyrics();
    });
  }

  // Era filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      selectedEra = btn.dataset.era || "all";
    });
  });
});

/* ================================
   PARALLAX SCROLL EFFECT
================================ */

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  document.querySelector(".layer-back").style.transform =
    `translateY(${scrollY * 0.1}px)`;

  document.querySelector(".layer-mid").style.transform =
    `translateY(${scrollY * 0.2}px)`;

  document.querySelector(".layer-front").style.transform =
    `translateY(${scrollY * 0.3}px)`;
});

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
