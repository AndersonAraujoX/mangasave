'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '../../components/Navbar';
import { MangaCardModern } from '../../components/MangaCardModern';
import { SkeletonGrid } from '../../components/SkeletonCard';
import { searchMangaAcrossProviders } from '../../services/coordinator';
import { getRecentlyUpdated } from '../../services/mangadex';
import { MangaResult } from '../../services/types';
import { saveManga } from '../../services/storage';

const GENRES = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'];

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [mangas, setMangas] = useState<MangaResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'az' | 'za'>('default');

  useEffect(() => {
    setLoading(true);
    if (activeQuery) {
      searchMangaAcrossProviders(activeQuery).then((data) => { setMangas(data); setLoading(false); });
    } else {
      getRecentlyUpdated().then((data) => { setMangas(data); setLoading(false); });
    }
  }, [activeQuery]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setActiveQuery(query);
  }

  const displayed = mangas
    .filter((m) => !selectedGenre || m.title.toLowerCase().includes(selectedGenre.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'az') return a.title.localeCompare(b.title);
      if (sortBy === 'za') return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Catálogo</h1>
          <p className="text-[#A0A0B0] text-sm">Explore milhares de títulos em PT-BR e Inglês</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#1E1E2E] border border-[#2A2A3E] rounded-2xl p-5 mb-8 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 bg-[#121212] border border-[#2A2A3E] rounded-xl px-4 py-2.5 focus-within:border-[#FF4500] transition-colors">
              <svg className="w-4 h-4 text-[#6B6B80] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar mangá..."
                className="bg-transparent text-white text-sm outline-none w-full"
              />
            </div>
            <button type="submit" className="px-5 py-2 bg-[#FF4500] text-white text-sm font-bold rounded-xl hover:bg-[#e03d00] transition-colors">
              Buscar
            </button>
          </form>

          {/* Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#6B6B80] text-xs font-semibold uppercase tracking-wider">Ordenar:</span>
            {([['default', 'Padrão'], ['az', 'A → Z'], ['za', 'Z → A']] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSortBy(val)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  sortBy === val ? 'bg-[#FF4500] border-[#FF4500] text-white' : 'bg-transparent border-[#2A2A3E] text-[#A0A0B0] hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <SkeletonGrid count={18} />
        ) : displayed.length === 0 ? (
          <div className="text-center py-24 text-[#A0A0B0]">
            <p className="text-6xl mb-4">📚</p>
            <p className="text-lg font-semibold">Nenhum resultado encontrado</p>
            <p className="text-sm mt-1">Tente outro termo de busca</p>
          </div>
        ) : (
          <>
            <p className="text-[#6B6B80] text-sm mb-4">{displayed.length} títulos encontrados</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayed.map((manga) => (
                <MangaCardModern
                  key={`${manga.provider}-${manga.id}`}
                  id={manga.id}
                  title={manga.title}
                  coverUrl={manga.coverUrl}
                  latestChapter={manga.latestChapter}
                  provider={manga.provider}
                  type="search"
                  onSave={(id, title, coverUrl) => {
                    saveManga({ id, title, coverUrl, currentChapter: '1' });
                    alert(`"${title}" salvo!`);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Carregando...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
