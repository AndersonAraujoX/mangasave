import { getSavedMangas, saveManga, removeManga } from './storage';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return empty array if no data', () => {
    expect(getSavedMangas()).toEqual([]);
  });

  it('should save and retrieve manga', () => {
    const manga = {
      id: '123',
      title: 'Naruto',
      currentChapter: '10',
    };

    saveManga(manga);
    
    const saved = getSavedMangas();
    expect(saved).toHaveLength(1);
    expect(saved[0].id).toBe('123');
    expect(saved[0].title).toBe('Naruto');
    expect(saved[0].currentChapter).toBe('10');
    expect(saved[0].updatedAt).toBeDefined();
  });

  it('should update existing manga', () => {
    const manga = {
      id: '123',
      title: 'Naruto',
      currentChapter: '10',
    };

    saveManga(manga);
    saveManga({ ...manga, currentChapter: '11' });
    
    const saved = getSavedMangas();
    expect(saved).toHaveLength(1);
    expect(saved[0].currentChapter).toBe('11');
  });

  it('should remove manga', () => {
    const manga = {
      id: '123',
      title: 'Naruto',
      currentChapter: '10',
    };

    saveManga(manga);
    removeManga('123');
    
    const saved = getSavedMangas();
    expect(saved).toHaveLength(0);
  });
});
