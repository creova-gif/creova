-- Key-value store mirroring kv_store_feacf0d8 (key, JSON value) plus updated_at.
-- value is JSON text. The primary key on key is what SQLite uses for
-- `WHERE key LIKE 'prefix%'`.
--
-- idx_kv_key_prefix is the explicit prefix index requested for those lookups.
-- D1 counts an index update as an extra row written, so each kv write costs
-- two rows written. See workers/api/README.md before adding more indexes.

CREATE TABLE IF NOT EXISTS kv (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_kv_key_prefix ON kv (key);
