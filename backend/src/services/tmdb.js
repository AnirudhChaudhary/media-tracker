import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Read API key inside the function, not at module level
function getApiKey() {
  return process.env.TMDB_API_KEY;
}

export async function searchMovies(query) {
  const API_KEY = getApiKey();
  
  if (!API_KEY || API_KEY === 'your_tmdb_api_key_here') {
    console.warn('TMDb API key not configured, using demo data');
    return getDemoMovies();
  }

  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: { api_key: API_KEY, query }
    });

    return response.data.results.map(item => ({
      id: `tmdb-movie-${item.id}`,
      externalId: item.id,
      title: item.title,
      year: item.release_date?.substring(0, 4) || 'N/A',
      poster: item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null,
      overview: item.overview,
      rating: item.vote_average,
      mediaType: 'movie'
    }));
  } catch (error) {
    console.error('TMDb API error:', error.message);
    return getDemoMovies();
  }
}

export async function searchTV(query) {
  const API_KEY = getApiKey();
  
  if (!API_KEY || API_KEY === 'your_tmdb_api_key_here') {
    console.warn('TMDb API key not configured, using demo data');
    return getDemoTV();
  }

  try {
    const response = await axios.get(`${BASE_URL}/search/tv`, {
      params: { api_key: API_KEY, query }
    });

    return response.data.results.map(item => ({
      id: `tmdb-tv-${item.id}`,
      externalId: item.id,
      title: item.name,
      year: item.first_air_date?.substring(0, 4) || 'N/A',
      poster: item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null,
      overview: item.overview,
      rating: item.vote_average,
      mediaType: 'tv'
    }));
  } catch (error) {
    console.error('TMDb API error:', error.message);
    return getDemoTV();
  }
}

function getDemoMovies() {
  return [
    {
      id: 'demo-movie-1',
      title: 'The Shawshank Redemption',
      year: '1994',
      poster: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      rating: 8.7,
      mediaType: 'movie'
    },
    {
      id: 'demo-movie-2',
      title: 'The Dark Knight',
      year: '2008',
      poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
      rating: 9.0,
      mediaType: 'movie'
    }
  ];
}

function getDemoTV() {
  return [
    {
      id: 'demo-tv-1',
      title: 'Breaking Bad',
      year: '2008',
      poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.',
      rating: 9.5,
      mediaType: 'tv'
    },
    {
      id: 'demo-tv-2',
      title: 'Game of Thrones',
      year: '2011',
      poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
      overview: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
      rating: 9.3,
      mediaType: 'tv'
    }
  ];
}