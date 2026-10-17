// [stage-60] fix(assistant): sanitize special characters (&) and conversational prefixes in search
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GITHUB_API_BASE } from "@/lib/constants";

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

function sanitizeSearchQuery(raw: string): string {
  // Strip conversational filler phrases and special characters that break GitHub search parser
  const cleaned = raw
    .replace(/\b(i want|i need|can you find|find me|show me|give me|repos related to|repo related to|repositories related to|repos for|repo for|repositories for|projects for|looking for)\b/gi, " ")
    .replace(/[&/\\#,+()$~%.'":*?<>{}[\]!@^=]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || raw.replace(/[&/\\#,+()$~%.'":*?<>{}[\]!@^=]/g, " ").trim();
}

async function searchGithub(cleanQuery: string): Promise<{
  fullName: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  htmlUrl: string;
}[]> {
  try {
    const searchUrl = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(cleanQuery)}&sort=stars&order=desc&per_page=5`;
    const res = await fetch(searchUrl, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.items)) return [];
    return data.items.map((item: {
      full_name: string;
      description: string | null;
      stargazers_count: number;
      forks_count: number;
      language: string | null;
      html_url: string;
    }) => ({
      fullName: item.full_name,
      description: item.description,
      stars: item.stargazers_count,
      forks: item.forks_count,
      language: item.language,
      htmlUrl: item.html_url,
    }));
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json({ error: "Please enter a topic or question" }, { status: 400 });
    }

    const cleanQuery = sanitizeSearchQuery(query);

    // 1. Primary search with cleaned terms
    let repos = await searchGithub(cleanQuery);

    // 2. Fallback: if 0 results, try with top 2 keywords
    if (repos.length === 0) {
      const keywords = cleanQuery.split(" ").filter((w) => w.length > 2);
      if (keywords.length > 1) {
        repos = await searchGithub(keywords.slice(0, 2).join(" "));
      } else if (keywords.length === 1) {
        repos = await searchGithub(keywords[0]);
      }
    }

    // 2. Synthesize Advice using AI (if key available)
    let advice = `Here are the top repositories on GitHub aligned with "${query}":`;
    const groqKey = process.env.GROQ_API_KEY;

    if (groqKey && repos.length > 0) {
      try {
        const repoListText = repos
          .map((r, i) => `${i + 1}. ${r.fullName} (${r.stars} stars, ${r.language || "Multi-lang"}): ${r.description || "No description"}`)
          .join("\n");

        const aiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            temperature: 0.5,
            max_tokens: 300,
            messages: [
              {
                role: "system",
                content:
                  "You are Arjuna Sarthi, an expert repository finder. Give a 2-3 sentence strategic recommendation comparing these top repositories for the user's inquiry. Do NOT use any asterisks (* or **), markdown symbols, or bullet stars. Output clean, readable plain text only.",
              },
              {
                role: "user",
                content: `User wants repositories for: "${query}". Top results found on GitHub:\n${repoListText}`,
              },
            ],
          }),
        });

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const generatedAdvice = aiData.choices?.[0]?.message?.content?.trim();
          if (generatedAdvice) {
            advice = generatedAdvice.replace(/\*\*/g, "").replace(/\*/g, "").trim();
          }
        }
      } catch (e) {
        console.error("Assistant AI advice error:", e);
      }
    }

    return NextResponse.json({
      query,
      advice,
      repositories: repos,
    });
  } catch (err) {
    console.error("Arjuna Sarthi assistant error:", err);
    return NextResponse.json({ error: "Failed to consult Arjuna Sarthi" }, { status: 500 });
  }
}
