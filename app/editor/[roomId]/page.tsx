import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { EditorLayout } from "@/components/editor/editor-layout";
import {
  getAccessibleProject,
  getCurrentProjectIdentity,
  type ProjectIdentity,
} from "@/lib/project-access";
import { listOwnedProjects, listSharedProjects } from "@/lib/projects";
import type { ProjectListItem } from "@/types/project";

interface ProjectWorkspacePageProps {
  params: Promise<{
    roomId: string;
  }>;
}

function serializeProject(
  project: Awaited<ReturnType<typeof listOwnedProjects>>[number],
  ownerType: ProjectListItem["ownerType"]
): ProjectListItem {
  return {
    id: project.id,
    name: project.name,
    ownerType,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

async function getEditorProjects(identity: ProjectIdentity) {
  const email = identity?.primaryEmail ?? "";
  const [ownedProjects, sharedProjects] = await Promise.all([
    listOwnedProjects(identity.userId),
    email ? listSharedProjects(email, identity.userId) : Promise.resolve([]),
  ]);

  return {
    ownedProjects: ownedProjects.map((project) => serializeProject(project, "owned")),
    sharedProjects: sharedProjects.map((project) => serializeProject(project, "shared")),
  };
}

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const identity = await getCurrentProjectIdentity();

  if (!identity) {
    redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in");
  }

  const { roomId } = await params;
  const project = await getAccessibleProject(roomId, identity);

  if (!project) {
    return <AccessDenied />;
  }

  const { ownedProjects, sharedProjects } = await getEditorProjects(identity);

  return (
    <EditorLayout
      activeProjectCanManage={project.ownerId === identity.userId}
      activeProjectId={roomId}
      activeProjectName={project.name}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
      <div className="relative flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden bg-base px-6">
        <div className="absolute inset-0 bg-[linear-gradient(var(--border-default)_1px,transparent_1px),linear-gradient(90deg,var(--border-default)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        <div className="relative max-w-md text-center">
          <p className="font-mono text-xs uppercase text-copy-faint">
            Room {project.id}
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-copy-primary">
            Canvas workspace
          </h1>
          <p className="mt-3 text-sm leading-6 text-copy-muted">
            Collaborative canvas logic will be added in a future step.
          </p>
        </div>
      </div>
    </EditorLayout>
  );
}
