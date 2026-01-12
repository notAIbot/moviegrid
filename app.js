// ===== MOVIEGRID APPLICATION =====
// Phase 1: Foundation - State Management & Error Handling

// ===== CONFIGURATION =====
// Load TMDB config (config.js must be loaded first in HTML)
const TMDB_API_KEY = CONFIG.TMDB_API_KEY;
const TMDB_BASE_URL = CONFIG.TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = CONFIG.TMDB_IMAGE_BASE_URL;
const RATE_LIMIT = CONFIG.TMDB_RATE_LIMIT;

// ===== STATE MANAGEMENT =====
const gridState = {
  activeTab: 'imdbTop100', // Current active tab
  tabs: {
    custom: {
      movies: [],
      input: '',
      customTitle: ''
    },
    imdbTop100: {
      movies: [],
      loaded: false
    },
    topByYear: {
      year: 2024,
      movies: []
    },
    favorites: {
      movies: {} // Object with movie IDs as keys
    },
    watchlist: {
      movies: {} // Object with movie IDs as keys
    }
  },
  loading: false,
  error: null
};

// ===== LOCALSTORAGE KEYS =====
const STORAGE_KEYS = {
  POSTER_CACHE: 'moviegrid_poster_cache',
  FAVORITES: 'moviegrid_favorites',
  WATCHLIST: 'moviegrid_watchlist',
  GRID_ORDER: 'moviegrid_grid_order',
  LAST_TAB: 'moviegrid_last_tab',
  LAST_YEAR: 'moviegrid_last_year',
  CUSTOM_TITLE: 'moviegrid_custom_title',
  CUSTOM_INPUT: 'moviegrid_custom_input'
};

// ===== ERROR HANDLING FRAMEWORK =====
class MovieGridError extends Error {
  constructor(message, type, details = {}) {
    super(message);
    this.name = 'MovieGridError';
    this.type = type; // 'API_ERROR', 'RATE_LIMIT', 'NETWORK_ERROR', 'CACHE_ERROR', 'NOT_FOUND'
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

// Error handler
function handleError(error, context = '') {
  console.error(`[MovieGrid Error - ${context}]:`, error);

  // Update state
  gridState.error = {
    message: error.message,
    type: error.type || 'UNKNOWN',
    context,
    timestamp: error.timestamp || new Date().toISOString()
  };

  // Show user-friendly message
  showError(error);
}

// Show error to user
function showError(error) {
  const errorMessages = {
    'RATE_LIMIT': 'Too many requests. Please wait a moment and try again.',
    'API_ERROR': 'Unable to fetch movie data. Please check your internet connection.',
    'NETWORK_ERROR': 'Network error. Please check your internet connection.',
    'NOT_FOUND': 'Movie not found. Please check the title and try again.',
    'CACHE_ERROR': 'Cache error. Your data may not be saved.',
    'UNKNOWN': 'An unexpected error occurred. Please try again.'
  };

  const message = errorMessages[error.type] || errorMessages['UNKNOWN'];

  // TODO: Replace with better UI notification in later phases
  alert(message);
}

// ===== RATE LIMITING =====
class RateLimiter {
  constructor(maxRequests, periodMs) {
    this.maxRequests = maxRequests;
    this.periodMs = periodMs;
    this.requests = [];
  }

  async throttle() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.periodMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.periodMs - (now - oldestRequest) + 100;
      console.log(`Rate limit: waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.throttle();
    }

    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter(RATE_LIMIT.requestsPerPeriod, RATE_LIMIT.periodInSeconds * 1000);

// ===== CACHE MANAGEMENT =====
function getCache() {
  try {
    const cache = localStorage.getItem(STORAGE_KEYS.POSTER_CACHE);
    return cache ? JSON.parse(cache) : {};
  } catch (e) {
    throw new MovieGridError('Failed to read cache', 'CACHE_ERROR', { originalError: e.message });
  }
}

function saveToCache(query, posterUrl) {
  try {
    const cache = getCache();
    cache[query.toLowerCase()] = posterUrl;
    localStorage.setItem(STORAGE_KEYS.POSTER_CACHE, JSON.stringify(cache));
  } catch (e) {
    console.warn('Cache save failed:', e);
    // Don't throw - caching is optional
  }
}

// ===== TMDB API FUNCTIONS =====

// Search for movie on TMDB
async function searchMovie(title) {
  await rateLimiter.throttle();

  const cache = getCache();
  const cacheKey = title.toLowerCase();

  // Check cache first
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        throw new MovieGridError('Rate limit exceeded', 'RATE_LIMIT');
      }
      throw new MovieGridError('API request failed', 'API_ERROR', { status: response.status });
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      const posterUrl = movie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
        : null;

      if (posterUrl) {
        const movieData = {
          posterUrl: posterUrl,
          id: movie.id,
          title: movie.title
        };
        saveToCache(title, movieData);
        return movieData;
      }
    }

    throw new MovieGridError('Movie not found', 'NOT_FOUND', { title });

  } catch (error) {
    if (error instanceof MovieGridError) {
      throw error;
    }
    throw new MovieGridError('Network error', 'NETWORK_ERROR', { originalError: error.message });
  }
}

// ===== UI HELPER FUNCTIONS =====

// Create movie poster element
function createMoviePoster(posterUrl, title, movieId, showActions = false) {
  const div = document.createElement('div');
  div.className = 'movie-poster';
  div.dataset.movieId = movieId;
  div.dataset.title = title;
  div.dataset.posterUrl = posterUrl;

  // Wrap in link if we have a movie ID
  if (movieId) {
    const link = document.createElement('a');
    link.href = `https://www.themoviedb.org/movie/${movieId}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'poster-link';

    if (posterUrl) {
      const img = document.createElement('img');
      img.src = posterUrl;
      img.alt = title;
      link.appendChild(img);
    } else {
      link.classList.add('placeholder');
      link.textContent = 'No poster found';
    }

    div.appendChild(link);

    // Add action buttons overlay if requested
    if (showActions) {
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'movie-actions';

      const favBtn = document.createElement('button');
      favBtn.className = 'action-btn fav-btn';
      favBtn.innerHTML = '❤️';
      favBtn.title = 'Add to Favorites';
      favBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToFavorites(movieId, title, posterUrl);
      };

      const watchlistBtn = document.createElement('button');
      watchlistBtn.className = 'action-btn watchlist-btn';
      watchlistBtn.innerHTML = '📋';
      watchlistBtn.title = 'Add to Watchlist';
      watchlistBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToWatchlist(movieId, title, posterUrl);
      };

      actionsDiv.appendChild(favBtn);
      actionsDiv.appendChild(watchlistBtn);
      div.appendChild(actionsDiv);
    }
  } else {
    // No movie ID, show non-clickable poster
    if (posterUrl) {
      const img = document.createElement('img');
      img.src = posterUrl;
      img.alt = title;
      div.appendChild(img);
    } else {
      div.classList.add('placeholder');
      div.textContent = 'No poster found';
    }
  }

  return div;
}

// Show/hide loading indicator
function setLoading(isLoading, message = '') {
  gridState.loading = isLoading;
  const progress = document.getElementById('progress');

  if (isLoading) {
    progress.textContent = message;
    progress.classList.add('active');
  } else {
    progress.classList.remove('active');
  }
}

// ===== FAVORITES & WATCHLIST MANAGEMENT =====

// Add movie to favorites
function addToFavorites(movieId, title, posterUrl, showNotif = true) {
  if (!movieId) return;

  // Add to state
  gridState.tabs.favorites.movies[movieId] = {
    id: movieId,
    title,
    posterUrl,
    addedAt: Date.now()
  };

  // Save to localStorage
  saveFavoritesToStorage();

  // Show confirmation
  if (showNotif) {
    showNotification(`"${title}" added to favorites! ❤️`);
  }

  // Re-render favorites grid if we're on that tab
  if (gridState.activeTab === 'favorites') {
    renderFavoritesGrid();
  }
}

// Remove movie from favorites
function removeFromFavorites(movieId) {
  if (!movieId) return;

  const movie = gridState.tabs.favorites.movies[movieId];
  delete gridState.tabs.favorites.movies[movieId];

  // Save to localStorage
  saveFavoritesToStorage();

  // Show confirmation
  if (movie) {
    showNotification(`"${movie.title}" removed from favorites`);
  }

  // Re-render favorites grid
  renderFavoritesGrid();
}

// Add movie to watchlist
function addToWatchlist(movieId, title, posterUrl, showNotif = true) {
  if (!movieId) return;

  // Add to state
  gridState.tabs.watchlist.movies[movieId] = {
    id: movieId,
    title,
    posterUrl,
    addedAt: Date.now()
  };

  // Save to localStorage
  saveWatchlistToStorage();

  // Show confirmation
  if (showNotif) {
    showNotification(`"${title}" added to watchlist! 📋`);
  }

  // Re-render watchlist grid if we're on that tab
  if (gridState.activeTab === 'watchlist') {
    renderWatchlistGrid();
  }
}

// Remove movie from watchlist
function removeFromWatchlist(movieId) {
  if (!movieId) return;

  const movie = gridState.tabs.watchlist.movies[movieId];
  delete gridState.tabs.watchlist.movies[movieId];

  // Save to localStorage
  saveWatchlistToStorage();

  // Show confirmation
  if (movie) {
    showNotification(`"${movie.title}" removed from watchlist`);
  }

  // Re-render watchlist grid
  renderWatchlistGrid();
}

// Move movie from watchlist to favorites
function moveToFavorites(movieId) {
  const movie = gridState.tabs.watchlist.movies[movieId];
  if (!movie) return;

  // Add to favorites
  addToFavorites(movieId, movie.title, movie.posterUrl);

  // Remove from watchlist
  removeFromWatchlist(movieId);

  showNotification(`"${movie.title}" moved to favorites! ❤️`);
}

// Save favorites to localStorage
function saveFavoritesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(gridState.tabs.favorites.movies));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
}

// Save watchlist to localStorage
function saveWatchlistToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(gridState.tabs.watchlist.movies));
  } catch (error) {
    console.error('Error saving watchlist to localStorage:', error);
  }
}

// Load favorites from localStorage
function loadFavoritesFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (saved) {
      gridState.tabs.favorites.movies = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
  }
}

// Load watchlist from localStorage
function loadWatchlistFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    if (saved) {
      gridState.tabs.watchlist.movies = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading watchlist from localStorage:', error);
  }
}

// Show notification message
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  // Hide and remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Render favorites grid
function renderFavoritesGrid() {
  const favoritesGrid = document.getElementById('favoritesGrid');
  const emptyState = document.getElementById('favoritesEmpty');

  if (!favoritesGrid) return;

  // Clear grid
  favoritesGrid.innerHTML = '';

  const favorites = Object.values(gridState.tabs.favorites.movies);

  if (favorites.length === 0) {
    // Show empty state
    emptyState.style.display = 'block';
    return;
  }

  // Hide empty state
  emptyState.style.display = 'none';

  // Sort by most recently added
  favorites.sort((a, b) => b.addedAt - a.addedAt);

  // Create poster elements with remove button
  favorites.forEach(movie => {
    const posterDiv = createMoviePoster(movie.posterUrl, movie.title, movie.id, false);

    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'action-btn remove-btn';
    removeBtn.innerHTML = '✕';
    removeBtn.title = 'Remove from Favorites';
    removeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeFromFavorites(movie.id);
    };

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'movie-actions';
    actionsDiv.appendChild(removeBtn);
    posterDiv.appendChild(actionsDiv);

    favoritesGrid.appendChild(posterDiv);
  });

  // Initialize drag-and-drop for favorites grid
  new Sortable(favoritesGrid, {
    animation: 150,
    ghostClass: 'sortable-ghost'
  });
}

// Render watchlist grid
function renderWatchlistGrid() {
  const watchlistGrid = document.getElementById('watchlistGrid');
  const emptyState = document.getElementById('watchlistEmpty');

  if (!watchlistGrid) return;

  // Clear grid
  watchlistGrid.innerHTML = '';

  const watchlist = Object.values(gridState.tabs.watchlist.movies);

  if (watchlist.length === 0) {
    // Show empty state
    emptyState.style.display = 'block';
    return;
  }

  // Hide empty state
  emptyState.style.display = 'none';

  // Sort by most recently added
  watchlist.sort((a, b) => b.addedAt - a.addedAt);

  // Create poster elements with action buttons
  watchlist.forEach(movie => {
    const posterDiv = createMoviePoster(movie.posterUrl, movie.title, movie.id, false);

    // Add action buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'movie-actions';

    const moveBtn = document.createElement('button');
    moveBtn.className = 'action-btn fav-btn';
    moveBtn.innerHTML = '❤️';
    moveBtn.title = 'Move to Favorites';
    moveBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveToFavorites(movie.id);
    };

    const removeBtn = document.createElement('button');
    removeBtn.className = 'action-btn remove-btn';
    removeBtn.innerHTML = '✕';
    removeBtn.title = 'Remove from Watchlist';
    removeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      removeFromWatchlist(movie.id);
    };

    actionsDiv.appendChild(moveBtn);
    actionsDiv.appendChild(removeBtn);
    posterDiv.appendChild(actionsDiv);

    watchlistGrid.appendChild(posterDiv);
  });

  // Initialize drag-and-drop for watchlist grid
  new Sortable(watchlistGrid, {
    animation: 150,
    ghostClass: 'sortable-ghost'
  });
}

// ===== BULK ADD TO FAVORITES/WATCHLIST =====

// Add multiple movies to favorites from text input
async function addMoviesToFavorites(movieTitles) {
  const favoritesProgress = document.getElementById('favoritesProgress');

  if (!movieTitles || movieTitles.length === 0) {
    showNotification('Please enter at least one movie title');
    return;
  }

  // Show progress
  favoritesProgress.style.display = 'block';
  favoritesProgress.textContent = `Adding 0 of ${movieTitles.length} movies...`;

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < movieTitles.length; i++) {
    const title = movieTitles[i];

    try {
      // Update progress
      favoritesProgress.textContent = `Adding ${i + 1} of ${movieTitles.length}: "${title}"...`;

      // Search for movie
      const movieData = await searchMovie(title);

      // Add to favorites (suppress individual notifications)
      addToFavorites(movieData.id, movieData.title, movieData.posterUrl, false);
      successCount++;

    } catch (error) {
      console.warn(`Failed to add "${title}":`, error.message);
      failCount++;
    }
  }

  // Hide progress
  favoritesProgress.style.display = 'none';

  // Show summary
  if (successCount > 0) {
    showNotification(`✅ Added ${successCount} movie${successCount > 1 ? 's' : ''} to favorites!${failCount > 0 ? ` (${failCount} failed)` : ''}`);
  } else {
    showNotification(`❌ Failed to add movies. Please check the titles.`);
  }

  // Clear input
  document.getElementById('favoritesInput').value = '';
}

// Add multiple movies to watchlist from text input
async function addMoviesToWatchlist(movieTitles) {
  const watchlistProgress = document.getElementById('watchlistProgress');

  if (!movieTitles || movieTitles.length === 0) {
    showNotification('Please enter at least one movie title');
    return;
  }

  // Show progress
  watchlistProgress.style.display = 'block';
  watchlistProgress.textContent = `Adding 0 of ${movieTitles.length} movies...`;

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < movieTitles.length; i++) {
    const title = movieTitles[i];

    try {
      // Update progress
      watchlistProgress.textContent = `Adding ${i + 1} of ${movieTitles.length}: "${title}"...`;

      // Search for movie
      const movieData = await searchMovie(title);

      // Add to watchlist (suppress individual notifications)
      addToWatchlist(movieData.id, movieData.title, movieData.posterUrl, false);
      successCount++;

    } catch (error) {
      console.warn(`Failed to add "${title}":`, error.message);
      failCount++;
    }
  }

  // Hide progress
  watchlistProgress.style.display = 'none';

  // Show summary
  if (successCount > 0) {
    showNotification(`✅ Added ${successCount} movie${successCount > 1 ? 's' : ''} to watchlist!${failCount > 0 ? ` (${failCount} failed)` : ''}`);
  } else {
    showNotification(`❌ Failed to add movies. Please check the titles.`);
  }

  // Clear input
  document.getElementById('watchlistInput').value = '';
}

// ===== DOM ELEMENTS =====
const movieInput = document.getElementById('movieInput');
const customTitleInput = document.getElementById('customTitle');
const generateBtn = document.getElementById('generateBtn');
const progress = document.getElementById('progress');
const outputSection = document.getElementById('outputSection');
const movieGrid = document.getElementById('movieGrid');
const gridTitle = document.getElementById('gridTitle');

// Load saved custom title
const savedTitle = localStorage.getItem(STORAGE_KEYS.CUSTOM_TITLE);
if (savedTitle) {
  customTitleInput.value = savedTitle;
  gridState.tabs.custom.customTitle = savedTitle;
}

// Save custom title on input
customTitleInput.addEventListener('input', () => {
  const title = customTitleInput.value.trim();
  gridState.tabs.custom.customTitle = title;

  if (title) {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_TITLE, title);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_TITLE);
  }
});

// Initialize SortableJS
function initializeSortable() {
  new Sortable(movieGrid, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    forceFallback: true,
    touchStartThreshold: 5
  });
}

// Generate grid (temporary - will be refactored in Phase 4)
async function generateGrid() {
  const input = movieInput.value.trim();

  if (!input) {
    alert('Please paste your movie list first!');
    return;
  }

  // Parse movies
  const movies = input.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (movies.length === 0) {
    alert('Please enter at least one movie!');
    return;
  }

  // Clear previous grid
  movieGrid.innerHTML = '';
  outputSection.classList.remove('active');
  gridState.tabs.custom.movies = [];

  // Update custom title
  const customTitle = customTitleInput.value.trim();
  if (customTitle) {
    gridTitle.textContent = customTitle;
    gridTitle.classList.add('active');
  } else {
    gridTitle.classList.remove('active');
  }

  // Disable button
  generateBtn.disabled = true;
  setLoading(true, `Fetching posters... (0/${movies.length})`);

  // Fetch posters sequentially
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    setLoading(true, `Fetching posters... (${i + 1}/${movies.length})`);

    try {
      const movieData = await searchMovie(movie);
      const posterElement = createMoviePoster(movieData.posterUrl, movie, movieData.id);
      movieGrid.appendChild(posterElement);

      gridState.tabs.custom.movies.push({
        title: movie,
        posterUrl: movieData.posterUrl,
        id: movieData.id
      });

    } catch (error) {
      // Show placeholder for failed movies
      const posterElement = createMoviePoster(null, movie);
      movieGrid.appendChild(posterElement);

      console.warn(`Failed to fetch poster for "${movie}":`, error.message);
    }

    // Small delay between requests
    if (i < movies.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  // Show output
  setLoading(false);
  generateBtn.disabled = false;
  outputSection.classList.add('active');

  // Initialize drag-and-drop
  initializeSortable();

  // Scroll to grid
  setTimeout(() => {
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// Event listeners
generateBtn.addEventListener('click', generateGrid);

movieInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    generateGrid();
  }
});

// ===== TAB NAVIGATION (PHASE 3) =====

// Tab switching functionality
function switchTab(tabName) {
  // Update state
  gridState.activeTab = tabName;

  // Save to localStorage
  localStorage.setItem(STORAGE_KEYS.LAST_TAB, tabName);

  // Update button states
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update content visibility
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => {
    content.classList.remove('active');
  });

  // Show selected tab
  const tabIdMap = {
    custom: 'customTab',
    imdbTop100: 'imdbTop100Tab',
    topByYear: 'topByYearTab',
    favorites: 'favoritesTab',
    watchlist: 'watchlistTab'
  };

  const selectedTab = document.getElementById(tabIdMap[tabName]);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }

  // Auto-load content based on tab
  if (tabName === 'imdbTop100') {
    loadTMDBTop100();
  } else if (tabName === 'favorites') {
    renderFavoritesGrid();
  } else if (tabName === 'watchlist') {
    renderWatchlistGrid();
  }

  console.log(`Switched to tab: ${tabName}`);
}

// Add event listeners to tab buttons
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.dataset.tab;
    switchTab(tabName);
  });
});

// Populate year selector (1900 - current year)
const yearSelect = document.getElementById('yearSelect');
if (yearSelect) {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1900; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  // Load last selected year from localStorage
  const lastYear = localStorage.getItem(STORAGE_KEYS.LAST_YEAR);
  if (lastYear) {
    yearSelect.value = lastYear;
    gridState.tabs.topByYear.year = parseInt(lastYear);
  } else {
    yearSelect.value = currentYear;
    gridState.tabs.topByYear.year = currentYear;
  }

  // Save year selection to localStorage
  yearSelect.addEventListener('change', () => {
    const selectedYear = parseInt(yearSelect.value);
    gridState.tabs.topByYear.year = selectedYear;
    localStorage.setItem(STORAGE_KEYS.LAST_YEAR, selectedYear);
  });
}

// Load last active tab from localStorage
const lastActiveTab = localStorage.getItem(STORAGE_KEYS.LAST_TAB);
if (lastActiveTab && ['custom', 'imdbTop100', 'topByYear', 'favorites', 'watchlist'].includes(lastActiveTab)) {
  switchTab(lastActiveTab);
} else {
  // Default to custom tab
  switchTab('custom');
}

// ===== TOP 10 BY YEAR (PHASE 8) =====

// Fetch top 10 movies by year from TMDB Discover API
async function fetchTopMoviesByYear(year) {
  await rateLimiter.throttle();

  try {
    // TMDB Discover API with filters for year and minimum vote count
    const url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&primary_release_year=${year}&sort_by=vote_average.desc&vote_count.gte=100&page=1`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        throw new MovieGridError('Rate limit exceeded', 'RATE_LIMIT');
      }
      throw new MovieGridError('API request failed', 'API_ERROR', { status: response.status });
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Get top 10 movies
      const top10 = data.results.slice(0, 10);

      return top10.map(movie => ({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        voteCount: movie.vote_count
      }));
    }

    return [];

  } catch (error) {
    if (error instanceof MovieGridError) {
      throw error;
    }
    throw new MovieGridError('Network error', 'NETWORK_ERROR', { originalError: error.message });
  }
}

// Render year grid
function renderYearGrid(movies) {
  const yearGrid = document.getElementById('yearGrid');
  if (!yearGrid) return;

  // Clear existing grid
  yearGrid.innerHTML = '';

  // Create poster elements with action buttons
  movies.forEach(movie => {
    const posterElement = createMoviePoster(movie.posterPath, movie.title, movie.id, true);
    yearGrid.appendChild(posterElement);
  });

  // Initialize drag-and-drop for year grid
  new Sortable(yearGrid, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    forceFallback: true,
    touchStartThreshold: 5
  });
}

// Load movies for selected year
async function loadMoviesByYear() {
  const yearSelect = document.getElementById('yearSelect');
  const loadYearBtn = document.getElementById('loadYearBtn');
  const yearProgress = document.getElementById('yearProgress');
  const yearGrid = document.getElementById('yearGrid');

  if (!yearSelect || !yearGrid) return;

  const selectedYear = parseInt(yearSelect.value);

  // Check cache first
  const cacheKey = `year_${selectedYear}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const movies = JSON.parse(cached);
      renderYearGrid(movies);
      gridState.tabs.topByYear.movies = movies;
      console.log(`Loaded ${movies.length} movies from cache for year ${selectedYear}`);
      return;
    } catch (e) {
      console.warn('Cache parse error, fetching fresh data');
    }
  }

  // Disable button and show progress
  if (loadYearBtn) loadYearBtn.disabled = true;
  if (yearProgress) {
    yearProgress.textContent = `Loading top 10 movies from ${selectedYear}...`;
    yearProgress.classList.add('active');
  }

  try {
    // Fetch movies
    const movies = await fetchTopMoviesByYear(selectedYear);

    if (movies.length === 0) {
      if (yearProgress) {
        yearProgress.textContent = `No movies found for ${selectedYear}`;
      }
      setTimeout(() => {
        if (yearProgress) yearProgress.classList.remove('active');
      }, 3000);
      return;
    }

    // Render grid
    renderYearGrid(movies);

    // Update state
    gridState.tabs.topByYear.movies = movies;
    gridState.tabs.topByYear.year = selectedYear;

    // Save to cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify(movies));
    } catch (e) {
      console.warn('Failed to cache year results:', e);
    }

    // Hide progress
    if (yearProgress) {
      yearProgress.textContent = `Loaded ${movies.length} top movies from ${selectedYear}!`;
      setTimeout(() => {
        yearProgress.classList.remove('active');
      }, 2000);
    }

    console.log(`Loaded ${movies.length} movies for year ${selectedYear}`);

  } catch (error) {
    console.error('Failed to load movies by year:', error);
    if (yearProgress) {
      yearProgress.textContent = error.message || 'Failed to load movies. Please try again.';
      yearProgress.style.color = '#f44336';
      setTimeout(() => {
        yearProgress.classList.remove('active');
        yearProgress.style.color = '';
      }, 5000);
    }
  } finally {
    if (loadYearBtn) loadYearBtn.disabled = false;
  }
}

// Add event listener to Load Movies button
const loadYearBtn = document.getElementById('loadYearBtn');
if (loadYearBtn) {
  loadYearBtn.addEventListener('click', loadMoviesByYear);
}

// ===== FAVORITES & WATCHLIST INPUT HANDLERS =====

// Favorites: Add button event listener
const addFavoritesBtn = document.getElementById('addFavoritesBtn');
if (addFavoritesBtn) {
  addFavoritesBtn.addEventListener('click', () => {
    const input = document.getElementById('favoritesInput');
    const text = input.value.trim();

    if (!text) {
      showNotification('Please enter at least one movie title');
      return;
    }

    // Parse movie titles (one per line)
    const movieTitles = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    addMoviesToFavorites(movieTitles);
  });
}

// Favorites: File upload event listener
const favoritesFileUpload = document.getElementById('favoritesFileUpload');
if (favoritesFileUpload) {
  favoritesFileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const movieTitles = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (movieTitles.length > 0) {
        addMoviesToFavorites(movieTitles);
      } else {
        showNotification('The file appears to be empty');
      }

      // Reset file input
      e.target.value = '';
    };
    reader.readAsText(file);
  });
}

// Watchlist: Add button event listener
const addWatchlistBtn = document.getElementById('addWatchlistBtn');
if (addWatchlistBtn) {
  addWatchlistBtn.addEventListener('click', () => {
    const input = document.getElementById('watchlistInput');
    const text = input.value.trim();

    if (!text) {
      showNotification('Please enter at least one movie title');
      return;
    }

    // Parse movie titles (one per line)
    const movieTitles = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    addMoviesToWatchlist(movieTitles);
  });
}

// Watchlist: File upload event listener
const watchlistFileUpload = document.getElementById('watchlistFileUpload');
if (watchlistFileUpload) {
  watchlistFileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const movieTitles = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      if (movieTitles.length > 0) {
        addMoviesToWatchlist(movieTitles);
      } else {
        showNotification('The file appears to be empty');
      }

      // Reset file input
      e.target.value = '';
    };
    reader.readAsText(file);
  });
}

// ===== TMDB TOP 100 (PHASE 5) =====

// Fetch top 100 movies from TMDB
async function fetchTMDBTop100() {
  const movies = [];
  const moviesPerPage = 20;
  const totalPages = 5; // 5 pages × 20 movies = 100 movies

  try {
    for (let page = 1; page <= totalPages; page++) {
      await rateLimiter.throttle();

      // Using TMDB's official top_rated endpoint to match their website
      const url = `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 429) {
          throw new MovieGridError('Rate limit exceeded', 'RATE_LIMIT');
        }
        throw new MovieGridError('API request failed', 'API_ERROR', { status: response.status });
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const pageMovies = data.results.map(movie => ({
          id: movie.id,
          title: movie.title,
          posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
          releaseDate: movie.release_date,
          rating: movie.vote_average,
          voteCount: movie.vote_count,
          popularity: movie.popularity
        }));

        movies.push(...pageMovies);
      }
    }

    return movies;

  } catch (error) {
    if (error instanceof MovieGridError) {
      throw error;
    }
    throw new MovieGridError('Network error', 'NETWORK_ERROR', { originalError: error.message });
  }
}

// Render TMDB Top 100 grid
function renderTMDBTop100Grid(movies) {
  const imdbGrid = document.getElementById('imdbGrid');
  if (!imdbGrid) return;

  // Clear existing grid
  imdbGrid.innerHTML = '';

  // Create poster elements with action buttons
  movies.forEach(movie => {
    const posterElement = createMoviePoster(movie.posterPath, movie.title, movie.id, true);
    imdbGrid.appendChild(posterElement);
  });

  // Initialize drag-and-drop for TMDB grid
  new Sortable(imdbGrid, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    forceFallback: true,
    touchStartThreshold: 5
  });
}

// Load TMDB Top 100 movies
async function loadTMDBTop100() {
  const imdbProgress = document.getElementById('imdbProgress');
  const imdbGrid = document.getElementById('imdbGrid');

  if (!imdbGrid) return;

  // If already loaded, don't reload
  if (gridState.tabs.imdbTop100.loaded && gridState.tabs.imdbTop100.movies.length > 0) {
    console.log('TMDB Top 100 already loaded');
    return;
  }

  // Check cache first (v2 = using top_rated endpoint)
  const cacheKey = 'tmdb_top_rated_v2';
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const movies = JSON.parse(cached);
      renderTMDBTop100Grid(movies);
      gridState.tabs.imdbTop100.movies = movies;
      gridState.tabs.imdbTop100.loaded = true;
      console.log(`Loaded ${movies.length} movies from cache for TMDB Top 100`);
      return;
    } catch (e) {
      console.warn('Cache parse error, fetching fresh data');
    }
  }

  // Show progress
  if (imdbProgress) {
    imdbProgress.textContent = 'Loading TMDB Top Rated movies... (This may take a moment)';
    imdbProgress.classList.add('active');
  }

  try {
    // Fetch movies
    const movies = await fetchTMDBTop100();

    if (movies.length === 0) {
      if (imdbProgress) {
        imdbProgress.textContent = 'No movies found';
      }
      setTimeout(() => {
        if (imdbProgress) imdbProgress.classList.remove('active');
      }, 3000);
      return;
    }

    // Render grid
    renderTMDBTop100Grid(movies);

    // Update state
    gridState.tabs.imdbTop100.movies = movies;
    gridState.tabs.imdbTop100.loaded = true;

    // Save to cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify(movies));
    } catch (e) {
      console.warn('Failed to cache TMDB Top 100 results:', e);
    }

    // Hide progress
    if (imdbProgress) {
      imdbProgress.textContent = `Loaded ${movies.length} top movies!`;
      setTimeout(() => {
        imdbProgress.classList.remove('active');
      }, 2000);
    }

    console.log(`Loaded ${movies.length} top-rated movies from TMDB`);

  } catch (error) {
    console.error('Failed to load TMDB Top 100:', error);
    if (imdbProgress) {
      imdbProgress.textContent = error.message || 'Failed to load movies. Please try again.';
      imdbProgress.style.color = '#f44336';
      setTimeout(() => {
        imdbProgress.classList.remove('active');
        imdbProgress.style.color = '';
      }, 5000);
    }
  }
}

// ===== INITIALIZATION =====

// Load favorites and watchlist from localStorage
loadFavoritesFromStorage();
loadWatchlistFromStorage();

console.log('MovieGrid initialized - Phase 6: Favorites & Watchlist');
console.log('State management:', gridState);
console.log('TMDB API configured:', TMDB_BASE_URL);
console.log('Active tab:', gridState.activeTab);
console.log('Favorites loaded:', Object.keys(gridState.tabs.favorites.movies).length);
console.log('Watchlist loaded:', Object.keys(gridState.tabs.watchlist.movies).length);
