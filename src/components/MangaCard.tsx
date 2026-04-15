import React from 'react';
import Link from 'next/link';
import styles from './MangaCard.module.css';

interface MangaCardProps {
  id: string;
  title: string;
  coverUrl?: string;
  latestChapter?: string;
  currentChapter?: string;
  type: 'search' | 'library';
  onAction: (id: string, title: string, coverUrl?: string) => void;
}

export const MangaCard: React.FC<MangaCardProps> = ({
  id,
  title,
  coverUrl,
  latestChapter,
  currentChapter,
  type,
  onAction
}) => {
  return (
    <div className={styles.card} data-testid={`manga-card-${id}`}>
      <Link href={`/manga/${id}`} className={styles.imageContainer}>
        {coverUrl ? (
          <img src={coverUrl} alt={title} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.image} style={{ background: '#2d3748' }} />
        )}
      </Link>
      <div className={styles.content}>
        <Link href={`/manga/${id}`} style={{ textDecoration: 'none' }}>
          <h3 className={styles.title} title={title}>{title}</h3>
        </Link>
        <div className={styles.chapter}>
          {type === 'library' ? (
            <>
              <span>Lido: <span className={styles.highlight}>Cap {currentChapter || '?'}</span></span>
            </>
          ) : (
            <span>Último: <span className={styles.highlight}>Cap {latestChapter || '?'}</span></span>
          )}
        </div>
        <button 
          className={styles.actionButton}
          onClick={() => onAction(id, title, coverUrl)}
        >
          {type === 'library' ? 'Atualizar Leitura' : 'Salvar na Biblioteca'}
        </button>
      </div>
    </div>
  );
};
