'use client';

import React from 'react';
import Link from 'next/link';

interface MangaCardModernProps {
  id: string;
  title: string;
  coverUrl?: string;
  latestChapter?: string;
  currentChapter?: string;
  provider?: string;
  type?: 'search' | 'library' | 'default';
  onSave?: (id: string, title: string, coverUrl?: string) => void;
  onRemove?: (id: string) => void;
}

export function MangaCardModern({
  id,
  title,
  coverUrl,
  latestChapter,
  currentChapter,
  provider,
  type = 'default',
  onSave,
  onRemove,
}: MangaCardModernProps) {
  const isFromMangaDex = provider === 'mangadex' || !provider;

  return (
    <div className="group relative rounded-xl overflow-hidden bg-[#1E1E2E] border border-[#2A2A3E] hover:border-[#FF4500]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Cover Image */}
      <Link href={isFromMangaDex ? `/manga/?id=${id}` : '#'} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#252535]">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[#3A3A50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 gap-2">
            {isFromMangaDex && (
              <Link
                href={`/manga/?id=${id}`}
                className="w-full py-2 text-center text-xs font-bold bg-[#FF4500] text-white rounded-lg hover:bg-[#e03d00] transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Ler Agora
              </Link>
            )}
            {type === 'search' && onSave && (
              <button
                onClick={(e) => { e.preventDefault(); onSave(id, title, coverUrl); }}
                className="w-full py-2 text-xs font-bold bg-[#A855F7]/80 text-white rounded-lg hover:bg-[#A855F7] transition-colors"
              >
                + Salvar
              </button>
            )}
            {type === 'library' && onRemove && (
              <button
                onClick={(e) => { e.preventDefault(); onRemove(id); }}
                className="w-full py-1.5 text-xs font-bold bg-red-600/80 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remover
              </button>
            )}
          </div>

          {/* Chapter Badge */}
          {(latestChapter || currentChapter) && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md">
              {type === 'library' ? `Lido: Cap ${currentChapter}` : `Cap ${latestChapter}`}
            </div>
          )}

          {/* Provider Badge */}
          {provider && provider !== 'mangadex' && (
            <div className="absolute top-2 left-2 bg-[#A855F7]/80 text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
              {provider}
            </div>
          )}
        </div>
      </Link>

      {/* Card Info */}
      <div className="p-3">
        <Link href={isFromMangaDex ? `/manga/?id=${id}` : '#'}>
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight hover:text-[#FF4500] transition-colors">
            {title}
          </h3>
        </Link>
      </div>
    </div>
  );
}
