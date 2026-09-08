import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getPullRequestsForUser } from "@/features/reviews/server/get-pull-requests";
import { PullRequestsList } from "@/features/reviews/components/pull-requests-list";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pull Requests · Dashboard",
};

function PullRequestsNotConnected() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Install the GitHub App first to receive and track pull request reviews.
      </p>
      <Button asChild>
        <Link href={DASHBOARD_ROUTES.github}>Go to GitHub App</Link>
      </Button>
    </div>
  );
}

export default async function DashboardPullRequestsPage() {
  const session = await requireAuth();
  const data = await getPullRequestsForUser(session.user.id);

  const header = (
    <DashboardHeader
      title="Pull Requests"
      description="Inspect AI-generated code reviews, suggestions, and review statuses across your repositories."
    />
  );

  if (!data.connected) {
    return (
      <>
        {header}
        <PullRequestsNotConnected />
      </>
    );
  }

  return (
    <>
      {header}
      <PullRequestsList data={data} />
    </>
  );
}
