import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'src/content/public-evidence.json');
const records = JSON.parse(readFileSync(manifestPath, 'utf8'));

const allowedHosts = new Set([
  'www.instagram.com',
  'instagram.com',
  'creova.pixieset.com',
  'www.creova.one',
  'creova.one',
]);
const kinds = new Set(['client-work', 'product', 'venture']);
const publicationStatuses = new Set(['published', 'draft', 'archived']);
const publicationBases = new Set(['creova-owned', 'public-source-only', 'written-permission']);
const approvals = new Set(['approved-by-owner', 'approved-by-partner']);
const errors = [];
const ids = new Set();
const slugs = new Set();

if (!Array.isArray(records)) errors.push('manifest must be an array');

for (const [index, record] of (Array.isArray(records) ? records : []).entries()) {
  const at = `record ${index + 1}`;
  for (const field of ['id', 'slug', 'kind', 'publicationStatus', 'publicationBasis', 'expiresOn']) {
    if (typeof record[field] !== 'string' || !record[field].trim()) errors.push(`${at}: missing ${field}`);
  }
  if (ids.has(record.id)) errors.push(`${at}: duplicate id ${record.id}`);
  if (slugs.has(record.slug)) errors.push(`${at}: duplicate slug ${record.slug}`);
  ids.add(record.id);
  slugs.add(record.slug);
  if (!kinds.has(record.kind)) errors.push(`${at}: invalid kind ${record.kind}`);
  if (!publicationStatuses.has(record.publicationStatus)) errors.push(`${at}: invalid publicationStatus ${record.publicationStatus}`);
  if (!publicationBases.has(record.publicationBasis)) errors.push(`${at}: invalid publicationBasis`);
  if (!Array.isArray(record.sources) || record.sources.length === 0) errors.push(`${at}: at least one source is required`);

  for (const locale of ['en', 'fr']) {
    if (!approvals.has(record.approvals?.[locale])) errors.push(`${at}: ${locale} copy is not approved`);
    if (!record.copy?.[locale]?.title?.trim()) errors.push(`${at}: ${locale} title is missing`);
    if (!record.copy?.[locale]?.summary?.trim()) errors.push(`${at}: ${locale} summary is missing`);
  }

  for (const source of record.sources ?? []) {
    try {
      const url = new URL(source.url);
      if (url.protocol !== 'https:') errors.push(`${at}: source must use https (${source.url})`);
      if (!allowedHosts.has(url.hostname)) errors.push(`${at}: source host is not allowlisted (${url.hostname})`);
    } catch {
      errors.push(`${at}: invalid source URL (${source.url})`);
    }
  }

  if (record.publicationStatus === 'published') {
    const expiry = Date.parse(`${record.expiresOn}T23:59:59Z`);
    if (!Number.isFinite(expiry)) errors.push(`${at}: invalid expiresOn date`);
    if (Number.isFinite(expiry) && expiry < Date.now()) errors.push(`${at}: published evidence expired on ${record.expiresOn}`);
  }
}

if (errors.length) {
  console.error(`Public evidence validation failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Public evidence validation passed (${records.length} records).`);
