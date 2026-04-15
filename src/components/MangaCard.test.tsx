import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MangaCard } from './MangaCard';

describe('MangaCard', () => {
  const mockProps = {
    id: '123',
    title: 'One Piece',
    coverUrl: 'https://example.com/cover.jpg',
    latestChapter: '1000',
    type: 'search' as const,
    onAction: jest.fn(),
  };

  it('renders search mode correctly', () => {
    render(<MangaCard {...mockProps} />);
    expect(screen.getByText('One Piece')).toBeInTheDocument();
    expect(screen.getByText('Último:')).toBeInTheDocument();
    expect(screen.getByText('Cap 1000')).toBeInTheDocument();
    expect(screen.getByText('Salvar na Biblioteca')).toBeInTheDocument();
  });

  it('renders library mode correctly', () => {
    render(<MangaCard {...mockProps} type="library" currentChapter="999" />);
    expect(screen.getByText('Lido:')).toBeInTheDocument();
    expect(screen.getByText('Cap 999')).toBeInTheDocument();
    expect(screen.getByText('Atualizar Leitura')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', () => {
    render(<MangaCard {...mockProps} />);
    fireEvent.click(screen.getByText('Salvar na Biblioteca'));
    expect(mockProps.onAction).toHaveBeenCalledWith('123', 'One Piece', 'https://example.com/cover.jpg');
  });
});
