import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReaderPage from './page';
import * as readerService from '../../services/reader';
import { useSearchParams } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  useSearchParams: jest.fn(),
}));

jest.mock('../../services/reader', () => ({
  getChapterImages: jest.fn(),
  getMangaChapters: jest.fn(),
}));

jest.mock('../../services/storage', () => ({
  getSavedMangas: () => [],
  updateReadingProgress: jest.fn(),
}));

describe('Reader Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup generic search params mock
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        if (key === 'id') return 'manga-1';
        if (key === 'chapterId') return 'chapter-1';
        return null;
      }
    });

    // Mock generic responses
    (readerService.getChapterImages as jest.Mock).mockResolvedValue([
      'http://test.com/img1.jpg',
      'http://test.com/img2.jpg',
      'http://test.com/img3.jpg',
    ]);
    
    (readerService.getMangaChapters as jest.Mock).mockResolvedValue([
      { id: 'chapter-1', chapterNumber: '1', title: 'Start', language: 'en' },
    ]);
  });

  const renderReader = async () => {
    render(<ReaderPage />);
    // Wait for the loading state to finish (getChapterImages resolves)
    await waitFor(() => {
      expect(screen.queryByText(/Carregando páginas/i)).not.toBeInTheDocument();
    });
  };

  it('renders correctly in the default scroll mode', async () => {
    await renderReader();
    
    // In scroll mode, all images should be rendered as a list
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    expect(images[0]).toHaveAttribute('src', 'http://test.com/img1.jpg');
    
    // Next/Prev buttons in scroll mode are typically rendered as part of "Fim do capítulo" (if multiple chapters exist)
    expect(screen.getByText('Fim do capítulo')).toBeInTheDocument();
  });

  it('changes HTML structure when switching from Scroll to Page mode', async () => {
    await renderReader();
    
    // Switch to Page mode
    const pageBtn = screen.getByText('Página');
    fireEvent.click(pageBtn);
    
    // In page mode, only one image should be visible at a time
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(1); // Only showing the current page
    expect(images[0]).toHaveAttribute('src', 'http://test.com/img1.jpg');
    
    // Page indicator should exist
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('navigates through pages correctly in Page mode and stops at the limit', async () => {
    await renderReader();
    
    // Switch to page mode
    fireEvent.click(screen.getByText('Página'));
    
    // Next page button is a div wrapping the svg, accessible by a button. We can find it by finding the buttons.
    // In the current implementation, it's a hidden touch area on the right absolute. 
    // They don't have text, but they are button elements.
    const buttons = screen.getAllByRole('button');
    // Button 0: mode, Button 1: mode, Button 2: Caps, Button 3: prev, Button 4: next
    // The "Página" and "Scroll" are actual buttons inside the header.
    // The previous and next are the last two buttons when Page mode is active.
    const prevBtn = buttons[buttons.length - 2];
    const nextBtn = buttons[buttons.length - 1];

    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    // Click Next
    fireEvent.click(nextBtn);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    const imgsAfterNext = screen.getAllByRole('img');
    expect(imgsAfterNext[0]).toHaveAttribute('src', 'http://test.com/img2.jpg');

    // Click Prev
    fireEvent.click(prevBtn);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();

    // Try going before page 1
    fireEvent.click(prevBtn);
    expect(screen.getByText('1 / 3')).toBeInTheDocument(); // Should stay at 1

    // Jump to last page
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    expect(screen.getByText('3 / 3')).toBeInTheDocument();

    // Try going beyond max
    fireEvent.click(nextBtn);
    expect(screen.getByText('3 / 3')).toBeInTheDocument(); // Should stay at 3
  });
});
