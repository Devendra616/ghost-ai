import { redirect } from "next/navigation";

import { AccessDenied } from "@/components/editor/access-denied";
import { CanvasRoom } from "@/components/editor/canvas-room";
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
      <CanvasRoom roomId={project.id} />
    </EditorLayout>
  );
}
