"use client";

import { useMemo, useState } from "react";

export interface MockProject {
  id: string;
  name: string;
  ownerType: "owned" | "shared";
}

type ProjectDialogType = "create" | "rename" | "delete";

interface ProjectDialogState {
  type: ProjectDialogType;
  project?: MockProject;
}

function createSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "project-slug";
}

export function useProjectDialogs() {
  const [dialogState, setDialogState] = useState<ProjectDialogState | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const slugPreview = useMemo(() => createSlug(projectName), [projectName]);

  function openCreateDialog() {
    setProjectName("");
    setDialogState({ type: "create" });
  }

  function openRenameDialog(project: MockProject) {
    setProjectName(project.name);
    setDialogState({ type: "rename", project });
  }

  function openDeleteDialog(project: MockProject) {
    setProjectName("");
    setDialogState({ type: "delete", project });
  }

  function closeDialog() {
    if (isLoading) {
      return;
    }

    setDialogState(null);
    setProjectName("");
  }

  function submitDialog() {
    setIsLoading(true);
    setIsLoading(false);
    setDialogState(null);
    setProjectName("");
  }

  return {
    dialogState,
    isLoading,
    projectName,
    slugPreview,
    closeDialog,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    setProjectName,
    submitDialog,
  };
}

export type ProjectDialogsController = ReturnType<typeof useProjectDialogs>;
