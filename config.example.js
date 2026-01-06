// TMDB API Configuration Template
//
// HOW TO USE:
// 1. Copy this file and rename it to "config.js"
// 2. Get your free API key from https://www.themoviedb.org/settings/api
// 3. Replace 'YOUR_API_KEY_HERE' with your actual TMDB API key
// 4. Save the file (config.js will be ignored by git)

const CONFIG = {
  TMDB_API_KEY: 'YOUR_API_KEY_HERE',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  TMDB_RATE_LIMIT: {
    requestsPerPeriod: 40,
    periodInSeconds: 10
  }
};
