import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EditorHome } from "@/components/editor/editor-home";
import { EditorLayout } from "@/components/editor/editor-layout";
import { listOwnedProjects, listSharedProjects } from "@/lib/projects";
import type { ProjectListItem } from "@/types/project";

interface ProjectWorkspacePageProps {
  params: Promise<{
    projectId: string;
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

async function getEditorProjects(userId: string) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const [ownedProjects, sharedProjects] = await Promise.all([
    listOwnedProjects(userId),
    email ? listSharedProjects(email, userId) : Promise.resolve([]),
  ]);

  return {
    ownedProjects: ownedProjects.map((project) => serializeProject(project, "owned")),
    sharedProjects: sharedProjects.map((project) => serializeProject(project, "shared")),
  };
}

export default async function ProjectWorkspacePage({
  params,
}: ProjectWorkspacePageProps) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in");
  }

  const { projectId } = await params;
  const { ownedProjects, sharedProjects } = await getEditorProjects(userId);

  return (
    <EditorLayout
      activeProjectId={projectId}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
      <EditorHome />
    </EditorLayout>
  );
}
