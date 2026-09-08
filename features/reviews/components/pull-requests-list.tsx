"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PullRequestItem,
  PullRequestsPageData,
} from "../server/get-pull-requests";
import { ReviewDetailSheet } from "@/features/dashboard/components/review-detail-sheet";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import {
  ArrowSquareOut,
  CaretLeft,
  CaretRight,
  ChatText,
  CheckCircle,
  Funnel,
  GitBranch,
  GitCommit,
  GitPullRequest,
  WarningCircle,
} from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";

type StatusFilter = "all" | "reviewed" | "processing" | "rate_limited";

type PullRequestsListProps = {
  data: PullRequestsPageData;
};

const ITEMS_PER_PAGE = 10;

export function PullRequestsList({ data }: PullRequestsListProps) {
  const { pullRequests, repoNames, statusCounts } = data;

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedRepo, setSelectedRepo] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedPr, setSelectedPr] = useState<PullRequestItem | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Filtered pull requests
  const filteredPrs = useMemo(() => {
    return pullRequests.filter((pr) => {
      // Status filter
      if (statusFilter !== "all" && pr.status !== statusFilter) {
        return false;
      }

      // Repo filter
      if (selectedRepo !== "all" && pr.repoFullName !== selectedRepo) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = pr.title.toLowerCase().includes(query);
        const matchesNumber = String(pr.prNumber).includes(query);
        const matchesRepo = pr.repoFullName.toLowerCase().includes(query);
        const matchesAuthor = (pr.authorLogin ?? "").toLowerCase().includes(query);

        if (!matchesTitle && !matchesNumber && !matchesRepo && !matchesAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [pullRequests, statusFilter, selectedRepo, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPrs.length / ITEMS_PER_PAGE));
  const paginatedPrs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPrs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPrs, currentPage]);

  const handleOpenReview = (pr: PullRequestItem) => {
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

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* 1. Filter and Search Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Tabs
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val as StatusFilter);
              setCurrentPage(1);
            }}
          >
            <TabsList>
              <TabsTrigger value="all">
                All ({statusCounts.all})
              </TabsTrigger>
              <TabsTrigger value="reviewed">
                Reviewed ({statusCounts.reviewed})
              </TabsTrigger>
              <TabsTrigger value="processing">
                In Progress ({statusCounts.processing})
              </TabsTrigger>
              <TabsTrigger value="rate_limited">
                Rate Limited ({statusCounts.rate_limited})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            {/* Repository Filter Select */}
            {repoNames.length > 0 ? (
              <Select
                value={selectedRepo}
                onValueChange={(val) => {
                  setSelectedRepo(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger size="default" className="w-[180px]">
                  <SelectValue placeholder="All Repositories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Repositories</SelectItem>
                  {repoNames.map((repo) => (
                    <SelectItem key={repo} value={repo}>
                      {repo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            {/* Search Input */}
            <Input
              placeholder="Search by title, #number, author…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-xs h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 2. Pull Requests Table */}
      {filteredPrs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border rounded-md bg-muted/10">
          <GitPullRequest className="size-10 text-muted-foreground/50 mb-3" />
          <h3 className="text-sm font-semibold">No pull requests found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {searchQuery || selectedRepo !== "all" || statusFilter !== "all"
              ? "No pull requests match your current filters. Try resetting your search query or filters."
              : "When you open a Pull Request on any connected GitHub repository, Code Bunny will automatically review it and display findings here."}
          </p>
          {(searchQuery || selectedRepo !== "all" || statusFilter !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedRepo("all");
                setStatusFilter("all");
                setCurrentPage(1);
              }}
              className="mt-4 text-xs"
            >
              Reset Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="rounded-none border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pull Request</TableHead>
                  <TableHead>Branches</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Commit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPrs.map((pr) => {
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
                      <TableCell>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                          <GitBranch className="size-3 text-muted-foreground" />
                          <span>{pr.baseBranch}</span>
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

          {/* Pagination bar */}
          {totalPages > 1 ? (
            <div className="flex items-center justify-between py-2 text-xs text-muted-foreground">
              <span>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredPrs.length)} of{" "}
                {filteredPrs.length} pull requests
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="size-7"
                >
                  <CaretLeft className="size-3.5" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                <span className="px-2 font-mono text-xs">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="size-7"
                >
                  <CaretRight className="size-3.5" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* 3. Review Detail Sheet */}
      <ReviewDetailSheet
        pr={selectedPr}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
