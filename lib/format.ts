const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

/**
 * Format a date string or timestamp into a human-readable relative time.
 */
export function formatRelativeTime(dateInput: string | number): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : new Date(dateInput);
  const now = Date.now();
  const diff = now - date.getTime();

  if (diff < MINUTE) return "just now";
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE);
    return `${mins}m ago`;
  }
  if (diff < DAY) {
    const hrs = Math.floor(diff / HOUR);
    return `${hrs}h ago`;
  }
  if (diff < MONTH) {
    const days = Math.floor(diff / DAY);
    return `${days}d ago`;
  }
  if (diff < YEAR) {
    const months = Math.floor(diff / MONTH);
    return `${months}mo ago`;
  }
  const years = Math.floor(diff / YEAR);
  return `${years}y ago`;
}

/**
 * Format a number with compact notation (e.g. 1.2k, 3.4M).
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`;
  }
  return String(num);
}

/**
 * Truncate a SHA to 7 characters.
 */
export function shortSha(sha: string): string {
  return sha.slice(0, 7);
}

/**
 * Truncate a commit message to a maximum length.
 */
export function truncateMessage(message: string, maxLength: number = 72): string {
  const firstLine = message.split("\n")[0];
  if (firstLine.length <= maxLength) return firstLine;
  return `${firstLine.slice(0, maxLength - 1)}…`;
}

/**
 * Format a Unix timestamp (seconds) to a locale date string.
 */
export function formatWeekDate(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Format byte count into human-readable B, KB, MB, GB.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

