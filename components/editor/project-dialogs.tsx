"use client";

import { AlertTriangle } from "lucide-react";

import { EditorDialogPattern } from "@/components/editor/editor-dialog-pattern";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ProjectActionsController } from "@/hooks/use-project-actions";

interface ProjectDialogsProps {
  controller: ProjectActionsController;
}

export function ProjectDialogs({ controller }: ProjectDialogsProps) {
  const {
    dialogState,
    isLoading,
    projectName,
    roomIdPreview,
    closeDialog,
    setProjectName,
    submitDialog,
  } = controller;

  const isOpen = Boolean(dialogState);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      {dialogState?.type === "create" ? (
        <EditorDialogPattern
          title="Create Project"
          description="Name the new architecture workspace."
          footer={
            <>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" form="create-project-form" disabled={isLoading}>
                Create Project
              </Button>
            </>
          }
        >
          <form
            id="create-project-form"
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              submitDialog();
            }}
          >
            <label className="space-y-2 text-sm font-medium text-copy-secondary">
              Project name
              <Input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Realtime payment platform"
                className="border-surface-border-subtle bg-bg-subtle text-copy-primary placeholder:text-copy-faint"
                autoFocus
              />
            </label>
            <div className="rounded-xl border border-surface-border bg-bg-subtle px-3 py-2">
              <p className="text-xs uppercase text-copy-faint">Room ID preview</p>
              <p className="mt-1 break-all font-mono text-sm text-brand">
                {roomIdPreview}
              </p>
            </div>
          </form>
        </EditorDialogPattern>
      ) : null}

      {dialogState?.type === "rename" && dialogState.project ? (
        <EditorDialogPattern
          title="Rename Project"
          description={`Current project: ${dialogState.project.name}`}
          footer={
            <>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" form="rename-project-form" disabled={isLoading}>
                Rename Project
              </Button>
            </>
          }
        >
          <form
            id="rename-project-form"
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              submitDialog();
            }}
          >
            <label className="space-y-2 text-sm font-medium text-copy-secondary">
              Project name
              <Input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                className="border-surface-border-subtle bg-bg-subtle text-copy-primary"
                autoFocus
              />
            </label>
          </form>
        </EditorDialogPattern>
      ) : null}

      {dialogState?.type === "delete" && dialogState.project ? (
        <EditorDialogPattern
          title="Delete Project"
          description={`This will remove ${dialogState.project.name} from your project list.`}
          footer={
            <>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={isLoading}
                onClick={submitDialog}
              >
                Delete Project
              </Button>
            </>
          }
        >
          <div className="flex items-start gap-3 rounded-2xl border border-state-error/40 bg-bg-subtle px-4 py-3 text-copy-secondary">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-state-error" />
            <p className="text-sm">
              This destructive action cannot be undone.
            </p>
          </div>
        </EditorDialogPattern>
      ) : null}
    </Dialog>
  );
}
