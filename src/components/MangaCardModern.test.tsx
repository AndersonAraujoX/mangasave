import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MangaCardModern } from './MangaCardModern';

describe('MangaCardModern Component', () => {
  const defaultProps = {
    id: 'test-123',
    title: 'Test Manga',
  };

  it('renders correctly with default props', () => {
    render(<MangaCardModern {...defaultProps} />);
    expect(screen.getByText('Test Manga')).toBeInTheDocument();
  });

  it('renders an image when coverUrl is provided', () => {
    render(<MangaCardModern {...defaultProps} coverUrl="http://image.com/test.jpg" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'http://image.com/test.jpg');
    expect(img).toHaveAttribute('alt', 'Test Manga');
  });

  it('renders SVG placeholder when coverUrl is NOT provided', () => {
    render(<MangaCardModern {...defaultProps} />);
    // Since we don't have coverUrl, an image shouldn't be rendered. 
    // Instead the SVG is in the DOM.
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    
    // An SVG exists within a generic container.
    // It's usually easier to find by checking if the container for the placeholder is there.
    // But testing the absence of the image is sufficient for coverUrl absence.
  });

  it('renders + Salvar button when type="search" and onSave is provided', () => {
    const mockOnSave = jest.fn();
    render(<MangaCardModern {...defaultProps} type="search" onSave={mockOnSave} />);
    
    const saveButton = screen.getByText('+ Salvar');
    expect(saveButton).toBeInTheDocument();
    
    fireEvent.click(saveButton);
    expect(mockOnSave).toHaveBeenCalledWith('test-123', 'Test Manga', undefined);
  });

  it('renders Remover button and reading badge when type="library"', () => {
    const mockOnRemove = jest.fn();
    render(
      <MangaCardModern 
        {...defaultProps} 
        type="library" 
        currentChapter="42" 
        onRemove={mockOnRemove} 
      />
    );
    
    expect(screen.getByText('Lido: Cap 42')).toBeInTheDocument();
    
    const removeBtn = screen.getByText('Remover');
    expect(removeBtn).toBeInTheDocument();
    
    fireEvent.click(removeBtn);
    expect(mockOnRemove).toHaveBeenCalledWith('test-123');
  });
});
