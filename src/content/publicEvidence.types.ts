export type PublicEvidenceKind = 'client-work' | 'product' | 'venture';

export type PublicationBasis =
  | 'creova-owned'
  | 'public-source-only'
  | 'written-permission';

export type CopyApproval = 'approved-by-owner' | 'approved-by-partner';

export interface PublicEvidenceSource {
  label: string;
  url: string;
  owner: 'creova' | 'partner' | 'institution';
}

export interface LocalizedEvidenceCopy {
  title: string;
  summary: string;
  statusLabel?: string;
}

export interface PublicEvidenceRecord {
  id: string;
  slug: string;
  kind: PublicEvidenceKind;
  publicationStatus: 'published' | 'draft' | 'archived';
  publicationBasis: PublicationBasis;
  partner?: string;
  occurredOn?: string;
  expiresOn: string;
  approvals: {
    en: CopyApproval;
    fr: CopyApproval;
  };
  copy: {
    en: LocalizedEvidenceCopy;
    fr: LocalizedEvidenceCopy;
  };
  sources: PublicEvidenceSource[];
}
