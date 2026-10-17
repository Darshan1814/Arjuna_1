// [stage-46] perf: implement Suspense boundaries for instant skeleton loading on initial visit
"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";

import type {
  RepoMetadata,
  LanguageEntry,
  WeeklyActivity,
  Contributor,
  Commit,
  HotFile,
} from "@/lib/schemas";

import { SearchBar } from "@/components/SearchBar";
import { RepoHeader } from "@/components/RepoHeader";
import { CommitActivity } from "@/components/CommitActivity";
import { LanguageBreakdown } from "@/components/LanguageBreakdown";
import { ContributorsList } from "@/components/ContributorsList";
import { RecentCommits } from "@/components/RecentCommits";
import { HotFiles } from "@/components/HotFiles";
import { AiSummary } from "@/components/AiSummary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PanelLoading } from "@/components/PanelState";
import { ReadmeViewer } from "@/components/ReadmeViewer";
import { ArjunaSarthi } from "@/components/ArjunaSarthi";

function GithubIcon({ size = 18 }: { readonly size?: number }): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function DashboardContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialRepo = searchParams.get("repo") ?? "vercel/next.js";
  const [currentRepo, setCurrentRepo] = useState<string>(initialRepo);

  // SQLite Search History (Max 5)
  const [history, setHistory] = useState<string[]>([]);

  // Repo & Language state
  const [metadata, setMetadata] = useState<RepoMetadata | null>(null);
  const [languages, setLanguages] = useState<readonly LanguageEntry[] | null>(null);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);

  // Activity & Contributor state
  const [activity, setActivity] = useState<
    readonly WeeklyActivity[] | { readonly status: "computing" } | null
  >(null);
  const [contributors, setContributors] = useState<
    readonly Contributor[] | { readonly status: "computing" } | null
  >(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  // Commits & Hot Files state
  const [commits, setCommits] = useState<readonly Commit[] | null>(null);
  const [hotFiles, setHotFiles] = useState<
    | readonly HotFile[]
    | { readonly status: "skipped"; readonly reason: string }
    | null
  >(null);
  const [commitsLoading, setCommitsLoading] = useState(false);
  const [commitsError, setCommitsError] = useState<string | null>(null);

  // Fetch search history from SQLite API
  const refreshHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.history)) {
          setHistory(data.history);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  const saveToHistory = useCallback(async (repo: string) => {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.history)) {
          setHistory(data.history);
        }
      }
    } catch {
      // Fallback
    }
  }, []);

  const fetchRepoData = useCallback(async (repo: string) => {
    setRepoLoading(true);
    setRepoError(null);
    try {
      const res = await fetch(`/api/repo?repo=${encodeURIComponent(repo)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load repository metadata");
      }
      setMetadata(data.metadata);
      setLanguages(data.languages ?? []);
    } catch (err: unknown) {
      setRepoError(err instanceof Error ? err.message : "Error loading repository");
      setMetadata(null);
      setLanguages(null);
    } finally {
      setRepoLoading(false);
    }
  }, []);

  const fetchActivityData = useCallback(async (repo: string) => {
    setActivityLoading(true);
    setActivityError(null);
    try {
      const res = await fetch(`/api/activity?repo=${encodeURIComponent(repo)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load activity statistics");
      }
      setActivity(data.commitActivity);
      setContributors(data.contributors);
    } catch (err: unknown) {
      setActivityError(err instanceof Error ? err.message : "Error loading activity");
      setActivity(null);
      setContributors(null);
    } finally {
      setActivityLoading(false);
    }
  }, []);

  const fetchCommitsData = useCallback(async (repo: string) => {
    setCommitsLoading(true);
    setCommitsError(null);
    try {
      const res = await fetch(`/api/commits?repo=${encodeURIComponent(repo)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load commit history");
      }
      setCommits(data.commits);
      setHotFiles(data.hotFiles);
    } catch (err: unknown) {
      setCommitsError(err instanceof Error ? err.message : "Error loading commits");
      setCommits(null);
      setHotFiles(null);
    } finally {
      setCommitsLoading(false);
    }
  }, []);

  const loadAll = useCallback(
    (repo: string) => {
      setCurrentRepo(repo);
      router.replace(`?repo=${encodeURIComponent(repo)}`, { scroll: false });
      void saveToHistory(repo);
      void fetchRepoData(repo);
      void fetchActivityData(repo);
      void fetchCommitsData(repo);
    },
    [fetchRepoData, fetchActivityData, fetchCommitsData, saveToHistory, router]
  );

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        void refreshHistory();
        void saveToHistory(initialRepo);
        void fetchRepoData(initialRepo);
        void fetchActivityData(initialRepo);
        void fetchCommitsData(initialRepo);
      }
    }, 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [initialRepo, fetchRepoData, fetchActivityData, fetchCommitsData, refreshHistory, saveToHistory]);

  const handleSearch = useCallback(
    (newRepo: string) => {
      loadAll(newRepo);
    },
    [loadAll]
  );

  return (
    <div className="app-container">
      {/* Arjuna Sarthi AI Assistant on Left */}
      <ArjunaSarthi onSelectRepo={handleSearch} />

      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gitstory-icon.svg"
              alt="GitStory logo"
              width={30}
              height={30}
              className="navbar-brand-logo"
            />
            <span className="brand-title">
              Git<span className="brand-title-accent">Story</span>
            </span>
          </div>

          <div className="navbar-actions">
            <ThemeToggle />
            {/* GitHub icon ONLY visible when repository URL is actively loaded */}
            {metadata ? (
              <a
                href={metadata.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="navbar-link animate-fadeIn"
                aria-label={`View ${metadata.fullName} on GitHub`}
                title={`Open ${metadata.fullName} on GitHub`}
              >
                <GithubIcon size={18} />
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hero & Search with SQLite History */}
        <SearchBar
          onSearch={handleSearch}
          initialValue={currentRepo}
          history={history}
        />

        {/* Global Loading or Error Banner for Repo Metadata */}
        {repoLoading && !metadata && (
          <div className="loading-card card animate-fadeIn">
            <PanelLoading message={`Analyzing telemetry for ${currentRepo}...`} />
          </div>
        )}

        {repoError && (
          <div className="error-banner card animate-shake" role="alert">
            <AlertCircle size={24} className="text-red-400 flex-shrink-0" aria-hidden="true" />
            <div className="error-banner-text">
              <h4>Repository Notice</h4>
              <p>{repoError}</p>
            </div>
            <button
              type="button"
              className="retry-btn ml-auto"
              onClick={() => loadAll(currentRepo)}
            >
              <RefreshCw size={14} aria-hidden="true" />
              Retry
            </button>
          </div>
        )}

        {metadata && (
          <div className="dashboard-grid animate-fadeIn">
            {/* Repo Header with Comprehensive Telemetry */}
            <RepoHeader metadata={metadata} />

            {/* AI Technical Story */}
            <AiSummary
              repo={currentRepo}
              metadata={metadata}
              languages={languages}
              contributors={
                Array.isArray(contributors) ? contributors : null
              }
            />

            {/* Commit Activity Timeline */}
            <CommitActivity
              activity={activity}
              isLoading={activityLoading}
              error={activityError}
              onRetry={() => fetchActivityData(currentRepo)}
            />

            {/* Languages & Contributors row */}
            <div className="two-col-grid">
              <LanguageBreakdown
                languages={languages}
                isLoading={repoLoading}
                error={repoError}
                onRetry={() => fetchRepoData(currentRepo)}
              />

              <ContributorsList
                contributors={contributors}
                isLoading={activityLoading}
                error={activityError}
                onRetry={() => fetchActivityData(currentRepo)}
              />
            </div>

            {/* Hot Files & Recent Commits row */}
            <div className="two-col-grid">
              <HotFiles
                hotFiles={hotFiles}
                isLoading={commitsLoading}
                error={commitsError}
                onRetry={() => fetchCommitsData(currentRepo)}
              />

              <RecentCommits
                commits={commits}
                isLoading={commitsLoading}
                error={commitsError}
                onRetry={() => fetchCommitsData(currentRepo)}
              />
            </div>

            {/* Readme Viewer with AI Summarization */}
            <ReadmeViewer key={currentRepo} repo={currentRepo} />
          </div>
        )}
      </main>

      {/* Footer without empty space */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand flex items-center justify-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gitstory-icon.svg"
              alt=""
              width={16}
              height={16}
              className="inline rounded align-middle"
            />
            <strong>GitStory</strong> — GitHub Repository Intelligence
          </div>
          <p className="footer-subtext">
            Commit activity timeline, language breakdown, and contributor statistics.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
          <PanelLoading message="Initializing RepoPulse..." />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
