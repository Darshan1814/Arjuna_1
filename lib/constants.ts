/** Cache duration in seconds for GitHub API responses */
export const CACHE_SECONDS = 600;

/** Maximum number of retries for GitHub 202 responses */
export const MAX_RETRIES = 3;

/** Backoff delay in ms between 202 retries */
export const RETRY_DELAY_MS = 1500;

/** Maximum concurrency for parallel commit detail fetches */
export const MAX_CONCURRENCY = 5;

/** Number of recent commits to fetch */
export const RECENT_COMMITS_COUNT = 100;

/** Number of top files to return in hot files */
export const TOP_FILES_COUNT = 10;

/** Number of top contributors to display */
export const TOP_CONTRIBUTORS_COUNT = 10;

/** Minimum remaining rate limit before skipping hot files */
export const MIN_RATE_LIMIT_FOR_HOT_FILES = 40;

/** GitHub API base URL */
export const GITHUB_API_BASE = "https://api.github.com";

/** Maximum length for owner or repo name segments */
export const MAX_SEGMENT_LENGTH = 100;

/** Regex pattern for valid GitHub owner/repo segments (ReDoS-safe) */
export const SEGMENT_PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

/** Maximum input length for AI summary */
export const AI_MAX_INPUT_CHARS = 4000;

/** Number of weeks in the commit activity timeline */
export const WEEKS_IN_YEAR = 52;
