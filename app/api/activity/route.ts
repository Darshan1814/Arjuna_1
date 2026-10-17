import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseRepoInput } from "@/lib/parse-repo";
import { fetchCommitActivity, fetchContributors, GitHubApiError } from "@/lib/github";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const repoParam = searchParams.get("repo");

  if (!repoParam) {
    return NextResponse.json({ error: "Missing repo parameter" }, { status: 400 });
  }

  const parsed = parseRepoInput(repoParam);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid repo format" }, { status: 400 });
  }

  try {
    const [activityResult, contributorsResult] = await Promise.allSettled([
      fetchCommitActivity(parsed.owner, parsed.repo),
      fetchContributors(parsed.owner, parsed.repo),
    ]);

    const commitActivity =
      activityResult.status === "fulfilled" && activityResult.value.activity
        ? activityResult.value.activity.map((w) => ({ week: w.week, total: w.total }))
        : { status: "computing" as const };

    const contributors =
      contributorsResult.status === "fulfilled" && contributorsResult.value.contributors
        ? contributorsResult.value.contributors.map((c) => ({
            login: c.login,
            avatarUrl: c.avatarUrl,
            totalCommits: c.totalCommits,
            additions: c.additions,
            deletions: c.deletions,
          }))
        : { status: "computing" as const };

    const rateLimit =
      activityResult.status === "fulfilled"
        ? activityResult.value.rateLimit
        : contributorsResult.status === "fulfilled"
          ? contributorsResult.value.rateLimit
          : undefined;

    return NextResponse.json({
      commitActivity,
      contributors,
      rateLimit,
    });
  } catch (err: unknown) {
    if (err instanceof GitHubApiError) {
      return NextResponse.json(
        { error: err.message, resetAt: err.resetAt },
        { status: err.statusCode }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
