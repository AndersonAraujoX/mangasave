import { proxiedFetch } from "../fetchProxy";
import { MangaResult } from '../types';

export const searchJikan = async (query: string): Promise<MangaResult[]> => {
  try {
    const response = await proxiedFetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=10`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.data.map((manga: any) => ({
      id: manga.mal_id.toString(),
      title: manga.title_english || manga.title,
      coverUrl: manga.images?.jpg?.image_url,
      provider: 'jikan' as const,
      latestChapter: manga.chapters ? manga.chapters.toString() : 'N/A'
    }));
  } catch (error) {
    console.error('Jikan search error:', error);
    return [];
  }
};
