import { MangaResult } from './types';

const BASE_URL = 'https://api.mangadex.org';

export interface MangaDetails {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  tags: string[];
  status: string;
  year?: number;
}

export const searchManga = async (query: string): Promise<MangaResult[]> => {
  const response = await fetch(`${BASE_URL}/manga?title=${encodeURIComponent(query)}&includes[]=cover_art&limit=10`);
  if (!response.ok) {
    throw new Error('Failed to fetch from MangaDex');
  }
  const data = await response.json();
  
  return data.data.map((manga: any) => {
    const title = manga.attributes.title.en || manga.attributes.title['pt-br'] || Object.values(manga.attributes.title)[0] || 'Unknown';
    const coverArt = manga.relationships.find((rel: any) => rel.type === 'cover_art');
    const coverFileName = coverArt?.attributes?.fileName;
    const coverUrl = coverFileName ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}` : undefined;
    
    return {
      id: manga.id,
      title,
      coverUrl,
      provider: 'mangadex' as const,
    };
  });
};

export const getLatestChapter = async (mangaId: string): Promise<string | null> => {
  const response = await fetch(`${BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=pt-br&translatedLanguage[]=en&order[chapter]=desc&limit=1`);
  if (!response.ok) {
    throw new Error('Failed to fetch chapters');
  }
  const data = await response.json();
  if (data.data && data.data.length > 0) {
    return data.data[0].attributes.chapter;
  }
  return null;
};

export const getPopularManga = async (): Promise<MangaResult[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/manga?order[followedCount]=desc&includes[]=cover_art&limit=10&availableTranslatedLanguage[]=pt-br&availableTranslatedLanguage[]=en`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.data.map((manga: any) => {
      const title = manga.attributes.title.en || manga.attributes.title['pt-br'] || Object.values(manga.attributes.title)[0] || 'Unknown';
      const coverArt = manga.relationships.find((rel: any) => rel.type === 'cover_art');
      const coverFileName = coverArt?.attributes?.fileName;
      return {
        id: manga.id,
        title,
        coverUrl: coverFileName ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}` : undefined,
        provider: 'mangadex' as const,
      };
    });
  } catch { return []; }
};

export const getRecentlyUpdated = async (): Promise<MangaResult[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/manga?order[updatedAt]=desc&includes[]=cover_art&limit=18&availableTranslatedLanguage[]=pt-br&availableTranslatedLanguage[]=en`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.data.map((manga: any) => {
      const title = manga.attributes.title.en || manga.attributes.title['pt-br'] || Object.values(manga.attributes.title)[0] || 'Unknown';
      const coverArt = manga.relationships.find((rel: any) => rel.type === 'cover_art');
      const coverFileName = coverArt?.attributes?.fileName;
      return {
        id: manga.id,
        title,
        coverUrl: coverFileName ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}` : undefined,
        provider: 'mangadex' as const,
      };
    });
  } catch { return []; }
};

export interface MangaDetails {
  id: string;
  title: string;
  description: string;
  coverUrl?: string;
  tags: string[];
  status: string;
  year?: number;
}

export const getMangaDetails = async (mangaId: string): Promise<MangaDetails | null> => {
  try {
    const response = await fetch(`${BASE_URL}/manga/${mangaId}?includes[]=cover_art`);
    if (!response.ok) return null;
    const data = await response.json();
    const manga = data.data;
    const title = manga.attributes.title.en || manga.attributes.title['pt-br'] || Object.values(manga.attributes.title)[0] || 'Unknown';
    const description = manga.attributes.description.en || manga.attributes.description['pt-br'] || (Object.values(manga.attributes.description)[0] as string) || '';
    const tags = manga.attributes.tags.map((t: any) => t.attributes.name.en || Object.values(t.attributes.name)[0]);
    const coverArt = manga.relationships.find((rel: any) => rel.type === 'cover_art');
    const coverFileName = coverArt?.attributes?.fileName;
    return {
      id: manga.id,
      title,
      description,
      coverUrl: coverFileName ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}` : undefined,
      tags,
      status: manga.attributes.status,
      year: manga.attributes.year,
    };
  } catch { return null; }
};
