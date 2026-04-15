import { MangaResult } from '../types';

export const searchKitsu = async (query: string): Promise<MangaResult[]> => {
  try {
    const response = await fetch(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(query)}&page[limit]=10`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.data.map((manga: any) => ({
      id: manga.id,
      title: manga.attributes.titles.en || manga.attributes.canonicalTitle,
      coverUrl: manga.attributes.posterImage?.small || manga.attributes.posterImage?.original,
      provider: 'kitsu' as const,
      latestChapter: manga.attributes.chapterCount ? manga.attributes.chapterCount.toString() : 'N/A'
    }));
  } catch (error) {
    console.error('Kitsu search error:', error);
    return [];
  }
};
