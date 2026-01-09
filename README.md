# MovieGrid

**Turn your movie lists into shareable poster grids for social media**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://notAIbot.github.io/moviegrid/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## What is MovieGrid?

MovieGrid is a free, open-source web app that transforms movie lists into beautiful visual poster grids. Perfect for sharing your favorite movies on Instagram, Twitter, or any social platform. No signup required, works entirely in your browser.

**Live Demo:** [https://notAIbot.github.io/moviegrid/](https://notAIbot.github.io/moviegrid/)

## Features

### 🎬 Custom Movie Grid
- Paste a list of movie titles (one per line)
- Automatically fetches high-quality posters from TMDB
- Add custom titles to your grids
- Drag-and-drop to reorder movies
- Screenshot and share instantly

### 🌟 TMDB Top 100
- Pre-loaded grid of the 100 most popular movies
- Based on TMDB's popularity rankings
- One-click loading with progress tracking
- Cached for fast subsequent loads

### 📅 Top 10 by Year
- Select any year from 1900 to present
- Discover top-rated movies from that year
- Explore cinema history decade by decade
- Cached results for instant access

### ❤️ Favorites & Watchlist (Coming Soon)
- Save your favorite movies
- Track movies you want to watch
- Persistent storage in your browser
- Export and share your lists

## How to Use

1. **Visit the app:** [https://notAIbot.github.io/moviegrid/](https://notAIbot.github.io/moviegrid/)
2. **Choose a tab:**
   - **Custom Grid:** Paste your movie titles
   - **TMDB Top 100:** Browse popular movies
   - **Top 10 by Year:** Select a year to explore
3. **Customize:** Drag posters to reorder them
4. **Share:** Take a screenshot and post to social media

## Tech Stack

- **Frontend:** Pure HTML, CSS, and JavaScript (no frameworks)
- **API:** [TMDB API](https://www.themoviedb.org/documentation/api) for movie data and posters
- **Storage:** localStorage for caching and persistence
- **Drag & Drop:** [SortableJS](https://sortablejs.github.io/Sortable/) for smooth reordering
- **Hosting:** GitHub Pages (free, fast, reliable)

## Why MovieGrid?

- **No signup required** - Start creating grids immediately
- **Privacy-focused** - All data stored locally in your browser
- **Free forever** - No ads, no premium features, 100% free
- **Open source** - Transparent code, contribute or fork as you like
- **Fast & responsive** - Works on desktop, tablet, and mobile
- **Offline-friendly** - Cached data works without internet

## Setup for Development

Want to run MovieGrid locally or contribute?

1. **Clone the repository:**
   ```bash
   git clone https://github.com/notAIbot/moviegrid.git
   cd moviegrid
   ```

2. **Get a TMDB API key:**
   - Sign up at [TMDB](https://www.themoviedb.org/signup)
   - Get your API key from [Settings > API](https://www.themoviedb.org/settings/api)

3. **Configure the API key:**
   ```bash
   cp config.example.js config.js
   # Edit config.js and add your API key
   ```

4. **Run locally:**
   - Open `index.html` in your browser
   - Or use a local server:
     ```bash
     python -m http.server 8000
     # Visit http://localhost:8000
     ```

## API Rate Limits

MovieGrid uses the free TMDB API tier:
- **1,000 requests per day**
- **40 requests per 10 seconds**

The app includes smart rate limiting and caching to stay within these limits.

## Project Status

✅ **Live & Functional:**
- Custom movie grid creation
- TMDB Top 100 browser
- Top 10 movies by year
- Drag-and-drop reordering
- Responsive design

🚧 **In Development:**
- Favorites management
- Watchlist tracking
- Export to PDF/image
- More curated lists

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Credits

- **Movie Data:** Powered by [The Movie Database (TMDB) API](https://www.themoviedb.org/)
- **Drag & Drop:** [SortableJS](https://sortablejs.github.io/Sortable/)
- **Created by:** [notAIbot](https://github.com/notAIbot)
- **Built with:** Human creativity + AI assistance (Claude Sonnet)

## Support

- **Issues:** [GitHub Issues](https://github.com/notAIbot/moviegrid/issues)
- **Live Demo:** [https://notAIbot.github.io/moviegrid/](https://notAIbot.github.io/moviegrid/)

---

Made with ❤️ for movie lovers everywhere
