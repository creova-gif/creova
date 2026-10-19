export type GalleryCategory = 'events' | 'sports' | 'brand' | 'conference';

export interface Gallery {
  id: string;
  title: string;
  subtitle: string;
  category: GalleryCategory;
  org: string;
  year: string;
  /** ISO date (YYYY-MM-DD) — used for sorting and display. */
  date?: string;
  /** Number of photos in the Pixieset collection. */
  itemCount?: number;
  /** True if the Pixieset collection is password-protected. */
  locked?: boolean;
  image: string;
  objectPosition: string;
  url: string;
  accent: string;
  featured: boolean;
  order: number;
}
