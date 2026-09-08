
import type { Metadata } from "next";
import { requireAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getDashboardData } from "@/features/dashboard/server/get-dashboard-data";

export const metadata: Metadata = {
  title: "Overview · Dashboard",
};

export default async function DashboardPage() {
  const session = await requireAuth();
  const data = await getDashboardData(session.user.id);

  return (
    <>
      <DashboardHeader
        title="Overview"
        description="Monitor automated AI reviews, usage metrics, and recent pull requests."
      />
      <DashboardOverview userId={session.user.id} data={data} />
    </>
  );
}