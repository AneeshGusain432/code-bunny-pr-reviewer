"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

/**
 * Renders the sticky dashboard page header with sidebar trigger and full-width bottom border.
 *
 * @param title - Primary heading (e.g. "Repositories").
 * @param description - Optional subtitle shown below the title.
 * @param children - Optional right-aligned actions or controls.
 * @param className - Optional additional classes.
 * @returns A `<header>` element with sidebar toggle and title block.
 */
export function DashboardHeader({
  title,
  description,
  children,
  className,
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-14 w-full shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-xs transition-[width,height] ease-linear",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {/* Opens/closes the sidebar on smaller screens or icon-collapsed mode */}
        <SidebarTrigger className="-ml-1" />
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-sm font-medium">{title}</h1>
          {description ? (
            <p className="truncate text-xs text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {children ? (
        <div className="flex items-center gap-2">{children}</div>
      ) : null}
    </header>
  );
}
