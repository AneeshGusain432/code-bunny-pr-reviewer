"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CircleNotch,
  Code,
  GitPullRequest,
  GithubLogo,
  MagnifyingGlass,
  Warning,
  Sparkle,
  Database,
  ChatCircleText,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type ShowcaseItem = {
  id: string;
  number: string;
  title: string;
  description: string;
};

const showcaseItems: ShowcaseItem[] = [
  {
    id: "review",
    number: "01",
    title: "Review every PR automatically",
    description:
      "Code Bunny analyzes every pull request and posts actionable findings directly where your team works.",
  },
  {
    id: "context",
    number: "02",
    title: "Understand your codebase",
    description:
      "Relevant PR changes are combined with repository context so reviews understand more than the diff.",
  },
  {
    id: "prioritize",
    number: "03",
    title: "Prioritize what matters",
    description:
      "Surface the issues that actually deserve attention instead of overwhelming developers with noise.",
  },
  {
    id: "continuous",
    number: "04",
    title: "Keep your codebase healthy",
    description:
      "Every new PR becomes another automated checkpoint for your engineering team.",
  },
];

export default function ProductShowcase() {
  const [active, setActive] = useState("review");
  const [paused, setPaused] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const activeIndex = showcaseItems.findIndex((item) => item.id === active);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActive((current) => {
        const index = showcaseItems.findIndex((item) => item.id === current);

        return showcaseItems[(index + 1) % showcaseItems.length].id;
      });
    }, 6500);

    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (!progressRef.current) return;

    progressRef.current.style.animation = "none";

    // Force browser reflow so the animation restarts.
    void progressRef.current.offsetWidth;

    progressRef.current.style.animation = paused
      ? "none"
      : "codeBunnyProgress 6.5s linear forwards";
  }, [active, paused]);

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden  bg-background"
    >

      <style jsx global>{`
        @keyframes codeBunnyProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        @keyframes codeBunnyFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes codeBunnyPulse {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes codeBunnyScan {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(300%);
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        {/* ───────────────── HEADER ───────────────── */}

        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 border border-border bg-muted/30 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <Sparkle className="size-3.5 text-primary" weight="fill" />
            Code intelligence for every PR
          </div>

          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Your code deserves a
            <span className="text-primary"> second pair of eyes.</span>
          </h2>

          <p className="mt-5 text-sm leading-6 text-muted-foreground sm:text-base">
            Code Bunny follows your pull requests from GitHub to review,
            context, and actionable feedback without slowing your team down.
          </p>
        </div>

        {/* ───────────────── SHOWCASE ───────────────── */}

        <div
          className="relative overflow-hidden border border-border bg-card/40"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* top feature navigation */}

          <div className="grid grid-cols-1 border-b border-border sm:grid-cols-2 lg:grid-cols-4">
            {showcaseItems.map((item, index) => {
              const isActive = item.id === active;

              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActive(item.id)}
                  onFocus={() => setActive(item.id)}
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "group relative min-h-[76px] border-b border-border px-5 py-4 text-left transition-colors sm:border-r last:border-r-0 lg:border-b-0",
                    index >= 2 && "sm:border-b-0",
                    isActive
                      ? "bg-muted/35"
                      : "bg-transparent hover:bg-muted/20"
                  )}
                >
                  {/* active orange line */}
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden bg-border">
                      <div
                        ref={index === activeIndex ? progressRef : undefined}
                        className="h-full bg-primary"
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "pt-0.5 font-mono text-[10px] transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground/60"
                      )}
                    >
                      {item.number}
                    </span>

                    <div>
                      <div
                        className={cn(
                          "text-xs font-semibold transition-colors sm:text-sm",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {item.title}
                      </div>

                      <div className="mt-1 hidden text-[11px] text-muted-foreground/70 lg:block">
                        {isActive ? item.description : "Explore feature →"}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ───────────────── CONTENT ───────────────── */}

          <div className="min-h-[540px]">
            {active === "review" && <ReviewLayout />}
            {active === "context" && <ContextLayout />}
            {active === "prioritize" && <PrioritizeLayout />}
            {active === "continuous" && <ContinuousLayout />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   01 — AUTOMATIC PR REVIEW
========================================================= */

function ReviewLayout() {
  return (
    <div className="grid min-h-[540px] lg:grid-cols-[190px_1fr]">
      {/* fake sidebar */}

      <div className="hidden border-r border-border bg-muted/10 p-4 lg:block">
        <div className="mb-7 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GithubLogo size={18} weight="fill" />
          </div>

          <span className="font-mono text-[10px] font-semibold">
            codebunny
          </span>
        </div>

        <div className="space-y-1">
          <SidebarItem
            icon={<GitPullRequest />}
            label="Pull requests"
            active
          />
          <SidebarItem
            icon={<MagnifyingGlass />}
            label="Reviews"
          />
          <SidebarItem
            icon={<Database />}
            label="Repository"
          />
        </div>
      </div>

      {/* PR */}

      <div className="p-5 sm:p-8 lg:p-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
                OPEN
              </span>

              <span className="font-mono text-[10px] text-muted-foreground">
                acme/web-app #482
              </span>
            </div>

            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Add invitation API and emails
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              8 files changed · 126 additions · 31 deletions
            </p>
          </div>

          <div className="flex items-center gap-2 border border-border px-3 py-2 text-xs">
            <CircleNotch
              className="size-3.5 animate-spin text-primary"
              weight="bold"
            />
            Code Bunny reviewing
          </div>
        </div>

        {/* review comment */}

        <div
          className="border border-border bg-muted/15"
          style={{
            animation: "codeBunnyFadeUp .5s ease-out",
          }}
        >
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkle size={15} weight="fill" />
            </div>

            <div>
              <span className="text-xs font-semibold">codebunny[bot]</span>
              <span className="ml-2 text-[10px] text-muted-foreground">
                automated review
              </span>
            </div>

            <span className="ml-auto rounded-full border border-border px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
              AI REVIEW
            </span>
          </div>

          <div className="space-y-5 p-5">
            <div className="inline-flex items-center gap-2 border border-border bg-background px-3 py-2 text-xs font-medium">
              <Warning
                size={15}
                weight="fill"
                className="text-yellow-500"
              />
              Potential issue
              <span className="text-primary">· Major</span>
            </div>

            <div>
              <h4 className="text-sm font-semibold">
                Expired sessions can reach the authentication layer.
              </h4>

              <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground">
                The session is issued without checking whether the existing
                token has expired. This can result in an invalid authenticated
                session being created.
              </p>
            </div>

            {/* diff */}

            <div className="overflow-hidden border border-border font-mono text-[10px] sm:text-[11px]">
              <div className="border-b border-border bg-muted/40 px-3 py-2 text-muted-foreground">
                src/server/auth/session.ts
              </div>

              <div className="bg-red-500/[0.07] px-3 py-2 text-red-400">
                − return issueSession(payload.userId);
              </div>

              <div className="bg-green-500/[0.07] px-3 py-2 text-green-400">
                + if (payload.expiresAt &lt;= Date.now()) return null;
              </div>

              <div className="bg-green-500/[0.07] px-3 py-2 text-green-400">
                + return issueSession(payload.userId);
              </div>
            </div>

            <button className="inline-flex items-center gap-2 text-xs font-medium text-primary transition-colors hover:text-primary/80">
              View suggested fix
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   02 — REPOSITORY CONTEXT
========================================================= */

function ContextLayout() {
  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2">
          <Database className="size-4 text-primary" weight="duotone" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Repository context
          </span>
        </div>

        <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Reviews that understand more than the diff.
        </h3>

        <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground">
          Code Bunny can search synced repository context alongside the current
          pull request before generating its review.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        {/* vector flow */}

        <div className="relative overflow-hidden border border-border bg-muted/10 p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-mono text-[10px] text-muted-foreground">
              CONTEXT PIPELINE
            </span>

            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              indexed
            </span>
          </div>

          <div className="space-y-3">
            <PipelineRow
              icon={<GitPullRequest />}
              title="Current PR"
              value="8 changed files"
            />

            <PipelineRow
              icon={<Code />}
              title="PR chunks"
              value="42 code chunks"
            />

            <PipelineRow
              icon={<Database />}
              title="Repository vectors"
              value="1,284 indexed"
            />

            <PipelineRow
              icon={<MagnifyingGlass />}
              title="Relevant context"
              value="10 matches"
              active
            />
          </div>

          {/* scanning line */}

          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 overflow-hidden opacity-20">
            <div
              className="h-full w-10 bg-primary blur-xl"
              style={{
                animation: "codeBunnyScan 3s linear infinite",
              }}
            />
          </div>
        </div>

        {/* context result */}

        <div className="border border-border bg-muted/10 p-5">
          <div className="mb-5 flex items-center gap-2">
            <MagnifyingGlass className="size-4 text-primary" />

            <span className="font-mono text-[10px]">
              SEARCH RESULT
            </span>
          </div>

          <div className="space-y-3">
            {[
              "src/server/auth/session.ts",
              "src/server/auth/permissions.ts",
              "src/features/users/service.ts",
            ].map((file, index) => (
              <div
                key={file}
                className="border border-border bg-background p-3"
              >
                <div className="flex items-center gap-2">
                  <Code className="size-3 text-muted-foreground" />

                  <span className="truncate font-mono text-[9px]">
                    {file}
                  </span>
                </div>

                <div className="mt-2 h-1 overflow-hidden bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${90 - index * 17}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   03 — PRIORITIZATION
========================================================= */

function PrioritizeLayout() {
  const rows = [
    {
      priority: "P0",
      title: "Authentication bypass",
      repo: "web-app",
      risk: "Critical",
      confidence: "98%",
    },
    {
      priority: "P1",
      title: "Expired session accepted",
      repo: "api",
      risk: "High",
      confidence: "94%",
    },
    {
      priority: "P2",
      title: "Missing validation",
      repo: "dashboard",
      risk: "Medium",
      confidence: "88%",
    },
    {
      priority: "P2",
      title: "Unused response field",
      repo: "web-app",
      risk: "Low",
      confidence: "81%",
    },
  ];

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Warning className="size-4 text-primary" weight="duotone" />

            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Review intelligence
            </span>
          </div>

          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Find the issues worth fixing first.
          </h3>
        </div>

        <div className="border border-border px-3 py-2 font-mono text-[10px] text-muted-foreground">
          12 PRs · 7 findings
        </div>
      </div>

      <div className="overflow-x-auto border border-border">
        <div className="min-w-[650px]">
          <div className="grid grid-cols-[80px_1fr_130px_110px_100px] border-b border-border bg-muted/20 px-4 py-3 text-[9px] uppercase tracking-wider text-muted-foreground">
            <span>Priority</span>
            <span>Finding</span>
            <span>Repository</span>
            <span>Risk</span>
            <span>Confidence</span>
          </div>

          {rows.map((row, index) => (
            <div
              key={row.title}
              className={cn(
                "grid grid-cols-[80px_1fr_130px_110px_100px] items-center px-4 py-4 text-xs transition-colors hover:bg-muted/20",
                index !== rows.length - 1 && "border-b border-border"
              )}
            >
              <span
                className={cn(
                  "inline-flex w-fit items-center gap-1.5 border px-2 py-1 font-mono text-[9px]",
                  row.priority === "P0"
                    ? "border-red-500/30 text-red-400"
                    : row.priority === "P1"
                      ? "border-yellow-500/30 text-yellow-500"
                      : "border-border text-muted-foreground"
                )}
              >
                {row.priority}
              </span>

              <div>
                <div className="font-medium">{row.title}</div>
                <div className="mt-1 text-[9px] text-muted-foreground">
                  Needs developer attention
                </div>
              </div>

              <span className="font-mono text-[10px] text-muted-foreground">
                {row.repo}
              </span>

              <span className="flex items-center gap-2 text-[10px]">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    row.risk === "Critical"
                      ? "bg-red-500"
                      : row.risk === "High"
                        ? "bg-yellow-500"
                        : "bg-primary"
                  )}
                />
                {row.risk}
              </span>

              <span className="font-mono text-[10px] text-muted-foreground">
                {row.confidence}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   04 — CONTINUOUS HEALTH
========================================================= */

function ContinuousLayout() {
  const dots = Array.from({ length: 180 });

  return (
    <div className="p-5 sm:p-8 lg:p-10">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Check className="size-4 text-primary" weight="bold" />

            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Codebase health
            </span>
          </div>

          <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Every PR becomes a checkpoint.
          </h3>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Scanning automatically
        </div>
      </div>

      <div className="border border-border bg-muted/10 p-5 sm:p-7">
        <div className="mb-5 flex items-end justify-between gap-5">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Current status
            </div>

            <div className="mt-1 text-2xl font-semibold tracking-tight">
              Mostly healthy
            </div>
          </div>

          <div className="hidden text-right sm:block">
            <div className="font-mono text-[9px] text-muted-foreground">
              LAST REVIEW
            </div>
            <div className="mt-1 text-xs">just now</div>
          </div>
        </div>

        <div className="mb-5 flex h-1 overflow-hidden bg-muted">
          <div className="w-[74%] bg-primary" />
          <div className="w-[16%] bg-yellow-500/80" />
          <div className="flex-1 bg-red-500/70" />
        </div>

        <div className="relative grid grid-cols-12 gap-2 overflow-hidden border border-border bg-background p-5 sm:grid-cols-18">
          {dots.map((_, index) => {
            const issue =
              index === 23 ||
              index === 61 ||
              index === 109 ||
              index === 145;

            const warning =
              index === 37 ||
              index === 82 ||
              index === 128;

            return (
              <span
                key={index}
                className={cn(
                  "aspect-square size-2 rounded-full transition-transform duration-300 hover:scale-150 sm:size-2.5",
                  issue
                    ? "bg-red-400"
                    : warning
                      ? "bg-yellow-400"
                      : "bg-primary/80"
                )}
              />
            );
          })}

          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent opacity-40" />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <HealthStat label="Reviewed" value="128" />
          <HealthStat label="Issues found" value="14" />
          <HealthStat label="Critical" value="2" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-[10px] transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </div>
  );
}

function PipelineRow({
  icon,
  title,
  value,
  active = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border px-4 py-3 transition-colors",
        active
          ? "border-primary/30 bg-primary/[0.04]"
          : "border-border bg-background"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-7 items-center justify-center",
            active
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          {icon}
        </div>

        <span className="text-xs font-medium">{title}</span>
      </div>

      <span className="font-mono text-[9px] text-muted-foreground">
        {value}
      </span>
    </div>
  );
}

function HealthStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-border bg-background p-3">
      <div className="font-mono text-[9px] text-muted-foreground">
        {label}
      </div>

      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}