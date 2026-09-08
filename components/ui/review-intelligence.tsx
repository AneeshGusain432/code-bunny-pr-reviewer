
"use client";

import {
  Bug,
  CheckCircle,
  Gauge,
  LockKey,
  ShieldCheck,
  Sparkle,
  Wrench,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

const REVIEW_AREAS = [
  {
    number: "01",
    title: "Correctness",
    description:
      "Catch logic errors, incorrect assumptions, edge cases, and broken behavior before they reach production.",
    icon: Bug,
  },
  {
    number: "02",
    title: "Security",
    description:
      "Spot authentication issues, injection risks, exposed secrets, unsafe input, and insecure handling of data.",
    icon: LockKey,
  },
  {
    number: "03",
    title: "Performance",
    description:
      "Identify unnecessary work, inefficient queries, N+1 patterns, memory issues, and avoidable bottlenecks.",
    icon: Gauge,
  },
  {
    number: "04",
    title: "Reliability",
    description:
      "Surface missing null checks, unhandled errors, race conditions, and failure paths that are easy to miss.",
    icon: ShieldCheck,
  },
  {
    number: "05",
    title: "Readability",
    description:
      "Find confusing logic, unclear naming, and complexity that makes code harder for your team to understand.",
    icon: CheckCircle,
  },
  {
    number: "06",
    title: "Maintainability",
    description:
      "Flag duplication, tight coupling, unnecessary complexity, and patterns that make future changes harder.",
    icon: Wrench,
  },
];

export function ReviewIntelligence() {
  return (
    <section
      id="features"
      className="relative border-border px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-1.5 border border-border bg-muted/30 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.17em] text-muted-foreground">
              <Sparkle
                weight="fill"
                className="size-3 text-primary"
              />
              Review intelligence
            </div>

            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              More than a diff.
              <br />
              <span className="text-muted-foreground">
                A deeper review.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground lg:ml-auto sm:text-base sm:leading-7">
            Code Bunny reviews the parts of a change that matter to your
            engineering team — from correctness and security to reliability
            and maintainability.
          </p>
        </div>

        {/* Review matrix */}
        <div className="mt-12 border border-border">
          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            {REVIEW_AREAS.map((area, index) => {
              const Icon = area.icon;

              return (
                <div
                  key={area.number}
                  className={cn(
                    "group relative min-h-[190px] p-5 transition-colors duration-200",
                    "hover:bg-muted/[0.18]",
                    index % 2 !== 0 && "md:border-l md:border-border",
                    index >= 2 && "md:border-t md:border-border",
                    index >= 3 && "lg:border-t-0",
                    index > 0 && index % 3 !== 0 && "lg:border-l lg:border-border",
                    index >= 3 && "lg:border-t lg:border-border",
                  )}
                >
                  {/* top row */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      {area.number}
                    </span>

                    <div className="flex size-8 items-center justify-center border border-border bg-muted/20 transition-colors group-hover:border-primary/30 group-hover:bg-primary/[0.05]">
                      <Icon
                        weight="regular"
                        className="size-4 text-muted-foreground transition-colors group-hover:text-primary"
                      />
                    </div>
                  </div>

                  {/* content */}
                  <div className="mt-7">
                    <h3 className="text-sm font-semibold tracking-tight">
                      {area.title}
                    </h3>

                    <p className="mt-2 max-w-sm text-[11px] leading-5 text-muted-foreground">
                      {area.description}
                    </p>
                  </div>

                  {/* tiny accent line */}
                  <div className="absolute bottom-0 left-5 h-px w-0 bg-primary transition-all duration-300 group-hover:w-10" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-8 flex flex-col gap-4 border border-border bg-muted/[0.08] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center border border-primary/20 bg-primary/[0.06]">
              <Sparkle
                weight="fill"
                className="size-3.5 text-primary"
              />
            </div>

            <div>
              <p className="text-xs font-medium">
                Review the change in context.
              </p>

              <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
                Relevant repository context helps Code Bunny make more useful,
                proportional suggestions instead of noisy generic feedback.
              </p>
            </div>
          </div>

          <div className="shrink-0 font-mono text-[10px] text-muted-foreground">
            diff + context → review
          </div>
        </div>
      </div>
    </section>
  );
}

