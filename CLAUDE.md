# CLAUDE.md — MovieGrid Project Brain

## North Star
I'm building MovieGrid - a tool to create and browse curated movie poster grids. Users can view TMDB Top 100, create custom grids, manage favorites/watchlist, and explore top movies by year.

## Current Milestone
- [x] Phase 0: Setup ✅ COMPLETED
- [x] Phase 1: Foundation ✅ COMPLETED
- [x] Phase 3: Tab Navigation ✅ COMPLETED
- [x] GitHub Pages Deployment ✅ LIVE
- [x] Phase 5: TMDB Top 100 ✅ COMPLETED
- [x] Phase 6: Favorites Management ✅ COMPLETED
- [x] Phase 7: Watchlist Management ✅ COMPLETED
- [x] Phase 8: PNG Image Export with Custom Titles ✅ COMPLETED
- [x] Phase 9: Share Grid URLs ✅ COMPLETED
- [ ] Phase 10: Polish & Documentation (NEXT)

## Project Vision
Convert the existing BookGrid application (currently displays book covers) to MovieGrid with these features:
1. **Custom Grid** - Users enter movie titles, app fetches posters from TMDB
2. **TMDB Top 100** - Pre-loaded grid of TMDB's top 100 movies
3. **Top 10 by Year** - Select a year, see top 10 movies from that year
4. **My Favorites** - Save favorite movies with localStorage
5. **My Watchlist** - Track movies to watch with localStorage

## Tech Stack
- HTML/CSS/JavaScript (vanilla, keeping existing BookGrid structure)
- TMDB API for movie posters and data
- localStorage for favorites, watchlist, and caching
- SortableJS for drag-and-drop reordering
- html2canvas for high-resolution PNG image export
- QRCode.js for QR code generation (share feature)
- Responsive CSS Grid layout

## Current Status - WHERE WE ARE NOW (Jan 21, 2026 - Session 9)

### 🎉 LIVE ON GITHUB PAGES!
**URL:** https://notAIbot.github.io/moviegrid/

### ✅ Completed Phases:

**Phase 0: Setup (COMPLETED)**
- [x] Got TMDB API key (user obtained key: 258f275d54c441bf4329b8545cd698cb)
- [x] Created config.js with API key
- [x] Created config.example.js template
- [x] Created .gitignore (later removed config.js from it for GitHub Pages)
- [x] Created conversion script (convert_imdb_to_json.js) - No longer needed, fetching from TMDB API
- [x] Created conversion HTML interface (convert_imdb.html) - No longer needed, fetching from TMDB API
- [x] Added IMDB Top 100 list (imdb_top_100.txt) - No longer needed, fetching from TMDB API
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
- [x] Added 5-tab navigation system (Custom, TMDB Top 100, Top by Year, Favorites, Watchlist)
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

**Phase 5: TMDB Top 100 (COMPLETED)**
- [x] Implemented fetchTMDBTop100() to fetch 100 movies from TMDB API
- [x] Used discover/movie endpoint with popularity sort and vote count filter
- [x] Created renderTMDBTop100Grid() to display movies
- [x] Added auto-load functionality when tab is clicked
- [x] Implemented progress indicator during loading
- [x] Added localStorage caching for TMDB Top 100 results
- [x] Tab shows 100 most popular movies with high ratings

**Phase 6: Favorites Management (COMPLETED)**
- [x] Implemented addToFavorites() and removeFromFavorites() functions
- [x] Added heart icon (❤️) action button on movie posters
- [x] Toggle favorite status with single click
- [x] Persistent storage in localStorage
- [x] Render favorites grid with renderFavoritesGrid()
- [x] Bulk add favorites via text file upload
- [x] Remove button (×) on favorites tab
- [x] Clear All button with confirmation dialog
- [x] Empty state message when no favorites
- [x] Sort by order added (oldest first)

**Phase 7: Watchlist Management (COMPLETED)**
- [x] Implemented addToWatchlist() and removeFromWatchlist() functions
- [x] Added clipboard icon (📋) action button on movie posters
- [x] Toggle watchlist status with single click
- [x] Persistent storage in localStorage
- [x] Render watchlist grid with renderWatchlistGrid()
- [x] Bulk add watchlist via text file upload
- [x] Remove button (×) on watchlist tab
- [x] Clear All button with confirmation dialog
- [x] Empty state message when no watchlist items
- [x] Sort by order added (oldest first)

**Phase 8: PNG Image Export with Custom Titles (COMPLETED)**
- [x] Added html2canvas library for high-quality PNG export
- [x] Floating "📸 Download as Image" button (all 5 tabs)
- [x] Optional custom title prompt for Favorites and Watchlist exports
- [x] Adaptive resolution scaling (1x-3x) based on grid size
- [x] Added img.crossOrigin='anonymous' for TMDB CORS compatibility
- [x] Custom titles displayed in exported image
- [x] Smart filename generation (includes tab name, custom title, date, .png extension)
- [x] Hides action buttons (heart/clipboard) and input sections during capture
- [x] Captures grid-frame with optional title
- [x] Error handling for empty grids, large grids, and timeouts
- [x] Adaptive timeout (15s-90s) based on movie count
- [x] Temporary title injection - doesn't save to localStorage

**Phase 9: Share Grid URLs (COMPLETED)**
- [x] Added QRCode.js library for QR code generation
- [x] Floating "🔗 Share Grid" button on Custom, Favorites, Watchlist, and Top by Year tabs
- [x] Share modal with multiple sharing options
- [x] Base64 JSON URL encoding (supports 100-200 movies per URL)
- [x] Optional custom title for shared grids
- [x] Edit permission toggle (read-only or editable)
- [x] Copy to clipboard functionality with visual feedback
- [x] QR code generation and download as PNG
- [x] Social media share buttons (Twitter, Facebook, LinkedIn)
- [x] Email share with pre-filled subject and body
- [x] URL length validation (warns at 1500+ chars, errors at 2000+)
- [x] Shared grid loading on page load with URL parameter parsing
- [x] Movie hydration from TMDB IDs (fetches full movie data)
- [x] Read-only shared grids with banner and "Save to My..." button
- [x] Mobile responsive modal design
- [x] Automatic URL cleanup after loading (removes ?share= parameter)

### 🎬 Fully Functional Features:
**All 5 Tabs are Working!**
- **Custom Grid:**
  - Users can paste movie titles (one per line)
  - App fetches posters from TMDB API
  - Creates responsive poster grid
  - Supports drag-and-drop reordering
  - Works with Hollywood and Bollywood movies
  - Heart/clipboard icons to add to Favorites/Watchlist
  - Export as PNG image (adaptive 1x-3x resolution)
  - Share grid via URL, QR code, or social media
- **TMDB Top 100:**
  - Auto-loads top 100 popular movies from TMDB
  - Displays high-quality movie posters
  - Cached in localStorage for fast subsequent loads
  - Supports drag-and-drop reordering
  - Heart/clipboard icons to add to Favorites/Watchlist
  - Export as PNG image (adaptive 1x-3x resolution)
- **Top 10 by Year:**
  - Year selector dropdown (1900-2026)
  - Fetches top 10 movies for selected year
  - Cached results per year
  - Heart/clipboard icons to add to Favorites/Watchlist
  - Export as PNG image (adaptive 1x-3x resolution)
  - Share grid via URL, QR code, or social media
- **Favorites:**
  - Heart icon toggles favorite status on any poster
  - Bulk add via text file upload
  - Remove button (×) on each poster
  - Clear All button with confirmation dialog
  - Displays in order added
  - localStorage persistence
  - Export as PNG with optional custom title prompt
  - Share grid via URL, QR code, or social media (with read-only option)
- **Watchlist:**
  - Clipboard icon toggles watchlist status on any poster
  - Bulk add via text file upload
  - Remove button (×) on each poster
  - Clear All button with confirmation dialog
  - Displays in order added
  - localStorage persistence
  - Export as PNG with optional custom title prompt
  - Share grid via URL, QR code, or social media (with read-only option)

### ⏳ Remaining Phases:
- [ ] **Phase 10: Polish & Testing** - Mobile testing, edge case handling, user guide updates

## Implementation Plan Overview

### Phase 0: Setup (Current - Days 0-1)
1. Get TMDB API key ⏸️ **START HERE NEXT SESSION**
2. Create config.js structure
3. Create config.example.js
4. Update .gitignore
5. (Removed) Convert imdb_top_100.txt → JSON - Now fetching directly from TMDB API
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

### Phase 5: TMDB Top 100 Tab (Day 7)
- Fetch top 100 movies from TMDB API
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
1. `index.html` - Add tabs, update text
2. `app.js` - TMDB API, state management
3. `styles.css` - Tab styles, action buttons
4. `README.md` - Update documentation

### New Files to Create:
- `config.js` - TMDB API key (now committed for GitHub Pages)
- `config.example.js` - Template for users
- `.gitignore` - Exclude config.js (later removed config.js from it)

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
✅ TMDB Top 100 auto-displays with posters
✅ Year selector shows top 10 movies
✅ Favorites & watchlist with add/remove
✅ Drag-and-drop reordering
✅ localStorage persistence
✅ Mobile responsive
✅ Progress indicators

## Next Steps for Next Session

### 🚀 START HERE (Session 9):

**Recent improvements complete (auto-load, z-index fixes). Continue polish and documentation:**

1. **Phase 9: Polish & Testing**
   - Test screenshot on mobile devices (different browsers)
   - Test edge cases (rate limiting, offline, etc.)
   - Test large grids (100+ movies) screenshot performance
   - Improve error messages
   - Add tooltips to action buttons
   - Test cross-browser compatibility (Safari, Firefox, Chrome)

2. **Phase 10: Documentation**
   - Add screenshots to README showing the new screenshot feature
   - Create user guide section
   - Document keyboard shortcuts if any
   - Add FAQ section
   - Add demo GIF/video of screenshot feature in action

3. **Optional Enhancements:**
   - Persist drag-and-drop order across page reloads
   - Add export to PDF functionality (screenshot is PNG only now)
   - Add movie details modal (plot, cast, ratings)
   - Add more curated lists (Oscar winners, genre-specific)
   - Quality selector for screenshots (low/medium/high)

## Decisions Made
- **Jan 5, 2025:** Using TMDB API (free, excellent poster quality)
- **Jan 5, 2025:** localStorage only (no backend for MVP)
- **Jan 5, 2025:** Keep existing BookGrid structure (proven, works well)
- **Jan 5, 2025:** Tab-based navigation (5 grid types)
- **Jan 5, 2025:** (Revised) Fetch top movies directly from TMDB API instead of converting IMDB txt to JSON
- **Jan 9, 2026:** Using TMDB API for Top 100 movies instead of static IMDB list
- **Jan 9, 2026:** Cinema-themed popcorn texture background with dark theater colors
- **Jan 6, 2026:** Commit config.js with API key to enable GitHub Pages (public API key approach)
- **Jan 6, 2026:** Light blue color theme for movie/cinema aesthetic (replaced in Session 4)
- **Jan 6, 2026:** Hollywood-style title with 3D text shadow and serif font
- **Jan 11, 2026:** Action icons (heart/clipboard) positioned at bottom-center of posters (better UX)
- **Jan 11, 2026:** Sort Favorites/Watchlist by order added (oldest first) to maintain file upload order
- **Jan 11, 2026:** Make icons always visible when movie is in a list (stateful UI)
- **Jan 12, 2026:** Use html2canvas + jsPDF for PDF export (most reliable, professional output)
- **Jan 12, 2026:** PDF export instead of PNG screenshot (more versatile for sharing/printing)
- **Jan 12, 2026:** User prompt for custom PDF title (personalization before export)
- **Jan 12, 2026:** 3x resolution canvas (balance quality vs performance)
- **Jan 12, 2026:** A4 format with auto landscape/portrait based on aspect ratio
- **Jan 12, 2026:** Capture tab header + grid together for full context
- **Jan 12, 2026:** Hide action buttons during capture for cleaner output
- **Jan 12, 2026:** Floating action button in bottom-right (always accessible)
- **Jan 12, 2026:** Subtle bronze cinema ticket theme (not bright gold - too flashy)
- **Jan 12, 2026:** Compact button size (user preference for subtlety)
- **Jan 12, 2026:** Use 🎬 emoji as favicon for instant movie theme recognition

## Commit Message Style
- Always use 🐵 (Monkey emoji) instead of 🤖 (robot emoji)
- Always end commit messages with:
  ```
  🐵 Generated by humans (notAIbot) in partnership with robots (Claude Sonnet)
  ```

## Git Workflow
- **IMPORTANT:** Always ask for permission before running `git add`, `git commit`, or `git push` commands
- Exception: Only proceed with git operations automatically if the user explicitly requests it in their message (e.g., "commit and push", "push this change")
- When changes are complete, wait for user to explicitly request commit/push
- User prefers to control when code is deployed to GitHub Pages

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

**Jan 9, 2026 (Session 3 - Phase 5: TMDB Top 100):**
- Completed Phase 5: TMDB Top 100 Tab
- Clarified project uses TMDB API, not IMDB data:
  - Updated all documentation references from IMDB to TMDB
  - Removed obsolete imdb_top_100.txt conversion approach
- Implemented TMDB Top 100 functionality:
  - Created fetchTMDBTop100() to fetch 100 movies across 5 API pages
  - Used discover/movie endpoint with popularity.desc sort
  - Added vote_count.gte=1000 filter for quality movies
  - Implemented renderTMDBTop100Grid() for display
  - Added auto-load when tab is clicked
  - Progress indicator shows loading status
  - localStorage caching for instant subsequent loads
- Architecture decisions:
  - Fetch movies by popularity (most reliable metric from TMDB)
  - Cache entire 100-movie list in localStorage
  - Reuse existing drag-and-drop and poster display logic
  - Auto-load prevents users from needing manual trigger

**Jan 9, 2026 (Session 4 - Cinema Background Design):**
- Replaced light blue gradient background with cinema-themed popcorn texture
- Design features:
  - Dark theater atmosphere with burgundy/purple velvet curtain gradient
  - Subtle floating popcorn kernel pattern using radial gradients
  - 24-second animation cycle for gentle motion effect
  - Keeps movie posters prominent while adding immersive cinema vibe
- CSS implementation:
  - 9 layered radial gradients for popcorn texture
  - Animated background positions for floating effect
  - Dark base colors (#1a0a0f to #2d1b3d) for theater aesthetic

**Jan 11, 2026 (Session 5 - Favorites & Watchlist + UI Polish):**
- Completed Phase 6 & 7: Favorites and Watchlist Management
- Implemented features:
  - Heart (❤️) and clipboard (📋) action buttons on all movie posters
  - Toggle functionality - click to add/remove from Favorites/Watchlist
  - Stateful buttons - icons stay visible when movie is in list
  - Bulk add functionality - upload text files with movie titles
  - Remove buttons (×) on Favorites and Watchlist tabs
  - localStorage persistence for both lists
  - Empty state messages for empty lists
- UI improvements:
  - Repositioned action icons from top-right to bottom-center of posters
  - Changed layout from vertical to horizontal (side-by-side icons)
  - Sort order changed to oldest-first (maintains file upload order)
  - Icons appear on hover, always visible if movie is in a list
- Technical learnings:
  - CSS positioning with `transform: translateX(-50%)` for centering
  - Stateful UI with `.active` class on buttons
  - File upload with FileReader API for bulk imports
  - localStorage JSON serialization for movie data with metadata

**Jan 12, 2026 (Session 6 - PDF Export & Clear All Functionality):**
- Completed Phase 8: PDF Export Feature (evolved from screenshot)
- Implemented complete PDF export system:
  - Added html2canvas + jsPDF libraries via CDN
  - Changed from PNG screenshot to professional PDF export
  - User prompted for custom title before export (optional)
  - Title rendered at top of PDF in bold 20pt font
  - 3x resolution canvas for crystal-clear PDF quality
  - Smart A4 sizing with auto landscape/portrait orientation
  - Smart filename generation (moviegrid-{tab}-{date}.pdf)
  - Temporary element hiding (buttons, inputs) during capture
- Technical challenges solved:
  - Initial approach with cloning elements failed (blank images)
  - Off-screen positioning prevented html2canvas from rendering
  - Solution: Hide unwanted elements, capture visible content directly
  - Wait for all images to load before capture to prevent blank posters
- html2canvas + jsPDF learnings:
  - `useCORS: true` handles cross-origin TMDB images automatically
  - `scale` parameter controls output resolution (higher = better quality)
  - Direct DOM capture more reliable than cloning elements
  - Elements must be visible (not off-screen) for capture to work
  - jsPDF auto-orientation based on aspect ratio (landscape/portrait)
  - PDF dimensions calculated to fit A4 page with margins
- UI/UX improvements:
  - Added 🎬 emoji favicon using SVG for scalability
  - Floating action button in bottom-right corner
  - Subtle bronze cinema ticket theme (not bright gold)
  - Compact size: 8px × 16px padding, 0.8rem font
  - 85% opacity for subtlety, full opacity on hover
  - Button only visible on active tab
  - Updated Custom Grid instructions to mention PDF export
  - User prompt for custom PDF title with cancel support
- Design iterations:
  - Started with bright golden button → too bright
  - Reduced to muted bronze/copper tones
  - Changed from absolute to fixed positioning (floating)
  - Made smaller per user feedback (60% size reduction)
  - Pill-shaped with gentle hover effects
- Added Clear All functionality:
  - Red "🗑️ Clear All" buttons for both Favorites and Watchlist tabs
  - Confirmation dialogs showing count of items to be cleared
  - Prevents accidental data loss with "cannot be undone" warning
  - Updates all action buttons across page after clearing
  - Shows notification with count of items cleared
  - Handles empty state gracefully (shows "No items to clear" message)
  - clearAllFavorites() and clearAllWatchlist() functions with identical patterns
  - Event listeners properly connected to button elements
- Fixed PDF export for large grids (150+ movies):
  - Implemented adaptive scaling: 1x scale for 150+ movies (was fixed 3x)
  - Adaptive timeouts: 60 seconds for 150+ movies (was 15 seconds)
  - User reported 198-movie watchlist exported empty PDF
  - Root cause: 3x scale + 15-second timeout couldn't handle large canvas
  - Solution: Scale and timeout now adapt to movie count
  - Canvas validation to catch empty canvas errors
  - Detailed console logging for debugging
  - Progress notifications show movie count and estimated time
- Added detailed error reporting for failed imports:
  - Track which specific movie titles failed during bulk import
  - Show alert dialog with bulleted list of failed titles
  - Helpful guidance: "Most likely not found in TMDB database"
  - Applies to both Favorites and Watchlist bulk imports
  - User can now identify typos or unavailable movies
- File organization:
  - app.js: +380 lines (PDF generation, title prompt, filename logic, Clear All functions, adaptive scaling, error reporting)
  - styles.css: +100 lines (floating button, cinema theme, Clear All button styling, mobile responsive)
  - index.html: +10 lines (jsPDF CDN, button label changes, favicon, Clear All buttons)
  - favicon.svg: new file (🎬 emoji)

**Jan 12, 2026 (Session 7 - PNG Export Fix & Custom Title Prompts):**
- Abandoned PDF export approach due to TMDB CORS restrictions
- Switched to PNG image export for compatibility
- Fixed image export failures:
  - Root cause: TMDB images don't have proper CORS headers
  - Multiple failed approaches tried (foreignObjectRendering, CORS proxies)
  - Solution: Add `img.crossOrigin = 'anonymous'` when creating poster images
  - This allows html2canvas to read images with `useCORS: true, allowTaint: false`
- Implemented optional custom title prompts:
  - User prompted for custom title when exporting Favorites or Watchlist
  - Title displayed in exported image (injected temporarily)
  - Title included in filename (sanitized for file system)
  - Temporary only - doesn't save to localStorage
  - User can skip by leaving blank or clicking Cancel
- Technical learnings:
  - Canvas "tainting" prevents toBlob() when allowTaint: true
  - crossOrigin attribute must be set BEFORE image loads
  - TMDB API serves images without Access-Control-Allow-Origin headers
  - Solution requires setting crossOrigin on img elements at creation time
  - foreignObjectRendering bypasses pixel reading but produces empty output
- Code changes:
  - Removed jsPDF library completely
  - Changed button text from "Export as PDF" to "📸 Download as Image"
  - Fixed filename extension from .pdf to .png
  - Added temporary title element injection before capture
  - Cleanup of temporary elements in finally block
  - Filename now includes custom title: `moviegrid-favorites-my-favorites-2026-01-12.png`
- Testing workflow established:
  - Test locally first (open index.html or use local server)
  - Commit and push only after confirming fixes work
  - User preference for local testing before deployment

**Jan 19, 2026 (Session 8 - UX Improvements & Git Workflow):**
- Fixed z-index issue with action buttons:
  - Favorite (heart) and watchlist (clipboard) buttons were hidden behind movie title and ratings overlay
  - Increased z-index from 10 to 20 to ensure buttons appear above title (z-index: 15) and metadata (z-index: 14)
  - Buttons now fully clickable and visible on hover without obstruction
- Improved Top 10 by Year UX:
  - Removed "Load Movies" button - unnecessary friction point
  - Movies now auto-load when year is selected from dropdown
  - Tab also auto-loads movies on first open with selected year
  - Updated yearSelect change event to trigger loadMoviesByYear()
  - Added topByYear auto-load in switchTab() function
  - Cleaner, more intuitive user experience
- Established Git Workflow guidelines:
  - Added requirement to ask permission before git operations (add, commit, push)
  - Exception: Only proceed automatically when user explicitly requests it
  - User prefers to control when code is deployed to GitHub Pages
  - Documented in CLAUDE.md Git Workflow section
- Code cleanup:
  - Removed all loadYearBtn references and event listeners from app.js
  - Removed button HTML from index.html
  - Cleaned up function to remove disabled button state management
- User feedback integration:
  - Reinforced importance of explicit permission for git operations
  - User expects to control deployment timing for live site

**Jan 21, 2026 (Session 9 - Share Grid URLs Feature):**
- Completed Phase 9: Share Grid URLs with comprehensive sharing functionality
- Implemented URL sharing system:
  - Base64 JSON encoding for compact URLs (supports 100-200 movies)
  - URL format: `?share=eyJ2IjoxLCJ0IjoiZmF2b3JpdGVzIiwiaWRzIjpbNTUwLDI3OF19`
  - JSON structure: `{v: 1, t: "favorites", ids: [550, 278], title: "...", edit: false}`
  - Version field (v:1) for future compatibility
- Share modal implementation:
  - Added QRCode.js library (1.0.0) via CDN
  - Floating "🔗 Share Grid" button (below Download button, blue gradient)
  - Modal with 5 sharing options: Copy Link, QR Code, Twitter, Facebook, LinkedIn, Email
  - Optional custom title input for shared grids
  - Edit permission toggle (read-only by default, editable optional)
  - URL length validation with color-coded warnings (green <1500, yellow <2000, red 2000+)
- Technical implementation:
  - `generateShareURL()` - Creates Base64-encoded share URLs from current grid
  - `parseShareURL()` - Decodes and validates share parameters
  - `hydrateMoviesFromIDs()` - Fetches full movie data from TMDB API using movie IDs
  - `loadSharedGrid()` - Automatically loads shared grids on page load
  - `showSharedBanner()` - Displays read-only banner with "Save to My..." option
  - DOMContentLoaded event listener triggers shared grid loading
- QR code functionality:
  - QRCode.js generates 256×256px QR codes in modal
  - Download as PNG functionality
  - Fallback message if library fails to load
- Social sharing:
  - Twitter: Opens tweet intent with pre-filled text and URL
  - Facebook: Opens Facebook sharer dialog
  - LinkedIn: Opens LinkedIn share dialog
  - Email: Opens mailto link with subject and body
- Read-only shared grids:
  - Blue gradient banner indicates shared grid status
  - Shows optional custom title in banner
  - "💾 Save to My Favorites/Watchlist" button
  - Saves shared movies to user's own collection
  - Confirmation dialog before saving
- URL handling:
  - Automatic cleanup: Removes ?share= parameter from URL after loading
  - Uses window.history.replaceState() for clean URLs
  - Preserves browser history without share parameter
- Edge cases handled:
  - Empty grids: Block share button, show notification
  - URL too long (200+ movies): Error message, suggest image export
  - Failed movie hydration: Shows partial grid, notifies user of failed count
  - Duplicate movie IDs: Automatically deduplicated using Set
  - Invalid/malformed URLs: Graceful error handling with console logging
- UI/UX design:
  - Mobile responsive modal (95% width on mobile, 600px max on desktop)
  - Backdrop blur effect for modal overlay
  - Copy button visual feedback (turns green, shows "✅ Copied!")
  - Social buttons with brand colors (Twitter blue, Facebook blue, LinkedIn blue, gray email)
  - Share button only visible on active tab
  - Modal closes when clicking outside (backdrop click)
- Code organization:
  - Added ~640 lines to app.js (URL functions, modal logic, sharing)
  - Added ~120 lines to index.html (modal HTML, QRCode CDN, share buttons)
  - Added ~425 lines to styles.css (modal styles, responsive design)
- Architectural decisions:
  - Base64 encoding chosen for simplicity and browser compatibility
  - Movie IDs instead of full data reduces URL length significantly
  - Read-only by default for privacy/control
  - QR codes for easy mobile sharing
  - No backend required - fully client-side implementation
- Learning outcomes:
  - Base64 encoding with btoa()/atob() for URL parameter compression
  - URL length limits (~2000 chars) require careful data encoding
  - QRCode.js library integration for canvas-based QR generation
  - Social media share URL formats (Twitter intents, Facebook sharer, LinkedIn offsite)
  - Modal accessibility patterns (ESC key, backdrop click, close button)
  - Clipboard API (navigator.clipboard.writeText) with fallback (document.execCommand)
  - URL parsing with URLSearchParams API
  - Hydrating sparse data (IDs only) from API calls
  - DOMContentLoaded vs direct script execution for event listeners

## Known Issues
- Public API key means rate limits are shared across all users
- TMDB Top 100 fetches movies by popularity, not by actual IMDB/TMDB top ratings (API limitation)
- Drag-and-drop order not yet persistent across page reloads

## Plan File Location
Full detailed plan: See git history and commit messages for implementation details

## Repository Status
- **Branch:** main
- **Status:** Clean, all changes committed and pushed
- **Remote:** https://github.com/notAIbot/moviegrid.git
- **GitHub Pages:** ✅ LIVE at https://notAIbot.github.io/moviegrid/
- **Latest Commits:**
  - `bd1f3c5` - Remove Load Movies button and add Git Workflow guidelines (Session 8)
  - `e572f04` - Fix action buttons hidden behind movie title and ratings overlay (Session 8)
  - `986d79e` - Fix CORS blocking issue - remove crossOrigin from poster images (Session 7)
  - `752f6b5` - Add optional custom title prompt on image export (Session 7)
  - `18183f7` - Fix image export by setting crossOrigin on img elements (Session 7)

## Future Ideas (Post-MVP)
- ✅ ~~Share grids as images~~ (DONE - PNG export with optional custom title, adaptive 1x-3x resolution)
- Export to PDF format (requires solving TMDB CORS restrictions)
- Share directly to social media (Web Share API)
- More curated lists (Oscar winners, genre-specific)
- Movie details modal (plot, cast, ratings)
- Search within grids
- Filter by genre/rating
- User authentication for cloud sync
- Persist drag-and-drop order across page reloads
