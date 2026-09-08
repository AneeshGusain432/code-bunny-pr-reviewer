import { prisma } from "@/lib/db";
import { getUserInstallationId, getInstallationStatus } from "@/features/github/server/installation";

export type PullRequestItem = {
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
  updatedAt: string;
};

export type PullRequestsPageData = {
  connected: boolean;
  pullRequests: PullRequestItem[];
  repoNames: string[];
  statusCounts: {
    all: number;
    reviewed: number;
    processing: number;
    rate_limited: number;
    pending: number;
  };
};

export async function getPullRequestsForUser(userId: string): Promise<PullRequestsPageData> {
  const [installationStatus, installationId] = await Promise.all([
    getInstallationStatus(userId),
    getUserInstallationId(userId),
  ]);

  if (!installationStatus.connected || !installationId) {
    return {
      connected: false,
      pullRequests: [],
      repoNames: [],
      statusCounts: {
        all: 0,
        reviewed: 0,
        processing: 0,
        rate_limited: 0,
        pending: 0,
      },
    };
  }

  const [prs, distinctRepos, reviewedCount, processingCount, rateLimitedCount, pendingCount] =
    await Promise.all([
      prisma.pullRequest.findMany({
        where: { installationId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.pullRequest.findMany({
        where: { installationId },
        select: { repoFullName: true },
        distinct: ["repoFullName"],
      }),
      prisma.pullRequest.count({
        where: { installationId, status: "reviewed" },
      }),
      prisma.pullRequest.count({
        where: { installationId, status: "processing" },
      }),
      prisma.pullRequest.count({
        where: { installationId, status: "rate_limited" },
      }),
      prisma.pullRequest.count({
        where: { installationId, status: "pending" },
      }),
    ]);

  const repoNames = distinctRepos.map((r) => r.repoFullName).sort();

  const pullRequests: PullRequestItem[] = prs.map((pr) => ({
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
    updatedAt: pr.updatedAt.toISOString(),
  }));

  return {
    connected: true,
    pullRequests,
    repoNames,
    statusCounts: {
      all: pullRequests.length,
      reviewed: reviewedCount,
      processing: processingCount,
      rate_limited: rateLimitedCount,
      pending: pendingCount,
    },
  };
}
