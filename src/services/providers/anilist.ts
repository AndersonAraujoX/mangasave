import { proxiedFetch } from "../fetchProxy";
import { MangaResult } from '../types';

export const searchAniList = async (query: string): Promise<MangaResult[]> => {
  const graphqlQuery = `
    query ($query: String) {
      Page(page: 1, perPage: 10) {
        media(search: $query, type: MANGA) {
          id
          title {
            english
            romaji
          }
          coverImage {
            large
          }
          chapters
        }
      }
    }
  `;

  try {
    const response = await proxiedFetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { query }
      })
    });

    if (!response.ok) return [];
    
    const data = await response.json();
    return data.data.Page.media.map((manga: any) => ({
      id: manga.id.toString(),
      title: manga.title.english || manga.title.romaji,
      coverUrl: manga.coverImage?.large,
      provider: 'anilist' as const,
      latestChapter: manga.chapters ? manga.chapters.toString() : 'N/A'
    }));
  } catch (error) {
    console.error('AniList search error:', error);
    return [];
  }
};
