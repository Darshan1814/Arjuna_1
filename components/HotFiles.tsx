// [stage-14] feat(analytics): create HotFiles component highlighting frequently modified architectural files
"use client";

import { FileCode, Flame, Info } from "lucide-react";
import type { HotFile } from "@/lib/schemas";
import { PanelLoading, PanelError, PanelEmpty } from "./PanelState";

interface HotFilesProps {
  readonly hotFiles:
    | readonly HotFile[]
    | { readonly status: "skipped"; readonly reason: string }
    | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly onRetry?: () => void;
}

export function HotFiles({
  hotFiles,
  isLoading,
  error,
  onRetry,
}: HotFilesProps): React.JSX.Element {
  if (isLoading) {
    return (
      <section className="card" aria-label="Frequently Changed Files">
        <h3 className="section-title">
          <Flame size={20} className="section-icon text-amber-500" aria-hidden="true" />
          Hot Files
        </h3>
        <PanelLoading message="Analyzing file change frequency..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="card" aria-label="Frequently Changed Files">
        <h3 className="section-title">
          <Flame size={20} className="section-icon text-amber-500" aria-hidden="true" />
          Hot Files
        </h3>
        <PanelError message={error} onRetry={onRetry} />
      </section>
    );
  }

  if (hotFiles && "status" in hotFiles && hotFiles.status === "skipped") {
    return (
      <section className="card hot-files-card" aria-label="Frequently Changed Files">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">
              <Flame size={20} className="section-icon text-amber-500" aria-hidden="true" />
              Hot Files
            </h3>
            <p className="section-subtitle">Frequently modified files in recent commits</p>
          </div>
        </div>
        <div className="panel-state panel-skipped" role="status">
          <Info size={22} className="text-amber-400" aria-hidden="true" />
          <p className="text-sm font-medium">Analysis Deferred</p>
          <p className="text-xs text-zinc-400 max-w-sm text-center">
            {hotFiles.reason || "Skipped to conserve GitHub API rate limit for core features."}
          </p>
        </div>
      </section>
    );
  }

  const files = Array.isArray(hotFiles) ? hotFiles : [];
  if (files.length === 0) {
    return (
      <section className="card" aria-label="Frequently Changed Files">
        <h3 className="section-title">
          <Flame size={20} className="section-icon text-amber-500" aria-hidden="true" />
          Hot Files
        </h3>
        <PanelEmpty message="No file change data available from recent commits." />
      </section>
    );
  }

  const maxChanges = Math.max(...files.map((f) => f.changeCount), 1);

  return (
    <section className="card hot-files-card" aria-label="Frequently Changed Files">
      <div className="section-header-row">
        <div>
          <h3 className="section-title">
            <Flame size={20} className="section-icon text-amber-500" aria-hidden="true" />
            Hot Files
          </h3>
          <p className="section-subtitle">Sampled from recent commit history</p>
        </div>
        <span className="hot-files-badge">Top {files.length}</span>
      </div>

      <div className="hot-files-list">
        {files.map((file, idx) => {
          const share = Math.round((file.changeCount / maxChanges) * 100);
          const parts = file.filename.split("/");
          const fileName = parts.pop() ?? file.filename;
          const dirPath = parts.join("/");

          return (
            <div key={file.filename} className="hot-file-row">
              <div className="hot-file-header">
                <div className="hot-file-name-wrapper">
                  <span className="hot-file-rank">#{idx + 1}</span>
                  <FileCode size={15} className="hot-file-icon" aria-hidden="true" />
                  <span className="hot-file-name" title={file.filename}>
                    {dirPath && <span className="hot-file-dir">{dirPath}/</span>}
                    <strong>{fileName}</strong>
                  </span>
                </div>
                <span className="hot-file-count">
                  {file.changeCount} {file.changeCount === 1 ? "change" : "changes"}
                </span>
              </div>
              <div className="hot-file-bar-wrapper">
                <div
                  className="hot-file-bar"
                  style={{ width: `${Math.max(share, 6)}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
