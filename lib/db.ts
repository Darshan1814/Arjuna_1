import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

let dbInstance: DatabaseSync | null = null;

function getDatabasePath(): string {
  if (process.env.VERCEL || process.env.NODE_ENV === "production" && !fs.existsSync(".data")) {
    const tmpDir = "/tmp";
    return path.join(tmpDir, "repopulse_history.db");
  }
  const dataDir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      return path.join("/tmp", "repopulse_history.db");
    }
  }
  return path.join(dataDir, "history.db");
}

function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    const dbPath = getDatabasePath();
    dbInstance = new DatabaseSync(dbPath);
    // Initialize schema
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        repo TEXT UNIQUE NOT NULL,
        searched_at INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_searched_at ON search_history(searched_at DESC);
    `);
  }
  return dbInstance;
}

export function getRecentSearches(): string[] {
  try {
    const db = getDatabase();
    const rows = db
      .prepare("SELECT repo FROM search_history ORDER BY searched_at DESC LIMIT 5")
      .all() as { repo: string }[];
    return rows.map((r) => r.repo);
  } catch (err) {
    console.error("Error reading search history from SQLite:", err);
    return [];
  }
}

export function recordSearch(repo: string): string[] {
  try {
    const db = getDatabase();
    const now = Date.now();
    // Insert or update searched_at
    db.prepare(`
      INSERT INTO search_history (repo, searched_at)
      VALUES (?, ?)
      ON CONFLICT(repo) DO UPDATE SET searched_at = excluded.searched_at
    `).run(repo, now);

    // Keep only the 5 most recent searches (remove 6th and older)
    db.exec(`
      DELETE FROM search_history
      WHERE id NOT IN (
        SELECT id FROM search_history
        ORDER BY searched_at DESC
        LIMIT 5
      );
    `);

    return getRecentSearches();
  } catch (err) {
    console.error("Error recording search in SQLite:", err);
    return [];
  }
}
