import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export type GalleryCategory = 'events' | 'sports' | 'brand' | 'conference';

export interface Gallery {
  id: string;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  org: string;
  year: string;
  /** ISO date (YYYY-MM-DD) — used for sorting and display */
  date?: string;
  /** Number of photos in the Pixieset collection */
  itemCount?: number;
  /** True if the Pixieset collection is password-protected */
  locked?: boolean;
  image: string;
  objectPosition: string;
  url: string;
  accent: string;
  featured: boolean;
  order: number;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8`;

/**
 * Shared source for the Work portfolio, used by both WorkPage and the
 * HomePage preview grid. Backed by the admin-managed /galleries endpoint
 * instead of a hardcoded array, so adding a new shoot doesn't require a
 * code change — see AdminGalleriesPage.
 */
export function useGalleries() {
  // During prerendering there is no browser to run the fetch below, so the
  // build script fetches the galleries once and hands them over on globalThis.
  // Without this /work would prerender its empty state — telling JS-less
  // crawlers the portfolio is "being updated" and omitting the ItemList schema.
  const prerendered =
    typeof window === 'undefined'
      ? (globalThis as { __CREOVA_GALLERIES__?: Gallery[] }).__CREOVA_GALLERIES__
      : undefined;

  const [galleries, setGalleries] = useState<Gallery[]>(prerendered ?? []);
  const [loading, setLoading] = useState(!prerendered);
  const [error, setError] = useState(false);
  const [refetchIndex, setRefetchIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/galleries`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
        });
        const data = await res.json();
        if (!cancelled) {
          if (res.ok) {
            setGalleries((data.galleries || []).sort((a: Gallery, b: Gallery) => a.order - b.order));
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
  }, [refetchIndex]);

  const refetch = () => setRefetchIndex(i => i + 1);

  return { galleries, loading, error, refetch };
}
