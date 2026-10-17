"use client";

import { useState, useCallback } from "react";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  ExternalLink,
  Code,
  BookOpen,
  RefreshCw,
} from "lucide-react";

interface ReadmeViewerProps {
  readonly repo: string;
}

export function ReadmeViewer({ repo }: ReadmeViewerProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "raw">("summary");

  const [readme, setReadme] = useState<{
    name: string;
    content: string;
    htmlUrl: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Fetch README when opened or when repo changes
  const fetchReadme = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/readme?repo=${encodeURIComponent(repo)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load README");
      }
      setReadme(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error loading README");
      setReadme(null);
    } finally {
      setIsLoading(false);
    }
  }, [repo]);

  const handleToggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next && !readme && !isLoading) {
      void fetchReadme();
    }
  };

  const handleSummarize = async () => {
    if (!readme?.content) return;
    setIsSummarizing(true);
    setSummaryError(null);
    try {
      const res = await fetch("/api/readme/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo, content: readme.content }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to summarize README");
      }
      setAiSummary(data.summary);
      setActiveTab("summary");
    } catch (err: unknown) {
      setSummaryError(err instanceof Error ? err.message : "AI synthesis unavailable");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <section className="card readme-card" aria-label="Repository README & AI Documentation">
      {/* Header bar that toggles collapse */}
      <div className="readme-header-row">
        <button
          type="button"
          onClick={handleToggleOpen}
          className="readme-toggle-trigger"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2.5">
            <FileText size={18} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
            <span className="font-bold text-sm tracking-tight text-main">
              {readme?.name ?? "README.md"}
            </span>
            <span className="readme-status-pill">
              Documentation Explorer
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {isOpen && readme && (
          <div className="readme-actions-row">
            <button
              type="button"
              onClick={handleSummarize}
              disabled={isSummarizing}
              className="readme-ai-btn"
            >
              {isSummarizing ? (
                <>
                  <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} className="text-amber-400" aria-hidden="true" />
                  <span>{aiSummary ? "Regenerate Summary" : "Summarize with AI"}</span>
                </>
              )}
            </button>

            <a
              href={readme.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="readme-ext-link"
              title="Open raw README on GitHub"
            >
              <span>GitHub</span>
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      {/* Expanded Content Body */}
      {isOpen && (
        <div className="readme-body animate-fadeIn">
          {isLoading && (
            <div className="py-8 flex flex-col items-center justify-center gap-2 text-zinc-400 text-sm">
              <Loader2 size={20} className="animate-spin text-amber-500" aria-hidden="true" />
              <span>Fetching repository documentation...</span>
            </div>
          )}

          {error && (
            <div className="py-6 text-center text-red-400 text-xs">
              <p>{error}</p>
              <button
                type="button"
                onClick={fetchReadme}
                className="retry-btn mt-2 inline-flex items-center gap-1.5"
              >
                <RefreshCw size={12} />
                Retry
              </button>
            </div>
          )}

          {readme && !isLoading && (
            <>
              {/* Tab Navigation if AI summary exists */}
              {aiSummary && (
                <div className="readme-tabs" role="tablist">
                  <button
                    type="button"
                    className={`readme-tab ${activeTab === "summary" ? "readme-tab-active" : ""}`}
                    onClick={() => setActiveTab("summary")}
                    role="tab"
                    aria-selected={activeTab === "summary"}
                  >
                    <BookOpen size={13} aria-hidden="true" />
                    AI Executive Brief
                  </button>
                  <button
                    type="button"
                    className={`readme-tab ${activeTab === "raw" ? "readme-tab-active" : ""}`}
                    onClick={() => setActiveTab("raw")}
                    role="tab"
                    aria-selected={activeTab === "raw"}
                  >
                    <Code size={13} aria-hidden="true" />
                    Full Document
                  </button>
                </div>
              )}

              {/* AI Summary Tab */}
              {activeTab === "summary" && aiSummary && (
                <div className="readme-summary-view animate-fadeIn">
                  <div className="readme-summary-text">
                    {aiSummary.split("\n\n").map((chunk, idx) => (
                      <p key={idx} className="mb-3 leading-relaxed">
                        {chunk}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw README Tab */}
              {(activeTab === "raw" || !aiSummary) && (
                <div className="readme-content-scroll">
                  <pre className="readme-pre">
                    <code>{readme.content}</code>
                  </pre>
                </div>
              )}

              {summaryError && (
                <p className="mt-2 text-xs text-red-400 text-center">{summaryError}</p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
