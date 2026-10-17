import type { WeeklyActivity, MonthlyActivity, Contributor, HotFile, LanguageEntry } from "./schemas";
import { TOP_CONTRIBUTORS_COUNT, TOP_FILES_COUNT } from "./constants";

/**
 * Convert byte counts per language to percentages.
 * Returns entries sorted by percentage descending.
 */
export function computeLanguagePercentages(
  languageBytes: Record<string, number>
): readonly LanguageEntry[] {
  const entries = Object.entries(languageBytes);
  if (entries.length === 0) {
    return [];
  }

  const totalBytes = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (totalBytes === 0) {
    return [];
  }

  return entries
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: Math.round((bytes / totalBytes) * 1000) / 10,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Bucket weekly commit activity data into monthly totals.
 */
export function bucketWeeklyToMonthly(
  weeks: readonly WeeklyActivity[]
): readonly MonthlyActivity[] {
  const buckets = new Map<string, number>();

  for (const week of weeks) {
    const date = new Date(week.week * 1000);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, (buckets.get(key) ?? 0) + week.total);
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));
}

/**
 * Get the top N contributors sorted by total commits descending.
 */
export function getTopContributors(
  contributors: readonly Contributor[],
  count: number = TOP_CONTRIBUTORS_COUNT
): readonly Contributor[] {
  return [...contributors]
    .sort((a, b) => b.totalCommits - a.totalCommits)
    .slice(0, count);
}

/**
 * Count file change frequency from a list of filenames across commits.
 * Returns top N most frequently changed files.
 */
export function countFileFrequency(
  allFiles: readonly string[],
  count: number = TOP_FILES_COUNT
): readonly HotFile[] {
  const counts = new Map<string, number>();

  for (const filename of allFiles) {
    counts.set(filename, (counts.get(filename) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([filename, changeCount]) => ({ filename, changeCount }))
    .sort((a, b) => b.changeCount - a.changeCount)
    .slice(0, count);
}

/**
 * Compute the maximum commits in a single contributor's contribution
 * as a share of total, for rendering share bars.
 */
export function computeContributorShare(
  contributor: Contributor,
  totalCommits: number
): number {
  if (totalCommits === 0) return 0;
  return Math.round((contributor.totalCommits / totalCommits) * 100);
}
