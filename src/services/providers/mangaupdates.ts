import { proxiedFetch } from "../fetchProxy";
import { MangaResult } from '../types';

export const searchMangaUpdates = async (query: string): Promise<MangaResult[]> => {
  try {
    const response = await proxiedFetch('https://api.mangaupdates.com/v1/series/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ search: query, perpage: 10 })
    });

    if (!response.ok) return [];
    
    const data = await response.json();
    return data.results.map((item: any) => {
      const manga = item.record;
      return {
        id: manga.series_id.toString(),
        title: manga.title,
        coverUrl: manga.image?.url?.original,
        provider: 'mangaupdates' as const,
        latestChapter: 'N/A' // MU does not provide chapter trivially in search
      };
    });
  } catch (error) {
    console.error('MangaUpdates search error:', error);
    return [];
  }
};
