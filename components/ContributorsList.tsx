/* eslint-disable @next/next/no-img-element */
"use client";

import { Users, ExternalLink, Plus, Minus } from "lucide-react";
import type { Contributor } from "@/lib/schemas";
import { formatCompactNumber } from "@/lib/format";
import { PanelLoading, PanelError, PanelEmpty, PanelComputing } from "./PanelState";

interface ContributorsListProps {
  readonly contributors: readonly Contributor[] | { readonly status: "computing" } | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly onRetry?: () => void;
}

export function ContributorsList({
  contributors,
  isLoading,
  error,
  onRetry,
}: ContributorsListProps): React.JSX.Element {
  if (isLoading) {
    return (
      <section className="card" aria-label="Contributors">
        <h3 className="section-title">
          <Users size={20} className="section-icon" aria-hidden="true" />
          Top Contributors
        </h3>
        <PanelLoading message="Loading contributors..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="card" aria-label="Contributors">
        <h3 className="section-title">
          <Users size={20} className="section-icon" aria-hidden="true" />
          Top Contributors
        </h3>
        <PanelError message={error} onRetry={onRetry} />
      </section>
    );
  }

  if (contributors && "status" in contributors && contributors.status === "computing") {
    return (
      <section className="card" aria-label="Contributors">
        <h3 className="section-title">
          <Users size={20} className="section-icon" aria-hidden="true" />
          Top Contributors
        </h3>
        <PanelComputing onRetry={onRetry} />
      </section>
    );
  }

  const list = Array.isArray(contributors) ? contributors : [];
  if (list.length === 0) {
    return (
      <section className="card" aria-label="Contributors">
        <h3 className="section-title">
          <Users size={20} className="section-icon" aria-hidden="true" />
          Top Contributors
        </h3>
        <PanelEmpty message="No contributor statistics available." />
      </section>
    );
  }

  const maxCommits = Math.max(...list.map((c) => c.totalCommits), 1);

  return (
    <section className="card contributors-card" aria-label="Top Contributors">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">
            <Users size={20} className="section-icon" aria-hidden="true" />
            Top Contributors
          </h3>
          <p className="section-subtitle">Ranked by commits with additions / deletions</p>
        </div>
        <span className="contributors-badge">Top {list.length}</span>
      </div>

      <div className="contributors-list">
        {list.map((c, index) => {
          const share = Math.round((c.totalCommits / maxCommits) * 100);
          return (
            <div key={c.login} className="contributor-row">
              <span className="contributor-rank">{index + 1}</span>
              <img
                src={c.avatarUrl}
                alt={`${c.login} avatar`}
                className="contributor-avatar"
                width={36}
                height={36}
                loading="lazy"
              />
              <div className="contributor-details">
                <div className="contributor-header">
                  <a
                    href={`https://github.com/${c.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contributor-name"
                  >
                    {c.login}
                    <ExternalLink size={12} className="inline ml-1 opacity-60" aria-hidden="true" />
                  </a>
                  <span className="contributor-commits">
                    <strong>{formatCompactNumber(c.totalCommits)}</strong> commits
                  </span>
                </div>

                <div className="contributor-bar-wrapper">
                  <div
                    className="contributor-bar"
                    style={{ width: `${Math.max(share, 4)}%` }}
                    aria-hidden="true"
                  />
                </div>

                {(c.additions > 0 || c.deletions > 0) && (
                  <div className="contributor-diff">
                    <span className="diff-add">
                      <Plus size={11} aria-hidden="true" />
                      {formatCompactNumber(c.additions)}
                    </span>
                    <span className="diff-del">
                      <Minus size={11} aria-hidden="true" />
                      {formatCompactNumber(c.deletions)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
