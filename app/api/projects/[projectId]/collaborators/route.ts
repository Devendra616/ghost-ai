import { auth, currentUser } from "@clerk/nextjs/server";

import {
  addProjectCollaborator,
  enrichCollaboratorProfiles,
  findCollaboratorProfileByEmail,
  listProjectCollaborators,
  parseCollaboratorEmail,
  serializeCollaborator,
} from "@/lib/project-collaborators";
import {
  getAccessibleProject,
  getCurrentProjectIdentity,
} from "@/lib/project-access";
import { normalizeEmail } from "@/lib/email";
import { findProjectOwner } from "@/lib/projects";

interface CollaboratorsRouteContext {
  params: Promise<{
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

async function getCollaboratorsResponse(projectId: string, canManage: boolean) {
  const collaborators = await listProjectCollaborators(projectId);
  const profiles = await enrichCollaboratorProfiles(
    collaborators.map((collaborator) => collaborator.email)
  ).catch((error: unknown) => {
    console.error("Failed to enrich collaborator profiles", error);
    return new Map();
  });

  return Response.json({
    canManage,
    collaborators: collaborators.map((collaborator) =>
      serializeCollaborator(
        collaborator,
        profiles.get(collaborator.email.toLowerCase())
      )
    ),
  });
}

export async function GET(_request: Request, context: CollaboratorsRouteContext) {
  const identity = await getCurrentProjectIdentity();

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await context.params;
  const project = await getAccessibleProject(projectId, identity);

  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  return getCollaboratorsResponse(projectId, project.ownerId === identity.userId);
}

export async function POST(request: Request, context: CollaboratorsRouteContext) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await context.params;
  const ownerError = await requireOwner(projectId, userId);

  if (ownerError) {
    return ownerError;
  }

  const body = (await request.json().catch(() => null)) as
    | { email?: unknown }
    | null;
  const email = parseCollaboratorEmail(body?.email);

  if (!email) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const user = await currentUser();
  const ownerEmail = user?.primaryEmailAddress?.emailAddress
    ? normalizeEmail(user.primaryEmailAddress.emailAddress)
    : null;

  if (ownerEmail === email) {
    return Response.json(
      { error: "Project owners already have access." },
      { status: 400 }
    );
  }

  const profile = await findCollaboratorProfileByEmail(email).catch(
    (error: unknown) => {
      console.error("Failed to verify collaborator email", error);
      return undefined;
    }
  );

  if (profile === undefined) {
    return Response.json(
      { error: "Unable to verify that user right now. Try again shortly." },
      { status: 503 }
    );
  }

  if (!profile) {
    return Response.json(
      { error: "No registered user found for that email." },
      { status: 404 }
    );
  }

  await addProjectCollaborator(projectId, email);

  return getCollaboratorsResponse(projectId, true);
}
