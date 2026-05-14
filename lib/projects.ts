import { prisma } from "@/lib/prisma";

const projectSelect = {
  id: true,
  ownerId: true,
  name: true,
  description: true,
  status: true,
  canvasJsonPath: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const DEFAULT_PROJECT_NAME = "Untitled Project";

export async function listOwnedProjects(ownerId: string) {
  return prisma.project.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    select: projectSelect,
  });
}

export async function listSharedProjects(email: string, ownerId: string) {
  return prisma.project.findMany({
    where: {
      ownerId: { not: ownerId },
      collaborators: {
        some: {
          email,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    select: projectSelect,
  });
}

export async function createOwnedProject(
  ownerId: string,
  name: string,
  id?: string
) {
  return prisma.project.create({
    data: {
      id,
      ownerId,
      name,
    },
    select: projectSelect,
  });
}

export async function findProjectOwner(projectId: string) {
  return prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });
}

export async function renameOwnedProject(projectId: string, name: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: { name },
    select: projectSelect,
  });
}

export async function deleteOwnedProject(projectId: string) {
  await prisma.project.delete({
    where: { id: projectId },
  });
}
