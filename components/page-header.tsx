import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  action?: ReactNode;
}

export function PageHeader({
  title,
  description,
  className,
  action,
}: PageHeaderProps) {
  return (
    <div
      className={cn("relative pb-4 mb-6 border-b border-border/40", className)}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight gradient-heading relative">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-lg max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

// Add to global.css:
// .gradient-heading::after {
//   content: "";
//   position: absolute;
//   bottom: -2px;
//   left: 0;
//   width: 60px;
//   height: 3px;
//   background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)));
//   border-radius: 9999px;
// }
