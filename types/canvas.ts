import type { Edge, Node } from "@xyflow/react";

export const CANVAS_NODE_TYPE = "canvasNode";
export const CANVAS_EDGE_TYPE = "canvasEdge";

export const NODE_COLORS = [
  { fill: "#1F1F1F", text: "#EDEDED" },
  { fill: "#10233D", text: "#52A8FF" },
  { fill: "#2E1938", text: "#BF7AF0" },
  { fill: "#331B00", text: "#FF990A" },
  { fill: "#3C1618", text: "#FF6166" },
  { fill: "#3A1726", text: "#F75F8F" },
  { fill: "#0F2E18", text: "#62C073" },
  { fill: "#062822", text: "#0AC7B4" },
] as const;

export const NODE_SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "pentagon",
  "rhombus",
  "hexagon",
] as const;

export type NodeColor = (typeof NODE_COLORS)[number];
export type NodeShape = (typeof NODE_SHAPES)[number];

export const DEFAULT_NODE_SIZES = {
  rectangle: { width: 180, height: 88 },
  diamond: { width: 150, height: 150 },
  circle: { width: 112, height: 112 },
  pill: { width: 172, height: 72 },
  cylinder: { width: 150, height: 112 },
  pentagon: { width: 144, height: 128 },
  rhombus: { width: 164, height: 104 },
  hexagon: { width: 160, height: 112 },
} as const satisfies Record<NodeShape, { width: number; height: number }>;

export const MIN_NODE_SIZE = {
  width: 80,
  height: 56,
} as const;

export const SHAPE_DRAG_MIME_TYPE = "application/x-ghost-ai-shape";

export interface CanvasShapeDragPayload {
  shape: NodeShape;
  size: {
    width: number;
    height: number;
  };
}

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color: NodeColor;
  shape: NodeShape;
}

export type CanvasNode = Node<CanvasNodeData, typeof CANVAS_NODE_TYPE>;
export type CanvasEdge = Edge<
  Record<string, unknown>,
  typeof CANVAS_EDGE_TYPE | "smoothstep"
>;
