// [stage-11] feat(analytics): build CommitActivity 52-week velocity timeline using Recharts
"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { GitCommit, TrendingUp, Calendar } from "lucide-react";
import type { WeeklyActivity } from "@/lib/schemas";
import { bucketWeeklyToMonthly } from "@/lib/aggregate";
import { formatCompactNumber } from "@/lib/format";
import { PanelLoading, PanelError, PanelEmpty, PanelComputing } from "./PanelState";

interface CommitActivityProps {
  readonly activity: readonly WeeklyActivity[] | { readonly status: "computing" } | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly onRetry?: () => void;
}

export function CommitActivity({
  activity,
  isLoading,
  error,
  onRetry,
}: CommitActivityProps): React.JSX.Element {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");

  const weeklyData = useMemo(() => {
    if (!activity || "status" in activity) return [];
    return activity.map((w) => {
      const d = new Date(w.week * 1000);
      return {
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        commits: w.total,
        timestamp: w.week,
      };
    });
  }, [activity]);

  const monthlyData = useMemo(() => {
    if (!activity || "status" in activity) return [];
    const monthly = bucketWeeklyToMonthly(activity);
    return monthly.map((m) => {
      const [year, month] = m.month.split("-");
      const d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      return {
        label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        commits: m.total,
      };
    });
  }, [activity]);

  const chartData = viewMode === "weekly" ? weeklyData : monthlyData;

  const totalCommits = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.commits, 0);
  }, [chartData]);

  const peakCommits = useMemo(() => {
    return chartData.reduce((max, item) => Math.max(max, item.commits), 0);
  }, [chartData]);

  if (isLoading) {
    return (
      <section className="card commit-activity-card" aria-label="Commit Activity">
        <h3 className="section-title">
          <GitCommit size={20} className="section-icon" aria-hidden="true" />
          Commit Activity Timeline
        </h3>
        <PanelLoading message="Loading commit activity..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="card commit-activity-card" aria-label="Commit Activity">
        <h3 className="section-title">
          <GitCommit size={20} className="section-icon" aria-hidden="true" />
          Commit Activity Timeline
        </h3>
        <PanelError message={error} onRetry={onRetry} />
      </section>
    );
  }

  if (activity && "status" in activity && activity.status === "computing") {
    return (
      <section className="card commit-activity-card" aria-label="Commit Activity">
        <h3 className="section-title">
          <GitCommit size={20} className="section-icon" aria-hidden="true" />
          Commit Activity Timeline
        </h3>
        <PanelComputing onRetry={onRetry} />
      </section>
    );
  }

  if (!activity || chartData.length === 0 || totalCommits === 0) {
    return (
      <section className="card commit-activity-card" aria-label="Commit Activity">
        <h3 className="section-title">
          <GitCommit size={20} className="section-icon" aria-hidden="true" />
          Commit Activity Timeline
        </h3>
        <PanelEmpty message="No commit activity recorded in the past year." />
      </section>
    );
  }

  return (
    <section className="card commit-activity-card" aria-label="Commit Activity">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">
            <GitCommit size={20} className="section-icon" aria-hidden="true" />
            Commit Activity Timeline
          </h3>
          <p className="section-subtitle">
            Past 52 weeks of repository development velocity
          </p>
        </div>
        <div className="segmented-control" role="group" aria-label="Time resolution">
          <button
            type="button"
            className={`segmented-btn ${viewMode === "weekly" ? "segmented-btn-active" : ""}`}
            onClick={() => setViewMode("weekly")}
            aria-pressed={viewMode === "weekly"}
          >
            Weekly
          </button>
          <button
            type="button"
            className={`segmented-btn ${viewMode === "monthly" ? "segmented-btn-active" : ""}`}
            onClick={() => setViewMode("monthly")}
            aria-pressed={viewMode === "monthly"}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric-badge">
          <span className="metric-label">Total in Period</span>
          <span className="metric-value">{formatCompactNumber(totalCommits)} commits</span>
        </div>
        <div className="metric-badge">
          <span className="metric-label">
            <TrendingUp size={14} className="inline mr-1" aria-hidden="true" />
            Peak ({viewMode})
          </span>
          <span className="metric-value">{formatCompactNumber(peakCommits)} commits</span>
        </div>
        <div className="metric-badge">
          <span className="metric-label">
            <Calendar size={14} className="inline mr-1" aria-hidden="true" />
            Active Periods
          </span>
          <span className="metric-value">
            {chartData.filter((i) => i.commits > 0).length} / {chartData.length}
          </span>
        </div>
      </div>

      <div className="chart-container" style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(150, 150, 150, 0.12)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "rgba(150, 150, 150, 0.2)" }}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              interval={viewMode === "weekly" ? 5 : 0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              tickFormatter={(v: number) => formatCompactNumber(v)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as { label: string; commits: number };
                  return (
                    <div className="custom-tooltip">
                      <div className="tooltip-title">{data.label}</div>
                      <div className="tooltip-value">
                        <span className="tooltip-dot" />
                        <strong>{data.commits}</strong> commits
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#commitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
