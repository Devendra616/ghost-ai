import { auth, currentUser } from "@clerk/nextjs/server";

import { normalizeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export interface ProjectIdentity {
  primaryEmail: string | null;
  userId: string;
}

const accessibleProjectSelect = {
  id: true,
  ownerId: true,
  name: true,
  description: true,
  status: true,
  canvasJsonPath: true,
  createdAt: true,
  updatedAt: true,
} as const;

export async function getCurrentProjectIdentity() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return null;
  }

  const user = await currentUser();

  return {
    userId,
    primaryEmail: user?.primaryEmailAddress?.emailAddress
      ? normalizeEmail(user.primaryEmailAddress.emailAddress)
      : null,
  } satisfies ProjectIdentity;
}

export async function getAccessibleProject(
  projectId: string,
  identity: ProjectIdentity
) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: identity.userId },
        ...(identity.primaryEmail
          ? [{ collaborators: { some: { email: identity.primaryEmail } } }]
          : []),
      ],
    },
    select: accessibleProjectSelect,
  });
}

export async function hasProjectAccess(
  projectId: string,
  identity: ProjectIdentity
) {
  const project = await getAccessibleProject(projectId, identity);

  return Boolean(project);
}
