'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { MangaResult } from '../services/types';

interface HeroCarouselProps {
  items: MangaResult[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (isPaused || items.length === 0) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next, items.length]);

  if (items.length === 0) return null;

  const manga = items[current];

  return (
    <div
      className="relative w-full h-[420px] sm:h-[520px] overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image */}
      {manga.coverUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 blur-sm transition-all duration-700"
          style={{ backgroundImage: `url(${manga.coverUrl})` }}
        />
      )}

      {/* Darken overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center px-8 sm:px-16">
        <div className="flex items-center gap-8 max-w-xl">
          {/* Cover */}
          {manga.coverUrl && (
            <div className="hidden sm:block shrink-0 w-36 rounded-xl overflow-hidden shadow-2xl border border-white/10">
              <img src={manga.coverUrl} alt={manga.title} className="w-full aspect-[3/4] object-cover" />
            </div>
          )}

          {/* Text */}
          <div className="space-y-4 animate-slide-up">
            <p className="text-[#FF4500] text-xs font-bold uppercase tracking-widest">Em Destaque</p>
            <h2 className="text-white text-3xl sm:text-4xl font-black leading-tight line-clamp-2">{manga.title}</h2>
            <div className="flex items-center gap-3">
              <Link
                href={`/manga/${manga.id}`}
                className="px-6 py-2.5 bg-[#FF4500] text-white text-sm font-bold rounded-xl hover:bg-[#e03d00] transition-colors shadow-[0_0_20px_rgba(255,69,0,0.4)]"
              >
                Ler Agora
              </Link>
              <Link
                href={`/manga/${manga.id}`}
                className="px-6 py-2.5 bg-white/10 backdrop-blur text-white text-sm font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                Detalhes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/70 transition text-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/70 transition text-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-[#FF4500]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}
