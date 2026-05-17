"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Loader2,
  MailPlus,
  Trash2,
  UserRound,
} from "lucide-react";

import { EditorDialogPattern } from "@/components/editor/editor-dialog-pattern";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ShareCollaborator {
  avatarUrl: string | null;
  createdAt: string;
  displayName: string | null;
  email: string;
  id: string;
}

interface CollaboratorsResponse {
  canManage: boolean;
  collaborators: ShareCollaborator[];
}

interface ShareDialogProps {
  canManage: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId?: string;
  projectName?: string;
}

async function parseCollaboratorsResponse(response: Response) {
  const data = (await response.json().catch(() => null)) as
    | (Partial<CollaboratorsResponse> & { error?: string })
    | null;

  if (!response.ok) {
    throw new Error(data?.error ?? "Collaborator request failed.");
  }

  return {
    canManage: Boolean(data?.canManage),
    collaborators: data?.collaborators ?? [],
  } satisfies CollaboratorsResponse;
}

function getInitials(collaborator: ShareCollaborator) {
  const label = collaborator.displayName ?? collaborator.email;
  return label.slice(0, 2).toUpperCase();
}

export function ShareDialog({
  canManage,
  onOpenChange,
  projectId,
  projectName,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<ShareCollaborator[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(projectId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [serverCanManage, setServerCanManage] = useState(canManage);

  const projectLink = useMemo(() => {
    if (typeof window === "undefined" || !projectId) {
      return "";
    }

    return `${window.location.origin}/editor/${projectId}`;
  }, [projectId]);

  useEffect(() => {
    let isCurrent = true;

    if (!projectId) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setCollaborators([]);

    fetch(`/api/projects/${projectId}/collaborators`)
      .then(parseCollaboratorsResponse)
      .then((data) => {
        if (!isCurrent) return;
        setCollaborators(data.collaborators);
        setServerCanManage(data.canManage);
      })
      .catch((loadError: unknown) => {
        if (!isCurrent) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load collaborators."
        );
      })
      .finally(() => {
        if (!isCurrent) return;
        setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [projectId]);

  useEffect(() => {
    if (!isCopied) return;

    const timeout = window.setTimeout(() => setIsCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [isCopied]);

  async function copyProjectLink() {
    if (!projectLink) return;

    await navigator.clipboard.writeText(projectLink);
    setIsCopied(true);
  }

  async function inviteCollaborator() {
    if (!projectId || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await parseCollaboratorsResponse(response);
      setCollaborators(data.collaborators);
      setServerCanManage(data.canManage);
      setEmail("");
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : "Unable to invite collaborator.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeCollaborator(collaboratorId: string) {
    if (!projectId || removingId) return;

    setRemovingId(collaboratorId);
    setError(null);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Unable to remove collaborator.");
      }

      setCollaborators((current) =>
        current.filter((collaborator) => collaborator.id !== collaboratorId)
      );
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Unable to remove collaborator.");
    } finally {
      setRemovingId(null);
    }
  }

  const canManageAccess = canManage && serverCanManage;

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <EditorDialogPattern
        title="Share project"
        description={projectName ? `Manage access to ${projectName}.` : undefined}
        className="sm:max-w-lg"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={projectLink}
              readOnly
              aria-label="Project link"
              className="border-surface-border-subtle bg-bg-subtle text-copy-secondary"
            />
            <Button
              type="button"
              variant="outline"
              onClick={copyProjectLink}
              className="border-surface-border-subtle"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>

          {canManageAccess ? (
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void inviteCollaborator();
              }}
            >
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="collaborator@example.com"
                type="email"
                className="border-surface-border-subtle bg-bg-subtle text-copy-primary placeholder:text-copy-faint"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MailPlus className="h-4 w-4" />
                )}
                Invite
              </Button>
            </form>
          ) : (
            <div className="rounded-2xl border border-surface-border bg-bg-subtle px-4 py-3 text-sm text-copy-muted">
              You can view collaborators for this project.
            </div>
          )}

          {error ? (
            <p className="rounded-xl border border-state-error/40 bg-bg-subtle px-3 py-2 text-sm text-state-error">
              {error}
            </p>
          ) : null}

          <div className="rounded-2xl border border-surface-border bg-bg-subtle">
            <div className="border-b border-surface-border px-4 py-3 text-sm font-medium text-copy-primary">
              Collaborators
            </div>
            <div className="max-h-72 overflow-y-auto">
              {isLoading ? (
                <div className="flex h-28 items-center justify-center text-copy-muted">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : collaborators.length > 0 ? (
                <ul className="divide-y divide-surface-border">
                  {collaborators.map((collaborator) => (
                    <li
                      key={collaborator.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-surface-border bg-bg-elevated text-xs font-medium text-copy-secondary">
                        {collaborator.avatarUrl ? (
                          <img
                            src={collaborator.avatarUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span aria-hidden="true">{getInitials(collaborator)}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-copy-primary">
                          {collaborator.displayName ?? collaborator.email}
                        </p>
                        <p className="truncate text-xs text-copy-muted">
                          {collaborator.email}
                        </p>
                      </div>
                      {canManageAccess ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove ${collaborator.email}`}
                          onClick={() => void removeCollaborator(collaborator.id)}
                          disabled={removingId === collaborator.id}
                          className="text-copy-muted hover:text-state-error"
                        >
                          {removingId === collaborator.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex h-28 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-copy-muted">
                  <UserRound className="h-5 w-5 text-copy-faint" />
                  No collaborators yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </EditorDialogPattern>
    </Dialog>
  );
}
