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
  activeTab: 'custom', // Current active tab
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
function createMoviePoster(posterUrl, title, movieId) {
  const div = document.createElement('div');
  div.className = 'movie-poster';

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

  // Create poster elements
  movies.forEach(movie => {
    const posterElement = createMoviePoster(movie.posterPath, movie.title, movie.id);
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

// ===== INITIALIZATION =====
console.log('MovieGrid initialized - Phase 8: Top 10 by Year');
console.log('State management:', gridState);
console.log('TMDB API configured:', TMDB_BASE_URL);
console.log('Active tab:', gridState.activeTab);
