CREATE TABLE IF NOT EXISTS intakes (
  request_id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  payload_json TEXT,
  received_at TEXT NOT NULL,
  response_due_at TEXT NOT NULL,
  synced_at TEXT,
  response_alerted_at TEXT,
  redacted_at TEXT,
  legal_hold INTEGER NOT NULL DEFAULT 0 CHECK (legal_hold IN (0, 1)),
  status TEXT NOT NULL DEFAULT 'received'
);

CREATE TABLE IF NOT EXISTS delivery_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id TEXT NOT NULL REFERENCES intakes(request_id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT NOT NULL,
  last_error TEXT,
  delivered_at TEXT,
  UNIQUE(request_id, destination)
);

CREATE INDEX IF NOT EXISTS idx_delivery_pending
  ON delivery_attempts(status, next_attempt_at);
CREATE INDEX IF NOT EXISTS idx_intakes_retention
  ON intakes(synced_at, received_at, legal_hold);
