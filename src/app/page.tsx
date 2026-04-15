'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroCarousel } from '../components/HeroCarousel';
import { MangaCardModern } from '../components/MangaCardModern';
import { SkeletonGrid } from '../components/SkeletonCard';
import { getPopularManga, getRecentlyUpdated } from '../services/mangadex';
import { searchMangaAcrossProviders } from '../services/coordinator';
import { MangaResult } from '../services/types';
import { getSavedMangas, saveManga, removeManga } from '../services/storage';
import Link from 'next/link';

export default function Home() {
  const [heroItems, setHeroItems] = useState<MangaResult[]>([]);
  const [popular, setPopular] = useState<MangaResult[]>([]);
  const [recent, setRecent] = useState<MangaResult[]>([]);
  const [searchResults, setSearchResults] = useState<MangaResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    getPopularManga().then((data) => {
      setHeroItems(data.slice(0, 5));
      setPopular(data);
      setLoadingPopular(false);
    });
    getRecentlyUpdated().then((data) => {
      setRecent(data);
      setLoadingRecent(false);
    });
  }, []);

  async function handleSearch(query: string) {
    if (!query.trim()) { setIsSearchMode(false); return; }
    setIsSearchMode(true);
    setIsSearching(true);
    setSearchQuery(query);
    const results = await searchMangaAcrossProviders(query);
    setSearchResults(results);
    setIsSearching(false);
  }

  function handleSave(id: string, title: string, coverUrl?: string) {
    saveManga({ id, title, coverUrl, currentChapter: '1' });
    alert(`"${title}" salvo na biblioteca!`);
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* Search Results Mode */}
        {isSearchMode ? (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Resultados para</h2>
                <p className="text-[#FF4500] font-semibold">"{searchQuery}"</p>
              </div>
              <button
                onClick={() => { setIsSearchMode(false); setSearchQuery(''); }}
                className="px-4 py-2 text-sm bg-[#1E1E2E] border border-[#2A2A3E] text-[#A0A0B0] rounded-xl hover:border-[#FF4500] hover:text-white transition-colors"
              >
                Voltar
              </button>
            </div>
            {isSearching ? (
              <SkeletonGrid count={12} />
            ) : searchResults.length === 0 ? (
              <div className="text-center py-16 text-[#A0A0B0]">Nenhum mangá encontrado.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchResults.map((manga) => (
                  <MangaCardModern
                    key={`${manga.provider}-${manga.id}`}
                    id={manga.id}
                    title={manga.title}
                    coverUrl={manga.coverUrl}
                    latestChapter={manga.latestChapter}
                    provider={manga.provider}
                    type="search"
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Hero Carousel */}
            {heroItems.length > 0 && <HeroCarousel items={heroItems} />}

            {/* Quick Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <form onSubmit={(e) => { e.preventDefault(); const v = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value; handleSearch(v); }}>
                <div className="flex items-center gap-3 bg-[#1E1E2E] border border-[#2A2A3E] rounded-2xl p-2 focus-within:border-[#FF4500] transition-colors shadow-xl">
                  <svg className="w-5 h-5 text-[#6B6B80] ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    name="search"
                    type="text"
                    placeholder="Buscar por título, autor ou gênero..."
                    className="flex-1 bg-transparent text-white placeholder-[#6B6B80] outline-none text-sm py-2"
                  />
                  <button type="submit" className="px-5 py-2 bg-[#FF4500] text-white text-sm font-bold rounded-xl hover:bg-[#e03d00] transition-colors">
                    Buscar
                  </button>
                </div>
              </form>
            </div>

            {/* Recently Updated */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-5 bg-[#FF4500] rounded-sm" />
                  Atualizações Recentes
                </h2>
                <Link href="/catalog" className="text-sm text-[#FF4500] hover:text-[#e03d00] font-semibold transition-colors">
                  Ver todos →
                </Link>
              </div>
              {loadingRecent ? <SkeletonGrid count={6} /> : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recent.slice(0, 12).map((manga) => (
                    <MangaCardModern
                      key={manga.id}
                      id={manga.id}
                      title={manga.title}
                      coverUrl={manga.coverUrl}
                      provider={manga.provider}
                      type="search"
                      onSave={handleSave}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Most Popular */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-5 bg-[#A855F7] rounded-sm" />
                  Mais Populares
                </h2>
                <Link href="/catalog" className="text-sm text-[#A855F7] hover:text-[#9333ea] font-semibold transition-colors">
                  Ver todos →
                </Link>
              </div>
              {loadingPopular ? <SkeletonGrid count={5} /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  {popular.map((manga, idx) => (
                    <div key={manga.id} className="relative">
                      <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-[#A855F7] text-white text-sm font-black rounded-full flex items-center justify-center shadow-lg">
                        {idx + 1}
                      </div>
                      <MangaCardModern
                        id={manga.id}
                        title={manga.title}
                        coverUrl={manga.coverUrl}
                        provider={manga.provider}
                        type="search"
                        onSave={handleSave}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2A2A3E] mt-16 py-8 text-center text-[#6B6B80] text-sm">
        <p>MangaSave &copy; {new Date().getFullYear()} — Leia em PT-BR &amp; English</p>
        <p className="mt-1 text-xs">Dados fornecidos por MangaDex, AniList, Kitsu e mais.</p>
      </footer>
    </div>
  );
}
