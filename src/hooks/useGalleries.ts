import { useState, useEffect } from 'react';
import { publicAnonKey } from '../utils/supabase/info';
import { GALLERY_FALLBACK } from '../data/galleryFallback';
import type { Gallery } from '../types/gallery';
import { apiUrl } from '../utils/api';

export type { Gallery, GalleryCategory } from '../types/gallery';

const API_BASE = (import.meta.env.VITE_GALLERY_API_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '');

type GallerySource = 'remote' | 'fallback' | 'empty';

function galleryUrl() {
  return API_BASE ? `${API_BASE}/galleries` : apiUrl('/galleries');
}

/**
 * Shared source for the Work portfolio, used by both WorkPage and the
 * HomePage preview grid. Backed by the admin-managed /galleries endpoint
 * instead of a hardcoded array, so adding a new shoot doesn't require a
 * code change — see AdminGalleriesPage.
 */
export function useGalleries({ useFallback = true }: { useFallback?: boolean } = {}) {
  // During prerendering there is no browser to run the fetch below, so the
  // build script fetches the galleries once and hands them over on globalThis.
  // Without this /work would prerender its empty state — telling JS-less
  // crawlers the portfolio is "being updated" and omitting the ItemList schema.
  const prerendered =
    typeof window === 'undefined'
      ? (globalThis as { __CREOVA_GALLERIES__?: Gallery[] }).__CREOVA_GALLERIES__
      : undefined;

  const initialGalleries = prerendered?.length
    ? prerendered
    : useFallback
      ? GALLERY_FALLBACK
      : [];
  const [galleries, setGalleries] = useState<Gallery[]>(initialGalleries);
  const [source, setSource] = useState<GallerySource>(
    prerendered?.length ? 'remote' : useFallback ? 'fallback' : 'empty',
  );
  const [loading, setLoading] = useState(Boolean(galleryUrl()) && initialGalleries.length === 0);
  const [error, setError] = useState(false);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    const url = galleryUrl();
    if (!url) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(url, {
          headers: API_BASE && publicAnonKey
            ? { Authorization: `Bearer ${publicAnonKey}` }
            : undefined,
        });
        const data = await res.json();
        if (!cancelled) {
          if (res.ok) {
            const remote = (data.galleries || []).sort((a: Gallery, b: Gallery) => a.order - b.order);
            if (remote.length > 0) {
              setGalleries(remote);
              setSource('remote');
            } else if (!useFallback) {
              setGalleries([]);
              setSource('empty');
            }
            setError(false);
          } else {
            setError(true);
          }
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refetchIndex, useFallback]);

  const refetch = () => setRefetchIndex(i => i + 1);

  return { galleries, loading, error, refetch, source };
}
