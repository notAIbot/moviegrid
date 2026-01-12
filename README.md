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

### 🌟 TMDB Top Rated
- Pre-loaded grid of the 100 highest-rated movies
- Based on TMDB's official top-rated rankings
- Matches the movies from [TMDB Top Rated](https://www.themoviedb.org/movie/top-rated)
- One-click loading with progress tracking
- Cached for fast subsequent loads

### 📅 Top 10 by Year
- Select any year from 1900 to present
- Discover top-rated movies from that year
- Explore cinema history decade by decade
- Cached results for instant access

### ❤️ Favorites & 📋 Watchlist
- Save your favorite movies with one click
- Track movies you want to watch
- Bulk add movies via text file upload
- Toggle status with action buttons on posters
- Persistent storage in your browser (localStorage)
- Movies display in the order they were added

## How to Use

1. **Visit the app:** [https://notAIbot.github.io/moviegrid/](https://notAIbot.github.io/moviegrid/)
2. **Choose a tab:**
   - **Custom Grid:** Paste your movie titles
   - **TMDB Top Rated:** Browse highest-rated movies
   - **Top 10 by Year:** Select a year to explore
   - **Favorites:** Save and manage your favorite movies
   - **Watchlist:** Track movies you want to watch
3. **Customize:** Drag posters to reorder them, click heart/clipboard icons to add to Favorites/Watchlist
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

## API Rate Limits

MovieGrid uses the free TMDB API tier:
- **1,000 requests per day**
- **40 requests per 10 seconds**

The app includes smart rate limiting and caching to stay within these limits.

## Project Status

✅ **Live & Functional:**
- Custom movie grid creation
- TMDB Top Rated browser (matches official TMDB rankings)
- Top 10 movies by year
- Favorites management with bulk add
- Watchlist tracking with bulk add
- Drag-and-drop reordering
- Responsive design

🚧 **In Development:**
- Export to PDF/image
- More curated lists
- Movie details modal


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
