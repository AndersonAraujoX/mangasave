export interface SavedManga {
  id: string;
  title: string;
  coverUrl?: string;
  currentChapter: string;
  currentPage?: number;
  lastDeviceId?: string;
  updatedAt: number;
}

const STORAGE_KEY = '@MangaSave:library';
const DEVICE_KEY = '@MangaSave:deviceId';

// Generate a random device ID to simulate different machines/mobile
export const getDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server';
  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    deviceId = `device_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(DEVICE_KEY, deviceId);
  }
  return deviceId;
};

export const getSavedMangas = (): SavedManga[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveManga = (manga: Omit<SavedManga, 'updatedAt'>): void => {
  if (typeof window === 'undefined') return;
  const mangas = getSavedMangas();
  const existingIndex = mangas.findIndex(m => m.id === manga.id);
  
  const updatedManga = { ...manga, updatedAt: Date.now() };

  if (existingIndex >= 0) {
    mangas[existingIndex] = updatedManga;
  } else {
    mangas.push(updatedManga);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mangas));
};

export const updateReadingProgress = (
  mangaId: string, 
  chapterNumber: string, 
  page: number, 
  forceMobileMock: boolean = false
) => {
  if (typeof window === 'undefined') return;
  const mangas = getSavedMangas();
  const mangaIndex = mangas.findIndex(m => m.id === mangaId);
  if (mangaIndex >= 0) {
    mangas[mangaIndex].currentChapter = chapterNumber;
    mangas[mangaIndex].currentPage = page;
    mangas[mangaIndex].lastDeviceId = forceMobileMock ? 'mobile_device_mock' : getDeviceId();
    mangas[mangaIndex].updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mangas));
  }
};

export const removeManga = (id: string): void => {
  if (typeof window === 'undefined') return;
  const mangas = getSavedMangas();
  const newMangas = mangas.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newMangas));
};
