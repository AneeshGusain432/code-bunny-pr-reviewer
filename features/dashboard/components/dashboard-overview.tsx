"use client";

import Link from "next/link";
import { DashboardOverviewData } from "../server/get-dashboard-data";
import { ReviewActivityChart } from "./review-activity-chart";
import { RecentPullRequests } from "./recent-pull-requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DASHBOARD_ROUTES } from "../lib/routes";
import {
  ArrowSquareOut,
  CheckCircle,
  Database,
  GitBranch,
  GitPullRequest,
  Lightning,
  Sparkle,
  Warning,
} from "@phosphor-icons/react";
import { getGithubInstallUrl } from "@/features/github/utils/github-app";

type DashboardOverviewProps = {
  userId: string;
  data: DashboardOverviewData;
};

export function DashboardOverview({ userId, data }: DashboardOverviewProps) {
  const { installation, subscription, usage, metrics, recentPrs, activityChart } = data;

  const isPro = subscription.plan === "pro" && subscription.status === "active";
  const usedCount = usage.used;
  const limitCount = usage.limit;
  const usagePercentage = limitCount ? Math.min(100, Math.round((usedCount / limitCount) * 100)) : 0;
  const installUrl = getGithubInstallUrl(userId);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 1. Connection Warning Banner if GitHub App not connected */}
      {!installation.connected ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <Warning className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="space-y-0.5">
              <p className="text-xs font-semibold">GitHub App is not connected</p>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Install the Code Bunny GitHub App to grant repository access and receive automated PR reviews.
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
            <a href={installUrl} target="_blank" rel="noopener noreferrer">
              Install GitHub App
              <ArrowSquareOut className="size-3.5 ml-1" />
            </a>
          </Button>
        </div>
      ) : null}

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Review Usage */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Monthly Usage
            </CardTitle>
            <Lightning className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono">
                {usedCount}
                <span className="text-xs font-normal text-muted-foreground">
                  {isPro ? " / Unlimited" : ` / ${limitCount ?? 50}`}
                </span>
              </span>
              <Badge variant={isPro ? "default" : "secondary"} className="text-[10px] uppercase">
                {subscription.plan}
              </Badge>
            </div>
            {!isPro && limitCount ? (
              <Progress value={usagePercentage} className="h-1.5" />
            ) : null}
            <p className="text-[11px] text-muted-foreground">
              {isPro
                ? "Unlimited reviews on Pro plan"
                : `${(limitCount ?? 50) - usedCount} reviews remaining this cycle`}
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Total PR Reviews */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Pull Requests
            </CardTitle>
            <GitPullRequest className="size-4 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-bold font-mono">{metrics.totalPrs}</div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <span className="text-green-600 dark:text-green-400 font-medium">
                {metrics.reviewedPrs} reviewed
              </span>
              {metrics.processingPrs > 0 ? (
                <>
                  <span>•</span>
                  <span className="text-blue-500 font-medium">
                    {metrics.processingPrs} in progress
                  </span>
                </>
              ) : null}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Codebase Vectors */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Indexed Codebases
            </CardTitle>
            <Database className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-xl font-bold font-mono">{metrics.syncedReposCount}</div>
            <p className="text-[11px] text-muted-foreground">
              {metrics.totalIndexedChunks.toLocaleString()} Pinecone vector chunks
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Webhook & AI Engine */}
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Review Engine
            </CardTitle>
            <Sparkle className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold">Active & Listening</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              OpenRouter AI + Inngest background workers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Middle Section: Activity Chart & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReviewActivityChart data={activityChart} />
        </div>

        {/* Quick Shortcuts & Navigation Card */}
        <Card className="flex flex-col border-border/80 shadow-xs justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            <p className="text-xs text-muted-foreground">
              Manage your connected repositories and review configurations.
            </p>
          </CardHeader>
          <CardContent className="space-y-2.5 pb-6">
            <Button asChild variant="outline" className="w-full justify-start text-xs h-9">
              <Link href={DASHBOARD_ROUTES.repos}>
                <GitBranch className="size-4 mr-2 text-muted-foreground" />
                View & Sync Repositories
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-xs h-9">
              <Link href={DASHBOARD_ROUTES.github}>
                <CheckCircle className="size-4 mr-2 text-muted-foreground" />
                GitHub App Settings
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-xs h-9">
              <Link href={DASHBOARD_ROUTES.settings}>
                <Lightning className="size-4 mr-2 text-muted-foreground" />
                {isPro ? "Manage Subscription" : "Upgrade to Pro"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 4. Bottom Section: Recent Pull Request Reviews */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Recent Pull Requests</h2>
            <p className="text-xs text-muted-foreground">
              Latest pull requests processed by Code Bunny
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs h-8">
            <Link href={DASHBOARD_ROUTES.repos}>All Repositories</Link>
          </Button>
        </div>

        <RecentPullRequests prs={recentPrs} />
      </div>
    </div>
  );
}
