import { Liveblocks } from "@liveblocks/node";

const CURSOR_COLORS = [
  "#00c8d4",
  "#6457f9",
  "#34d399",
  "#fbbf24",
  "#ff4d4f",
  "#8b82ff",
  "#0ac7b4",
  "#f75f8f",
] as const;

declare global {
  var cachedLiveblocksClient: InstanceType<typeof Liveblocks> | undefined;
}

function getLiveblocksSecret() {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;

  if (!secret) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is required.");
  }

  return secret;
}

export function getLiveblocksClient() {
  if (!globalThis.cachedLiveblocksClient) {
    globalThis.cachedLiveblocksClient = new Liveblocks({
      secret: getLiveblocksSecret(),
    });
  }

  return globalThis.cachedLiveblocksClient;
}

export function getCursorColorForUser(userId: string) {
  let hash = 0;

  for (let index = 0; index < userId.length; index += 1) {
    hash = (hash * 31 + userId.charCodeAt(index)) >>> 0;
  }

  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}
