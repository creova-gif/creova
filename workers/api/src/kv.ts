// D1 replacement for the Supabase kv_store. Same get / set / del / getByPrefix
// shape the routes already call. Values are JSON text.

// Values are untyped JSON, same as the Supabase kv helper this replaces.
export interface KvStore {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  del(key: string): Promise<void>;
  mget(keys: string[]): Promise<any[]>;
  mset(keys: string[], values: any[]): Promise<void>;
  mdel(keys: string[]): Promise<void>;
  getByPrefix(prefix: string): Promise<any[]>;
}

function likePrefix(prefix: string): string {
  return `${prefix.replace(/[\\%_]/g, (ch) => `\\${ch}`)}%`;
}

function parseValue(raw: string): unknown {
  return JSON.parse(raw);
}

export function createKv(db: D1Database): KvStore {
  return {
    async get(key) {
      const row = await db
        .prepare("SELECT value FROM kv WHERE key = ?")
        .bind(key)
        .first<{ value: string }>();
      if (!row) return undefined;
      return parseValue(row.value);
    },

    async set(key, value) {
      const result = await db
        .prepare(
          `INSERT INTO kv (key, value, updated_at) VALUES (?1, ?2, ?3)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        )
        .bind(key, JSON.stringify(value), new Date().toISOString())
        .run();
      if (!result.success) {
        throw new Error("kv write failed");
      }
    },

    async del(key) {
      const result = await db.prepare("DELETE FROM kv WHERE key = ?").bind(key).run();
      if (!result.success) {
        throw new Error("kv delete failed");
      }
    },

    async mget(keys) {
      if (keys.length === 0) return [];
      const placeholders = keys.map(() => "?").join(", ");
      const result = await db
        .prepare(`SELECT key, value FROM kv WHERE key IN (${placeholders})`)
        .bind(...keys)
        .all<{ key: string; value: string }>();
      const byKey = new Map((result.results ?? []).map((row) => [row.key, parseValue(row.value)]));
      return keys.map((key) => byKey.get(key));
    },

    async mset(keys, values) {
      if (keys.length !== values.length) {
        throw new Error("kv mset length mismatch");
      }
      if (keys.length === 0) return;
      const now = new Date().toISOString();
      const statements = keys.map((key, i) =>
        db
          .prepare(
            `INSERT INTO kv (key, value, updated_at) VALUES (?1, ?2, ?3)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
          )
          .bind(key, JSON.stringify(values[i]), now),
      );
      const results = await db.batch(statements);
      if (results.some((result) => !result.success)) {
        throw new Error("kv write failed");
      }
    },

    async mdel(keys) {
      if (keys.length === 0) return;
      const placeholders = keys.map(() => "?").join(", ");
      const result = await db
        .prepare(`DELETE FROM kv WHERE key IN (${placeholders})`)
        .bind(...keys)
        .run();
      if (!result.success) {
        throw new Error("kv delete failed");
      }
    },

    async getByPrefix(prefix) {
      const result = await db
        .prepare("SELECT value FROM kv WHERE key LIKE ?1 ESCAPE '\\' ORDER BY key")
        .bind(likePrefix(prefix))
        .all<{ value: string }>();
      return (result.results ?? []).map((row) => parseValue(row.value));
    },
  };
}
