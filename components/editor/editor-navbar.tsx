"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorNavbarProps {
  isAiSidebarOpen?: boolean;
  isSidebarOpen: boolean;
  onAiSidebarToggle?: () => void;
  onSidebarToggle: () => void;
  projectName?: string;
  className?: string;
}

export function EditorNavbar({
  isAiSidebarOpen = false,
  isSidebarOpen,
  onAiSidebarToggle,
  onSidebarToggle,
  projectName,
  className,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;
  const AiSidebarIcon = isAiSidebarOpen ? PanelRightClose : PanelRightOpen;
  const showWorkspaceActions = Boolean(projectName);

  return (
    <header
      className={cn(
        "grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-surface-border bg-surface px-3",
        className
      )}
    >
      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={isSidebarOpen ? "Close project sidebar" : "Open project sidebar"}
          aria-pressed={isSidebarOpen}
          onClick={onSidebarToggle}
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex min-w-0 items-center justify-center">
        {projectName ? (
          <div className="flex min-w-0 items-center gap-2 text-center">
            <Bot className="h-4 w-4 shrink-0 text-ai-text" />
            <span className="truncate text-sm font-medium text-copy-primary">
              {projectName}
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-2">
        {showWorkspaceActions ? (
          <>
            <Button type="button" variant="ghost" size="sm" aria-label="Share project">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
              aria-pressed={isAiSidebarOpen}
              onClick={onAiSidebarToggle}
            >
              <AiSidebarIcon className="h-5 w-5" />
            </Button>
          </>
        ) : null}
        <UserButton />
      </div>
    </header>
  );
}
