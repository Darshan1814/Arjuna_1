import { SEGMENT_PATTERN } from "./constants";
import type { RepoInput } from "./schemas";

/**
 * Parse a GitHub repo reference from various input formats:
 * - `owner/repo`
 * - `https://github.com/owner/repo`
 * - `https://github.com/owner/repo.git`
 * - With trailing slashes
 *
 * Returns null if input is invalid. Uses URL constructor + string
 * splitting instead of complex regex to avoid ReDoS.
 */
export function parseRepoInput(input: string): RepoInput | null {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return null;
  }

  let pathSegments: string[];

  if (trimmed.includes("://")) {
    // Treat as URL
    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      return null;
    }

    // Only allow github.com
    if (parsed.hostname !== "github.com") {
      return null;
    }

    // Get path segments, filter empties
    pathSegments = parsed.pathname.split("/").filter(Boolean);
  } else if (trimmed.includes("/")) {
    // Treat as owner/repo format
    pathSegments = trimmed.split("/").filter(Boolean);
  } else {
    return null;
  }

  if (trimmed.includes("://")) {
    if (pathSegments.length < 2) {
      return null;
    }
  } else {
    if (pathSegments.length !== 2) {
      return null;
    }
  }

  const owner = pathSegments[0];
  let repo = pathSegments[1];

  // Strip .git suffix
  if (repo.endsWith(".git")) {
    repo = repo.slice(0, -4);
  }

  // Validate segments
  if (!SEGMENT_PATTERN.test(owner) || !SEGMENT_PATTERN.test(repo)) {
    return null;
  }

  return { owner, repo };
}

/**
 * Validate that owner and repo are safe for use in API calls.
 * Returns true if valid.
 */
export function isValidSegment(segment: string): boolean {
  return SEGMENT_PATTERN.test(segment);
}
