import { getDb } from "./db";
import type { GithubStats } from "./types";

export type Snapshot = {
  capturedAt: string;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
};

async function ensureSchema(): Promise<void> {
  const db = getDb();
  await db`
    CREATE TABLE IF NOT EXISTS github_snapshots (
      id SERIAL PRIMARY KEY,
      captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      total_contributions INTEGER NOT NULL,
      current_streak INTEGER NOT NULL,
      longest_streak INTEGER NOT NULL,
      commits INTEGER NOT NULL,
      pull_requests INTEGER NOT NULL,
      issues INTEGER NOT NULL,
      reviews INTEGER NOT NULL
    )
  `;
}

export async function insertSnapshot(stats: GithubStats): Promise<void> {
  await ensureSchema();
  const db = getDb();
  await db`
    INSERT INTO github_snapshots
      (total_contributions, current_streak, longest_streak, commits, pull_requests, issues, reviews)
    VALUES
      (${stats.totalContributions}, ${stats.currentStreak}, ${stats.longestStreak},
       ${stats.totals.commits}, ${stats.totals.pullRequests}, ${stats.totals.issues}, ${stats.totals.reviews})
  `;
}

export async function getRecentSnapshots(limit = 60): Promise<Snapshot[]> {
  await ensureSchema();
  const db = getDb();
  const rows = await db`
    SELECT captured_at, total_contributions, current_streak, longest_streak,
           commits, pull_requests, issues, reviews
    FROM github_snapshots
    ORDER BY captured_at ASC
    LIMIT ${limit}
  `;

  return rows.map((row) => ({
    capturedAt: row.captured_at as string,
    totalContributions: row.total_contributions as number,
    currentStreak: row.current_streak as number,
    longestStreak: row.longest_streak as number,
    commits: row.commits as number,
    pullRequests: row.pull_requests as number,
    issues: row.issues as number,
    reviews: row.reviews as number,
  }));
}
