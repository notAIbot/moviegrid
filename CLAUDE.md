# CLAUDE.md — MovieGrid Project Brain

## North Star
I'm building MovieGrid - a tool to create and browse curated movie poster grids. Users can view IMDB Top 100, create custom grids, manage favorites/watchlist, and explore top movies by year.

## Current Milestone
- [x] Phase 0: Setup ✅ COMPLETED
- [x] Phase 1: Foundation ✅ COMPLETED
- [x] Phase 3: Tab Navigation ✅ COMPLETED
- [x] GitHub Pages Deployment ✅ LIVE
- [ ] Phase 5-10: Implementation (NEXT)

## Project Vision
Convert the existing BookGrid application (currently displays book covers) to MovieGrid with these features:
1. **Custom Grid** - Users enter movie titles, app fetches posters from TMDB
2. **IMDB Top 100** - Pre-loaded grid of IMDB's top 100 movies
3. **Top 10 by Year** - Select a year, see top 10 movies from that year
4. **My Favorites** - Save favorite movies with localStorage
5. **My Watchlist** - Track movies to watch with localStorage

## Tech Stack
- HTML/CSS/JavaScript (vanilla, keeping existing BookGrid structure)
- TMDB API for movie posters and data
- localStorage for favorites, watchlist, and caching
- SortableJS for drag-and-drop (already integrated)
- Responsive CSS Grid layout (already working)

## Current Status - WHERE WE ARE NOW (Jan 6, 2026 - Session 2)

### 🎉 LIVE ON GITHUB PAGES!
**URL:** https://notAIbot.github.io/moviegrid/

### ✅ Completed Phases:

**Phase 0: Setup (COMPLETED)**
- [x] Got TMDB API key (user obtained key: 258f275d54c441bf4329b8545cd698cb)
- [x] Created config.js with API key
- [x] Created config.example.js template
- [x] Created .gitignore (later removed config.js from it for GitHub Pages)
- [x] Created conversion script (convert_imdb_to_json.js)
- [x] Created conversion HTML interface (convert_imdb.html)
- [x] Added IMDB Top 100 list (imdb_top_100.txt)
- [x] Tested TMDB API with Hollywood (Titanic) and Bollywood (Devdas) movies ✅

**Phase 1: Foundation (COMPLETED)**
- [x] Implemented central state management (gridState object)
- [x] Built error handling framework (MovieGridError class)
- [x] Added rate limiting for TMDB API (40 requests/10 seconds)
- [x] Migrated from Google Books API to TMDB API
- [x] Updated localStorage keys (bookgrid → moviegrid)
- [x] Implemented cache management for movie posters
- [x] Renamed all references from book to movie
- [x] Updated UI with light blue theme

**Phase 3: Tab Navigation (COMPLETED)**
- [x] Added 5-tab navigation system (Custom, IMDB Top 100, Top by Year, Favorites, Watchlist)
- [x] Implemented tab switching with smooth transitions
- [x] Added active tab state persistence in localStorage
- [x] Created year selector dropdown (1900-2026) with localStorage persistence
- [x] Styled Hollywood-style title with 3D text shadow effect
- [x] Added responsive tab design for mobile and desktop
- [x] Created empty state messages for Favorites and Watchlist
- [x] Implemented tab-specific content sections

**GitHub Pages Deployment (COMPLETED)**
- [x] Committed config.js with API key to repository
- [x] Enabled GitHub Pages on repository
- [x] Site is live and fully functional at https://notAIbot.github.io/moviegrid/

### 🎬 Currently Working:
**Only Custom Grid Tab is Functional**
- Users can paste movie titles (one per line)
- App fetches posters from TMDB API
- Creates responsive poster grid
- Supports drag-and-drop reordering
- Works with Hollywood and Bollywood movies

### ⏳ Remaining Phases:
- [ ] **Phase 5: IMDB Top 100 Tab** - Auto-load top 100 movies with posters
- [ ] **Phase 6: Favorites Management** - Add/remove favorites, localStorage persistence
- [ ] **Phase 7: Watchlist Management** - Add/remove watchlist items
- [ ] **Phase 8: Top 10 by Year** - Fetch top movies for selected year from TMDB
- [ ] **Phase 9: Polish & Testing** - Hover effects, empty states, testing
- [ ] **Phase 10: Documentation** - Update README, add screenshots

## Implementation Plan Overview

### Phase 0: Setup (Current - Days 0-1)
1. Get TMDB API key ⏸️ **START HERE NEXT SESSION**
2. Create config.js structure
3. Create config.example.js
4. Update .gitignore
5. Convert imdb_top_100.txt → JSON with TMDB IDs
6. Test TMDB API

### Phase 1: Foundation (Days 1-2)
- Setup state management (gridState object)
- Setup error handling framework
- Create config.example.js for docs

### Phase 2: TMDB Integration (Days 3-4)
- Replace Google Books API → TMDB API
- Update fetchMoviePoster() function
- Update cache keys (bookgrid → moviegrid)
- Test with sample movies

### Phase 3: Tab Navigation (Day 5)
- Add tab HTML structure
- Add tab CSS styles
- Add tab switching JavaScript
- Save active tab to localStorage

### Phase 4: Convert Custom Grid (Day 6)
- Rename variables (book → movie)
- Update placeholder text
- Parse year from input
- Add action buttons (Favorites/Watchlist)

### Phase 5: IMDB Top 100 Tab (Day 7)
- Load imdb_top_100.json
- Auto-generate grid
- Show progress
- Cache results
- Add action buttons

### Phase 6: Favorites Management (Day 8)
- Create addToFavorites() function
- Update localStorage structure
- Render favorites grid
- Add "Remove from Favorites" button
- Handle empty state

### Phase 7: Watchlist Management (Day 9)
- Create addToWatchlist() function
- Render watchlist grid
- Add "Move to Favorites" button
- Add "Remove from Watchlist" button
- Handle empty state

### Phase 8: Top 10 by Year (Day 10)
- Add year selector dropdown
- Use TMDB Discover API
- Show loading state
- Cache results per year
- Add action buttons

### Phase 9: Polish & Testing (Days 11-12)
- Add hover effects
- Add empty state messages
- Test drag-and-drop persistence
- Test offline functionality
- Test rate limiting
- Mobile responsive testing

### Phase 10: Documentation (Day 13)
- Update README.md
- Add inline comments
- Create config.example.js with instructions
- Document TMDB API setup
- Add screenshots

## Key Technical Details

### TMDB API Information:
- **Free tier:** 1000 requests/day, 40 requests/10 seconds
- **Endpoints:** `/search/movie`, `/movie/{id}`, `/discover/movie`
- **Poster URL format:** `https://image.tmdb.org/t/p/w500${poster_path}`
- **API Key storage:** config.js (not committed to repo)

### State Management Architecture:
```javascript
const gridState = {
  activeTab: 'custom',
  tabs: {
    custom: { movies: [], input: '' },
    imdbTop100: { movies: [], loaded: false },
    topByYear: { year: 2024, movies: [] },
    favorites: { movies: {} },
    watchlist: { movies: {} }
  }
};
```

### localStorage Keys:
- `movieCache_posters` - Poster URLs cache
- `movieData_favorites` - User favorites
- `movieData_watchlist` - User watchlist
- `movieData_gridOrder` - Drag-drop order per tab
- `movieData_lastActiveTab` - Remember active tab
- `movieData_lastYear` - Remember last selected year

### Files to Modify (from plan):
1. `/Users/k2ey/vm-claude-project/Projects/movie_grid/index.html` - Add tabs, update text
2. `/Users/k2ey/vm-claude-project/Projects/movie_grid/app.js` - TMDB API, state management
3. `/Users/k2ey/vm-claude-project/Projects/movie_grid/styles.css` - Tab styles, action buttons
4. `/Users/k2ey/vm-claude-project/Projects/movie_grid/README.md` - Update documentation
5. `/Users/k2ey/vm-claude-project/Projects/movie_grid/imdb_top_100.txt` - Parse to JSON

### New Files to Create:
- `config.js` - TMDB API key (not committed)
- `config.example.js` - Template for users
- `.gitignore` - Exclude config.js
- `data/imdb_top_100.json` - Parsed movie data with TMDB IDs

## Critical Edge Cases (Documented in Plan)
1. Movie Not Found → Show placeholder
2. Duplicate Movies → Allow (document behavior)
3. Offline Access → Show cached data
4. Rate Limit Hit → Pause 10sec, show message
5. Empty States → Friendly messages
6. Large Posters → Lazy loading
7. Tab Switch → Save input to localStorage
8. Drag-Drop Order → Persist to localStorage

## Success Criteria
✅ Custom movie grids via text input
✅ IMDB Top 100 auto-displays with posters
✅ Year selector shows top 10 movies
✅ Favorites & watchlist with add/remove
✅ Drag-and-drop reordering
✅ localStorage persistence
✅ Mobile responsive
✅ Progress indicators

## Next Steps for Next Session

### 🚀 START HERE (Session 3):

**Site is live! Next, implement remaining tabs:**

1. **Phase 5: IMDB Top 100 Tab**
   - Load imdb_top_100.json (need to convert imdb_top_100.txt first using convert_imdb.html)
   - Auto-generate grid with all 100 movie posters
   - Show progress indicator
   - Cache results in localStorage
   - Add action buttons (Add to Favorites/Watchlist)

2. **Phase 6: Favorites Management**
   - Create addToFavorites() function
   - Save/load from localStorage
   - Render favorites grid
   - Add "Remove from Favorites" button
   - Handle empty state

3. **Phase 7: Watchlist Management**
   - Similar to Favorites
   - Add "Move to Favorites" button

4. **Phase 8: Top 10 by Year**
   - Use TMDB Discover API with year filter
   - Implement year selector functionality

**Or:** Polish existing features, add documentation, screenshots

## Decisions Made
- **Jan 5, 2025:** Using TMDB API (free, excellent poster quality)
- **Jan 5, 2025:** localStorage only (no backend for MVP)
- **Jan 5, 2025:** Keep existing BookGrid structure (proven, works well)
- **Jan 5, 2025:** Tab-based navigation (5 grid types)
- **Jan 5, 2025:** Convert IMDB txt to JSON for efficiency
- **Jan 6, 2026:** Commit config.js with API key to enable GitHub Pages (public API key approach)
- **Jan 6, 2026:** Light blue color theme for movie/cinema aesthetic
- **Jan 6, 2026:** Hollywood-style title with 3D text shadow and serif font

## Commit Message Style
- Always use 🐵 (Monkey emoji) instead of 🤖 (robot emoji)
- Always end commit messages with:
  ```
  🐵 Generated by humans (notAIbot) in partnership with robots (Claude Sonnet)
  ```

## What I Learned

**Jan 5, 2025 (Session 1 - Planning):**
- Researched existing BookGrid codebase architecture
- Learned about TMDB API:
  - Free tier with 1000 requests/day
  - 40 requests per 10 seconds rate limit
  - Multiple poster sizes available (using w500)
  - Need API key from themoviedb.org
- Designed comprehensive state management:
  - Central gridState object for all tabs
  - localStorage for persistence
  - Separate cache, favorites, watchlist
- Planned tab navigation system:
  - 5 tabs with show/hide logic
  - Save active tab for next visit
  - Each tab has own grid container
- Identified 8 critical edge cases:
  - Rate limiting, offline access, empty states
  - All documented with solutions
- Created 10-phase implementation plan:
  - From setup to documentation
  - 13-day timeline with clear milestones
  - Validated by planning agent

**Jan 6, 2026 (Session 2 - Implementation & Deployment):**
- Completed Phase 0, 1, and 3 in one session
- Verified TMDB API works with both Hollywood and Bollywood movies (tested Titanic and Devdas)
- Implemented tab navigation system:
  - Active tab persistence with localStorage
  - Smooth transitions between tabs
  - Year selector populated dynamically (1900-2026)
- Learned about GitHub Pages deployment:
  - Static sites need API keys committed or user-provided
  - Decided to commit config.js publicly for easier deployment
  - Site works immediately without user setup
- Created Hollywood-style branding:
  - Serif fonts with wide letter-spacing
  - 3D text shadows for dramatic effect
  - Light blue cinema theme
- Understanding of rate limiting:
  - Built RateLimiter class to handle TMDB's 40 req/10sec limit
  - Automatic throttling prevents API errors
- Cache management:
  - localStorage caching reduces API calls
  - Improves performance and user experience

## Known Issues
- IMDB Top 100 tab not functional yet (Phase 5 pending)
- Top 10 by Year tab not functional yet (Phase 8 pending)
- Favorites tab not functional yet (Phase 6 pending)
- Watchlist tab not functional yet (Phase 7 pending)
- Public API key means rate limits are shared across all users

## Plan File Location
Full detailed plan: `/Users/k2ey/.claude/plans/fancy-yawning-pearl.md`

## Repository Status
- **Branch:** main
- **Status:** Clean, all changes committed and pushed
- **Remote:** https://github.com/notAIbot/moviegrid.git
- **GitHub Pages:** ✅ LIVE at https://notAIbot.github.io/moviegrid/
- **Latest Commits:**
  - `4e2f5bf` - Add config.js for GitHub Pages deployment
  - `e866b7f` - Phase 3: Tab Navigation
  - `4ff9ab1` - Phase 0 & Phase 1: Setup and Foundation

## Future Ideas (Post-MVP)
- Share grids as images
- Export to PDF
- More curated lists (Oscar winners, genre-specific)
- Movie details modal (plot, cast, ratings)
- Search within grids
- Filter by genre/rating
- User authentication for cloud sync
