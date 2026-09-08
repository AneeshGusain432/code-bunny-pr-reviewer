"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  GithubLogo,
  CheckCircle,
  WarningCircle,
  ShieldWarning,
  Lightning,
  GitPullRequest,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

const codeLines = [
  {
    indent: 0,
    parts: [
      { text: "export", type: "keyword" },
      { text: " async ", type: "plain" },
      { text: "function", type: "keyword" },
      { text: " resetPassword", type: "function" },
      { text: "(", type: "plain" },
    ],
  },
  {
    indent: 1,
    parts: [
      { text: "userId", type: "variable" },
      { text: ": ", type: "plain" },
      { text: "string", type: "type" },
    ],
  },
  {
    indent: 1,
    parts: [
      { text: "token", type: "variable" },
      { text: ": ", type: "plain" },
      { text: "string", type: "type" },
    ],
  },
  {
    indent: 0,
    parts: [{ text: ") {", type: "plain" }],
  },
  {
    indent: 1,
    parts: [
      { text: "const", type: "keyword" },
      { text: " user = ", type: "plain" },
      { text: "await", type: "keyword" },
      { text: " db.user.findUnique", type: "function" },
      { text: "({", type: "plain" },
    ],
  },
  {
    indent: 2,
    parts: [
      { text: "where", type: "variable" },
      { text: ": { id: userId },", type: "plain" },
    ],
  },
  {
    indent: 1,
    parts: [{ text: "});", type: "plain" }],
  },
  {
    indent: 1,
    parts: [
      { text: "await", type: "keyword" },
      { text: " updatePassword", type: "function" },
      { text: "(user, token);", type: "plain" },
    ],
  },
  {
    indent: 1,
    parts: [
      { text: "return", type: "keyword" },
      { text: " user;", type: "plain" },
    ],
  },
  {
    indent: 0,
    parts: [{ text: "}", type: "plain" }],
  },
];

const findings = [
  {
    icon: ShieldWarning,
    title: "Security",
    text: "Token is not revoked",
    line: "line 42",
    className: "border-orange-500/25 bg-orange-500/[0.06] text-orange-400",
  },
  {
    icon: WarningCircle,
    title: "Risk detected",
    text: "Session can remain active",
    line: "line 42",
    className: "border-yellow-500/20 bg-yellow-500/[0.05] text-yellow-400",
  },
];

export default function CodeFlowHero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* =========================================================
          BACKGROUND ATMOSPHERE
      ========================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute left-[3%] top-[20%] size-[460px] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(249,115,22,0.09), transparent 68%)",
          }}
        />

        <div
          className="absolute left-[30%] top-[60%] size-[320px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.035), transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto grid min-h-[680px] w-full max-w-7xl items-center gap-10 px-4  sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
        {/* =========================================================
            LEFT — AI CODE REVIEW VISUAL
        ========================================================== */}

        <div className="relative flex h-[460px] w-full items-center justify-center sm:h-[540px]">
          {/* Soft radial field */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-[370px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(249,115,22,0.08), transparent 68%)",
            }}
          />

          {/* =====================================================
              FLOW LINES BEHIND EDITOR
          ====================================================== */}

          <svg
            viewBox="0 0 640 520"
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="lineOrange" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
                <stop offset="45%" stopColor="#fb923c" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="lineGreen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
                <stop offset="50%" stopColor="#4ade80" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.65" />
              </linearGradient>

              <filter
                id="signalGlow"
                x="-200%"
                y="-200%"
                width="400%"
                height="400%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter
                id="bigGlow"
                x="-300%"
                y="-300%"
                width="600%"
                height="600%"
              >
                <feGaussianBlur stdDeviation="10" result="blur" />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <radialGradient id="coreGlow">
                <stop offset="0%" stopColor="#fb923c" stopOpacity="0.35" />
                <stop offset="55%" stopColor="#f97316" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Upper incoming signal */}
            <path
              d="M 20 120 C 130 80 170 90 260 190"
              fill="none"
              stroke="url(#lineOrange)"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Left incoming signal */}
            <path
              d="M 5 250 C 110 220 160 225 240 245"
              fill="none"
              stroke="url(#lineGreen)"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Lower incoming signal */}
            <path
              d="M 25 400 C 125 430 180 370 260 300"
              fill="none"
              stroke="url(#lineOrange)"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Top-right output */}
            <path
              d="M 390 200 C 475 150 535 150 630 105"
              fill="none"
              stroke="url(#lineOrange)"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Bottom-right output */}
            <path
              d="M 390 310 C 470 350 535 370 630 415"
              fill="none"
              stroke="url(#lineGreen)"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Moving signals */}

            <circle r="2" fill="#fb923c" filter="url(#signalGlow)">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                path="M 20 120 C 130 80 170 90 260 190"
              />
            </circle>

            <circle r="1.7" fill="#4ade80" filter="url(#signalGlow)">
              <animateMotion
                dur="4.7s"
                begin="-2s"
                repeatCount="indefinite"
                path="M 5 250 C 110 220 160 225 240 245"
              />
            </circle>

            <circle r="2" fill="#fb923c" filter="url(#signalGlow)">
              <animateMotion
                dur="5s"
                begin="-1.4s"
                repeatCount="indefinite"
                path="M 25 400 C 125 430 180 370 260 300"
              />
            </circle>

            <circle r="1.8" fill="#fb923c" filter="url(#signalGlow)">
              <animateMotion
                dur="4.2s"
                begin="-1s"
                repeatCount="indefinite"
                path="M 390 200 C 475 150 535 150 630 105"
              />
            </circle>

            <circle r="1.7" fill="#4ade80" filter="url(#signalGlow)">
              <animateMotion
                dur="4.8s"
                begin="-2.5s"
                repeatCount="indefinite"
                path="M 390 310 C 470 350 535 370 630 415"
              />
            </circle>

            {/* Central intelligence field */}
            <circle cx="325" cy="255" r="75" fill="url(#coreGlow)">
              <animate
                attributeName="r"
                values="60;78;60"
                dur="3.4s"
                repeatCount="indefinite"
              />

              <animate
                attributeName="opacity"
                values="0.65;0.25;0.65"
                dur="3.4s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Core rings */}
            <circle
              cx="325"
              cy="255"
              r="12"
              fill="none"
              stroke="#fb923c"
              strokeWidth="0.7"
              strokeOpacity="0.45"
            >
              <animate
                attributeName="r"
                values="9;18;9"
                dur="2.5s"
                repeatCount="indefinite"
              />

              <animate
                attributeName="opacity"
                values="0.7;0.05;0.7"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>

            <circle
              cx="325"
              cy="255"
              r="4"
              fill="#fb923c"
              filter="url(#bigGlow)"
            >
              <animate
                attributeName="r"
                values="3;5;3"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          {/* =====================================================
              CODE EDITOR
          ====================================================== */}

          <div
            className="
              relative z-20
              w-[min(100%,470px)]
              rounded-2xl
              border border-border/80
              bg-card/90
              shadow-[0_35px_90px_-35px_rgba(0,0,0,0.45)]
              backdrop-blur-xl
            "
          >
            {/* Editor header */}
            <div className="flex h-11 items-center border-b border-border/70 px-4">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-red-500/60" />
                <span className="size-2.5 rounded-full bg-yellow-500/60" />
                <span className="size-2.5 rounded-full bg-green-500/60" />
              </div>

              <div className="ml-4 flex items-center gap-2 text-[10px] text-muted-foreground">
                <GitPullRequest className="size-3.5" weight="bold" />
                pull/482
              </div>

              <div className="ml-auto flex items-center gap-1.5 text-[9px] text-muted-foreground/70">
                <span className="size-1.5 rounded-full bg-green-500" />
                analyzing
              </div>
            </div>

            {/* File tabs */}
            <div className="flex border-b border-border/60 bg-muted/20">
              <div className="border-r border-border/50 px-4 py-2 text-[10px] text-muted-foreground">
                auth/session.ts
              </div>

              <div className="px-4 py-2 text-[10px] text-muted-foreground/40">
                +3 files
              </div>
            </div>

            {/* Code */}
            <div className="relative overflow-hidden px-4 py-5">
              {/* Scanning beam */}
              <div
                className="
                  pointer-events-none absolute
                  left-0 right-0 top-0
                  h-10
                  bg-gradient-to-b
                  from-orange-500/0
                  via-orange-500/[0.08]
                  to-orange-500/0
                  animate-[pulse_2.6s_ease-in-out_infinite]
                "
              />

              <div className="space-y-1 font-mono text-[10px] leading-5 sm:text-[11px]">
                {codeLines.map((line, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      index === 7 ? "rounded-md bg-orange-500/[0.07]" : ""
                    }`}
                  >
                    <span className="w-8 shrink-0 select-none pr-3 text-right text-muted-foreground/25">
                      {index + 38}
                    </span>

                    <span className="min-w-0">
                      {Array.from({
                        length: line.indent,
                      }).map((_, i) => (
                        <span key={i}>{"  "}</span>
                      ))}

                      {line.parts.map((part, partIndex) => (
                        <span
                          key={partIndex}
                          className={
                            part.type === "keyword"
                              ? "text-orange-400"
                              : part.type === "function"
                                ? "text-sky-400"
                                : part.type === "type"
                                  ? "text-emerald-400"
                                  : part.type === "variable"
                                    ? "text-amber-300"
                                    : "text-muted-foreground/75"
                          }
                        >
                          {part.text}
                        </span>
                      ))}
                    </span>

                    {index === 7 && (
                      <span className="ml-2 inline-flex items-center text-orange-400/80">
                        <span className="size-1.5 rounded-full bg-orange-400 animate-pulse" />
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Analysis bar */}
              <div className="mt-5 border-t border-border/50 pt-4">
                <div className="mb-2 flex items-center justify-between text-[9px] text-muted-foreground">
                  <span>Code Bunny analysis</span>
                  <span>82%</span>
                </div>

                <div className="h-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-orange-500/40 via-orange-400 to-orange-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              FINDING — TOP RIGHT
          ====================================================== */}

          <div
            className="
              absolute right-[2%] top-[12%] z-30
              hidden w-44
              rounded-xl
              border border-orange-500/20
              bg-background/90
              px-3 py-2.5
              shadow-xl shadow-orange-500/5
              backdrop-blur-md
              sm:block
            "
          >
            <div className="flex items-start gap-2">
              <ShieldWarning
                weight="fill"
                className="mt-0.5 size-4 shrink-0 text-orange-400"
              />

              <div className="min-w-0">
                <p className="text-[9px] font-semibold text-orange-400">
                  Security issue
                </p>

                <p className="mt-1 text-[9px] leading-4 text-muted-foreground">
                  Token remains valid after reset
                </p>
              </div>
            </div>

            <div className="mt-2 text-[8px] text-muted-foreground/45">
              auth/session.ts:42
            </div>
          </div>

          {/* =====================================================
              FINDING — LEFT BOTTOM
          ====================================================== */}

          <div
            className="
              absolute bottom-[9%] left-[1%] z-30
              hidden w-48
              rounded-xl
              border border-border/80
              bg-background/90
              px-3 py-2.5
              shadow-xl
              backdrop-blur-md
              sm:block
            "
          >
            <div className="flex items-center gap-2">
              <WarningCircle weight="fill" className="size-4 text-yellow-400" />

              <span className="text-[9px] font-semibold text-foreground">
                Review insight
              </span>

              <span className="ml-auto text-[8px] text-muted-foreground/50">
                42
              </span>
            </div>

            <p className="mt-1.5 text-[9px] leading-4 text-muted-foreground">
              Session invalidation should happen before password rotation.
            </p>
          </div>

          {/* =====================================================
              REVIEW COMPLETE
          ====================================================== */}

          <div
            className="
              absolute bottom-[13%] right-[3%] z-30
              hidden items-center gap-2
              rounded-full
              border border-green-500/20
              bg-background/90
              px-3 py-2
              text-[9px]
              text-green-400
              shadow-xl shadow-green-500/5
              backdrop-blur-md
              sm:flex
            "
          >
            <CheckCircle weight="fill" className="size-3.5" />
            Review ready
          </div>

          {/* Tiny labels */}
          <div className="absolute left-[9%] top-[8%] hidden text-[8px] uppercase tracking-[0.18em] text-muted-foreground/30 sm:block">
            pull request
          </div>

          <div className="absolute bottom-[5%] right-[20%] hidden items-center gap-1.5 text-[8px] uppercase tracking-[0.18em] text-muted-foreground/30 sm:flex">
            <Lightning className="size-3" weight="fill" />
            live analysis
          </div>
        </div>

        {/* =========================================================
            RIGHT — EXISTING HERO COPY
        ========================================================== */}

        <div className="relative max-w-2xl lg:pl-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            AI-powered pull request intelligence
          </div>

          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-6xl">
            Fast code.
            <br />
            <span className="text-muted-foreground">Faster reviews.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Code Bunny reviews every pull request automatically, prioritizes
            what matters, understands your codebase, and catches risky changes
            before they reach production.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/sign-in">
                <GithubLogo weight="bold" data-icon="inline-start" />
                Get started free
                <ArrowUpRight
                  className="size-4 opacity-60"
                  data-icon="inline-end"
                />
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild>
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-green-500" />
              Automatic PR reviews
            </span>

            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-orange-500" />
              Codebase context
            </span>

            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-yellow-500" />
              Risk prioritization
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
