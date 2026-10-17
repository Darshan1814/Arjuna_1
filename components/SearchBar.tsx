// [stage-43] feat(dashboard): integrate SQLite history chips directly into search experience
"use client";

import { Search, History, ArrowRight, Sparkles } from "lucide-react";
import { useState, useCallback } from "react";
import { parseRepoInput } from "@/lib/parse-repo";

const DEFAULT_EXAMPLES = [
  "vercel/next.js",
  "facebook/react",
  "tailwindlabs/tailwindcss",
  "torvalds/linux",
  "emanuelef/daily-stars-explorer",
] as const;

interface SearchBarProps {
  readonly onSearch: (repo: string) => void;
  readonly initialValue?: string;
  readonly history?: readonly string[];
}

export function SearchBar({
  onSearch,
  initialValue = "",
  history = [],
}: SearchBarProps): React.JSX.Element {
  const [input, setInput] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setInput(initialValue);
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const parsed = parseRepoInput(input);
      if (!parsed) {
        setError("Enter a valid repo: owner/repo or a GitHub URL");
        return;
      }
      setError(null);
      onSearch(`${parsed.owner}/${parsed.repo}`);
    },
    [input, onSearch]
  );

  const handleSelectRepo = useCallback(
    (repo: string) => {
      setInput(repo);
      setError(null);
      onSearch(repo);
    },
    [onSearch]
  );

  // Use top 5 searches from SQLite history if available, else default examples
  const displayChips = history.length > 0 ? history.slice(0, 5) : DEFAULT_EXAMPLES;

  return (
    <section className="hero" aria-label="Repository search">
      <h1 className="hero-title animate-fadeIn">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gitstory-icon.svg"
          alt=""
          width={40}
          height={40}
          className="hero-brand-logo"
        />
        Git<span className="hero-title-accent">Story</span>
      </h1>

      <p className="hero-subtitle animate-fadeIn">
        Activity timeline, contributor statistics, and codebase breakdown for any public GitHub repository.
      </p>

      <form onSubmit={handleSubmit} className="search-form animate-slideUp" role="search">
        <label htmlFor="repo-input" className="sr-only">
          Repository
        </label>
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" aria-hidden="true" />
          <input
            id="repo-input"
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="owner/repo or https://github.com/owner/repo"
            className="search-input"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button type="submit" className="explore-btn">
          <span>Explore</span>
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </form>

      {error ? (
        <p className="search-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="examples animate-fadeIn">
        <span className="examples-label">
          {history.length > 0 ? (
            <>
              <History size={12} className="inline mr-1 text-amber-500" aria-hidden="true" />
              Recent (max 5):
            </>
          ) : (
            <>
              <Sparkles size={12} className="inline mr-1 text-amber-500" aria-hidden="true" />
              Quick explore:
            </>
          )}
        </span>
        <div className="examples-list">
          {displayChips.map((repo) => (
            <button
              key={repo}
              type="button"
              className="example-btn"
              onClick={() => handleSelectRepo(repo)}
            >
              {repo}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
