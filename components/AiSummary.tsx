"use client";

import { useState, useCallback } from "react";
import { Sparkles, Loader2, AlertCircle, Key, RefreshCw, BrainCircuit } from "lucide-react";
import type { RepoMetadata, LanguageEntry, Contributor } from "@/lib/schemas";

interface AiSummaryProps {
  readonly repo: string;
  readonly metadata: RepoMetadata | null;
  readonly languages: readonly LanguageEntry[] | null;
  readonly contributors: readonly Contributor[] | null;
}

export function AiSummary({
  repo,
  metadata,
  languages,
  contributors,
}: AiSummaryProps): React.JSX.Element {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotConfigured, setIsNotConfigured] = useState(false);

  const generateSummary = useCallback(async () => {
    if (!metadata) return;

    setIsLoading(true);
    setError(null);
    setIsNotConfigured(false);

    try {
      const topLangs = (languages ?? [])
        .slice(0, 5)
        .map((l) => `${l.name} (${l.percentage}%)`)
        .join(", ");

      const topContribs = (contributors ?? [])
        .slice(0, 5)
        .map((c) => `${c.login} (${c.totalCommits} commits)`)
        .join(", ");

      const stats = `${metadata.stars} stars, ${metadata.forks} forks, ${metadata.openIssues} open issues, created ${metadata.createdAt.slice(0, 10)}`;

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo,
          description: metadata.description ?? "",
          languages: topLangs,
          topContributors: topContribs,
          recentActivity: `Default branch: ${metadata.defaultBranch}, last pushed: ${metadata.pushedAt.slice(0, 10)}`,
          stats,
        }),
      });

      if (res.status === 501) {
        setIsNotConfigured(true);
        return;
      }

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Failed to generate AI executive summary");
      }

      const data = (await res.json()) as { summary: string };
      setSummary(data.summary);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "AI service temporarily unavailable");
    } finally {
      setIsLoading(false);
    }
  }, [repo, metadata, languages, contributors]);

  // Split summary into clean paragraphs
  const paragraphs = summary
    ? summary
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <section className="card ai-summary-card animate-fadeIn" aria-label="AI Repository Story">
      <div className="section-header-row">
        <div className="ai-header-left">
          <div className="ai-icon-badge" aria-hidden="true">
            <Sparkles size={18} className="ai-sparkle-icon" />
          </div>
          <div>
            <h3 className="section-title">
              Repository Intelligence Story
              <span className="ai-powered-pill">
                <BrainCircuit size={11} aria-hidden="true" />
                Neural Analysis
              </span>
            </h3>
            <p className="section-subtitle">
              Architectural analysis, velocity assessment & ecosystem health
            </p>
          </div>
        </div>

        {!summary && !isNotConfigured && (
          <button
            type="button"
            className="ai-generate-btn"
            onClick={generateSummary}
            disabled={isLoading || !metadata}
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                <span>Synthesizing Story...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} aria-hidden="true" />
                <span>Generate Intelligence Story</span>
              </>
            )}
          </button>
        )}
      </div>

      {isLoading && !summary && (
        <div className="ai-loading-state" role="status">
          <div className="ai-loading-pulse" />
          <p className="text-sm">Neural synthesis in progress...</p>
        </div>
      )}

      {summary && (
        <div className="ai-summary-content">
          <div className="ai-paragraphs">
            {paragraphs.map((para, idx) => (
              <p key={idx} className="ai-summary-text">
                {para}
              </p>
            ))}
          </div>

          <div className="ai-summary-footer">
            <div className="ai-footer-badge">
              <span className="ai-dot-indicator" aria-hidden="true" />
              <span>Autonomous Repository Synthesis</span>
            </div>
            <button
              type="button"
              className="ai-refresh-btn"
              onClick={generateSummary}
              disabled={isLoading}
              title="Regenerate summary"
            >
              <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} aria-hidden="true" />
              Regenerate
            </button>
          </div>
        </div>
      )}

      {isNotConfigured && (
        <div className="ai-graceful-notice" role="status">
          <Key size={18} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
          <div className="text-left">
            <p className="font-semibold text-sm">AI Summary Not Configured</p>
            <p className="text-xs opacity-80 mt-0.5">
              Set <code className="key-code">API_KEY</code> in <code className="key-code">.env.local</code> to enable AI summaries.
              All visual timelines, charts, and statistics remain completely operational.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="ai-error-notice" role="alert">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" aria-hidden="true" />
          <p className="text-xs flex-1">{error}</p>
          <button
            type="button"
            className="retry-btn text-xs py-1 px-2.5"
            onClick={generateSummary}
          >
            Retry
          </button>
        </div>
      )}
    </section>
  );
}
