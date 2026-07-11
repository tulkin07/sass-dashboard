import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  message = "Something went wrong",
  onRetry,
  retryLabel = "Retry",
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-12 text-center"
      role="alert"
      aria-live="polite"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
