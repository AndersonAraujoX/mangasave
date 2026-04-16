'use client';

import React, { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getChapterImages } from '../../services/reader';
import { getMangaChapters, Chapter } from '../../services/reader';
import { getSavedMangas, updateReadingProgress } from '../../services/storage';

type ReadMode = 'scroll' | 'page';

function ChapterReaderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mangaId = searchParams?.get('id') || '';
  const chapterId = searchParams?.get('chapterId') || '';
  const initialPage = parseInt(searchParams?.get('page') || '0', 10);

  const [images, setImages] = useState<string[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [readMode, setReadMode] = useState<ReadMode>('scroll');
  const [currentPage, setCurrentPage] = useState(0);
  const [showHeader, setShowHeader] = useState(true);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const lastScrollY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chapterId) return;
    setIsLoading(true);
    setImages([]);
    setCurrentPage(initialPage);
    getChapterImages(chapterId).then((imgs) => { setImages(imgs); setIsLoading(false); });
  }, [chapterId, initialPage]);

  useEffect(() => {
    if (!mangaId) return;
    getMangaChapters(mangaId).then(setChapters);
  }, [mangaId]);

  // Auto-mark progress
  useEffect(() => {
    const saved = getSavedMangas().find((m) => m.id === mangaId);
    if (saved) {
      const currentChap = chapters.find((c) => c.id === chapterId);
      if (currentChap) {
        const forceMock = searchParams?.get('mock') === 'mobile';
        updateReadingProgress(mangaId, currentChap.chapterNumber, currentPage, forceMock);
      }
    }
  }, [chapters, chapterId, mangaId, currentPage, searchParams]);

  // Hide header on scroll down
  useEffect(() => {
    if (readMode !== 'scroll') return;
    function onScroll() {
      const y = window.scrollY;
      setShowHeader(y < lastScrollY.current || y < 80);
      lastScrollY.current = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [readMode]);

  // Keyboard navigation
  useEffect(() => {
    if (readMode !== 'page') return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextPage();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevPage();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [readMode, currentPage, images.length]);

  const currentIndex = chapters.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const currentChapterInfo = chapters[currentIndex];

  function nextPage() { setCurrentPage((p) => Math.min(p + 1, images.length - 1)); }
  function prevPage() { setCurrentPage((p) => Math.max(p - 1, 0)); }

  if (!mangaId || !chapterId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/50">Parâmetros inválidos.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" ref={containerRef}>
      {/* Header - slides in/out */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${showHeader || readMode === 'page' ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {/* Back + Title */}
            <div className="flex items-center gap-3 min-w-0">
              <Link href={`/manga/?id=${mangaId}`} className="shrink-0 w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="min-w-0">
                <p className="text-xs text-white/50 truncate">Capítulo {currentChapterInfo?.chapterNumber || '?'}</p>
                <p className="text-xs text-white/70 truncate">{currentChapterInfo?.title || ''}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Mode Toggle */}
              <div className="flex items-center bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setReadMode('scroll')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${readMode === 'scroll' ? 'bg-[#FF4500] text-white' : 'text-white/60 hover:text-white'}`}
                >
                  Scroll
                </button>
                <button
                  onClick={() => setReadMode('page')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${readMode === 'page' ? 'bg-[#FF4500] text-white' : 'text-white/60 hover:text-white'}`}
                >
                  Página
                </button>
              </div>

              {/* Chapter Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowChapterSelector(!showChapterSelector)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  Caps
                </button>
                {showChapterSelector && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#1a1a24] border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-80 overflow-y-auto z-50">
                    {chapters.map((c) => (
                      <Link
                        key={c.id}
                        href={`/reader/?id=${mangaId}&chapterId=${c.id}`}
                        onClick={() => setShowChapterSelector(false)}
                        className={`flex items-center justify-between px-4 py-3 text-xs hover:bg-white/10 transition ${c.id === chapterId ? 'bg-[#FF4500]/20 text-[#FF4500]' : 'text-white/70'}`}
                      >
                        <span>Cap. {c.chapterNumber}</span>
                        <span className="text-white/30 capitalize">{c.language}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-2 border-[#FF4500] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-white/50 text-sm">Carregando páginas...</p>
          </div>
        </div>
      )}

      {/* Webtoon Scroll Mode */}
      {!isLoading && readMode === 'scroll' && (
        <div className="pt-16 flex flex-col items-center">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Página ${idx + 1}`}
              className="w-full max-w-3xl block"
              loading="lazy"
            />
          ))}
          {/* End of Chapter Nav */}
          <div className="py-12 text-center space-y-4">
            <p className="text-white/50 text-sm">Fim do capítulo</p>
            <div className="flex items-center gap-4">
              {prevChapter && (
                <Link href={`/reader/?id=${mangaId}&chapterId=${prevChapter.id}`} className="px-5 py-2.5 bg-[#1E1E2E] border border-[#2A2A3E] text-white text-sm font-bold rounded-xl hover:border-[#FF4500] transition">
                  ← Cap. {prevChapter.chapterNumber}
                </Link>
              )}
              {nextChapter && (
                <Link href={`/reader/?id=${mangaId}&chapterId=${nextChapter.id}`} className="px-5 py-2.5 bg-[#FF4500] text-white text-sm font-bold rounded-xl hover:bg-[#e03d00] transition">
                  Cap. {nextChapter.chapterNumber} →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Mode */}
      {!isLoading && readMode === 'page' && images.length > 0 && (
        <div className="fixed inset-0 flex flex-col bg-black">
          {/* Spacer for header */}
          <div className="h-16" />

          {/* Image */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            <img
              src={images[currentPage]}
              alt={`Página ${currentPage + 1}`}
              className="max-h-full max-w-full object-contain"
            />

            {/* Click areas */}
            <button onClick={prevPage} className="absolute left-0 top-0 bottom-0 w-1/3 cursor-w-resize opacity-0 hover:opacity-100 flex items-center justify-start pl-4 transition-opacity">
              <div className="bg-black/60 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </div>
            </button>
            <button onClick={nextPage} className="absolute right-0 top-0 bottom-0 w-1/3 cursor-e-resize opacity-0 hover:opacity-100 flex items-center justify-end pr-4 transition-opacity">
              <div className="bg-black/60 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </button>
          </div>

          {/* Page indicator + progress */}
          <div className="p-4 space-y-2">
            <div className="w-full bg-white/10 rounded-full h-1">
              <div
                className="bg-[#FF4500] h-1 rounded-full transition-all"
                style={{ width: `${((currentPage + 1) / images.length) * 100}%` }}
              />
            </div>
            <p className="text-center text-white/50 text-xs">{currentPage + 1} / {images.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReaderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ChapterReaderContent />
    </Suspense>
  );
}
