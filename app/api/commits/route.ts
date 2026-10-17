import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseRepoInput } from "@/lib/parse-repo";
import { fetchRecentCommits, fetchHotFiles, GitHubApiError } from "@/lib/github";
import { countFileFrequency } from "@/lib/aggregate";

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
    const { commits, rateLimit } = await fetchRecentCommits(parsed.owner, parsed.repo);

    const shas = commits.map((c) => c.sha);
    const hotFilesResult = await fetchHotFiles(
      parsed.owner,
      parsed.repo,
      shas,
      rateLimit
    );

    let hotFiles:
      | readonly { readonly filename: string; readonly changeCount: number }[]
      | { readonly status: "skipped"; readonly reason: string };

    if ("status" in hotFilesResult) {
      hotFiles = hotFilesResult;
    } else {
      hotFiles = countFileFrequency(hotFilesResult.files);
    }

    return NextResponse.json({
      commits: commits.map((c) => ({
        sha: c.sha,
        message: c.message,
        authorLogin: c.authorLogin,
        authorAvatarUrl: c.authorAvatarUrl,
        date: c.date,
        htmlUrl: c.htmlUrl,
      })),
      hotFiles,
      rateLimit:
        "status" in hotFilesResult ? rateLimit : hotFilesResult.rateLimit,
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
