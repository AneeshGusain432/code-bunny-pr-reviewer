"use client";

import Link from "next/link";
import {
  Check,
  GithubLogo,
  Lightning,
  Sparkle,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Free",
    description: "For trying Code Bunny on a few repositories.",
    price: "0",
    period: "forever",
    features: [
      "50 AI reviews per month",
      "GitHub App integration",
      "Public and private repositories",
      "Repository-aware reviews",
    ],
    action: "Get started free",
    href: "/sign-in",
    featured: false,
  },
  {
    name: "Pro",
    description: "For teams shipping code regularly.",
    price: "99",
    period: "per month",
    features: [
      "Unlimited AI reviews",
      "Everything in Free",
      "Repository context",
      "Automated pull request reviews",
      "Review activity and usage tracking",
    ],
    action: "Upgrade to Pro",
    href: "/sign-in",
    featured: true,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="r px-4 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 border border-border bg-muted/30 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.17em] text-muted-foreground">
            <Sparkle
              className="size-3 text-primary"
              weight="fill"
            />
            Pricing
          </div>

          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Start free.
            <br />
            <span className="text-muted-foreground">
              Upgrade when you need more.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Choose the plan that fits your review volume. Connect GitHub and
            start reviewing pull requests without changing your workflow.
          </p>
        </div>

        {/* Plans */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col border bg-card",
                plan.featured
                  ? "border-primary/35"
                  : "border-border",
              )}
            >
              {/* Featured marker */}
              {plan.featured ? (
                <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 border border-primary/20 bg-primary/[0.06] px-2 py-1 text-[9px] font-medium text-primary">
                  <Sparkle
                    className="size-3"
                    weight="fill"
                  />
                  Recommended
                </div>
              ) : null}

              {/* Header */}
              <div className="border-b border-border p-5">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center border",
                      plan.featured
                        ? "border-primary/20 bg-primary/[0.06]"
                        : "border-border bg-muted/20",
                    )}
                  >
                    {plan.featured ? (
                      <Sparkle
                        className="size-4 text-primary"
                        weight="fill"
                      />
                    ) : (
                      <Lightning className="size-4 text-muted-foreground" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      {plan.name}
                    </h3>

                    <p className="mt-1 max-w-xs text-[10px] leading-4 text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-end gap-1">
                  <span className="font-mono text-3xl font-semibold tracking-tight">
                    {plan.price}
                  </span>

                  <span className="pb-1 text-[10px] text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="flex-1 p-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Includes
                </p>

                <ul className="mt-4 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-[11px] text-muted-foreground"
                    >
                      <Check
                        className="mt-0.5 size-3.5 shrink-0 text-green-500"
                        weight="bold"
                      />

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="border-t border-border p-5">
                <Button
                  className={cn(
                    "h-9 w-full rounded-md text-xs",
                    plan.featured
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "",
                  )}
                  variant={plan.featured ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>
                    {plan.featured ? (
                      <Sparkle
                        className="size-3.5"
                        weight="fill"
                      />
                    ) : (
                      <GithubLogo
                        className="size-3.5"
                        weight="fill"
                      />
                    )}

                    {plan.action}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison footer */}
        <div className="mx-auto mt-8 max-w-4xl border border-border">
          <div className="grid sm:grid-cols-3 sm:divide-x sm:divide-border">
            <div className="px-4 py-4 sm:px-5">
              <p className="font-mono text-[9px] text-muted-foreground">
                REVIEWS
              </p>

              <p className="mt-1 text-xs font-medium">
                Free: 50 / month
              </p>
            </div>

            <div className="border-t border-border px-4 py-4 sm:border-t-0 sm:px-5">
              <p className="font-mono text-[9px] text-muted-foreground">
                PRO
              </p>

              <p className="mt-1 text-xs font-medium">
                Unlimited reviews
              </p>
            </div>

            <div className="border-t border-border px-4 py-4 sm:border-t-0 sm:px-5">
              <p className="font-mono text-[9px] text-muted-foreground">
                WORKFLOW
              </p>

              <p className="mt-1 text-xs font-medium">
                GitHub-native
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}