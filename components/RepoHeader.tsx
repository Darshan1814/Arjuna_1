/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Star,
  GitFork,
  CircleDot,
  Scale,
  ExternalLink,
  Calendar,
  Eye,
  GitBranch,
  Tag,
} from "lucide-react";
import type { RepoMetadata } from "@/lib/schemas";
import { formatCompactNumber, formatRelativeTime } from "@/lib/format";

interface RepoHeaderProps {
  readonly metadata: RepoMetadata;
}

export function RepoHeader({ metadata }: RepoHeaderProps): React.JSX.Element {
  const repoBaseUrl = metadata.htmlUrl;

  return (
    <section className="card repo-header" aria-label="Repository information">
      <div className="repo-header-top">
        <a
          href={repoBaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open ${metadata.fullName} on GitHub`}
        >
          <img
            src={metadata.ownerAvatarUrl}
            alt={`${metadata.fullName} owner avatar`}
            className="repo-avatar hover:scale-105 transition-transform"
            width={52}
            height={52}
          />
        </a>
        <div className="repo-header-info">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="repo-name">
              <a
                href={repoBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-link"
              >
                {metadata.fullName}
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </h2>
            {metadata.latestRelease && (
              <a
                href={`${repoBaseUrl}/releases/tag/${metadata.latestRelease.tag}`}
                target="_blank"
                rel="noopener noreferrer"
                className="release-badge hover:brightness-110 transition-all"
                title={`Open release ${metadata.latestRelease.tag} on GitHub`}
              >
                <Tag size={11} className="inline mr-1" aria-hidden="true" />
                {metadata.latestRelease.tag}
                <ExternalLink size={10} className="inline ml-1 opacity-70" aria-hidden="true" />
              </a>
            )}
          </div>
          {metadata.description ? (
            <p className="repo-description">{metadata.description}</p>
          ) : null}
        </div>
      </div>

      <div className="repo-stats">
        <div className="stat-badge">
          <Star size={14} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
          <span className="stat-value">{formatCompactNumber(metadata.stars)}</span>
          <span className="stat-name">stars</span>
        </div>

        <div className="stat-badge">
          <GitFork size={14} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
          <span className="stat-value">{formatCompactNumber(metadata.forks)}</span>
          <span className="stat-name">forks</span>
        </div>

        {metadata.watchers !== undefined && (
          <div className="stat-badge">
            <Eye size={14} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
            <span className="stat-value">{formatCompactNumber(metadata.watchers)}</span>
            <span className="stat-name">watchers</span>
          </div>
        )}

        <div className="stat-badge">
          <CircleDot size={14} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
          <span className="stat-value">{formatCompactNumber(metadata.openIssues)}</span>
          <span className="stat-name">issues</span>
        </div>

        <div className="stat-badge">
          <GitBranch size={14} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
          <span className="stat-value">{metadata.defaultBranch}</span>
        </div>

        {metadata.license ? (
          <div className="stat-badge">
            <Scale size={14} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
            <span className="stat-value">{metadata.license}</span>
          </div>
        ) : null}

        <div className="stat-badge">
          <Calendar size={14} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
          <span className="stat-name">Created</span>
          <span className="stat-value">{formatRelativeTime(metadata.createdAt)}</span>
        </div>

        <div className="stat-badge">
          <Calendar size={14} className="text-amber-500 flex-shrink-0" aria-hidden="true" />
          <span className="stat-name">Updated</span>
          <span className="stat-value">{formatRelativeTime(metadata.pushedAt)}</span>
        </div>
      </div>
    </section>
  );
}
