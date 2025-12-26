import axios from 'axios';

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1';

export async function searchBooks(query) {
  if (!API_KEY || API_KEY === 'your_google_books_key_here') {
    console.warn('Google Books API key not configured, using demo data');
    return getDemoBooks();
  }

  try {
    const response = await axios.get(`${BASE_URL}/volumes`, {
      params: { q: query, key: API_KEY, maxResults: 10 }
    });

    return response.data.items?.map(item => ({
      id: `book-${item.id}`,
      externalId: item.id,
      title: item.volumeInfo.title,
      year: item.volumeInfo.publishedDate?.substring(0, 4) || 'N/A',
      author: item.volumeInfo.authors?.join(', ') || 'Unknown',
      poster: item.volumeInfo.imageLinks?.thumbnail || null,
      overview: item.volumeInfo.description || 'No description available',
      pages: item.volumeInfo.pageCount,
      mediaType: 'book'
    })) || [];
  } catch (error) {
    console.error('Google Books API error:', error.message);
    return getDemoBooks();
  }
}

function getDemoBooks() {
  return [
    {
      id: 'demo-book-1',
      title: '1984',
      year: '1949',
      author: 'George Orwell',
      poster: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
      overview: 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.',
      pages: 328,
      mediaType: 'book'
    },
    {
      id: 'demo-book-2',
      title: 'To Kill a Mockingbird',
      year: '1960',
      author: 'Harper Lee',
      poster: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
      overview: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
      pages: 324,
      mediaType: 'book'
    }
  ];
}