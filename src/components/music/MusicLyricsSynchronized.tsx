/**
 * MusicLyricsSynchronized Component
 *
 * Composant d'affichage de paroles synchronisées (LRC format).
 *
 * Features:
 * - Format LRC standard
 * - Synchronisation temps réel
 * - Auto-scroll
 * - Highlight actif
 * - Navigation par clic
 * - Traduction multilingue
 * - Mode karaoké
 *
 * @module components/music/MusicLyricsSynchronized
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

// ============================================
// TYPES
// ============================================

export interface LyricLine {
  time: number;      // Temps en secondes
  text: string;      // Texte de la ligne
  translation?: string; // Traduction optionnelle
}

export interface LRCData {
  title?: string;
  artist?: string;
  album?: string;
  by?: string;      // Créateur des paroles
  offset?: number;  // Offset en ms
  lines: LyricLine[];
}

export interface MusicLyricsSynchronizedProps {
  lyrics: string | LRCData; // Format LRC string ou objet parsé
  currentTime: number;        // Temps actuel de lecture (secondes)
  className?: string;
  onLineClick?: (time: number) => void;
  showTranslation?: boolean;
  highlightColor?: string;
  autoScroll?: boolean;
  karaokeMode?: boolean;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
}

// ============================================
// LRC PARSER
// ============================================

function parseLRC(lrc: string): LRCData {
  const lines: LyricLine[] = [];
  const metadata: Partial<LRCData> = {};

  const lrcLines = lrc.split('\n');

  for (const line of lrcLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Parse metadata [key:value]
    const metaMatch = trimmed.match(/^\[([a-z]+):(.+)\]$/i);
    if (metaMatch) {
      const [, key, value] = metaMatch;
      switch (key.toLowerCase()) {
        case 'ti':
          metadata.title = value;
          break;
        case 'ar':
          metadata.artist = value;
          break;
        case 'al':
          metadata.album = value;
          break;
        case 'by':
          metadata.by = value;
          break;
        case 'offset':
          metadata.offset = parseInt(value, 10);
          break;
      }
      continue;
    }

    // Parse time tags [mm:ss.xx]
    const timeTagRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
    const times: number[] = [];
    let match: RegExpExecArray | null;

    while ((match = timeTagRegex.exec(trimmed)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const centiseconds = parseInt(match[3].padEnd(3, '0'), 10);
      const timeInSeconds = minutes * 60 + seconds + centiseconds / 1000;
      times.push(timeInSeconds);
    }

    // Extract text after time tags
    const text = trimmed.replace(timeTagRegex, '').trim();

    // Add line for each time tag (for repeated phrases)
    times.forEach(time => {
      lines.push({ time, text });
    });
  }

  // Sort by time
  lines.sort((a, b) => a.time - b.time);

  return {
    ...metadata,
    lines
  };
}

// ============================================
// COMPONENT
// ============================================

export function MusicLyricsSynchronized({
  lyrics,
  currentTime,
  className,
  onLineClick,
  showTranslation = false,
  highlightColor = '#3b82f6',
  autoScroll = true,
  karaokeMode = false,
  fontSize = 'md'
}: MusicLyricsSynchronizedProps) {
  const [lrcData, setLrcData] = useState<LRCData | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Parse LRC data
  useEffect(() => {
    try {
      if (typeof lyrics === 'string') {
        const parsed = parseLRC(lyrics);
        setLrcData(parsed);
      } else {
        setLrcData(lyrics);
      }
    } catch (error) {
      logger.error('Failed to parse LRC', error as Error, 'MusicLyricsSynchronized');
    }
  }, [lyrics]);

  // Find active line based on current time
  useEffect(() => {
    if (!lrcData) return;

    const offset = (lrcData.offset || 0) / 1000; // Convert ms to seconds
    const adjustedTime = currentTime + offset;

    // Find the last line that has passed
    let newActiveIndex = -1;
    for (let i = lrcData.lines.length - 1; i >= 0; i--) {
      if (adjustedTime >= lrcData.lines[i].time) {
        newActiveIndex = i;
        break;
      }
    }

    if (newActiveIndex !== activeLineIndex) {
      setActiveLineIndex(newActiveIndex);
    }
  }, [currentTime, lrcData, activeLineIndex]);

  // Auto-scroll to active line
  useEffect(() => {
    if (!autoScroll || !activeLineRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const activeLine = activeLineRef.current;

    const containerHeight = container.clientHeight;
    const activeLineTop = activeLine.offsetTop;
    const activeLineHeight = activeLine.clientHeight;

    // Scroll to center the active line
    const scrollTo = activeLineTop - containerHeight / 2 + activeLineHeight / 2;

    container.scrollTo({
      top: scrollTo,
      behavior: 'smooth'
    });
  }, [activeLineIndex, autoScroll]);

  // Handle line click
  const handleLineClick = useCallback((time: number) => {
    onLineClick?.(time);
  }, [onLineClick]);

  if (!lrcData) {
    return (
      <div className={cn('flex items-center justify-center p-8 text-muted-foreground', className)}>
        <div className="text-center">
          <p>Aucune parole disponible</p>
        </div>
      </div>
    );
  }

  const fontSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-y-auto',
        'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100',
        className
      )}
      role="region"
      aria-label="Paroles synchronisées"
    >
      {/* Metadata */}
      {(lrcData.title || lrcData.artist) && (
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm p-4 border-b z-10">
          {lrcData.title && (
            <h3 className="font-semibold text-lg text-foreground">{lrcData.title}</h3>
          )}
          {lrcData.artist && (
            <p className="text-sm text-muted-foreground">{lrcData.artist}</p>
          )}
        </div>
      )}

      {/* Lyrics Lines */}
      <div className="p-4 space-y-4">
        {lrcData.lines.map((line, index) => {
          const isActive = index === activeLineIndex;
          const isPast = index < activeLineIndex;
          const isFuture = index > activeLineIndex;

          // Calculate karaoke progress
          let karaokeProgress = 0;
          if (karaokeMode && isActive && index < lrcData.lines.length - 1) {
            const nextLine = lrcData.lines[index + 1];
            const duration = nextLine.time - line.time;
            const elapsed = currentTime - line.time;
            karaokeProgress = Math.min(1, Math.max(0, elapsed / duration));
          }

          return (
            <div
              key={`${line.time}-${index}`}
              ref={isActive ? activeLineRef : null}
              className={cn(
                'transition-all duration-300 cursor-pointer',
                fontSizeClasses[fontSize],
                isActive && 'font-semibold transform scale-105',
                isPast && 'opacity-50',
                isFuture && 'opacity-30',
                onLineClick && 'hover:opacity-100 hover:scale-105'
              )}
              style={{
                color: isActive ? highlightColor : 'inherit'
              }}
              onClick={() => handleLineClick(line.time)}
              role="button"
              tabIndex={0}
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Karaoke mode */}
              {karaokeMode && isActive ? (
                <div className="relative">
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="h-full transition-all duration-100"
                      style={{
                        width: `${karaokeProgress * 100}%`,
                        background: highlightColor,
                        opacity: 0.3
                      }}
                    />
                  </div>
                  <div className="relative">{line.text}</div>
                </div>
              ) : (
                <div>{line.text}</div>
              )}

              {/* Translation */}
              {showTranslation && line.translation && (
                <div className="text-sm italic text-gray-500 mt-1">
                  {line.translation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer spacer for better scroll experience */}
      <div className="h-48" />
    </div>
  );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convertit un temps en format LRC [mm:ss.xx]
 */
export function formatTimeToLRC(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const centisecs = Math.floor((seconds % 1) * 100);

  return `[${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centisecs.toString().padStart(2, '0')}]`;
}

/**
 * Crée un fichier LRC depuis un objet
 */
export function createLRCFile(data: LRCData): string {
  const lines: string[] = [];

  // Metadata
  if (data.title) lines.push(`[ti:${data.title}]`);
  if (data.artist) lines.push(`[ar:${data.artist}]`);
  if (data.album) lines.push(`[al:${data.album}]`);
  if (data.by) lines.push(`[by:${data.by}]`);
  if (data.offset) lines.push(`[offset:${data.offset}]`);

  lines.push(''); // Empty line after metadata

  // Lyrics
  data.lines.forEach(line => {
    lines.push(`${formatTimeToLRC(line.time)}${line.text}`);
  });

  return lines.join('\n');
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Exemple 1: Utilisation avec string LRC
 *
 * ```tsx
 * const lrcString = `
 * [ti:Beautiful Song]
 * [ar:Artist Name]
 * [00:12.00]First line of lyrics
 * [00:17.20]Second line here
 * [00:21.10]And so on...
 * `;
 *
 * function LyricsDisplay() {
 *   const { state } = useMusic();
 *
 *   return (
 *     <MusicLyricsSynchronized
 *       lyrics={lrcString}
 *       currentTime={state.currentTime}
 *     />
 *   );
 * }
 * ```
 */

/**
 * Exemple 2: Mode karaoké avec navigation
 *
 * ```tsx
 * function KaraokePlayer() {
 *   const { state, seek } = useMusic();
 *
 *   return (
 *     <MusicLyricsSynchronized
 *       lyrics={lrcData}
 *       currentTime={state.currentTime}
 *       karaokeMode
 *       onLineClick={(time) => seek(time)}
 *       highlightColor="#ff00ff"
 *       fontSize="xl"
 *     />
 *   );
 * }
 * ```
 */

/**
 * Exemple 3: Avec traduction
 *
 * ```tsx
 * const lyricsWithTranslation: LRCData = {
 *   title: "Chanson",
 *   artist: "Artiste",
 *   lines: [
 *     { time: 0, text: "Original text", translation: "Texte traduit" },
 *     { time: 5, text: "Second line", translation: "Deuxième ligne" }
 *   ]
 * };
 *
 * <MusicLyricsSynchronized
 *   lyrics={lyricsWithTranslation}
 *   currentTime={currentTime}
 *   showTranslation
 * />
 * ```
 */
