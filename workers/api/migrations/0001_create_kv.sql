-- Key-value store mirroring kv_store_feacf0d8 (key, JSON value) plus updated_at.
--
-- WITHOUT ROWID keeps the row in the primary-key B-tree only, so an insert or
-- update is one row written. A second index on key would be a duplicate of
-- sqlite_autoindex and D1 would count that update as another row written.
--
-- Prefix lookups are a range on the primary key (`key >= ? AND key < ?`).
-- LIKE cannot use that index: D1's default LIKE is case-insensitive, so it
-- scans the whole table. Do not add idx_kv_key_prefix back.

CREATE TABLE IF NOT EXISTS kv (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
) WITHOUT ROWID;
