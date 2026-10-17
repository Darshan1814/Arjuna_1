// [stage-7] feat: create PanelState skeleton loader, error banners, and empty state components
"use client";

import { AlertCircle, Loader2, RefreshCw, Clock } from "lucide-react";

interface PanelLoadingProps {
  readonly message?: string;
}

export function PanelLoading({ message = "Loading..." }: PanelLoadingProps): React.JSX.Element {
  return (
    <div className="panel-state" role="status" aria-label="Loading">
      <Loader2 className="animate-spin" size={24} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

interface PanelErrorProps {
  readonly message: string;
  readonly onRetry?: () => void;
}

export function PanelError({ message, onRetry }: PanelErrorProps): React.JSX.Element {
  return (
    <div className="panel-state panel-error" role="alert">
      <AlertCircle size={24} aria-hidden="true" />
      <p>{message}</p>
      {onRetry ? (
        <button onClick={onRetry} className="retry-btn" type="button">
          <RefreshCw size={14} aria-hidden="true" />
          Retry
        </button>
      ) : null}
    </div>
  );
}

interface PanelEmptyProps {
  readonly message: string;
}

export function PanelEmpty({ message }: PanelEmptyProps): React.JSX.Element {
  return (
    <div className="panel-state panel-empty">
      <p>{message}</p>
    </div>
  );
}

interface PanelComputingProps {
  readonly onRetry?: () => void;
}

export function PanelComputing({ onRetry }: PanelComputingProps): React.JSX.Element {
  return (
    <div className="panel-state panel-computing" role="status">
      <Clock size={24} aria-hidden="true" />
      <p>GitHub is still crunching the data. This can take a moment for first-time requests.</p>
      {onRetry ? (
        <button onClick={onRetry} className="retry-btn" type="button">
          <RefreshCw size={14} aria-hidden="true" />
          Try again
        </button>
      ) : null}
    </div>
  );
}
