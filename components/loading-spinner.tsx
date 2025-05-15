import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
  message?: string;
}

export function LoadingSpinner({
  size = "medium",
  className,
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-3",
    large: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div
          className={cn(
            "animate-spin rounded-full border-solid border-t-transparent",
            sizeClasses[size],
            className || "border-primary"
          )}
        />
        <div
          className={cn(
            "absolute top-0 left-0 animate-pulse opacity-50 rounded-full",
            sizeClasses[size],
            "border border-accent/30"
          )}
        />
      </div>
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
}
