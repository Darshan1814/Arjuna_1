import {
  GITHUB_API_BASE,
  CACHE_SECONDS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
  RECENT_COMMITS_COUNT,
  MAX_CONCURRENCY,
  MIN_RATE_LIMIT_FOR_HOT_FILES,
} from "./constants";
import type { RateLimit } from "./schemas";

/* ── Types for raw GitHub API responses ── */

interface GitHubRepoRaw {
  readonly full_name: string;
  readonly description: string | null;
  readonly stargazers_count: number;
  readonly forks_count: number;
  readonly open_issues_count: number;
  readonly license: { readonly spdx_id: string } | null;
  readonly created_at: string;
  readonly pushed_at: string;
  readonly default_branch: string;
  readonly html_url: string;
  readonly owner: { readonly avatar_url: string };
  readonly subscribers_count?: number;
}

interface GitHubContributorRaw {
  readonly author: {
    readonly login: string;
    readonly avatar_url: string;
  };
  readonly total: number;
  readonly weeks: readonly {
    readonly a: number;
    readonly d: number;
  }[];
}

interface GitHubCommitActivityRaw {
  readonly week: number;
  readonly total: number;
}

interface GitHubCommitRaw {
  readonly sha: string;
  readonly commit: {
    readonly message: string;
    readonly author: { readonly date: string } | null;
  };
  readonly author: {
    readonly login: string;
    readonly avatar_url: string;
  } | null;
  readonly html_url: string;
}

interface GitHubCommitDetailRaw {
  readonly files?: readonly { readonly filename: string }[];
}

/* ── Helpers ── */

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitStory/1.0",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export function parseRateLimit(response: Response): RateLimit {
  return {
    remaining: Number.parseInt(response.headers.get("x-ratelimit-remaining") ?? "0", 10),
    limit: Number.parseInt(response.headers.get("x-ratelimit-limit") ?? "60", 10),
    resetAt: Number.parseInt(response.headers.get("x-ratelimit-reset") ?? "0", 10),
  };
}

async function githubFetch(path: string): Promise<Response> {
  const url = `${GITHUB_API_BASE}${path}`;
  return fetch(url, {
    headers: getHeaders(),
    next: { revalidate: CACHE_SECONDS },
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Handle a response that might be a GitHub 202 "computing" response.
 * Retries up to MAX_RETRIES times with RETRY_DELAY_MS backoff.
 * Returns null if still computing after retries.
 */
async function fetchWithRetry(
  path: string
): Promise<{ data: unknown; rateLimit: RateLimit } | null> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await githubFetch(path);
    const rateLimit = parseRateLimit(response);

    if (response.status === 200) {
      const data: unknown = await response.json();
      return { data, rateLimit };
    }

    if (response.status === 202) {
      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }
      return null;
    }

    await handleErrorResponse(response);
  }
  return null;
}

async function handleErrorResponse(response: Response): Promise<never> {
  const rateLimit = parseRateLimit(response);

  if (response.status === 404) {
    throw new GitHubApiError("Repository not found or is private", 404);
  }
  if (response.status === 403 || response.status === 429) {
    throw new GitHubApiError(
      `Rate limit exceeded. Resets at ${new Date(rateLimit.resetAt * 1000).toLocaleTimeString()}`,
      response.status,
      rateLimit.resetAt
    );
  }
  throw new GitHubApiError(
    `GitHub API error: ${response.status}`,
    response.status
  );
}

/* ── Error class ── */

export class GitHubApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly resetAt?: number
  ) {
    super(message);
    this.name = "GitHubApiError";
  }
}

/* ── Public API functions ── */

export async function fetchRepoMetadata(
  owner: string,
  repo: string
): Promise<{
  readonly metadata: {
    readonly fullName: string;
    readonly description: string | null;
    readonly stars: number;
    readonly forks: number;
    readonly watchers?: number;
    readonly openIssues: number;
    readonly license: string | null;
    readonly createdAt: string;
    readonly pushedAt: string;
    readonly defaultBranch: string;
    readonly htmlUrl: string;
    readonly ownerAvatarUrl: string;
    readonly latestRelease?: {
      readonly tag: string;
      readonly name: string | null;
      readonly publishedAt: string;
    } | null;
  };
  readonly rateLimit: RateLimit;
}> {
  const response = await githubFetch(`/repos/${owner}/${repo}`);
  const rateLimit = parseRateLimit(response);

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  const raw = (await response.json()) as GitHubRepoRaw;

  let latestRelease: { tag: string; name: string | null; publishedAt: string } | null = null;
  try {
    const relRes = await githubFetch(`/repos/${owner}/${repo}/releases/latest`);
    if (relRes.ok) {
      const relRaw = (await relRes.json()) as {
        tag_name?: string;
        name?: string;
        published_at?: string;
        created_at?: string;
      };
      if (relRaw.tag_name) {
        latestRelease = {
          tag: relRaw.tag_name,
          name: relRaw.name || relRaw.tag_name,
          publishedAt: relRaw.published_at || relRaw.created_at || "",
        };
      }
    }
  } catch {
    // Release fetch error is optional
  }

  return {
    metadata: {
      fullName: raw.full_name,
      description: raw.description,
      stars: raw.stargazers_count,
      forks: raw.forks_count,
      watchers: raw.subscribers_count ?? raw.stargazers_count,
      openIssues: raw.open_issues_count,
      license: raw.license?.spdx_id ?? null,
      createdAt: raw.created_at,
      pushedAt: raw.pushed_at,
      defaultBranch: raw.default_branch,
      htmlUrl: raw.html_url,
      ownerAvatarUrl: raw.owner.avatar_url,
      latestRelease,
    },
    rateLimit,
  };
}

export async function fetchLanguages(
  owner: string,
  repo: string
): Promise<{ readonly languages: Record<string, number>; readonly rateLimit: RateLimit }> {
  const response = await githubFetch(`/repos/${owner}/${repo}/languages`);
  const rateLimit = parseRateLimit(response);

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  const raw = (await response.json()) as Record<string, number>;
  return { languages: raw, rateLimit };
}

export async function fetchCommitActivity(
  owner: string,
  repo: string
): Promise<{
  readonly activity: readonly { readonly week: number; readonly total: number }[] | null;
  readonly rateLimit: RateLimit | undefined;
}> {
  // 1. Try standard stats endpoint
  const result = await fetchWithRetry(`/repos/${owner}/${repo}/stats/commit_activity`);
  if (result && Array.isArray(result.data) && result.data.length > 0) {
    const rawArray = result.data as readonly GitHubCommitActivityRaw[];
    return {
      activity: rawArray.map((w) => ({ week: w.week, total: w.total })),
      rateLimit: result.rateLimit,
    };
  }

  // 2. Reliable fallback: /stats/participation returns 52-week array instantly without 202
  try {
    const partRes = await githubFetch(`/repos/${owner}/${repo}/stats/participation`);
    if (partRes.ok) {
      const partData = (await partRes.json()) as { all?: number[] };
      if (Array.isArray(partData.all) && partData.all.length > 0) {
        const now = Math.floor(Date.now() / 1000);
        const ONE_WEEK = 7 * 24 * 3600;
        const totalWeeks = partData.all.length;
        const mapped = partData.all.map((total, idx) => ({
          week: now - (totalWeeks - 1 - idx) * ONE_WEEK,
          total,
        }));
        return {
          activity: mapped,
          rateLimit: parseRateLimit(partRes),
        };
      }
    }
  } catch {
    // Continue
  }

  return { activity: null, rateLimit: undefined };
}

export async function fetchContributors(
  owner: string,
  repo: string
): Promise<{
  readonly contributors: readonly {
    readonly login: string;
    readonly avatarUrl: string;
    readonly totalCommits: number;
    readonly additions: number;
    readonly deletions: number;
  }[] | null;
  readonly rateLimit: RateLimit | undefined;
}> {
  // 1. Try /stats/contributors for detailed additions/deletions
  const result = await fetchWithRetry(`/repos/${owner}/${repo}/stats/contributors`);
  if (result && Array.isArray(result.data) && result.data.length > 0) {
    const rawArray = result.data as readonly GitHubContributorRaw[];
    const contributors = rawArray.map((c) => {
      const additions = c.weeks ? c.weeks.reduce((sum, w) => sum + w.a, 0) : 0;
      const deletions = c.weeks ? c.weeks.reduce((sum, w) => sum + w.d, 0) : 0;
      return {
        login: c.author?.login || "unknown",
        avatarUrl: c.author?.avatar_url || "",
        totalCommits: c.total || 0,
        additions,
        deletions,
      };
    });
    return { contributors, rateLimit: result.rateLimit };
  }

  // 2. Reliable fallback: direct /contributors endpoint returns immediately
  try {
    const contribRes = await githubFetch(`/repos/${owner}/${repo}/contributors?per_page=30`);
    if (contribRes.ok) {
      const rawList = (await contribRes.json()) as readonly {
        login: string;
        avatar_url: string;
        contributions: number;
      }[];
      if (Array.isArray(rawList) && rawList.length > 0) {
        const contributors = rawList.map((c) => ({
          login: c.login,
          avatarUrl: c.avatar_url,
          totalCommits: c.contributions,
          additions: 0,
          deletions: 0,
        }));
        return { contributors, rateLimit: parseRateLimit(contribRes) };
      }
    }
  } catch {
    // Continue
  }

  return { contributors: null, rateLimit: undefined };
}

export async function fetchRecentCommits(
  owner: string,
  repo: string
): Promise<{
  readonly commits: readonly {
    readonly sha: string;
    readonly message: string;
    readonly authorLogin: string | null;
    readonly authorAvatarUrl: string | null;
    readonly date: string;
    readonly htmlUrl: string;
  }[];
  readonly rateLimit: RateLimit;
}> {
  const response = await githubFetch(
    `/repos/${owner}/${repo}/commits?per_page=${RECENT_COMMITS_COUNT}`
  );
  const rateLimit = parseRateLimit(response);

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  const rawArray = (await response.json()) as readonly GitHubCommitRaw[];
  const commits = rawArray.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    authorLogin: c.author?.login ?? null,
    authorAvatarUrl: c.author?.avatar_url ?? null,
    date: c.commit.author?.date ?? "",
    htmlUrl: c.html_url,
  }));

  return { commits, rateLimit };
}

/**
 * Fetch file change details for the given SHAs with a concurrency limit.
 * Returns all filenames across all commits.
 */
export async function fetchHotFiles(
  owner: string,
  repo: string,
  shas: readonly string[],
  currentRateLimit: RateLimit
): Promise<{
  readonly files: readonly string[];
  readonly rateLimit: RateLimit;
} | { readonly status: "skipped"; readonly reason: string }> {
  if (currentRateLimit.remaining < MIN_RATE_LIMIT_FOR_HOT_FILES) {
    return {
      status: "skipped",
      reason: `Rate limit too low (${currentRateLimit.remaining} remaining). Skipping hot files analysis.`,
    };
  }

  const allFiles: string[] = [];
  let latestRateLimit = currentRateLimit;

  // Process SHAs in batches of MAX_CONCURRENCY
  for (let i = 0; i < shas.length; i += MAX_CONCURRENCY) {
    const batch = shas.slice(i, i + MAX_CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(async (sha) => {
        const response = await githubFetch(`/repos/${owner}/${repo}/commits/${sha}`);
        latestRateLimit = parseRateLimit(response);

        if (!response.ok) {
          return [];
        }

        const detail = (await response.json()) as GitHubCommitDetailRaw;
        return detail.files?.map((f) => f.filename) ?? [];
      })
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        allFiles.push(...result.value);
      }
    }
  }

  return { files: allFiles, rateLimit: latestRateLimit };
}
