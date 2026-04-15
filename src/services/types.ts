export interface MangaResult {
  id: string;
  title: string;
  coverUrl?: string;
  latestChapter?: string;
  provider: 'mangadex' | 'jikan' | 'kitsu' | 'mangaupdates' | 'anilist';
  url?: string;
}
