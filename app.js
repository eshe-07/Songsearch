const API_URL = "https://eshe.app.n8n.cloud/webhook/search-lyrics";

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
      body: JSON.stringify({ query: keyword })
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
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
        <img src="${song.image || 'https://via.placeholder.com/300'}" />
        <h4>${song.title}</h4>
        <p>${song.artist}</p>
        <a href="${song.url}" target="_blank" style="color:#caa7ff">View lyrics</a>
      `;

      resultsDiv.appendChild(card);
    });

  } catch (error) {
    console.error(error);
    resultsDiv.innerHTML = "<p>🚨 Something went wrong. Please try again.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("query");
  if (input) {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") searchLyrics();
    });
  }
});
