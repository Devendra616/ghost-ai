"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { NodeShapeView } from "@/components/editor/node-shape-view";
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

interface ShapeDragPreviewState {
  payload: CanvasShapeDragPayload;
  position: {
    x: number;
    y: number;
  };
}

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
  const [shapeDragPreview, setShapeDragPreview] =
    useState<ShapeDragPreviewState | null>(null);
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

  useEffect(() => {
    if (!shapeDragPreview) {
      return;
    }

    function handleWindowDragOver(event: globalThis.DragEvent) {
      setShapeDragPreview((current) => {
        if (!current) {
          return null;
        }

        return {
          payload: current.payload,
          position: {
            x: event.clientX,
            y: event.clientY,
          },
        };
      });
    }

    function hidePreview() {
      setShapeDragPreview(null);
    }

    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", hidePreview);
    window.addEventListener("dragend", hidePreview);

    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", hidePreview);
      window.removeEventListener("dragend", hidePreview);
    };
  }, [shapeDragPreview]);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (Array.from(event.dataTransfer.types).includes(SHAPE_DRAG_MIME_TYPE)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";

      setShapeDragPreview((current) => {
        const payload = current?.payload ?? readShapeDragPayload(event.dataTransfer);

        if (!payload) {
          return null;
        }

        return {
          payload,
          position: {
            x: event.clientX,
            y: event.clientY,
          },
        };
      });
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
        setShapeDragPreview(null);
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
      setShapeDragPreview(null);
    },
    [reactFlowInstance],
  );

  const handleShapeDragStart = useCallback(
    (payload: CanvasShapeDragPayload, position: { x: number; y: number }) => {
      setShapeDragPreview({
        payload,
        position,
      });
    },
    [],
  );

  const handleShapeDragEnd = useCallback(() => {
    setShapeDragPreview(null);
  }, []);

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
      {shapeDragPreview ? (
        <div
          className="pointer-events-none fixed z-50 opacity-75"
          style={{
            height: shapeDragPreview.payload.size.height,
            left: shapeDragPreview.position.x - shapeDragPreview.payload.size.width / 2,
            top: shapeDragPreview.position.y - shapeDragPreview.payload.size.height / 2,
            width: shapeDragPreview.payload.size.width,
          }}
        >
          <NodeShapeView
            color={NODE_COLORS[0]}
            selected
            shape={shapeDragPreview.payload.shape}
          />
        </div>
      ) : null}
      <ShapePanel
        onShapeDragEnd={handleShapeDragEnd}
        onShapeDragStart={handleShapeDragStart}
      />
    </div>
  );
}
