import { getDeviceId, getSavedMangas, saveManga, removeManga, updateReadingProgress } from './storage';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getDeviceId', () => {
    it('should generate and save a new device ID if none exists', () => {
      const deviceId = getDeviceId();
      expect(deviceId).toBeDefined();
      expect(deviceId).toMatch(/^device_/);
      expect(localStorage.getItem('@MangaSave:deviceId')).toBe(deviceId);
    });

    it('should return the existing device ID if it is already set', () => {
      localStorage.setItem('@MangaSave:deviceId', 'device_test_123');
      const deviceId = getDeviceId();
      expect(deviceId).toBe('device_test_123');
    });
  });

  describe('Manga Operations', () => {
    const mockManga = {
      id: '123',
      title: 'Naruto',
      currentChapter: '10'
    };

    it('should return empty array if no data', () => {
      expect(getSavedMangas()).toEqual([]);
    });

    it('should save and retrieve manga', () => {
      saveManga(mockManga);
      
      const saved = getSavedMangas();
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe('123');
      expect(saved[0].title).toBe('Naruto');
      expect(saved[0].currentChapter).toBe('10');
      expect(saved[0].updatedAt).toBeDefined();
    });

    it('should update existing manga', () => {
      saveManga(mockManga);
      saveManga({ ...mockManga, currentChapter: '11' });
      
      const saved = getSavedMangas();
      expect(saved).toHaveLength(1);
      expect(saved[0].currentChapter).toBe('11');
    });

    it('should remove manga', () => {
      saveManga(mockManga);
      removeManga('123');
      
      const saved = getSavedMangas();
      expect(saved).toHaveLength(0);
    });

    it('should update reading progress with page and device ID for Smart Sync', () => {
      saveManga(mockManga);
      
      const myDevice = getDeviceId();
      updateReadingProgress('123', '11', 14);
      
      const saved = getSavedMangas();
      expect(saved[0].currentChapter).toBe('11');
      expect(saved[0].currentPage).toBe(14);
      expect(saved[0].lastDeviceId).toBe(myDevice);
    });

    it('should allow forcing a mobile mock device ID for testing/demo', () => {
      saveManga(mockManga);
      updateReadingProgress('123', '12', 20, true);
      
      const saved = getSavedMangas();
      expect(saved[0].currentChapter).toBe('12');
      expect(saved[0].currentPage).toBe(20);
      expect(saved[0].lastDeviceId).toBe('mobile_device_mock');
    });
  });
});
