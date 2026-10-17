import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseRepoInput } from "@/lib/parse-repo";
import { AI_MAX_INPUT_CHARS } from "@/lib/constants";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return NextResponse.json({ error: "AI summary not configured" }, { status: 501 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const typedBody = body as {
    repo?: string;
    description?: string;
    languages?: string;
    topContributors?: string;
    recentActivity?: string;
    stats?: string;
  };

  if (!typedBody.repo) {
    return NextResponse.json({ error: "Missing repo parameter" }, { status: 400 });
  }

  const parsed = parseRepoInput(typedBody.repo);
  if (!parsed) {
    return NextResponse.json({ error: "Invalid repo format" }, { status: 400 });
  }

  // Sanitize and truncate inputs
  const sanitize = (text: string | undefined): string => {
    if (!text) return "";
    return text.slice(0, AI_MAX_INPUT_CHARS).replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  };

  const contextData = [
    `Repository: ${parsed.owner}/${parsed.repo}`,
    `Description: ${sanitize(typedBody.description)}`,
    `Core Languages: ${sanitize(typedBody.languages)}`,
    `Top Contributors: ${sanitize(typedBody.topContributors)}`,
    `Recent Activity: ${sanitize(typedBody.recentActivity)}`,
    `Key Metrics: ${sanitize(typedBody.stats)}`,
  ].join("\n");

  const systemPrompt =
    "You are a principal software architect analyzing open-source repositories. Provide an engaging, factual, and insightful executive summary of this project. Highlight: (1) Core Purpose & Ecosystem Impact, (2) Technology Stack & Architecture, and (3) Development Velocity & Community Health. Write 2-3 concise, well-crafted paragraphs. Do not use markdown headings. Do not include token counts, stats tables, or HTML tags. Keep it professional and compelling.";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0.5,
        max_tokens: 500,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the live repository telemetry:\n\n${contextData}` },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API error:", errText);
      return NextResponse.json({ error: "AI synthesis service unavailable" }, { status: 502 });
    }

    const result = (await response.json()) as {
      choices?: readonly {
        message?: {
          content?: string;
        };
      }[];
    };

    const content = result.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json({ error: "Empty response from AI service" }, { status: 502 });
    }

    // Only return the summary text; strictly exclude any token usage or sensitive fields
    return NextResponse.json({ summary: content });
  } catch (err: unknown) {
    console.error("Groq fetch failure:", err);
    return NextResponse.json({ error: "AI summary generation failed" }, { status: 502 });
  }
}
