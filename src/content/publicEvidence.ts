import manifest from './public-evidence.json';
import type { PublicEvidenceRecord } from './publicEvidence.types';

export const PUBLIC_EVIDENCE = manifest as PublicEvidenceRecord[];

export function getPublishedEvidence(kind?: PublicEvidenceRecord['kind']) {
  return PUBLIC_EVIDENCE.filter((record) =>
    record.publicationStatus === 'published' && (!kind || record.kind === kind)
  );
}

export function getPublishedEvidenceBySlug(slug: string) {
  return getPublishedEvidence().find((record) => record.slug === slug);
}
