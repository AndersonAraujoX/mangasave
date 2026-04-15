import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('should render correctly', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Search for a manga...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('should call onSearch when submitted with query', () => {
    const handleSearch = jest.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const input = screen.getByPlaceholderText('Search for a manga...');
    fireEvent.change(input, { target: { value: 'Naruto' } });
    
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    
    expect(handleSearch).toHaveBeenCalledWith('Naruto');
  });

  it('should not call onSearch when submitted empty', () => {
    const handleSearch = jest.fn();
    render(<SearchBar onSearch={handleSearch} />);
    
    const form = screen.getByTestId('search-form');
    fireEvent.submit(form);
    
    expect(handleSearch).not.toHaveBeenCalled();
  });
});
