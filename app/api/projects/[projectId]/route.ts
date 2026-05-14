import { auth } from "@clerk/nextjs/server";

import { parseRenameProjectInput } from "@/lib/api-project-input";
import {
  deleteOwnedProject,
  findProjectOwner,
  renameOwnedProject,
} from "@/lib/projects";

interface ProjectRouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

async function requireProjectOwner(projectId: string, userId: string) {
  const project = await findProjectOwner(projectId);

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

export async function PATCH(request: Request, context: ProjectRouteContext) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await context.params;
  const ownerError = await requireProjectOwner(projectId, userId);

  if (ownerError) {
    return ownerError;
  }

  const input = await parseRenameProjectInput(request);

  if (!input.ok) {
    return Response.json({ error: input.message }, { status: 400 });
  }

  const project = await renameOwnedProject(projectId, input.name);

  return Response.json({ project });
}

export async function DELETE(_request: Request, context: ProjectRouteContext) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await context.params;
  const ownerError = await requireProjectOwner(projectId, userId);

  if (ownerError) {
    return ownerError;
  }

  await deleteOwnedProject(projectId);

  return Response.json({ success: true });
}
