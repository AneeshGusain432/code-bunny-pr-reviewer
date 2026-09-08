
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  GithubLogo,
} from "@phosphor-icons/react";

const FOOTER_LINKS = {
  Product: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ],
  Resources: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "GitHub", href: "https://github.com/AneeshGusain432" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main footer */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.7fr_0.7fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
            >
              <span className="flex size-8 items-center justify-center overflow-hidden">
                <Image
                  src="/code-bunny-logo.png"
                  alt="codebunny"
                  width={36}
                  height={36}
                  className="size-7 object-contain"
                />
              </span>

              <span className="font-[family-name:var(--font-heading)] text-sm font-medium tracking-tight">
                codebunny
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-xs leading-5 text-muted-foreground">
              AI-powered pull request reviews with repository context,
              built directly into your GitHub workflow.
            </p>

            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="
                mt-5 inline-flex items-center gap-2
                text-[11px] font-medium
                text-muted-foreground
                transition-colors
                hover:text-foreground
              "
            >
              <GithubLogo
                className="size-3.5"
                weight="fill"
              />

              GitHub

              <ArrowUpRight className="size-3 opacity-50" />
            </Link>
          </div>

          {/* Product */}
          <div>
            <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              Product
            </p>

            <nav className="flex flex-col items-start gap-2.5">
              {FOOTER_LINKS.Product.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="
                    text-xs text-muted-foreground
                    transition-colors
                    hover:text-foreground
                  "
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              Resources
            </p>

            <nav className="flex flex-col items-start gap-2.5">
              {FOOTER_LINKS.Resources.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    text-xs text-muted-foreground
                    transition-colors
                    hover:text-foreground
                  "
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} codebunny. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <span>AI code review for GitHub</span>

            <span className="size-1 rounded-full bg-border" />

            <span className="font-mono">
              built for developers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
