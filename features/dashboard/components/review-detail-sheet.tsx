"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecentPrItem } from "../server/get-dashboard-data";
import { ArrowSquareOut, Check, Copy, GitPullRequest } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type ReviewDetailSheetProps = {
  pr: RecentPrItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReviewDetailSheet({
  pr,
  open,
  onOpenChange,
}: ReviewDetailSheetProps) {
  const [copied, setCopied] = useState(false);

  if (!pr) return null;

  const prUrl = `https://github.com/${pr.repoFullName}/pull/${pr.prNumber}`;

  const handleCopy = () => {
    if (!pr.reviewComment) return;
    navigator.clipboard.writeText(pr.reviewComment);
    setCopied(true);
    toast.success("Review copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col p-0">
        <SheetHeader className="border-b border-border p-6 pb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">
              #{pr.prNumber}
            </Badge>
            <span className="text-xs text-muted-foreground truncate">
              {pr.repoFullName}
            </span>
          </div>
          <SheetTitle className="text-base font-semibold leading-snug mt-1">
            {pr.title}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
            <span>By @{pr.authorLogin ?? "unknown"}</span>
            <span>•</span>
            <span>
              {pr.reviewedAt
                ? formatDistanceToNow(new Date(pr.reviewedAt), { addSuffix: true })
                : formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {pr.reviewComment ? (
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground text-xs leading-relaxed space-y-3 whitespace-pre-wrap font-sans bg-muted/20 p-4 rounded-md border border-border">
              {pr.reviewComment}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <GitPullRequest className="size-8 mb-2 opacity-50" />
              <p className="text-xs font-medium">No review comments yet</p>
              <p className="text-[11px] text-muted-foreground/80 mt-1">
                {pr.status === "processing"
                  ? "AI is currently analyzing this pull request diff..."
                  : "This PR has not been reviewed yet."}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4 bg-muted/10 flex items-center justify-between gap-3">
          {pr.reviewComment ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 text-xs"
            >
              {copied ? (
                <Check className="size-3.5 text-green-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? "Copied" : "Copy Review"}
            </Button>
          ) : (
            <div />
          )}

          <Button asChild size="sm" className="gap-1.5 text-xs">
            <a href={prUrl} target="_blank" rel="noopener noreferrer">
              View on GitHub
              <ArrowSquareOut className="size-3.5" />
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
