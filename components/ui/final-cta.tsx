"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  GithubLogo,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:py-24">
      {/* subtle background */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-x-0 top-1/2 -z-10
          h-[320px] -translate-y-1/2
          bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_18%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_18%,transparent)_1px,transparent_1px)]
          bg-[size:56px_56px]
          [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]
        "
      />

      <div
        aria-hidden
        className="
          pointer-events-none absolute left-1/2 top-1/2 -z-10
          h-[260px] w-[520px]
          -translate-x-1/2 -translate-y-1/2
          rounded-full bg-primary/[0.07]
          blur-[100px]
        "
      />

      <div className="mx-auto max-w-3xl text-center">
        {/* eyebrow */}
        <div className="inline-flex items-center gap-1.5 border border-border bg-muted/30 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.17em] text-muted-foreground">
          <Sparkle
            className="size-3 text-primary"
            weight="fill"
          />
          Start reviewing
        </div>

        {/* heading */}
        <h2 className="mt-6 font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl md:text-5xl">
          Give every pull request
          <br />
          <span className="text-muted-foreground">
            a second pair of eyes.
          </span>
        </h2>

        {/* description */}
        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          Connect GitHub, let Code Bunny understand your repositories, and
          start getting actionable AI reviews without changing the way your
          team ships code.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-in"
            className="
              group inline-flex h-10 items-center gap-2
              bg-primary px-5
              text-xs font-medium
              text-primary-foreground
              transition-all
              hover:bg-primary/90
              active:translate-y-px
            "
          >
            <GithubLogo
              className="size-4"
              weight="bold"
            />

            Get started free

            <ArrowUpRight
              className="
                size-3
                opacity-60
                transition-transform
                group-hover:-translate-y-px
                group-hover:translate-x-px
              "
            />
          </Link>
        </div>

        {/* trust */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck
              className="size-3.5 text-green-500"
              weight="fill"
            />
            GitHub native
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Sparkle
              className="size-3.5 text-primary"
              weight="fill"
            />
            Repository-aware
          </span>

          <span className="text-muted-foreground/60">
            Start with the free plan
          </span>
        </div>
      </div>
    </section>
  );
}