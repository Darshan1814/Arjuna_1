import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRecentSearches, recordSearch } from "@/lib/db";
import { parseRepoInput } from "@/lib/parse-repo";

export async function GET(): Promise<NextResponse> {
  const history = getRecentSearches();
  return NextResponse.json({ history });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const repo = typeof body.repo === "string" ? body.repo.trim() : "";
    const parsed = parseRepoInput(repo);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid repository identifier" }, { status: 400 });
    }
    const cleanRepo = `${parsed.owner}/${parsed.repo}`;
    const history = recordSearch(cleanRepo);
    return NextResponse.json({ history });
  } catch (err: unknown) {
    console.error("Failed to update history:", err);
    return NextResponse.json({ error: "Failed to update history" }, { status: 500 });
  }
}
