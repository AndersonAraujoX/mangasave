'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { searchMangaAcrossProviders } from '../services/coordinator';
import { MangaResult } from '../services/types';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MangaResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchMangaAcrossProviders(query);
        setSuggestions(res.slice(0, 6));
        setShowSuggestions(true);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, [query]);

  function handleSelect(manga: MangaResult) {
    setShowSuggestions(false);
    setQuery('');
    if (manga.provider === 'mangadex') {
      router.push(`/manga/?id=${manga.id}`);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      router.push(`/catalog?q=${encodeURIComponent(query)}`);
      setQuery('');
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#121212]/90 backdrop-blur-xl border-b border-[#2A2A3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF4500] to-[#A855F7] flex items-center justify-center">
              <span className="text-white font-black text-sm">M</span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">
              Manga<span className="text-[#FF4500]">Save</span>
            </span>
          </Link>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[#A0A0B0] hover:text-white text-sm font-medium transition-colors">Início</Link>
            <Link href="/catalog" className="text-[#A0A0B0] hover:text-white text-sm font-medium transition-colors">Catálogo</Link>
            <Link href="/dashboard" className="text-[#A0A0B0] hover:text-white text-sm font-medium transition-colors">Minha Lista</Link>
          </div>

          {/* Search + Controls */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSubmit} className="relative hidden sm:block">
              <div className="flex items-center gap-2 bg-[#1E1E2E] border border-[#2A2A3E] rounded-xl px-4 py-2 w-64 focus-within:border-[#FF4500] transition-colors">
                <svg className="w-4 h-4 text-[#6B6B80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Buscar mangá..."
                  className="bg-transparent text-sm text-white placeholder-[#6B6B80] outline-none w-full"
                />
                {isSearching && (
                  <div className="w-3 h-3 border border-[#FF4500] border-t-transparent rounded-full animate-spin" />
                )}
              </div>

              {/* Autocomplete */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-xl overflow-hidden shadow-2xl z-50 animate-fade-in">
                  {suggestions.map((manga) => (
                    <button
                      key={`${manga.provider}-${manga.id}`}
                      onMouseDown={() => handleSelect(manga)}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-[#252535] transition-colors text-left"
                    >
                      {manga.coverUrl ? (
                        <img src={manga.coverUrl} alt="" className="w-8 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-8 h-10 bg-[#252535] rounded" />
                      )}
                      <div>
                        <p className="text-sm text-white font-medium line-clamp-1">{manga.title}</p>
                        <p className="text-xs text-[#6B6B80] capitalize">{manga.provider}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-[#1E1E2E] border border-[#2A2A3E] flex items-center justify-center hover:border-[#FF4500] transition-colors"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#A0A0B0]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-[#1E1E2E] border border-[#2A2A3E] flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2A2A3E] bg-[#121212]/95 backdrop-blur px-4 py-4 space-y-3 animate-fade-in">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-[#A0A0B0] hover:text-white py-2 text-sm">Início</Link>
          <Link href="/catalog" onClick={() => setMobileMenuOpen(false)} className="block text-[#A0A0B0] hover:text-white py-2 text-sm">Catálogo</Link>
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-[#A0A0B0] hover:text-white py-2 text-sm">Minha Lista</Link>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar mangá..."
              className="w-full bg-[#1E1E2E] border border-[#2A2A3E] rounded-xl px-4 py-2 text-sm text-white outline-none"
            />
          </form>
        </div>
      )}
    </nav>
  );
}
