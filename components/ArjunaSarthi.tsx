// [stage-21] feat(assistant): implement 1-click repo loading action from Arjuna Sarthi recommendations
"use client";

import { useState, useCallback } from "react";
import {
  X,
  Search,
  Star,
  GitFork,
  ArrowRight,
  Loader2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { formatCompactNumber } from "@/lib/format";

interface RecommendedRepo {
  readonly fullName: string;
  readonly description: string | null;
  readonly stars: number;
  readonly forks: number;
  readonly language: string | null;
  readonly htmlUrl: string;
}

interface ArjunaSarthiProps {
  readonly onSelectRepo: (repo: string) => void;
}

const QUICK_TOPICS = [
  "AI Agents & Autonomous Systems",
  "High Performance Rust CLI",
  "Modern Next.js Architecture",
  "Fintech & Payment Gateways",
  "Cybersecurity & Pentesting",
] as const;

export function ArjunaSarthi({ onSelectRepo }: ArjunaSarthiProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [repos, setRepos] = useState<readonly RecommendedRepo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = useCallback(
    async (topicQuery: string) => {
      const q = topicQuery.trim();
      if (!q) return;

      setQuery(q);
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Arjuna Sarthi is momentarily unavailable");
        }

        setAdvice(typeof data.advice === "string" ? data.advice.replace(/\*\*/g, "").replace(/\*/g, "").trim() : null);
        setRepos(data.repositories || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to consult assistant");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleAsk(query);
  };

  const handlePickRepo = (fullName: string) => {
    onSelectRepo(fullName);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Circular FAB on Bottom Right Corner */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="arjuna-fab-btn"
        aria-label="Open Arjuna Sarthi Assistant"
        title="Open Arjuna Sarthi — Intelligent Repo Guide"
      >
        <span className="arjuna-fab-beacon" aria-hidden="true" />
        <span className="arjuna-fab-letter" aria-hidden="true">A</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="arjuna-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer */}
      <aside
        className={`arjuna-drawer ${isOpen ? "arjuna-drawer-open" : ""}`}
        aria-label="Arjuna Sarthi Repository Guide"
        aria-hidden={!isOpen}
      >
        {/* Drawer Header */}
        <div className="arjuna-drawer-header">
          <div className="flex items-center gap-2.5">
            <div className="arjuna-icon-large" aria-hidden="true">
              <span>A</span>
            </div>
            <div>
              <h3 className="arjuna-drawer-title">Arjuna Sarthi</h3>
              <p className="arjuna-drawer-subtitle">Repo Finder</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="arjuna-close-btn"
            aria-label="Close Assistant"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="arjuna-drawer-body">
          {/* Query input */}
          <form onSubmit={handleSubmit} className="arjuna-search-form">
            <Search size={16} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. I want repos for AI agents..."
              className="arjuna-input"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="arjuna-submit-btn"
              aria-label="Search repositories"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ArrowRight size={14} />
              )}
            </button>
          </form>

          {/* Quick topic pills */}
          <div className="arjuna-quick-topics">
            <span className="text-xs text-dim block mb-1 font-medium">
              <Sparkles size={11} className="inline mr-1 text-amber-500" />
              Suggested topics:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => void handleAsk(topic)}
                  className="arjuna-topic-pill"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs mt-3">
              {error}
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-zinc-400 text-sm">
              <div className="arjuna-loading-pulse" />
              <span>Arjuna Sarthi is scouting GitHub...</span>
            </div>
          )}

          {/* Advice Bubble */}
          {!isLoading && advice && (
            <div className="arjuna-advice-card animate-fadeIn">
              <p className="arjuna-advice-text">{advice.replace(/\*\*/g, "").replace(/\*/g, "").trim()}</p>
            </div>
          )}

          {/* Recommended Repositories List */}
          {!isLoading && repos.length > 0 && (
            <div className="arjuna-repo-list animate-fadeIn">
              <span className="arjuna-list-label">
                Recommended Repositories ({repos.length})
              </span>

              {repos.map((repo) => (
                <div key={repo.fullName} className="arjuna-repo-item">
                  <div className="arjuna-repo-item-header">
                    <button
                      type="button"
                      onClick={() => handlePickRepo(repo.fullName)}
                      className="arjuna-repo-name"
                      title="Load this repo into RepoPulse"
                    >
                      {repo.fullName}
                    </button>
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-amber-400"
                      title="View on GitHub"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  {repo.description ? (
                    <p className="arjuna-repo-desc">{repo.description}</p>
                  ) : null}

                  <div className="arjuna-repo-meta">
                    <span className="arjuna-stat">
                      <Star size={11} className="text-amber-500" />
                      {formatCompactNumber(repo.stars)}
                    </span>
                    <span className="arjuna-stat">
                      <GitFork size={11} className="text-amber-500" />
                      {formatCompactNumber(repo.forks)}
                    </span>
                    {repo.language && (
                      <span className="arjuna-lang-badge">{repo.language}</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handlePickRepo(repo.fullName)}
                      className="arjuna-explore-action"
                    >
                      <span>Explore</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
