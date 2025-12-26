import axios from 'axios';

const GRAPHQL_URL = 'https://graphql.anilist.co';

export async function searchAnime(query) {
  try {
    const graphqlQuery = `
      query ($search: String) {
        Page(perPage: 10) {
          media(search: $search, type: ANIME) {
            id
            title { romaji english }
            startDate { year }
            coverImage { large }
            description
            averageScore
            episodes
          }
        }
      }
    `;

    const response = await axios.post(GRAPHQL_URL, {
      query: graphqlQuery,
      variables: { search: query }
    });

    return response.data.data.Page.media.map(item => ({
      id: `anilist-anime-${item.id}`,
      externalId: item.id,
      title: item.title.english || item.title.romaji,
      year: item.startDate?.year?.toString() || 'N/A',
      poster: item.coverImage.large,
      overview: item.description?.replace(/<[^>]*>/g, '') || 'No description',
      rating: item.averageScore ? item.averageScore / 10 : null,
      episodes: item.episodes,
      mediaType: 'anime'
    }));
  } catch (error) {
    console.error('AniList API error:', error.message);
    return getDemoAnime();
  }
}

export async function searchManga(query) {
  try {
    const graphqlQuery = `
      query ($search: String) {
        Page(perPage: 10) {
          media(search: $search, type: MANGA) {
            id
            title { romaji english }
            startDate { year }
            coverImage { large }
            description
            averageScore
            chapters
          }
        }
      }
    `;

    const response = await axios.post(GRAPHQL_URL, {
      query: graphqlQuery,
      variables: { search: query }
    });

    return response.data.data.Page.media.map(item => ({
      id: `anilist-manga-${item.id}`,
      externalId: item.id,
      title: item.title.english || item.title.romaji,
      year: item.startDate?.year?.toString() || 'N/A',
      poster: item.coverImage.large,
      overview: item.description?.replace(/<[^>]*>/g, '') || 'No description',
      rating: item.averageScore ? item.averageScore / 10 : null,
      chapters: item.chapters,
      mediaType: 'manga'
    }));
  } catch (error) {
    console.error('AniList API error:', error.message);
    return getDemoManga();
  }
}

function getDemoAnime() {
  return [
    {
      id: 'demo-anime-1',
      title: 'Cowboy Bebop',
      year: '1998',
      poster: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1-CXtrrkMpJ8Zq.png',
      overview: 'A ragtag crew of bounty hunters travels across the solar system in their ship, the Bebop.',
      rating: 8.8,
      episodes: 26,
      mediaType: 'anime'
    }
  ];
}

function getDemoManga() {
  return [
    {
      id: 'demo-manga-1',
      title: 'Berserk',
      year: '1989',
      poster: 'https://s4.anilist.co/file/anilistcdn/media/manga/cover/large/bx30002-7KyyKRmlnDGY.jpg',
      overview: 'Guts, a former mercenary now known as the Black Swordsman, is out for revenge.',
      rating: 9.0,
      chapters: 364,
      mediaType: 'manga'
    }
  ];
}