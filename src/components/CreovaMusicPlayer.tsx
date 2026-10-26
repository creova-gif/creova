import { useState } from 'react';
import { ArrowUpRight, Headphones, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';

const TRACKS = [
  { title: 'Passport', videoId: 'bqkemlkPcZg', duration: '2:59' },
  { title: 'Ca Va Vraiment', videoId: 'FIznaoVZLWI', duration: '3:08' },
  { title: 'The Ones Who Stayed', videoId: '4sF1CnIupvI', duration: '3:32' },
] as const;

export function CreovaMusicPlayer() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const activeTrack = TRACKS.find((track) => track.videoId === activeVideo) ?? TRACKS[0];

  return (
    <section className="py-24 lg:py-32" style={{ backgroundColor: '#CDBFAE' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-16 items-stretch">
          <div className="rounded-3xl overflow-hidden min-h-[420px] relative" style={{ backgroundColor: '#2D1011' }}>
            {activeVideo ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title={`${activeTrack.title} by CREOVA Music`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 22% 18%, rgba(198,164,90,.32), transparent 35%), radial-gradient(circle at 80% 78%, rgba(205,191,174,.2), transparent 38%), linear-gradient(135deg, #2D1011, #5A3028)' }} />
                <Logo color="#CDBFAE" className="absolute left-8 top-8 h-14 w-auto opacity-70" interactive={false} />
                <button
                  type="button"
                  onClick={() => setActiveVideo(activeTrack.videoId)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center p-8 group"
                  aria-label={`${fr ? 'Écouter' : 'Play'} ${activeTrack.title}`}
                >
                  <span className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: '#FFFFFF', color: '#2D1011' }}>
                    <Play className="w-6 h-6 ml-1" fill="currentColor" />
                  </span>
                  <span className="text-xs tracking-[.3em] uppercase" style={{ color: '#C6A45A' }}>{fr ? 'Écouter maintenant' : 'Listen now'}</span>
                  <span className="text-3xl md:text-4xl" style={{ color: '#FFFFFF' }}>{activeTrack.title}</span>
                </button>
              </>
            )}
          </div>

          <div className="rounded-3xl p-7 md:p-10 flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center gap-3 text-xs tracking-[.3em] uppercase" style={{ color: '#887759' }}>
              <Headphones className="w-4 h-4" /> CREOVA Music
            </div>
            <h2 className="mt-7 text-4xl md:text-6xl tracking-tight leading-[1.02]" style={{ color: '#2D1011' }}>
              {fr ? 'Une autre façon de raconter.' : 'Another way we tell stories.'}
            </h2>
            <p className="mt-5 leading-relaxed" style={{ color: '#555' }}>
              {fr
                ? 'Des sorties originales qui prolongent la pratique narrative de CREOVA par le son. La lecture commence seulement lorsque vous la choisissez.'
                : 'Original releases that extend CREOVA’s storytelling practice through sound. Playback starts only when you choose it.'}
            </p>
            <div className="mt-9 border-t" style={{ borderColor: '#E5DED5' }}>
              {TRACKS.map((track, index) => (
                <button
                  key={track.videoId}
                  type="button"
                  onClick={() => setActiveVideo(track.videoId)}
                  className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-4 py-4 text-left border-b group"
                  style={{ borderColor: '#E5DED5' }}
                >
                  <span className="text-xs" style={{ color: '#887759' }}>0{index + 1}</span>
                  <span className="group-hover:translate-x-1 transition-transform" style={{ color: '#2D1011' }}>{track.title}</span>
                  <span className="text-xs" style={{ color: '#777' }}>{track.duration}</span>
                </button>
              ))}
            </div>
            <a href="https://www.youtube.com/@CREOVAMusic" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-medium" style={{ color: '#887759' }}>
              {fr ? 'Toutes les sorties sur YouTube' : 'All releases on YouTube'} <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
