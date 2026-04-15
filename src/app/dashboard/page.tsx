'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { MangaCardModern } from '../../components/MangaCardModern';
import { getSavedMangas, removeManga, saveManga, SavedManga } from '../../services/storage';

export default function DashboardPage() {
  const [library, setLibrary] = useState<SavedManga[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editChap, setEditChap] = useState('');

  useEffect(() => {
    setLibrary(getSavedMangas());
  }, []);

  function handleRemove(id: string) {
    if (confirm('Remover da biblioteca?')) {
      removeManga(id);
      setLibrary(getSavedMangas());
    }
  }

  function handleEdit(manga: SavedManga) {
    setEditingId(manga.id);
    setEditChap(manga.currentChapter);
  }

  function handleSaveEdit(manga: SavedManga) {
    saveManga({ ...manga, currentChapter: editChap });
    setEditingId(null);
    setLibrary(getSavedMangas());
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Minha Lista</h1>
          <p className="text-[#A0A0B0] text-sm">{library.length} mangás na biblioteca</p>
        </div>

        {library.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-6xl">📚</p>
            <h2 className="text-xl font-bold text-white">Sua biblioteca está vazia</h2>
            <p className="text-[#A0A0B0] text-sm">Explore o catálogo e salve seus mangás favoritos</p>
            <Link
              href="/catalog"
              className="inline-block px-6 py-3 bg-[#FF4500] text-white text-sm font-bold rounded-xl hover:bg-[#e03d00] transition-colors"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {library.map((manga) => (
              <div key={manga.id} className="space-y-2">
                <MangaCardModern
                  id={manga.id}
                  title={manga.title}
                  coverUrl={manga.coverUrl}
                  currentChapter={manga.currentChapter}
                  type="library"
                  onRemove={handleRemove}
                />
                {/* Chapter edit */}
                {editingId === manga.id ? (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={editChap}
                      onChange={(e) => setEditChap(e.target.value)}
                      className="flex-1 bg-[#1E1E2E] border border-[#FF4500] text-white text-xs rounded-lg px-2 py-1.5 outline-none"
                      placeholder="Cap."
                    />
                    <button
                      onClick={() => handleSaveEdit(manga)}
                      className="px-2 py-1.5 bg-[#FF4500] text-white text-xs font-bold rounded-lg"
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(manga)}
                    className="w-full py-1.5 text-xs bg-[#1E1E2E] border border-[#2A2A3E] text-[#A0A0B0] rounded-lg hover:border-[#FF4500] hover:text-white transition-colors"
                  >
                    Editar cap.
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
