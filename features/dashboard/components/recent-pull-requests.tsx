"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RecentPrItem } from "../server/get-dashboard-data";
import { ReviewDetailSheet } from "./review-detail-sheet";
import {
  ArrowSquareOut,
  ChatText,
  CheckCircle,
  GitCommit,
  GitPullRequest,
  WarningCircle,
} from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";
import { statusBadge } from "../lib/status-style";

type RecentPullRequestsProps = {
  prs: RecentPrItem[];
};

export function RecentPullRequests({ prs }: RecentPullRequestsProps) {
  const [selectedPr, setSelectedPr] = useState<RecentPrItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleOpenReview = (pr: RecentPrItem) => {
    setSelectedPr(pr);
    setSheetOpen(true);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "reviewed":
        return (
          <span className={statusBadge("success", "gap-1")}>
            <CheckCircle className="size-3" />
            Reviewed
          </span>
        );
      case "processing":
        return (
          <span className={statusBadge("info", "gap-1")}>
            <Spinner className="size-3" />
            Processing
          </span>
        );
      case "rate_limited":
        return (
          <span className={statusBadge("warning", "gap-1")}>
            <WarningCircle className="size-3" />
            Rate Limited
          </span>
        );
      default:
        return (
          <span className={statusBadge("neutral", "gap-1")}>
            <GitPullRequest className="size-3" />
            Pending
          </span>
        );
    }
  };

  if (prs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-md bg-muted/10">
        <GitPullRequest className="size-10 text-muted-foreground/50 mb-3" />
        <h3 className="text-sm font-medium">No pull requests received yet</h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          When you open a Pull Request on any connected GitHub repository, Code Bunny will automatically review it and display findings here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-none border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pull Request</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Commit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Activity</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prs.map((pr) => {
              const prUrl = `https://github.com/${pr.repoFullName}/pull/${pr.prNumber}`;
              return (
                <TableRow key={pr.id}>
                  <TableCell>
                    <div className="flex flex-col min-w-0 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-1.5 font-medium text-xs">
                        <span className="font-mono text-muted-foreground">
                          #{pr.prNumber}
                        </span>
                        <span className="truncate">{pr.title}</span>
                      </div>
                      <a
                        href={`https://github.com/${pr.repoFullName}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-muted-foreground hover:underline truncate"
                      >
                        {pr.repoFullName}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    @{pr.authorLogin ?? "unknown"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                      <GitCommit className="size-3" />
                      {pr.headSha ? pr.headSha.slice(0, 7) : "—"}
                    </div>
                  </TableCell>
                  <TableCell>{renderStatusBadge(pr.status)}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDistanceToNow(
                      new Date(pr.reviewedAt ?? pr.createdAt),
                      { addSuffix: true },
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {pr.reviewComment ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReview(pr)}
                          className="h-7 px-2.5 text-xs gap-1"
                        >
                          <ChatText className="size-3.5 text-blue-500" />
                          View Review
                        </Button>
                      ) : null}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        className="h-7 w-7"
                      >
                        <a
                          href={prUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open on GitHub"
                        >
                          <ArrowSquareOut className="size-3.5" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ReviewDetailSheet
        pr={selectedPr}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
