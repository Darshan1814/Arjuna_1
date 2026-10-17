import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI summary not configured" }, { status: 501 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { repo, content } = body as { repo?: string; content?: string };
  if (!content) {
    return NextResponse.json({ error: "Missing README content" }, { status: 400 });
  }

  // Truncate to first 8,000 characters to stay within efficient inference
  const truncatedContent = content.slice(0, 8000);

  const systemPrompt = `You are a staff engineer analyzing an open-source project's README documentation.
Synthesize the README into an authoritative, clean, and highly readable developer brief with these 4 clear sections:
1. 🎯 What It Is & Core Value: 2-3 sentences explaining what this project does and why developers use it.
2. ⚡ Key Capabilities: 3-5 succinct bullet points of defining technical features.
3. 🚀 Quickstart & Setup: The essential installation command or configuration step.
4. 💡 Architecture & Best Practices: Any notable design pattern, prerequisite, or ecosystem fit.

Keep it direct, professional, and free of marketing fluff. Do not output HTML tags.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0.4,
        max_tokens: 600,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Repository: ${repo || "Unknown"}\n\nREADME Content:\n${truncatedContent}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI synthesis service unavailable" }, { status: 502 });
    }

    const result = (await response.json()) as {
      choices?: readonly { message?: { content?: string } }[];
    };

    const summary = result.choices?.[0]?.message?.content?.trim();
    if (!summary) {
      return NextResponse.json({ error: "Empty summary generated" }, { status: 502 });
    }

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("README summary error:", err);
    return NextResponse.json({ error: "Failed to summarize README" }, { status: 502 });
  }
}
