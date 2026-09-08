
"use client";

import {
  ArrowRight,
  CheckCircle,
  Clock,
  GitPullRequest,
  GithubLogo,
  Lightning,
  Robot,
  Sparkle,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

const PIPELINE_STEPS = [
  {
    number: "01",
    title: "Pull request opened",
    description: "GitHub sends Code Bunny the pull request event.",
    icon: GitPullRequest,
    state: "complete",
  },
  {
    number: "02",
    title: "Review queued",
    description: "The review is handed to the background review pipeline.",
    icon: Clock,
    state: "complete",
  },
  {
    number: "03",
    title: "AI analyzes the change",
    description: "Diff and relevant repository context are reviewed together.",
    icon: Robot,
    state: "active",
  },
  {
    number: "04",
    title: "Feedback posted",
    description: "The generated review is sent back to the GitHub PR.",
    icon: CheckCircle,
    state: "pending",
  },
];

function GitHubEvent() {
  return (
    <div className="border border-border bg-card">
      <div className="flex h-10 items-center justify-between border-b border-border bg-muted/40 px-4">
        <div className="flex items-center gap-2">
          <GithubLogo className="size-3.5" weight="fill" />

          <span className="font-mono text-[10px] text-muted-foreground">
            github.com
          </span>
        </div>

        <span className="text-[9px] text-muted-foreground/50">
          event
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center border border-border bg-muted/20">
            <GitPullRequest
              className="size-3.5 text-green-500"
              weight="regular"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold">
              Pull request opened
            </p>

            <p className="mt-1 font-mono text-[9px] text-muted-foreground">
              pull_request.opened
            </p>

            <p className="mt-3 truncate text-[10px] text-foreground">
              #184 · Improve authentication flow
            </p>

            <p className="mt-1 text-[9px] text-muted-foreground">
              acme/backend · @aneesh
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-muted/[0.08] px-4 py-2.5">
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-green-500" />
          Event received
        </div>
      </div>
    </div>
  );
}

function ProcessingPanel() {
  return (
    <div className="border border-primary/20 bg-primary/[0.025]">
      <div className="flex h-10 items-center justify-between border-b border-primary/15 bg-primary/[0.04] px-4">
        <div className="flex items-center gap-2">
          <Sparkle
            className="size-3.5 text-primary"
            weight="fill"
          />

          <span className="text-[10px] font-medium text-primary">
            Code Bunny
          </span>
        </div>

        <span className="font-mono text-[9px] text-muted-foreground">
          review-pipeline
        </span>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {PIPELINE_STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative flex gap-3"
              >
                {index < PIPELINE_STEPS.length - 1 ? (
                  <span className="absolute left-[11px] top-7 h-[calc(100%+8px)] w-px bg-border" />
                ) : null}

                <div
                  className={cn(
                    "relative z-10 flex size-6 shrink-0 items-center justify-center border bg-background",
                    step.state === "active"
                      ? "border-primary/40 bg-primary/[0.07]"
                      : step.state === "complete"
                        ? "border-green-500/25 bg-green-500/[0.06]"
                        : "border-border",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-3",
                      step.state === "active"
                        ? "text-primary"
                        : step.state === "complete"
                          ? "text-green-500"
                          : "text-muted-foreground/50",
                    )}
                    weight="regular"
                  />
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium">
                      {step.title}
                    </span>

                    {step.state === "active" ? (
                      <span className="inline-flex items-center gap-1 text-[8px] font-medium text-primary">
                        <span className="size-1 animate-pulse rounded-full bg-primary" />
                        analyzing
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-[9px] leading-4 text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                <span className="font-mono text-[9px] text-muted-foreground/40">
                  {step.number}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GitHubResult() {
  return (
    <div className="border border-border bg-card">
      <div className="flex h-10 items-center justify-between border-b border-border bg-muted/40 px-4">
        <div className="flex items-center gap-2">
          <GitPullRequest
            className="size-3.5 text-green-500"
            weight="regular"
          />

          <span className="text-[10px] font-medium">
            Pull request #184
          </span>
        </div>

        <span className="inline-flex items-center gap-1.5 text-[9px] text-green-600 dark:text-green-400">
          <CheckCircle weight="fill" className="size-3" />
          Reviewed
        </span>
      </div>

      <div className="p-4">
        <div className="border border-border bg-muted/10 p-3">
          <div className="flex items-start gap-2.5">
            <div className="flex size-6 shrink-0 items-center justify-center border border-primary/20 bg-primary/[0.06]">
              <Sparkle
                className="size-3 text-primary"
                weight="fill"
              />
            </div>

            <div>
              <p className="text-[10px] font-medium">
                Code Bunny review
              </p>

              <p className="mt-1.5 text-[9px] leading-4 text-muted-foreground">
                Potential issue found in the authentication flow.
                Consider handling the stale session state before
                returning a successful result.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[9px] text-muted-foreground">
          <span>1 issue · 1 suggestion</span>

          <span className="font-medium text-primary">
            View review →
          </span>
        </div>
      </div>

      <div className="border-t border-border bg-muted/[0.08] px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-muted-foreground">
            Posted directly to GitHub
          </span>

          <ArrowRight className="size-3 text-primary" />
        </div>
      </div>
    </div>
  );
}

export function GitHubAutomation() {
  return (
    <section
      id="automation"
      className=" px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-1.5 border border-border bg-muted/30 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.17em] text-muted-foreground">
              <Lightning
                className="size-3 text-primary"
                weight="fill"
              />
              Automated by default
            </div>

            <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
              No extra workflow.
              <br />
              <span className="text-muted-foreground">
                Just open the PR.
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground lg:ml-auto sm:text-base sm:leading-7">
            Once Code Bunny is connected to GitHub, pull requests can move
            through the review pipeline automatically — from webhook to AI
            analysis to GitHub feedback.
          </p>
        </div>

        {/* Workflow */}
        <div className="mt-12 grid gap-3 lg:grid-cols-[0.9fr_1.2fr_0.9fr]">
          <GitHubEvent />

          <ProcessingPanel />

          <GitHubResult />
        </div>

        {/* Bottom message */}
        <div className="mt-8 grid border border-border sm:grid-cols-3 sm:divide-x sm:divide-border">
          <div className="px-4 py-4 sm:px-5">
            <div className="flex items-center gap-2">
              <GithubLogo
                className="size-3.5 text-foreground"
                weight="fill"
              />

              <span className="text-[10px] font-mono text-muted-foreground">
                INPUT
              </span>
            </div>

            <p className="mt-2 text-xs font-medium">
              Pull request event
            </p>
          </div>

          <div className="border-t border-border px-4 py-4 sm:border-t-0 sm:px-5">
            <div className="flex items-center gap-2">
              <Sparkle
                className="size-3.5 text-primary"
                weight="fill"
              />

              <span className="text-[10px] font-mono text-muted-foreground">
                PROCESSING
              </span>
            </div>

            <p className="mt-2 text-xs font-medium">
              Background AI review
            </p>
          </div>

          <div className="border-t border-border px-4 py-4 sm:border-t-0 sm:px-5">
            <div className="flex items-center gap-2">
              <CheckCircle
                className="size-3.5 text-green-500"
                weight="fill"
              />

              <span className="text-[10px] font-mono text-muted-foreground">
                OUTPUT
              </span>
            </div>

            <p className="mt-2 text-xs font-medium">
              Review posted to GitHub
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
