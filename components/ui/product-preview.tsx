"use client";

import {
  Pulse,
  CheckCircle,
  Database,
  GitBranch,
  GitPullRequest,
  Lightning,
  Sparkle,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

const recentPullRequests = [
  {
    number: "#184",
    title: "Improve authentication flow",
    repo: "acme/backend",
    author: "@aneesh",
    commit: "a82f91c",
    status: "Reviewed",
  },
  {
    number: "#183",
    title: "Add repository indexing",
    repo: "acme/api",
    author: "@sarah",
    commit: "91fa241",
    status: "Processing",
  },
  {
    number: "#181",
    title: "Refactor request validation",
    repo: "acme/web",
    author: "@john",
    commit: "7b31d20",
    status: "Reviewed",
  },
];

const activity = [2, 3, 1, 4, 3, 6, 5, 7, 4, 8, 6, 9, 7, 10];

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  iconClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  iconClassName?: string;
}) {
  return (
    <div className="border-border p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>

        <Icon className={cn("size-3.5", iconClassName)} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <span className="font-mono text-2xl font-semibold tracking-tight">
          {value}
        </span>

        <span className="text-[10px] text-muted-foreground">
          {detail}
        </span>
      </div>
    </div>
  );
}

function ActivityChart() {
  const max = Math.max(...activity);

  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
        <div>
          <p className="text-xs font-semibold">
            Review activity
          </p>

          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Pull requests reviewed over the last 14 days
          </p>
        </div>

        <div className="text-right">
          <p className="font-mono text-sm font-semibold">72</p>
          <p className="text-[9px] text-muted-foreground">
            total reviews
          </p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex h-36 items-end gap-1.5">
          {activity.map((value, index) => {
            const height = Math.max(8, (value / max) * 100);

            return (
              <div
                key={index}
                className="flex h-full flex-1 items-end"
              >
                <div
                  className={cn(
                    "w-full rounded-[1px] transition-all duration-500",
                    index === activity.length - 1
                      ? "bg-primary"
                      : "bg-primary/25",
                  )}
                  style={{ height: `${height}%` }}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex justify-between text-[9px] text-muted-foreground">
          <span>Aug 25</span>
          <span>Sep 7</span>
        </div>
      </div>
    </div>
  );
}

function PullRequestTable() {
  return (
    <div className="overflow-hidden border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-3">
        <div>
          <p className="text-xs font-semibold">
            Recent pull requests
          </p>

          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Latest reviews processed by Code Bunny
          </p>
        </div>

        <span className="text-[9px] text-muted-foreground">
          View all →
        </span>
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-[1.3fr_1fr_0.75fr_0.8fr_0.75fr] border-b border-border px-4 py-2.5">
          <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Pull Request
          </span>

          <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Repository
          </span>

          <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Author
          </span>

          <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Commit
          </span>

          <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            Status
          </span>
        </div>

        {recentPullRequests.map((pr) => (
          <div
            key={pr.number}
            className="grid grid-cols-[1.3fr_1fr_0.75fr_0.8fr_0.75fr] items-center border-b border-border px-4 py-3 last:border-b-0"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {pr.number}
                </span>

                <span className="truncate text-[10px] font-medium">
                  {pr.title}
                </span>
              </div>
            </div>

            <span className="truncate text-[10px] text-muted-foreground">
              {pr.repo}
            </span>

            <span className="text-[10px] text-muted-foreground">
              {pr.author}
            </span>

            <span className="font-mono text-[10px] text-muted-foreground">
              {pr.commit}
            </span>

            <StatusBadge status={pr.status} />
          </div>
        ))}
      </div>

      <div className="divide-y divide-border md:hidden">
        {recentPullRequests.map((pr) => (
          <div key={pr.number} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {pr.number}
                  </span>

                  <span className="truncate text-[10px] font-medium">
                    {pr.title}
                  </span>
                </div>

                <p className="mt-1 text-[9px] text-muted-foreground">
                  {pr.repo} · {pr.author}
                </p>
              </div>

              <StatusBadge status={pr.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const reviewed = status === "Reviewed";

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-md border px-2 py-1 text-[9px] font-medium",
        reviewed
          ? "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400"
          : "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400",
      )}
    >
      {reviewed ? (
        <CheckCircle className="size-3" weight="fill" />
      ) : (
        <span className="size-1.5 animate-pulse rounded-full bg-blue-500" />
      )}

      {status}
    </span>
  );
}

export function ProductPreview() {
  return (
    <section
      id="product"
      className="border-border px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-1.5 border border-border bg-muted/30 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.17em] text-muted-foreground">
              <Pulse
                className="size-3 text-primary"
                weight="fill"
              />
              Product overview
            </div>

            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Everything in one place.
              <br />
              <span className="text-muted-foreground">
                Nothing extra.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground lg:ml-auto sm:text-base sm:leading-7">
            Track your repositories, pull requests, review activity, and
            usage from the same workspace that powers your automated reviews.
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="mt-12 overflow-hidden border border-border bg-background">
          {/* window header */}
          <div className="flex h-11 items-center justify-between border-b border-border bg-muted/30 px-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-destructive/50" />
              <span className="size-2 rounded-full bg-chart-1/50" />
              <span className="size-2 rounded-full bg-chart-3/50" />

              <div className="ml-2 h-4 w-px bg-border" />

              <span className="text-[10px] font-medium text-muted-foreground">
                codebunny / overview
              </span>
            </div>

            <span className="hidden text-[9px] text-muted-foreground sm:block">
              workspace
            </span>
          </div>

          {/* metrics */}
          <div className="grid border-b border-border sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
            <Metric
              icon={Lightning}
              label="Monthly usage"
              value="42"
              detail="/ 50 reviews"
              iconClassName="text-primary"
            />

            <Metric
              icon={GitPullRequest}
              label="Pull requests"
              value="184"
              detail="142 reviewed"
              iconClassName="text-green-500"
            />

            <Metric
              icon={Database}
              label="Indexed codebases"
              value="12"
              detail="24.8k chunks"
              iconClassName="text-purple-500"
            />

            <Metric
              icon={Sparkle}
              label="Review engine"
              value="Active"
              detail="listening"
              iconClassName="text-primary"
            />
          </div>

          {/* charts + quick state */}
          <div className="grid gap-4 p-4 lg:grid-cols-[1.5fr_0.5fr]">
            <ActivityChart />

            <div className="border border-border bg-card">
              <div className="border-b border-border bg-muted/20 px-4 py-3">
                <p className="text-xs font-semibold">
                  Repository status
                </p>

                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Connected codebases
                </p>
              </div>

              <div className="space-y-0 divide-y divide-border">
                {[
                  ["acme/backend", "Synced", "12.4k"],
                  ["acme/api", "Synced", "8.1k"],
                  ["acme/web", "Syncing", "4.3k"],
                ].map(([repo, status, chunks]) => (
                  <div
                    key={repo}
                    className="flex items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[10px] font-medium">
                        {repo}
                      </p>

                      <p className="mt-0.5 text-[9px] text-muted-foreground">
                        {chunks} chunks
                      </p>
                    </div>

                    <span
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1.5 text-[9px] font-medium",
                        status === "Synced"
                          ? "text-green-500"
                          : "text-primary",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          status === "Synced"
                            ? "bg-green-500"
                            : "animate-pulse bg-primary",
                        )}
                      />

                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent PRs */}
          <div className="p-4 pt-0">
            <PullRequestTable />
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-5 flex flex-col gap-2 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle
              className="size-3 text-green-500"
              weight="fill"
            />
            Same workspace. Same review pipeline.
          </span>

          <span className="font-mono text-muted-foreground/60">
            overview
          </span>
        </div>
      </div>
    </section>
  );
}