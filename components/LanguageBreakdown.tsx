// [stage-12] feat(analytics): implement LanguageBreakdown donut chart with percentage byte distribution
"use client";

import { useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Code2 } from "lucide-react";
import type { LanguageEntry } from "@/lib/schemas";
import { formatBytes } from "@/lib/format";
import { PanelLoading, PanelError, PanelEmpty } from "./PanelState";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dart: "#00B4AB",
  Lua: "#000080",
  R: "#198CE7",
  Elixir: "#6e4a7e",
  Scala: "#c22d40",
};

const FALLBACK_PALETTE = [
  "#6366f1",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f43f5e",
  "#84cc16",
  "#64748b",
];

interface LanguageBreakdownProps {
  readonly languages: readonly LanguageEntry[] | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly onRetry?: () => void;
}

export function LanguageBreakdown({
  languages,
  isLoading,
  error,
  onRetry,
}: LanguageBreakdownProps): React.JSX.Element {
  const chartData = useMemo(() => {
    if (!languages || languages.length === 0) return [];
    return languages.map((lang, index) => ({
      name: lang.name,
      value: lang.bytes,
      percentage: lang.percentage,
      color:
        LANGUAGE_COLORS[lang.name] ??
        FALLBACK_PALETTE[index % FALLBACK_PALETTE.length],
    }));
  }, [languages]);

  if (isLoading) {
    return (
      <section className="card" aria-label="Languages">
        <h3 className="section-title">
          <Code2 size={20} className="section-icon" aria-hidden="true" />
          Languages Breakdown
        </h3>
        <PanelLoading message="Loading language statistics..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="card" aria-label="Languages">
        <h3 className="section-title">
          <Code2 size={20} className="section-icon" aria-hidden="true" />
          Languages Breakdown
        </h3>
        <PanelError message={error} onRetry={onRetry} />
      </section>
    );
  }

  if (!languages || languages.length === 0) {
    return (
      <section className="card" aria-label="Languages">
        <h3 className="section-title">
          <Code2 size={20} className="section-icon" aria-hidden="true" />
          Languages Breakdown
        </h3>
        <PanelEmpty message="No language data found for this repository." />
      </section>
    );
  }

  return (
    <section className="card languages-card" aria-label="Languages Breakdown">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">
            <Code2 size={20} className="section-icon" aria-hidden="true" />
            Languages Breakdown
          </h3>
          <p className="section-subtitle">Codebase composition by bytes</p>
        </div>
      </div>

      {/* Segmented bar */}
      <div className="language-bar-container" aria-hidden="true">
        <div className="language-bar">
          {chartData.map((lang) => (
            <div
              key={lang.name}
              className="language-bar-segment"
              style={{
                width: `${Math.max(lang.percentage, 1)}%`,
                backgroundColor: lang.color,
              }}
              title={`${lang.name}: ${lang.percentage}%`}
            />
          ))}
        </div>
      </div>

      <div className="languages-content-grid">
        {/* Donut chart */}
        <div className="donut-wrapper" style={{ width: 200, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as {
                      name: string;
                      value: number;
                      percentage: number;
                      color: string;
                    };
                    return (
                      <div className="custom-tooltip">
                        <div className="tooltip-title flex items-center gap-1.5">
                          <span
                            className="inline-block w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: data.color }}
                          />
                          {data.name}
                        </div>
                        <div className="tooltip-value">
                          <strong>{data.percentage}%</strong> ({formatBytes(data.value)})
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend list */}
        <div className="language-legend-list">
          {chartData.map((lang) => (
            <div key={lang.name} className="language-legend-item">
              <span
                className="language-dot"
                style={{ backgroundColor: lang.color }}
                aria-hidden="true"
              />
              <span className="language-name">{lang.name}</span>
              <span className="language-pct">{lang.percentage}%</span>
              <span className="language-bytes">{formatBytes(lang.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
