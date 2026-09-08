import { prisma } from "@/lib/db";
import { getInstallationStatus, getUserInstallationId } from "@/features/github/server/installation";
import { getUserSubscription } from "@/features/billing/server/subscription";
import { getUsageSummary, UsageSummary } from "@/features/billing/server/usage";
import { GithubInstallationStatus, UserSubscription } from "../lib/types";
import { format, subDays, startOfDay } from "date-fns";

export type RecentPrItem = {
  id: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  headSha: string;
  baseBranch: string;
  status: string;
  reviewComment: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

export type DailyActivity = {
  date: string;
  label: string;
  reviews: number;
};

export type DashboardOverviewData = {
  installation: GithubInstallationStatus;
  subscription: UserSubscription;
  usage: UsageSummary;
  metrics: {
    totalPrs: number;
    reviewedPrs: number;
    processingPrs: number;
    syncedReposCount: number;
    totalIndexedChunks: number;
  };
  recentPrs: RecentPrItem[];
  activityChart: DailyActivity[];
};

export async function getDashboardData(userId: string): Promise<DashboardOverviewData> {
  const [installation, subscription, usage, installationId] = await Promise.all([
    getInstallationStatus(userId),
    getUserSubscription(userId),
    getUsageSummary(userId),
    getUserInstallationId(userId),
  ]);

  if (!installationId) {
    return {
      installation,
      subscription,
      usage,
      metrics: {
        totalPrs: 0,
        reviewedPrs: 0,
        processingPrs: 0,
        syncedReposCount: 0,
        totalIndexedChunks: 0,
      },
      recentPrs: [],
      activityChart: generateEmptyActivity(14),
    };
  }

  const fourteenDaysAgo = startOfDay(subDays(new Date(), 13));

  const [
    totalPrs,
    reviewedPrs,
    processingPrs,
    repoSyncs,
    recentPrRecords,
    recentActivityPrs,
  ] = await Promise.all([
    prisma.pullRequest.count({
      where: { installationId },
    }),
    prisma.pullRequest.count({
      where: { installationId, status: "reviewed" },
    }),
    prisma.pullRequest.count({
      where: { installationId, status: "processing" },
    }),
    prisma.repoSync.findMany({
      where: { installationId },
      select: { status: true, chunkCount: true },
    }),
    prisma.pullRequest.findMany({
      where: { installationId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.pullRequest.findMany({
      where: {
        installationId,
        createdAt: { gte: fourteenDaysAgo },
      },
      select: { createdAt: true },
    }),
  ]);

  const syncedRepos = repoSyncs.filter((s) => s.status === "synced");
  const totalIndexedChunks = syncedRepos.reduce((acc, s) => acc + (s.chunkCount || 0), 0);

  // Group activity by day for chart
  const activityMap = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const day = subDays(new Date(), i);
    const key = format(day, "yyyy-MM-dd");
    activityMap.set(key, 0);
  }

  for (const pr of recentActivityPrs) {
    const key = format(pr.createdAt, "yyyy-MM-dd");
    if (activityMap.has(key)) {
      activityMap.set(key, (activityMap.get(key) || 0) + 1);
    }
  }

  const activityChart: DailyActivity[] = Array.from(activityMap.entries()).map(
    ([dateKey, count]) => {
      const dateObj = new Date(dateKey + "T00:00:00");
      return {
        date: dateKey,
        label: format(dateObj, "MMM d"),
        reviews: count,
      };
    },
  );

  const recentPrs: RecentPrItem[] = recentPrRecords.map((pr) => ({
    id: pr.id,
    repoFullName: pr.repoFullName,
    prNumber: pr.prNumber,
    title: pr.title,
    authorLogin: pr.authorLogin,
    headSha: pr.headSha,
    baseBranch: pr.baseBranch,
    status: pr.status,
    reviewComment: pr.reviewComment,
    reviewedAt: pr.reviewedAt ? pr.reviewedAt.toISOString() : null,
    createdAt: pr.createdAt.toISOString(),
  }));

  return {
    installation,
    subscription,
    usage,
    metrics: {
      totalPrs,
      reviewedPrs,
      processingPrs,
      syncedReposCount: syncedRepos.length,
      totalIndexedChunks,
    },
    recentPrs,
    activityChart,
  };
}

function generateEmptyActivity(days: number): DailyActivity[] {
  const chart: DailyActivity[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = subDays(new Date(), i);
    chart.push({
      date: format(day, "yyyy-MM-dd"),
      label: format(day, "MMM d"),
      reviews: 0,
    });
  }
  return chart;
}
