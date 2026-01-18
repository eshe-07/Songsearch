async function searchLyrics() {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML = "Searching...";

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter a word.</p>";
    return;
  }

  try {
    const response = await fetch("https://eshe.app.n8n.cloud/webhook/search-lyrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();

    console.log("API response:", data); // debug

    // ✅ IMPORTANT FIX: data IS the array
    if (!Array.isArray(data) || data.length === 0) {
      resultsDiv.innerHTML = "<p>No songs found.</p>";
      return;
    }

    resultsDiv.innerHTML = "";

    data.forEach(song => {
      const card = document.createElement("div");
      card.className = "song-card";

      card.innerHTML = `
        <img src="${song.image || 'https://via.placeholder.com/60'}" />
        <div class="song-info">
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
          <a href="${song.url}" target="_blank">View lyrics</a>
        </div>
      `;

      resultsDiv.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = "<p>Server error. Please try later.</p>";
  }
}
