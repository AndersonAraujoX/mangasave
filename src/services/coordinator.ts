import { searchManga as searchMangaDex, getLatestChapter as getMangaDexLatest } from './mangadex';
import { searchJikan } from './providers/jikan';
import { searchKitsu } from './providers/kitsu';
import { searchAniList } from './providers/anilist';
import { searchMangaUpdates } from './providers/mangaupdates';
import { MangaResult } from './types';

export const searchMangaAcrossProviders = async (query: string): Promise<MangaResult[]> => {
  // Execute all providers in parallel
  const [mangadex, jikan, kitsu, anilist, mangaupdates] = await Promise.allSettled([
    searchMangaDex(query),
    searchJikan(query),
    searchKitsu(query),
    searchAniList(query),
    searchMangaUpdates(query)
  ]);

  let results: MangaResult[] = [];

  if (mangadex.status === 'fulfilled') {
    const mdWithChapters = await Promise.all(mangadex.value.map(async (m) => {
      try {
        const chap = await getMangaDexLatest(m.id);
        return { ...m, latestChapter: chap || 'N/A' };
      } catch {
        return { ...m, latestChapter: 'N/A' };
      }
    }));
    results = results.concat(mdWithChapters);
  }
  if (jikan.status === 'fulfilled') results = results.concat(jikan.value);
  if (kitsu.status === 'fulfilled') results = results.concat(kitsu.value);
  if (anilist.status === 'fulfilled') results = results.concat(anilist.value);
  if (mangaupdates.status === 'fulfilled') results = results.concat(mangaupdates.value);

  // Remove exact title duplicates, keeping MangaDex priority if available
  const uniqueMap = new Map<string, MangaResult>();

  results.forEach(manga => {
    // Normalizing title to lower-case alphanumeric to catch slight variations
    const normTitle = manga.title ? manga.title.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    
    if (normTitle && !uniqueMap.has(normTitle)) {
      uniqueMap.set(normTitle, manga);
    } else if (normTitle && manga.provider === 'mangadex') {
      // MangaDex is priority since it has actual readable chapters on the app
      uniqueMap.set(normTitle, manga);
    }
  });

  return Array.from(uniqueMap.values());
};
