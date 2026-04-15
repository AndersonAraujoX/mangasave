import { searchMangaAcrossProviders } from './coordinator';
import * as mangadex from './mangadex';
import * as jikan from './providers/jikan';
import * as kitsu from './providers/kitsu';
import * as anilist from './providers/anilist';
import * as mangaupdates from './providers/mangaupdates';

jest.mock('./mangadex');
jest.mock('./providers/jikan');
jest.mock('./providers/kitsu');
jest.mock('./providers/anilist');
jest.mock('./providers/mangaupdates');

describe('Coordinator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should merge results and remove duplicates', async () => {
    (mangadex.searchManga as jest.Mock).mockResolvedValue([
      { id: '1', title: 'One Piece', provider: 'mangadex' }
    ]);
    (mangadex.getLatestChapter as jest.Mock).mockResolvedValue('1000');
    
    (jikan.searchJikan as jest.Mock).mockResolvedValue([
      { id: '2', title: 'One Piece', provider: 'jikan' },
      { id: '3', title: 'Naruto', provider: 'jikan' }
    ]);

    (kitsu.searchKitsu as jest.Mock).mockResolvedValue([]);
    (anilist.searchAniList as jest.Mock).mockResolvedValue([]);
    (mangaupdates.searchMangaUpdates as jest.Mock).mockResolvedValue([]);

    const results = await searchMangaAcrossProviders('one piece');
    
    expect(results).toHaveLength(2); // One Piece (mangadex prioritized) and Naruto
    
    const titles = results.map(r => r.title);
    expect(titles).toContain('One Piece');
    expect(titles).toContain('Naruto');
    
    const onePiece = results.find(r => r.title === 'One Piece');
    expect(onePiece?.provider).toBe('mangadex');
    expect(onePiece?.latestChapter).toBe('1000');
  });
});
