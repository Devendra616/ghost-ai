import { DEFAULT_PROJECT_NAME } from "@/lib/projects";

interface ProjectInput {
  id?: unknown;
  name?: unknown;
}

export interface ParsedProjectName {
  ok: true;
  id?: string;
  name: string;
}

export interface ProjectInputError {
  ok: false;
  message: string;
}

export type ProjectInputResult = ParsedProjectName | ProjectInputError;

const projectIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readJsonBody(request: Request): Promise<unknown> {
  const text = await request.text();

  if (!text.trim()) {
    return {};
  }

  return JSON.parse(text);
}

export async function parseCreateProjectInput(
  request: Request
): Promise<ProjectInputResult> {
  let body: unknown;

  try {
    body = await readJsonBody(request);
  } catch {
    return { ok: false, message: "Invalid JSON body." };
  }

  if (!isRecord(body)) {
    return { ok: false, message: "Request body must be an object." };
  }

  const input = body as ProjectInput;
  let id: string | undefined;

  if (input.id !== undefined && input.id !== null) {
    if (typeof input.id !== "string") {
      return { ok: false, message: "Project ID must be a string." };
    }

    id = input.id.trim();

    if (!projectIdPattern.test(id)) {
      return { ok: false, message: "Project ID must be a slug." };
    }
  }

  if (input.name === undefined || input.name === null) {
    return { ok: true, id, name: DEFAULT_PROJECT_NAME };
  }

  if (typeof input.name !== "string") {
    return { ok: false, message: "Project name must be a string." };
  }

  const name = input.name.trim();
  return { ok: true, id, name: name || DEFAULT_PROJECT_NAME };
}

export async function parseRenameProjectInput(
  request: Request
): Promise<ProjectInputResult> {
  let body: unknown;

  try {
    body = await readJsonBody(request);
  } catch {
    return { ok: false, message: "Invalid JSON body." };
  }

  if (!isRecord(body)) {
    return { ok: false, message: "Request body must be an object." };
  }

  const input = body as ProjectInput;

  if (typeof input.name !== "string") {
    return { ok: false, message: "Project name must be a string." };
  }

  const name = input.name.trim();

  if (!name) {
    return { ok: false, message: "Project name is required." };
  }

  return { ok: true, name };
}
