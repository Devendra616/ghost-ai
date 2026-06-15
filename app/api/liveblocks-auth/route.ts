import { currentUser } from "@clerk/nextjs/server";

import { getCursorColorForUser, getLiveblocksClient } from "@/lib/liveblocks";
import {
  getCurrentProjectIdentity,
  hasProjectAccess,
} from "@/lib/project-access";

interface LiveblocksAuthRequestBody {
  room?: unknown;
}

function getDisplayName(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) {
    return "Anonymous";
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    fullName ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Anonymous"
  );
}

async function parseRoomId(request: Request) {
  let body: LiveblocksAuthRequestBody;

  try {
    body = (await request.json()) as LiveblocksAuthRequestBody;
  } catch {
    return null;
  }

  return typeof body.room === "string" && body.room.trim()
    ? body.room.trim()
    : null;
}

export async function POST(request: Request) {
  const identity = await getCurrentProjectIdentity();

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roomId = await parseRoomId(request);

  if (!roomId) {
    return Response.json({ error: "Room ID is required" }, { status: 400 });
  }

  const canAccessProject = await hasProjectAccess(roomId, identity);

  if (!canAccessProject) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await currentUser();
  const liveblocks = getLiveblocksClient();

  try {
    await liveblocks.getOrCreateRoom(roomId, {
      defaultAccesses: [],
    });
  } catch (error) {
    console.error("Failed to create/get Liveblocks room:", error);
    return Response.json(
      { error: "Failed to initialize room" },
      { status: 500 },
    );
  }

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: {
      name: getDisplayName(user),
      avatar: user?.imageUrl || "",
      color: getCursorColorForUser(identity.userId),
    },
  });

  session.allow(roomId, session.FULL_ACCESS);

  try {
    const { body, status } = await session.authorize();
    return new Response(body, { status });
  } catch (error) {
    console.error("Failed to authorize Liveblocks session:", error);
    return Response.json(
      { error: "Failed to authorize session" },
      { status: 500 },
    );
  }
}
