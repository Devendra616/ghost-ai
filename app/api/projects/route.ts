import { auth } from "@clerk/nextjs/server";

import { parseCreateProjectInput } from "@/lib/api-project-input";
import { createOwnedProject, listOwnedProjects } from "@/lib/projects";

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await listOwnedProjects(userId);

  return Response.json({ projects });
}

export async function POST(request: Request) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = await parseCreateProjectInput(request);

  if (!input.ok) {
    return Response.json({ error: input.message }, { status: 400 });
  }

  const project = await createOwnedProject(userId, input.name, input.id);

  return Response.json({ project }, { status: 201 });
}
