import { auth } from "@clerk/nextjs/server";

import { removeProjectCollaborator } from "@/lib/project-collaborators";
import { findProjectOwner } from "@/lib/projects";

interface CollaboratorRouteContext {
  params: Promise<{
    collaboratorId: string;
    projectId: string;
  }>;
}

async function requireOwner(projectId: string, userId: string) {
  const project = await findProjectOwner(projectId);

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

export async function DELETE(
  _request: Request,
  context: CollaboratorRouteContext
) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collaboratorId, projectId } = await context.params;
  const ownerError = await requireOwner(projectId, userId);

  if (ownerError) {
    return ownerError;
  }

  await removeProjectCollaborator(projectId, collaboratorId);

  return Response.json({ success: true });
}
