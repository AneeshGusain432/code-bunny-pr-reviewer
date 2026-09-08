"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  GithubLogo,
  List,
  X,
} from "@phosphor-icons/react";
import { useState, useEffect, useCallback, useRef } from "react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";

  /* ─── scroll detection ─── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── intersection observer for active section ─── */
  useEffect(() => {
    if (!isHome) return;
    const ids = navigation.map((n) => n.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isHome]);

  /* ─── sliding underline indicator ─── */
  const updateIndicator = useCallback(() => {
    if (!navRef.current || !indicatorRef.current) return;
    const activeLink = navRef.current.querySelector(
      `[data-active="true"]`
    ) as HTMLElement | null;
    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      indicatorRef.current.style.opacity = "1";
      indicatorRef.current.style.width = `${linkRect.width - 16}px`;
      indicatorRef.current.style.transform = `translateX(${linkRect.left - navRect.left + 8}px)`;
    } else {
      indicatorRef.current.style.opacity = "0";
    }
  }, []);

  useEffect(() => {
    updateIndicator();
  }, [activeSection, updateIndicator]);

  /* ─── close mobile menu on resize ─── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,border-color,box-shadow] duration-300 ease-out",
        scrolled
          ? "border-b border-border bg-background/95 backdrop-blur-xs"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* ── Brand ── */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="codebunny home"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden bg-transparent">
            <Image
              src="/code-bunny-logo.png"
              alt="codebunny"
              width={40}
              height={40}
              priority
              className="size-7 object-contain transition-transform duration-200 group-hover:scale-110"
            />
          </span>
          <span className="font-[family-name:var(--font-heading)] text-sm font-medium tracking-tight text-foreground">
            codebunny
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav
          ref={navRef}
          aria-label="Main navigation"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 md:flex"
        >
          {/* sliding indicator */}
          <div
            ref={indicatorRef}
            className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ease-out"
            style={{ opacity: 0, width: 0 }}
          />

          {navigation.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.href}
                href={isHome ? item.href : `/${item.href}`}
                data-active={isActive}
                className={cn(
                  "inline-flex h-14 items-center px-3 text-xs font-medium transition-colors duration-150",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* ── Desktop actions ── */}
        <div className="hidden items-center gap-1.5 md:flex">
          <ModeToggle />

          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">Log in</Link>
          </Button>

          <Button size="sm" asChild>
            <Link href="/sign-in">
              <GithubLogo weight="bold" data-icon="inline-start" />
              Get started free
              <ArrowUpRight className="size-3 opacity-60" data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        {/* ── Mobile actions ── */}
        <div className="flex items-center gap-1 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <div className="relative size-4">
              <List
                className={cn(
                  "absolute inset-0 size-4 transition-all duration-200",
                  mobileOpen
                    ? "scale-0 rotate-90 opacity-0"
                    : "scale-100 rotate-0 opacity-100"
                )}
              />
              <X
                className={cn(
                  "absolute inset-0 size-4 transition-all duration-200",
                  mobileOpen
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-0 -rotate-90 opacity-0"
                )}
              />
            </div>
          </Button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out md:hidden",
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Mobile navigation"
            className="border-t border-border bg-background px-4 pb-4 pt-2"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={isHome ? item.href : `/${item.href}`}
                onClick={() => setMobileOpen(false)}
                className="flex h-10 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}

            <div className="mt-3 flex gap-2 border-t border-border pt-3">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                  Log in
                </Link>
              </Button>
              <Button size="sm" className="flex-1" asChild>
                <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                  <GithubLogo weight="bold" data-icon="inline-start" />
                  Get started
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;