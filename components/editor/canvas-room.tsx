"use client";

import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from "@liveblocks/react";

import { CanvasErrorBoundary } from "@/components/editor/canvas-error-boundary";
import { CollaborativeCanvas } from "@/components/editor/collaborative-canvas";

interface CanvasRoomProps {
  roomId: string;
}

function CanvasFallback({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[calc(100vh-3.5rem)] items-center justify-center bg-base px-6 text-center">
      <p className="text-sm text-copy-muted">{message}</p>
    </div>
  );
}

export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          isThinking: false,
        }}
      >
        <CanvasErrorBoundary
          fallback={<CanvasFallback message="Unable to connect to the collaborative canvas." />}
        >
          <ClientSideSuspense fallback={<CanvasFallback message="Loading canvas..." />}>
            <CollaborativeCanvas />
          </ClientSideSuspense>
        </CanvasErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
