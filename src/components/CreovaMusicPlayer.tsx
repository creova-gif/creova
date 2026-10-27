import { useRef, useState } from 'react';
import { ArrowUpRight, Headphones, Play, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';

// A deliberately varied sampler: one track per release rather than several
// consecutive tracks from the same album.
const TRACKS = [
  { title: 'Passport', release: 'Geen Tijd', videoId: 'bqkemlkPcZg', duration: '2:59' },
  { title: 'Roots', release: 'Duality & Roots', videoId: 'eQhJhDZePyE', duration: '1:53' },
  { title: 'Home', release: 'Home', videoId: 'eqAszxFzvsc', duration: '2:57' },
  { title: 'Altar Rail', release: 'PAPER DREAMS', videoId: '7Ar6ilSqFzY', duration: '5:33' },
  { title: 'Counting Bodies', release: 'Counting Bodies', videoId: 'y2_p81GXlZM', duration: '3:47' },
] as const;

/** Renders a compact, user-initiated sampler spanning multiple CREOVA Music releases. */
export function CreovaMusicPlayer() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const [selectedId, setSelectedId] = useState<string>(TRACKS[0].videoId);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedTrack = TRACKS.find((track) => track.videoId === selectedId) ?? TRACKS[0];

  const focusCloseButton = () => requestAnimationFrame(() => closeButtonRef.current?.focus());

  const selectTrack = (videoId: string) => {
    setSelectedId(videoId);
    setPlayingId(videoId);
    focusCloseButton();
  };

  const playSelectedTrack = () => {
    setPlayingId(selectedTrack.videoId);
    focusCloseButton();
  };

  const closePlayer = () => {
    setPlayingId(null);
    requestAnimationFrame(() => playButtonRef.current?.focus());
  };

  return (
    <section className="py-12 lg:py-16" style={{ backgroundColor: '#CDBFAE' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem]" style={{ backgroundColor: '#0E0E0E', border: '1px solid rgba(45,16,17,.12)', boxShadow: '0 22px 60px rgba(45,16,17,.14)' }}>
          <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7" style={{ borderColor: 'rgba(205,191,174,.14)' }}>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: '#2D1011' }}>
                <Headphones className="h-5 w-5" style={{ color: '#C6A45A' }} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[.34em]" style={{ color: '#C6A45A' }}>CREOVA Music</p>
                <h2 className="mt-1 text-xl tracking-tight sm:text-2xl" style={{ color: '#FFFFFF' }}>
                  {fr ? 'Cinq sorties. Une écoute en mouvement.' : 'Five releases. One moving listen.'}
                </h2>
              </div>
            </div>
            <a href="https://www.youtube.com/@CREOVAMusic" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 self-start text-xs font-medium sm:self-auto" style={{ color: '#CDBFAE' }}>
              {fr ? 'Catalogue complet' : 'Full catalogue'} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="grid gap-5 p-5 md:p-7 lg:grid-cols-[minmax(280px,.88fr)_minmax(0,1.12fr)] lg:items-center">
            <div className="relative aspect-video overflow-hidden rounded-2xl" style={{ background: 'radial-gradient(circle at 18% 20%, rgba(198,164,90,.34), transparent 33%), radial-gradient(circle at 82% 78%, rgba(205,191,174,.18), transparent 36%), linear-gradient(135deg, #2D1011, #5A3028)' }}>
              {playingId ? (
                <>
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${playingId}?autoplay=1&rel=0`}
                    title={`${selectedTrack.title} by CREOVA Music`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closePlayer}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-transform hover:scale-105"
                    style={{ backgroundColor: 'rgba(14,14,14,.76)', color: '#FFFFFF' }}
                    aria-label={fr ? 'Fermer le lecteur vidéo' : 'Close video player'}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <button
                  ref={playButtonRef}
                  type="button"
                  onClick={playSelectedTrack}
                  className="absolute inset-0 flex items-center gap-5 p-6 text-left group"
                  aria-label={`${fr ? 'Écouter' : 'Play'} ${selectedTrack.title}`}
                >
                  <Logo color="#CDBFAE" className="absolute right-5 top-5 h-9 w-auto opacity-50" interactive={false} />
                  <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105" style={{ backgroundColor: '#FFFFFF', color: '#2D1011' }}>
                    <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                  </span>
                  <span className="min-w-0 self-end pb-1">
                    <span className="block text-[9px] uppercase tracking-[.3em]" style={{ color: '#C6A45A' }}>{fr ? 'Sélection actuelle' : 'Current selection'}</span>
                    <span className="mt-1 block truncate text-2xl" style={{ color: '#FFFFFF' }}>{selectedTrack.title}</span>
                    <span className="mt-0.5 block truncate text-xs" style={{ color: '#CDBFAE' }}>{selectedTrack.release}</span>
                  </span>
                </button>
              )}
            </div>

            <div className="min-w-0">
              <div className="mb-4 flex items-end justify-between gap-4">
                <p className="max-w-md text-sm leading-relaxed" style={{ color: '#B9B0AA' }}>
                  {fr
                    ? 'Une sélection transversale de sorties — choisie pour le contraste, pas pour suivre l’ordre d’un album.'
                    : 'A cross-release sampler chosen for contrast, not album order.'}
                </p>
                <span className="hidden text-[9px] uppercase tracking-[.28em] sm:block" style={{ color: '#706966' }}>{fr ? 'Choisir une piste' : 'Choose a track'}</span>
              </div>

              <div className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#5A3028 transparent' }}>
                {TRACKS.map((track, index) => {
                  const selected = track.videoId === selectedId;
                  return (
                    <button
                      key={track.videoId}
                      type="button"
                      onClick={() => selectTrack(track.videoId)}
                      className="group grid min-w-[235px] snap-start grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-colors sm:min-w-0"
                      style={{ backgroundColor: selected ? '#2D1011' : '#171717', border: `1px solid ${selected ? 'rgba(198,164,90,.48)' : 'rgba(205,191,174,.1)'}` }}
                      aria-pressed={selected}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full text-[10px]" style={{ backgroundColor: selected ? '#C6A45A' : '#252525', color: selected ? '#2D1011' : '#887759' }}>
                        {selected ? <Play className="h-3 w-3" fill="currentColor" /> : String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm" style={{ color: '#FFFFFF' }}>{track.title}</span>
                        <span className="mt-0.5 block truncate text-[10px] uppercase tracking-[.16em]" style={{ color: '#887759' }}>{track.release}</span>
                      </span>
                      <span className="text-[10px]" style={{ color: '#B9B0AA' }}>{track.duration}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
