import { clerkClient } from "@clerk/nextjs/server";

import { normalizeEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export interface CollaboratorProfile {
  avatarUrl: string | null;
  displayName: string | null;
  email: string;
}

const collaboratorSelect = {
  id: true,
  email: true,
  createdAt: true,
} as const;

function getDisplayName(user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.username || null;
}

export async function listProjectCollaborators(projectId: string) {
  return prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
    select: collaboratorSelect,
  });
}

export async function addProjectCollaborator(projectId: string, email: string) {
  return prisma.projectCollaborator.upsert({
    where: {
      projectId_email: {
        projectId,
        email: normalizeEmail(email),
      },
    },
    create: {
      projectId,
      email: normalizeEmail(email),
    },
    update: {},
    select: collaboratorSelect,
  });
}

export async function removeProjectCollaborator(
  projectId: string,
  collaboratorId: string
) {
  return prisma.projectCollaborator.deleteMany({
    where: {
      id: collaboratorId,
      projectId,
    },
  });
}

export async function enrichCollaboratorProfiles(emails: string[]) {
  const uniqueEmails = Array.from(new Set(emails.map(normalizeEmail)));

  if (uniqueEmails.length === 0) {
    return new Map<string, CollaboratorProfile>();
  }

  const client = await clerkClient();
  const users = await client.users.getUserList({
    emailAddress: uniqueEmails,
    limit: uniqueEmails.length,
  });

  const profiles = new Map<string, CollaboratorProfile>();

  for (const user of users.data) {
    const matchedEmail = user.emailAddresses
      .map((emailAddress) => normalizeEmail(emailAddress.emailAddress))
      .find((emailAddress) => uniqueEmails.includes(emailAddress));

    if (!matchedEmail) {
      continue;
    }

    profiles.set(matchedEmail, {
      avatarUrl: user.imageUrl || null,
      displayName: getDisplayName(user),
      email: matchedEmail,
    });
  }

  return profiles;
}

export async function findCollaboratorProfileByEmail(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const client = await clerkClient();
  const users = await client.users.getUserList({
    emailAddress: [normalizedEmail],
    limit: 1,
  });

  const user = users.data.find((candidate) =>
    candidate.emailAddresses.some(
      (emailAddress) =>
        normalizeEmail(emailAddress.emailAddress) === normalizedEmail
    )
  );

  if (!user) {
    return null;
  }

  return {
    avatarUrl: user.imageUrl || null,
    displayName: getDisplayName(user),
    email: normalizedEmail,
  } satisfies CollaboratorProfile;
}

export function serializeCollaborator(
  collaborator: Awaited<ReturnType<typeof listProjectCollaborators>>[number],
  profile?: CollaboratorProfile
) {
  return {
    id: collaborator.id,
    email: collaborator.email,
    displayName: profile?.displayName ?? null,
    avatarUrl: profile?.avatarUrl ?? null,
    createdAt: collaborator.createdAt.toISOString(),
  };
}

export function parseCollaboratorEmail(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const email = normalizeEmail(value);
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return isValid ? email : null;
}
