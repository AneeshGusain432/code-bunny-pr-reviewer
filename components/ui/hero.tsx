"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GithubLogo,
  ArrowUpRight,
  CheckCircle,
  Lightning,
  ShieldCheck,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* ─── Rotating words (CodeRabbit-style) ─── */
const ROTATING_WORDS = [
  "bugs",
  "vulnerabilities",
  "code smells",
  "anti-patterns",
  "regressions",
];
const WORD_INTERVAL = 2800;

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 300);
    }, WORD_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-flex overflow-hidden">
      <span
        className={cn(
          "inline-block transition-all duration-300 ease-out text-primary",
          isAnimating
            ? "-translate-y-full opacity-0"
            : "translate-y-0 opacity-100",
        )}
      >
        {ROTATING_WORDS[index]}
      </span>
    </span>
  );
}

/* ─── Main Hero ─── */
export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:pt-28 sm:pb-24">
      {/* ambient glow */}
      
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-start justify-center"
      >
        <div
          className="h-[400px] w-[700px] -translate-y-1/3 rounded-full bg-primary/8 blur-[100px]"
          style={{ animation: "hero-glow-pulse 6s ease-in-out infinite" }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* ── text content ── */}
        <div className="mx-auto max-w-3xl text-center">
          {/* badge */}
          <div className="hero-stagger-1 mb-6 inline-flex items-center gap-1.5 border border-border bg-muted/30 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            AI-Powered Code Reviews
          </div>

          {/* headline */}
          <h1 className="hero-stagger-2 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Catch <RotatingWord /> <br className="hidden sm:block" />
            before they ship
          </h1>

          {/* subtitle */}
          <p className="hero-stagger-3 mx-auto mt-5 max-w-lg text-sm text-muted-foreground sm:text-base">
            Code Bunny reviews every pull request with AI — posting inline
            comments in under 60 seconds so you can merge with confidence.
          </p>

          {/* CTAs */}
          <div className="hero-stagger-4 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/sign-in"
              className="group inline-flex h-9 items-center gap-2 bg-primary px-5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/80 active:translate-y-px"
            >
              <GithubLogo className="size-4" weight="bold" />
              Get started free
              <ArrowUpRight className="size-3 opacity-60 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex h-9 items-center gap-1.5 border border-border bg-background px-5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              See how it works
            </a>
          </div>

          {/* trust signals */}
          <div className="hero-stagger-4 mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
            {[
              { icon: CheckCircle, text: "No credit card required" },
              { icon: Lightning, text: "Reviews in < 60s" },
              { icon: ShieldCheck, text: "Your code stays private" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <Icon className="size-3.5 text-primary" weight="fill" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
