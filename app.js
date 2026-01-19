/* ================================
   CONFIG
================================ */
const API_URL = "https://eshe.app.n8n.cloud/webhook/search-lyrics";

/* ================================
   SEARCH LOGIC
================================ */
async function searchLyrics() {
  const input = document.getElementById("query");
  const resultsDiv = document.getElementById("results");
  const yearSelect = document.getElementById("yearFilter");

  if (!input || !resultsDiv) return;

  const keyword = input.value.trim();
  const year = yearSelect ? yearSelect.value : null;

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
        year: year !== "" ? year : null
      })
    });

    if (!response.ok) {
      throw new Error(`Server error ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      resultsDiv.innerHTML = "<p>No songs found.</p>";
      return;
    }

    resultsDiv.innerHTML = "";

    data.forEach(song => {
      const card = document.createElement("div");
      card.className = "song-card";

      card.innerHTML = `
        <img src="${song.image || "https://via.placeholder.com/300"}" />
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
        <a href="${song.url}" target="_blank" style="color:#caa7ff">
          View lyrics
        </a>
      `;

      resultsDiv.appendChild(card);
    });

  } catch (error) {
    console.error("Search error:", error);
    resultsDiv.innerHTML =
      "<p>🚨 Something went wrong. Please try again.</p>";
  }
}

/* ================================
   DOM EVENTS
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("query");
  const button = document.querySelector("button");

  if (button) {
    button.addEventListener("click", searchLyrics);
  }

  if (input) {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") searchLyrics();
    });
  }
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

/* ================================
   SHOOTING STARS
================================ */
function createShootingStar() {
  const container = document.querySelector(".shooting-stars");
  if (!container) return;

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
  if (!spans.length) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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
