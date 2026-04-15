import { getMangaChapters, getChapterImages } from './reader';

global.fetch = jest.fn();

describe('Reader Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch manga chapters', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            id: 'chap-1',
            attributes: { chapter: '1', title: 'Start', translatedLanguage: 'en', pages: 20 }
          }
        ]
      })
    });

    const chapters = await getMangaChapters('test-id');
    expect(chapters).toHaveLength(1);
    expect(chapters[0].chapterNumber).toBe('1');
    expect(chapters[0].language).toBe('en');
  });

  it('should get correct chapter image urls', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        baseUrl: 'https://test-server.org',
        chapter: {
          hash: 'abc',
          data: ['1.png', '2.png']
        }
      })
    });

    const images = await getChapterImages('chap-id');
    expect(images).toHaveLength(2);
    expect(images[0]).toBe('https://test-server.org/data/abc/1.png');
  });
});
