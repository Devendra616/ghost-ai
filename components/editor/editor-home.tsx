"use client";

import { Plus } from "lucide-react";

import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context";
import { Button } from "@/components/ui/button";

export function EditorHome() {
  const { openCreateDialog } = useProjectDialogsContext();

  return (
    <div className="relative flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden bg-base px-6">
      <div className="absolute inset-0 bg-[linear-gradient(var(--border-default)_1px,transparent_1px),linear-gradient(90deg,var(--border-default)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      <div className="relative max-w-xl text-center">
        <h1 className="text-2xl font-semibold text-copy-primary md:text-3xl">
          Create a project or open an existing one
        </h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted md:text-base">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <Button type="button" className="mt-6" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </div>
  );
}
