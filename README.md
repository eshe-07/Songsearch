# 🎵 Lyrics Finder App

A web application that lets users search for songs by any word appearing in their lyrics.  
The frontend is built with HTML, CSS, and JavaScript, and the backend logic is powered by **n8n** using the **Genius API**.

---

## 🚀 Features

- Search songs by any word (example: *love*, *amnesia*)
- Displays:
  - Song title
  - Artist name
  - Album image
  - Link to lyrics on Genius
- Fast results using Genius API
- No paid APIs required
- Clean modern UI

---

## 🧱 Tech Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript (Fetch API)

### Backend
- n8n (Webhook workflow)
- Genius API

---

## 📸 Demo

> Example search: `amnesia`

Results are fetched from Genius and displayed instantly.

---

## ⚙️ How It Works

1. User enters a word in the frontend.
2. Frontend sends request to n8n webhook:
