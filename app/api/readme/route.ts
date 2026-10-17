import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseRepoInput } from "@/lib/parse-repo";
import { GITHUB_API_BASE, CACHE_SECONDS } from "@/lib/constants";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "RepoPulse",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const repoParam = searchParams.get("repo");

  if (!repoParam) {
    return NextResponse.json({ error: "Missing repo parameter" }, { status: 400 });
  }

  const parsed = parseRepoInput(repoParam);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid repository format" }, { status: 400 });
  }

  try {
    const res = await fetch(`${GITHUB_API_BASE}/repos/${parsed.owner}/${parsed.repo}/readme`, {
      headers: getHeaders(),
      next: { revalidate: CACHE_SECONDS },
    });

    if (res.status === 404) {
      return NextResponse.json({ error: "No README found in this repository" }, { status: 404 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch repository README" }, { status: res.status });
    }

    const data = (await res.json()) as {
      name?: string;
      content?: string;
      encoding?: string;
      html_url?: string;
      download_url?: string;
    };

    let decodedContent = "";
    if (data.content && data.encoding === "base64") {
      decodedContent = Buffer.from(data.content, "base64").toString("utf-8");
    } else if (data.download_url) {
      const rawRes = await fetch(data.download_url);
      if (rawRes.ok) {
        decodedContent = await rawRes.text();
      }
    }

    return NextResponse.json({
      name: data.name || "README.md",
      content: decodedContent,
      htmlUrl: data.html_url || `https://github.com/${parsed.owner}/${parsed.repo}#readme`,
    });
  } catch (err: unknown) {
    console.error("Error fetching README:", err);
    return NextResponse.json({ error: "Internal server error reading README" }, { status: 500 });
  }
}
