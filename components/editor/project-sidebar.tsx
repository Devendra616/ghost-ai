"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";

import { useProjectDialogsContext } from "@/components/editor/project-dialogs-context";
import type { MockProject } from "@/components/editor/use-project-dialogs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const ownedProjects: MockProject[] = [
  {
    id: "payments-platform",
    name: "Realtime Payment Platform",
    ownerType: "owned",
  },
  {
    id: "support-automation",
    name: "Support Automation Mesh",
    ownerType: "owned",
  },
];

const sharedProjects: MockProject[] = [];

function EmptyProjectsState() {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-bg-elevated/60 px-4 text-center">
      <p className="text-sm text-copy-muted">No projects to show yet.</p>
    </div>
  );
}

interface ProjectListProps {
  projects: MockProject[];
}

function ProjectList({ projects }: ProjectListProps) {
  const { openDeleteDialog, openRenameDialog } = useProjectDialogsContext();

  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => {
        const canManageProject = project.ownerType === "owned";

        return (
          <div
            key={project.id}
            className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-surface-border bg-bg-elevated px-3 py-2"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-copy-primary">
                {project.name}
              </p>
              <p className="text-xs text-copy-muted">
                {canManageProject ? "Owned project" : "Shared project"}
              </p>
            </div>

            {canManageProject ? (
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Rename ${project.name}`}
                  onClick={() => openRenameDialog(project)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${project.name}`}
                  onClick={() => openDeleteDialog(project)}
                >
                  <Trash2 className="h-4 w-4 text-state-error" />
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  className,
}: ProjectSidebarProps) {
  const { openCreateDialog } = useProjectDialogsContext();

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close project sidebar"
          className="fixed inset-0 z-30 bg-bg-base/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        aria-hidden={!isOpen}
        className={cn(
          "fixed left-3 top-[4.25rem] z-40 flex h-[calc(100vh-5rem)] w-80 max-w-[calc(100vw-1.5rem)] flex-col rounded-2xl border border-surface-border bg-surface/95 p-4 shadow-2xl shadow-bg-base/60 backdrop-blur transition-transform duration-200 ease-out",
          isOpen
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none -translate-x-[calc(100%+1.5rem)]",
          className
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-copy-primary">Projects</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close project sidebar"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="mt-4 min-h-0 flex-1 flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-bg-subtle">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
          <TabsContent value="my-projects" className="mt-4 min-w-0">
            <ProjectList projects={ownedProjects} />
          </TabsContent>
          <TabsContent value="shared" className="mt-4 min-w-0">
            <ProjectList projects={sharedProjects} />
          </TabsContent>
        </Tabs>

        <Button type="button" className="mt-4 w-full" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </aside>
    </>
  );
}
