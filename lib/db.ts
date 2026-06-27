import { neon } from "@neondatabase/serverless";

// Lazy-initialized — avoids connecting during build
let sqlInstance: ReturnType<typeof neon> | null = null;

function sql() {
  if (sqlInstance) return sqlInstance;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL not set");
  }

  sqlInstance = neon(url);
  return sqlInstance;
}

let tableReady = false;

export async function ensureTable(): Promise<void> {
  if (tableReady) return;

  await sql()`
    CREATE TABLE IF NOT EXISTS audit_requests (
      id TEXT PRIMARY KEY,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL DEFAULT 'New',
      name TEXT NOT NULL,
      business_name TEXT NOT NULL,
      business_type TEXT DEFAULT '',
      facebook_page TEXT DEFAULT '',
      contact TEXT NOT NULL,
      problem TEXT NOT NULL,
      package TEXT NOT NULL,
      budget TEXT NOT NULL,
      improvements TEXT[] DEFAULT '{}',
      admin_notes TEXT DEFAULT '',
      follow_up_date TEXT DEFAULT ''
    )
  `;

  tableReady = true;
}

export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL;
}

export { sql };
