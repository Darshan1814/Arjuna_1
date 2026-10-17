import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseRepoInput } from "@/lib/parse-repo";
import { fetchRepoMetadata, fetchLanguages, GitHubApiError } from "@/lib/github";
import { computeLanguagePercentages } from "@/lib/aggregate";

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
    const [metaResult, langResult] = await Promise.allSettled([
      fetchRepoMetadata(parsed.owner, parsed.repo),
      fetchLanguages(parsed.owner, parsed.repo),
    ]);

    if (metaResult.status === "rejected") {
      const err = metaResult.reason;
      if (err instanceof GitHubApiError) {
        return NextResponse.json(
          { error: err.message, resetAt: err.resetAt },
          { status: err.statusCode }
        );
      }
      return NextResponse.json({ error: "Failed to fetch repository info" }, { status: 500 });
    }

    const { metadata, rateLimit } = metaResult.value;

    const languages =
      langResult.status === "fulfilled"
        ? computeLanguagePercentages(langResult.value.languages)
        : [];

    return NextResponse.json({
      metadata,
      languages,
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
