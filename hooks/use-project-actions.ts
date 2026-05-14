"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import type { ProjectListItem } from "@/types/project";

type ProjectDialogType = "create" | "rename" | "delete";

interface ProjectDialogState {
  type: ProjectDialogType;
  project?: ProjectListItem;
}

interface ProjectResponse {
  project: ProjectListItem;
}

const DEFAULT_PROJECT_NAME = "Untitled Project";

function createShortSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

function slugifyProjectName(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-project";
}

async function parseProjectResponse(response: Response) {
  if (!response.ok) {
    throw new Error("Project request failed.");
  }

  return (await response.json()) as ProjectResponse;
}

export function useProjectActions() {
  const router = useRouter();
  const pathname = usePathname();
  const [dialogState, setDialogState] = useState<ProjectDialogState | null>(null);
  const [projectName, setProjectName] = useState("");
  const [projectSuffix, setProjectSuffix] = useState(createShortSuffix);
  const [isLoading, setIsLoading] = useState(false);

  const roomIdPreview = useMemo(() => {
    const baseName = projectName.trim() || DEFAULT_PROJECT_NAME;
    return `${slugifyProjectName(baseName)}-${projectSuffix}`;
  }, [projectName, projectSuffix]);

  function openCreateDialog() {
    setProjectSuffix(createShortSuffix());
    setProjectName("");
    setDialogState({ type: "create" });
  }

  function openRenameDialog(project: ProjectListItem) {
    setProjectName(project.name);
    setDialogState({ type: "rename", project });
  }

  function openDeleteDialog(project: ProjectListItem) {
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

  async function createProject() {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: roomIdPreview,
        name: projectName.trim() || DEFAULT_PROJECT_NAME,
      }),
    });
    const data = await parseProjectResponse(response);

    router.push(`/editor/${data.project.id}`);
  }

  async function renameProject(project: ProjectListItem) {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName }),
    });
    await parseProjectResponse(response);

    router.refresh();
  }

  async function deleteProject(project: ProjectListItem) {
    const response = await fetch(`/api/projects/${project.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Project request failed.");
    }

    if (pathname === `/editor/${project.id}`) {
      router.push("/editor");
      return;
    }

    router.refresh();
  }

  async function submitDialog() {
    if (isLoading || !dialogState) return;

    setIsLoading(true);

    try {
      if (dialogState.type === "create") {
        await createProject();
      }

      if (dialogState.type === "rename" && dialogState.project) {
        await renameProject(dialogState.project);
      }

      if (dialogState.type === "delete" && dialogState.project) {
        await deleteProject(dialogState.project);
      }

      setDialogState(null);
      setProjectName("");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    dialogState,
    isLoading,
    projectName,
    roomIdPreview,
    closeDialog,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    setProjectName,
    submitDialog,
  };
}

export type ProjectActionsController = ReturnType<typeof useProjectActions>;
