// TMDB API Configuration
// IMPORTANT: Do not commit this file to git!
// This file contains your private API key

const CONFIG = {
  TMDB_API_KEY: '258f275d54c441bf4329b8545cd698cb',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
  TMDB_RATE_LIMIT: {
    requestsPerPeriod: 40,
    periodInSeconds: 10
  }
};
