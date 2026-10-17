/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo } from "react";
import { GitCommit, ExternalLink, Calendar, User, Search } from "lucide-react";
import type { Commit } from "@/lib/schemas";
import { formatRelativeTime, shortSha, truncateMessage } from "@/lib/format";
import { PanelLoading, PanelError, PanelEmpty } from "./PanelState";

interface RecentCommitsProps {
  readonly commits: readonly Commit[] | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly onRetry?: () => void;
}

export function RecentCommits({
  commits,
  isLoading,
  error,
  onRetry,
}: RecentCommitsProps): React.JSX.Element {
  const [filterQuery, setFilterQuery] = useState("");

  const filteredCommits = useMemo(() => {
    if (!commits) return [];
    if (!filterQuery.trim()) return commits;
    const q = filterQuery.toLowerCase();
    return commits.filter(
      (c) =>
        c.message.toLowerCase().includes(q) ||
        (c.authorLogin && c.authorLogin.toLowerCase().includes(q)) ||
        c.sha.toLowerCase().startsWith(q)
    );
  }, [commits, filterQuery]);

  if (isLoading) {
    return (
      <section className="card" aria-label="Recent Commits">
        <h3 className="section-title">
          <GitCommit size={20} className="section-icon text-amber-500" aria-hidden="true" />
          Commit History Feed
        </h3>
        <PanelLoading message="Streaming repository commits..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="card" aria-label="Recent Commits">
        <h3 className="section-title">
          <GitCommit size={20} className="section-icon text-amber-500" aria-hidden="true" />
          Commit History Feed
        </h3>
        <PanelError message={error} onRetry={onRetry} />
      </section>
    );
  }

  if (!commits || commits.length === 0) {
    return (
      <section className="card" aria-label="Recent Commits">
        <h3 className="section-title">
          <GitCommit size={20} className="section-icon text-amber-500" aria-hidden="true" />
          Commit History Feed
        </h3>
        <PanelEmpty message="No commits recorded on this branch." />
      </section>
    );
  }

  return (
    <section className="card recent-commits-card" aria-label="Commit History Feed">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">
            <GitCommit size={20} className="section-icon text-amber-500" aria-hidden="true" />
            Commit History Feed
          </h3>
          <p className="section-subtitle">
            Showing {filteredCommits.length} of {commits.length} commits on default branch
          </p>
        </div>
        <span className="commits-badge">{commits.length} commits</span>
      </div>

      {/* Filter search input */}
      <div className="commits-filter-bar">
        <Search size={14} className="text-zinc-500" aria-hidden="true" />
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter commits by message or author..."
          className="commits-filter-input"
          spellCheck={false}
        />
        {filterQuery && (
          <button
            type="button"
            onClick={() => setFilterQuery("")}
            className="text-xs text-zinc-500 hover:text-zinc-200"
          >
            Clear
          </button>
        )}
      </div>

      <div className="commits-timeline">
        {filteredCommits.map((commit) => (
          <div key={commit.sha} className="commit-item">
            <div className="commit-line-decor" aria-hidden="true">
              <span className="commit-node" />
            </div>
            <div className="commit-content">
              <div className="commit-header">
                <a
                  href={commit.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="commit-sha"
                  title="View commit on GitHub"
                >
                  <code>{shortSha(commit.sha)}</code>
                  <ExternalLink size={11} aria-hidden="true" />
                </a>
                <span className="commit-date" title={commit.date}>
                  <Calendar size={12} className="inline mr-1 opacity-70" aria-hidden="true" />
                  {formatRelativeTime(commit.date)}
                </span>
              </div>

              <p className="commit-message" title={commit.message}>
                {truncateMessage(commit.message, 100)}
              </p>

              <div className="commit-author">
                {commit.authorAvatarUrl ? (
                  <img
                    src={commit.authorAvatarUrl}
                    alt={commit.authorLogin ? `${commit.authorLogin} avatar` : "Author avatar"}
                    className="commit-author-avatar"
                    width={18}
                    height={18}
                    loading="lazy"
                  />
                ) : (
                  <User size={13} className="opacity-60" aria-hidden="true" />
                )}
                <span className="commit-author-name">
                  {commit.authorLogin ?? "Unknown author"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredCommits.length === 0 && (
          <div className="py-6 text-center text-xs text-zinc-500">
            No commits matching &quot;{filterQuery}&quot;
          </div>
        )}
      </div>
    </section>
  );
}
