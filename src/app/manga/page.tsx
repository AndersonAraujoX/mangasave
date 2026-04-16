'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMangaDetails, MangaDetails } from '../../services/mangadex';
import { getMangaChapters, Chapter } from '../../services/reader';
import { saveManga, getSavedMangas, removeManga, SavedManga, getDeviceId } from '../../services/storage';
import { Navbar } from '../../components/Navbar';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ongoing: { label: 'Em Lançamento', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  completed: { label: 'Completo', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  hiatus: { label: 'Hiato', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

function MangaDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mangaId = searchParams?.get('id') || '';

  const [details, setDetails] = useState<MangaDetails | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savedInfo, setSavedInfo] = useState<SavedManga | null>(null);
  const [showSyncPrompt, setShowSyncPrompt] = useState(true);
  const [langFilter, setLangFilter] = useState<'all' | 'en' | 'pt-br'>('all');
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    if (!mangaId) return;
    setDeviceId(getDeviceId());
    getMangaDetails(mangaId).then((d) => { setDetails(d); setLoadingDetails(false); });
    getMangaChapters(mangaId).then((c) => { setChapters(c); setLoadingChapters(false); });
    const saved = getSavedMangas().find((m) => m.id === mangaId);
    if (saved) {
      setIsSaved(true);
      setSavedInfo(saved);
    }
  }, [mangaId]);

  function toggleSave() {
    if (isSaved) {
      removeManga(mangaId);
      setIsSaved(false);
      setSavedInfo(null);
    } else if (details) {
      const nova: SavedManga = { id: mangaId, title: details.title, coverUrl: details.coverUrl, currentChapter: '0', updatedAt: Date.now() };
      saveManga(nova);
      setIsSaved(true);
      setSavedInfo(nova);
    }
  }

  const filtered = langFilter === 'all' ? chapters : chapters.filter((c) => c.language === langFilter);

  if (!mangaId) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-[#A0A0B0]">ID do mangá não informado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        {details?.coverUrl && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-40"
              style={{ backgroundImage: `url(${details.coverUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121212]/60 to-[#121212]" />
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-40 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Cover */}
          <div className="shrink-0">
            {loadingDetails ? (
              <div className="w-40 sm:w-48 aspect-[3/4] skeleton rounded-xl" />
            ) : (
              <div className="w-40 sm:w-48 rounded-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.6)] border border-white/10">
                {details?.coverUrl ? (
                  <img src={details.coverUrl} alt={details.title} className="w-full aspect-[3/4] object-cover" />
                ) : (
                  <div className="w-full aspect-[3/4] bg-[#1E1E2E]" />
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 space-y-4">
            {loadingDetails ? (
              <div className="space-y-3">
                <div className="skeleton h-8 w-64 rounded" />
                <div className="skeleton h-4 w-32 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            ) : details ? (
              <>
                <div className="flex items-start gap-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{details.title}</h1>
                    <p className="text-[#A0A0B0] text-sm mt-1">{details.year && `${details.year} • `}MangaDex</p>
                  </div>
                  {details.status && STATUS_MAP[details.status] && (
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${STATUS_MAP[details.status].color}`}>
                      {STATUS_MAP[details.status].label}
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {details.tags.slice(0, 8).map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs bg-[#1E1E2E] border border-[#2A2A3E] text-[#A0A0B0] rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Synopsis */}
                <p className="text-[#A0A0B0] text-sm leading-relaxed line-clamp-4 max-w-2xl">
                  {details.description || 'Sem sinopse disponível.'}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {chapters.length > 0 && (
                    <Link
                      href={`/reader/?id=${mangaId}&chapterId=${chapters[chapters.length - 1].id}`}
                      className="px-6 py-2.5 bg-[#FF4500] text-white text-sm font-bold rounded-xl hover:bg-[#e03d00] transition-colors shadow-[0_0_20px_rgba(255,69,0,0.3)]"
                    >
                      ▶ Começar Leitura
                    </Link>
                  )}
                  <button
                    onClick={toggleSave}
                    className={`px-6 py-2.5 text-sm font-bold rounded-xl border transition-colors ${
                      isSaved
                        ? 'bg-[#A855F7]/20 border-[#A855F7]/50 text-[#A855F7]'
                        : 'bg-[#1E1E2E] border-[#2A2A3E] text-[#A0A0B0] hover:border-[#A855F7] hover:text-white'
                    }`}
                  >
                    {isSaved ? '✓ Na Biblioteca' : '+ Minha Lista'}
                  </button>
                  <button onClick={() => router.back()} className="px-4 py-2.5 text-sm bg-[#1E1E2E] border border-[#2A2A3E] text-[#A0A0B0] rounded-xl hover:border-white/30 hover:text-white transition-colors">
                    ← Voltar
                  </button>
                </div>
              </>
            ) : (
              <p className="text-[#A0A0B0]">Mangá não encontrado.</p>
            )}
          </div>
        </div>

        {/* Chapter List */}
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-white">
              Capítulos <span className="text-[#6B6B80] text-base font-normal">({filtered.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              {(['all', 'en', 'pt-br'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLangFilter(lang)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    langFilter === lang
                      ? 'bg-[#FF4500] border-[#FF4500] text-white'
                      : 'bg-[#1E1E2E] border-[#2A2A3E] text-[#A0A0B0] hover:text-white'
                  }`}
                >
                  {lang === 'all' ? 'Todos' : lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {loadingChapters ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-[#A0A0B0]">Nenhum capítulo disponível.</div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filtered.map((chap) => (
                <Link
                  key={chap.id}
                  href={`/reader/?id=${mangaId}&chapterId=${chap.id}`}
                  className="flex items-center justify-between p-4 bg-[#1E1E2E] border border-[#2A2A3E] rounded-xl hover:border-[#FF4500]/50 hover:bg-[#252535] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[#FF4500] font-bold text-sm min-w-[60px]">Cap. {chap.chapterNumber}</span>
                    <span className="text-white text-sm group-hover:text-[#FF4500] transition-colors line-clamp-1">{chap.title || `Capítulo ${chap.chapterNumber}`}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${
                      chap.language === 'pt-br' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    }`}>{chap.language}</span>
                  </div>
                  <svg className="w-4 h-4 text-[#6B6B80] group-hover:text-[#FF4500] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="pb-16" />
      </div>

      {/* Smart Sync Prompt */}
      {savedInfo && savedInfo.currentChapter && savedInfo.currentChapter !== '0' && showSyncPrompt && chapters.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-[#FF4500] to-[#A855F7] p-[1px] rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,69,0,0.5)]">
            <div className="bg-[#121212]/95 backdrop-blur-xl px-4 py-4 sm:px-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <p className="text-[#A0A0B0] text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2 justify-center sm:justify-start">
                  <span className="w-2 h-2 rounded-full bg-[#FF4500] animate-pulse" />
                  {savedInfo.lastDeviceId && savedInfo.lastDeviceId !== deviceId ? '📲 Sincronizado de outro aparelho' : '🔖 Smart Sync'}
                </p>
                <p className="text-white font-bold text-sm">
                  Continuar do Cap. {savedInfo.currentChapter}{savedInfo.currentPage !== undefined ? `, Pág. ${savedInfo.currentPage + 1}` : ''}?
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href={`/reader/?id=${mangaId}&chapterId=${chapters.find(c => c.chapterNumber === savedInfo.currentChapter)?.id || chapters[0].id}${savedInfo.currentPage !== undefined ? `&page=${savedInfo.currentPage}` : ''}`}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#FF4500] text-white text-sm font-bold rounded-xl hover:bg-[#e03d00] transition-colors text-center"
                >
                  Continuar
                </Link>
                <button
                  onClick={() => setShowSyncPrompt(false)}
                  className="w-9 h-9 flex items-center justify-center bg-[#1E1E2E] border border-[#2A2A3E] text-[#A0A0B0] hover:text-white rounded-xl transition-colors hover:border-white/30"
                  aria-label="Dispensar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MangaDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121212]" />}>
      <MangaDetailsContent />
    </Suspense>
  );
}
