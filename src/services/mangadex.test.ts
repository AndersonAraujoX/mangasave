import { searchManga, getLatestChapter } from './mangadex';

global.fetch = jest.fn();

describe('MangaDex API Integration', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should search manga and return formatted results', async () => {
    const mockMangaResponse = {
      data: [{
        id: '123',
        attributes: { title: { en: 'Naruto' } },
        relationships: [{ type: 'cover_art', attributes: { fileName: 'cover.jpg' } }]
      }]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMangaResponse,
    });

    const results = await searchManga('Naruto');

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/manga?title=Naruto'));
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('123');
    expect(results[0].title).toBe('Naruto');
    expect(results[0].coverUrl).toBe('https://uploads.mangadex.org/covers/123/cover.jpg');
  });

  it('should get latest chapter', async () => {
    const mockChapterResponse = {
      data: [{
        attributes: { chapter: '700' }
      }]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockChapterResponse,
    });

    const latestChapter = await getLatestChapter('123');

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/manga/123/feed'));
    expect(latestChapter).toBe('700');
  });

  it('should return null if no chapters found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const latestChapter = await getLatestChapter('123');
    expect(latestChapter).toBeNull();
  });
});
