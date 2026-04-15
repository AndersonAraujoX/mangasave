import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock all external services
jest.mock('../services/mangadex', () => ({
  getPopularManga: jest.fn().mockResolvedValue([]),
  getRecentlyUpdated: jest.fn().mockResolvedValue([]),
}));

jest.mock('../services/coordinator', () => ({
  searchMangaAcrossProviders: jest.fn().mockResolvedValue([]),
}));

jest.mock('../services/storage', () => ({
  getSavedMangas: () => [],
  saveManga: jest.fn(),
  removeManga: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock context
jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark', toggleTheme: jest.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Home Page', () => {
  it('renders the MangaSave logo', () => {
    render(<Home />);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders section titles', () => {
    render(<Home />);
    expect(screen.getByText('Atualizações Recentes')).toBeInTheDocument();
    expect(screen.getByText('Mais Populares')).toBeInTheDocument();
  });
});
