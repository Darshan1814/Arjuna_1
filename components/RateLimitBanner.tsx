"use client";

import { ShieldAlert, Zap } from "lucide-react";
import type { RateLimit } from "@/lib/schemas";
import { formatRelativeTime } from "@/lib/format";

interface RateLimitBannerProps {
  readonly rateLimit?: RateLimit;
}

export function RateLimitBanner({ rateLimit }: RateLimitBannerProps): React.JSX.Element | null {
  if (!rateLimit) return null;

  const isLow = rateLimit.remaining <= 10;
  const isExhausted = rateLimit.remaining === 0;
  const resetDate = new Date(rateLimit.resetAt * 1000).toISOString();

  return (
    <div
      className={`rate-limit-banner ${isExhausted ? "rate-limit-exhausted" : isLow ? "rate-limit-warning" : "rate-limit-ok"}`}
      role="status"
      aria-label="GitHub API Rate Limit"
    >
      <div className="rate-limit-content">
        {isLow ? (
          <ShieldAlert size={16} className="rate-limit-icon" aria-hidden="true" />
        ) : (
          <Zap size={16} className="rate-limit-icon" aria-hidden="true" />
        )}
        <span className="rate-limit-text">
          GitHub API: <strong>{rateLimit.remaining}</strong> / {rateLimit.limit} requests remaining
        </span>
        <span className="rate-limit-divider">•</span>
        <span className="rate-limit-reset">
          Resets {formatRelativeTime(resetDate)}
        </span>
      </div>
    </div>
  );
}
