import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Navbar } from './Navbar';
import { searchMangaAcrossProviders } from '../services/coordinator';
import { ThemeProvider } from '../context/ThemeContext';

// Mock routing since we are using Next.js useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the coordinator fetch so we don't hit real APIs
jest.mock('../services/coordinator', () => ({
  searchMangaAcrossProviders: jest.fn(),
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderNavbar = () => {
    return render(
      <ThemeProvider>
        <Navbar />
      </ThemeProvider>
    );
  };

  it('renders the navbar logo correctly', () => {
    renderNavbar();
    expect(screen.getByText('Manga')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('does NOT call search provider when typing only 1 character', () => {
    renderNavbar();
    const input = screen.getByPlaceholderText('Buscar mangá...');
    
    fireEvent.change(input, { target: { value: 'O' } });
    
    // Advance timers
    jest.advanceTimersByTime(500);
    
    expect(searchMangaAcrossProviders).not.toHaveBeenCalled();
  });

  it('calls search provider and shows suggestions when typing > 1 char after debounce', async () => {
    // Setup mock return
    (searchMangaAcrossProviders as jest.Mock).mockResolvedValue([
      { id: '1', title: 'One Piece', provider: 'mangadex', coverUrl: '' }
    ]);

    renderNavbar();
    const input = screen.getByPlaceholderText('Buscar mangá...');
    
    fireEvent.change(input, { target: { value: 'One' } });
    
    // Fast-forward standard debounce (400ms)
    jest.advanceTimersByTime(450);
    
    // Since we mocked a resolved Promise, we need to wait for it to resolve in UI
    await waitFor(() => {
      expect(searchMangaAcrossProviders).toHaveBeenCalledWith('One');
    });
    
    // Suggestion should appear
    expect(await screen.findByText('One Piece')).toBeInTheDocument();
  });
});
