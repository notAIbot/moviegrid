// IMDB Top 100 to JSON Converter
// This script converts imdb_top_100.txt to a JSON file with TMDB data
//
// Usage: Open this HTML file in a browser, it will fetch and convert automatically
// Output: Creates imdb_top_100.json with TMDB IDs and poster paths

// Load the config
const TMDB_API_KEY = CONFIG.TMDB_API_KEY;
const TMDB_BASE_URL = CONFIG.TMDB_BASE_URL;

// Rate limiting helper
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
      console.log(`Rate limit reached. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.throttle();
    }

    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter(40, 10000); // 40 requests per 10 seconds

// Parse the IMDB text file
function parseIMDBText(text) {
  const lines = text.split('\n');
  const movies = [];

  for (const line of lines) {
    // Match pattern: "1. Movie Title - Rating: 8.5"
    const match = line.match(/^\s*\d+\.\s+(.+?)\s+-\s+Rating:\s+([\d.]+)/);
    if (match) {
      const fullTitle = match[1];
      const rating = parseFloat(match[2]);

      // Extract English title (remove foreign title in parentheses if present)
      const titleMatch = fullTitle.match(/(.+?)\s*\(([^)]+)\)$/);
      let title, foreignTitle;

      if (titleMatch) {
        foreignTitle = titleMatch[1].trim();
        title = titleMatch[2].trim();
      } else {
        title = fullTitle.trim();
      }

      movies.push({
        title,
        foreignTitle: foreignTitle || null,
        imdbRating: rating
      });
    }
  }

  return movies;
}

// Search for movie on TMDB
async function searchTMDB(title) {
  await rateLimiter.throttle();

  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const movie = data.results[0]; // Take the first result
      return {
        tmdbId: movie.id,
        posterPath: movie.poster_path,
        releaseYear: movie.release_date ? movie.release_date.substring(0, 4) : null,
        tmdbTitle: movie.title
      };
    }
  } catch (error) {
    console.error(`Error fetching ${title}:`, error);
  }

  return null;
}

// Main conversion function
async function convertIMDBToJSON() {
  console.log('Starting IMDB to JSON conversion...');

  try {
    // Load the IMDB text file
    const response = await fetch('imdb_top_100.txt');
    const text = await response.text();

    // Parse the text
    const movies = parseIMDBText(text);
    console.log(`Parsed ${movies.length} movies from IMDB list`);

    // Fetch TMDB data for each movie
    const moviesWithTMDB = [];

    for (let i = 0; i < movies.length; i++) {
      const movie = movies[i];
      console.log(`[${i + 1}/${movies.length}] Fetching: ${movie.title}`);

      // Try searching with English title first
      let tmdbData = await searchTMDB(movie.title);

      // If not found and there's a foreign title, try that
      if (!tmdbData && movie.foreignTitle) {
        console.log(`  Trying foreign title: ${movie.foreignTitle}`);
        tmdbData = await searchTMDB(movie.foreignTitle);
      }

      if (tmdbData) {
        moviesWithTMDB.push({
          rank: i + 1,
          title: movie.title,
          foreignTitle: movie.foreignTitle,
          imdbRating: movie.imdbRating,
          tmdbId: tmdbData.tmdbId,
          posterPath: tmdbData.posterPath,
          releaseYear: tmdbData.releaseYear,
          tmdbTitle: tmdbData.tmdbTitle
        });
        console.log(`  ✓ Found: ${tmdbData.tmdbTitle} (${tmdbData.releaseYear})`);
      } else {
        console.log(`  ✗ Not found on TMDB`);
        // Still add to list but without TMDB data
        moviesWithTMDB.push({
          rank: i + 1,
          title: movie.title,
          foreignTitle: movie.foreignTitle,
          imdbRating: movie.imdbRating,
          tmdbId: null,
          posterPath: null,
          releaseYear: null,
          tmdbTitle: null
        });
      }
    }

    // Output the JSON
    const json = JSON.stringify({
      lastUpdated: new Date().toISOString(),
      totalMovies: moviesWithTMDB.length,
      movies: moviesWithTMDB
    }, null, 2);

    console.log('\n=== CONVERSION COMPLETE ===');
    console.log(`Total movies: ${moviesWithTMDB.length}`);
    console.log(`Movies with TMDB data: ${moviesWithTMDB.filter(m => m.tmdbId).length}`);
    console.log('\nCopy the JSON below and save it as imdb_top_100.json:\n');
    console.log(json);

    // Also offer as download
    const blob = new Blob([json], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'imdb_top_100.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    return moviesWithTMDB;

  } catch (error) {
    console.error('Conversion failed:', error);
    throw error;
  }
}

// Auto-run when page loads
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('Click the button below to start conversion');
  });
}
