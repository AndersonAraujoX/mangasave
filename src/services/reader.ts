import { proxiedFetch } from "./fetchProxy";
const BASE_URL = 'https://api.mangadex.org';

export interface Chapter {
  id: string;
  chapterNumber: string;
  title: string;
  language: string;
  pages: number;
  externalUrl?: string | null;
}

export const getMangaChapters = async (mangaId: string): Promise<Chapter[]> => {
  try {
    const response = await proxiedFetch(`${BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=pt-br&translatedLanguage[]=en&order[chapter]=desc&limit=100`);
    if (!response.ok) throw new Error('Failed to fetch feed');
    
    const data = await response.json();
    return data.data.map((chap: any) => ({
      id: chap.id,
      chapterNumber: chap.attributes.chapter || '0',
      title: chap.attributes.title || `Capítulo ${chap.attributes.chapter}`,
      language: chap.attributes.translatedLanguage,
      pages: chap.attributes.pages,
      externalUrl: chap.attributes.externalUrl
    }));
  } catch (error) {
    console.error('getMangaChapters Error:', error);
    return [];
  }
};

export const getChapterImages = async (chapterId: string): Promise<string[]> => {
  try {
    const response = await proxiedFetch(`${BASE_URL}/at-home/server/${chapterId}`);
    if (!response.ok) throw new Error('Failed to fetch chapter images server');

    const data = await response.json();
    const hash = data.chapter.hash;
    const baseUrl = data.baseUrl;
    const dataList = data.chapter.data;

    return dataList.map((filename: string) => `${baseUrl}/data/${hash}/${filename}`);
  } catch (error) {
    console.error('getChapterImages Error:', error);
    return [];
  }
};
