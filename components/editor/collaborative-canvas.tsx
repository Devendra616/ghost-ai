"use client";

import { useCallback, useRef, useState } from "react";
import type { DragEvent } from "react";

import { Cursors, useLiveblocksFlow } from "@liveblocks/react-flow";
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  MiniMap,
  ReactFlow,
} from "@xyflow/react";
import type { ReactFlowInstance } from "@xyflow/react";

import { CanvasNode as CanvasNodeRenderer } from "@/components/editor/canvas-node";
import { ShapePanel } from "@/components/editor/shape-panel";
import type { CanvasEdge, CanvasNode } from "@/types/canvas";
import {
  CANVAS_NODE_TYPE,
  DEFAULT_NODE_SIZES,
  NODE_COLORS,
  NODE_SHAPES,
  SHAPE_DRAG_MIME_TYPE,
} from "@/types/canvas";
import type { CanvasShapeDragPayload, NodeShape } from "@/types/canvas";

const defaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "var(--text-primary)",
  },
  style: {
    stroke: "var(--text-primary)",
    strokeWidth: 1,
  },
} satisfies Partial<CanvasEdge>;

const nodeTypes = {
  [CANVAS_NODE_TYPE]: CanvasNodeRenderer,
};

const nodeShapeSet = new Set<NodeShape>(NODE_SHAPES);

function readShapeDragPayload(dataTransfer: DataTransfer): CanvasShapeDragPayload | null {
  const rawPayload = dataTransfer.getData(SHAPE_DRAG_MIME_TYPE);

  if (!rawPayload) {
    return null;
  }

  try {
    const payload = JSON.parse(rawPayload) as Partial<CanvasShapeDragPayload>;

    if (
      !payload.shape ||
      !nodeShapeSet.has(payload.shape) ||
      !payload.size ||
      typeof payload.size.width !== "number" ||
      typeof payload.size.height !== "number"
    ) {
      return null;
    }

    return {
      shape: payload.shape,
      size: payload.size,
    };
  } catch {
    return null;
  }
}

export function CollaborativeCanvas() {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<CanvasNode, CanvasEdge> | null>(null);
  const nodeCounter = useRef(0);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: {
        initial: [],
      },
      edges: {
        initial: [],
      },
    });

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (Array.from(event.dataTransfer.types).includes(SHAPE_DRAG_MIME_TYPE)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    }
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowInstance) {
        return;
      }

      const payload = readShapeDragPayload(event.dataTransfer);

      if (!payload) {
        return;
      }

      const size = payload.size ?? DEFAULT_NODE_SIZES[payload.shape];
      const canvasPosition = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const counter = nodeCounter.current;
      nodeCounter.current += 1;

      const node = {
        id: `${payload.shape}-${Date.now()}-${counter}`,
        type: CANVAS_NODE_TYPE,
        position: {
          x: canvasPosition.x - size.width / 2,
          y: canvasPosition.y - size.height / 2,
        },
        data: {
          label: "",
          color: NODE_COLORS[0],
          shape: payload.shape,
        },
        style: {
          width: size.width,
          height: size.height,
        },
      } satisfies CanvasNode;

      reactFlowInstance.addNodes(node);
    },
    [reactFlowInstance],
  );

  return (
    <div
      className="relative h-full min-h-[calc(100vh-3.5rem)] bg-base"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow<CanvasNode, CanvasEdge>
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={defaultEdgeOptions}
        edges={edges}
        fitView
        nodes={nodes}
        onConnect={onConnect}
        onDelete={onDelete}
        onEdgesChange={onEdgesChange}
        onInit={setReactFlowInstance}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
      >
        <MiniMap
          maskColor="rgba(8, 8, 9, 0.7)"
          nodeColor="var(--bg-subtle)"
          nodeStrokeColor="var(--border-subtle)"
          pannable
          position="bottom-left"
          zoomable
        />
        <Background
          color="var(--border-default)"
          gap={24}
          size={1}
          variant={BackgroundVariant.Dots}
        />
        <Cursors />
      </ReactFlow>
      <ShapePanel />
    </div>
  );
}
