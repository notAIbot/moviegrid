# CLAUDE.md — MovieGrid Project Brain

## North Star
I'm building MovieGrid - a tool to create and browse curated movie poster grids. Users can view IMDB Top 100, create custom grids, manage favorites/watchlist, and explore top movies by year.

## Current Milestone
- [ ] Phase 0: Setup (IN PROGRESS - STOPPED HERE) ⏸️
- [ ] Phase 1-10: Implementation

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

## Current Status - WHERE WE STOPPED (Jan 5, 2025 - Session 1)

### ✅ Completed:
- [x] Research existing BookGrid codebase
- [x] Created comprehensive implementation plan (10 phases)
- [x] Plan validated and approved
- [x] Started Phase 0: Setup

### 🔄 In Progress (Phase 0 - Setup):
**Task 1: Get TMDB API Key**
- ⏸️ **STOPPED HERE** - User needs to:
  1. Go to https://www.themoviedb.org/signup
  2. Create free account
  3. Verify email
  4. Go to https://www.themoviedb.org/settings/api
  5. Request API Key (choose "Developer")
  6. Save the API key (v3 auth) for next session

**Remaining Phase 0 Tasks:**
- [ ] Create config.js with API key
- [ ] Create config.example.js (template for other users)
- [ ] Update/create .gitignore (exclude config.js)
- [ ] Write conversion script (IMDB txt → JSON with TMDB data)
- [ ] Test TMDB API with sample movie request

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

### 🚀 START HERE:
1. **Resume Phase 0 - Task 1: Get TMDB API Key**
   - Have you registered and got your API key?
   - If yes, share it with Claude
   - If no, follow steps above first

2. **Complete Phase 0:**
   - Create config.js with your API key
   - Create config.example.js
   - Update .gitignore
   - Write IMDB conversion script
   - Test TMDB API

3. **Then move to Phase 1:** Foundation & state management

## Decisions Made
- **Jan 5, 2025:** Using TMDB API (free, excellent poster quality)
- **Jan 5, 2025:** localStorage only (no backend for MVP)
- **Jan 5, 2025:** Keep existing BookGrid structure (proven, works well)
- **Jan 5, 2025:** Tab-based navigation (5 grid types)
- **Jan 5, 2025:** Convert IMDB txt to JSON for efficiency

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

## Known Issues
- None yet - haven't started coding

## Plan File Location
Full detailed plan: `/Users/k2ey/.claude/plans/fancy-yawning-pearl.md`

## Repository Status
- **Branch:** main
- **Uncommitted files:** All files (project not yet committed)
- **Remote:** https://github.com/notAIbot/moviegrid.git

## Future Ideas (Post-MVP)
- Share grids as images
- Export to PDF
- More curated lists (Oscar winners, genre-specific)
- Movie details modal (plot, cast, ratings)
- Search within grids
- Filter by genre/rating
- User authentication for cloud sync
