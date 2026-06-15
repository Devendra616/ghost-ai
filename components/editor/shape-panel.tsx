"use client";

import {
  Circle,
  Database,
  Diamond,
  Hexagon,
  Pentagon,
  Pill,
  RectangleHorizontal,
} from "lucide-react";
import type { ComponentType, DragEvent, SVGProps } from "react";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_NODE_SIZES,
  NODE_SHAPES,
  SHAPE_DRAG_MIME_TYPE,
} from "@/types/canvas";
import type { CanvasShapeDragPayload, NodeShape } from "@/types/canvas";

type ShapeIcon = ComponentType<SVGProps<SVGSVGElement>>;

function RhombusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.5L20.5 12L12 20.5L3.5 12L12 3.5Z" />
    </svg>
  );
}

const shapeIcons = {
  rectangle: RectangleHorizontal,
  diamond: Diamond,
  circle: Circle,
  pill: Pill,
  cylinder: Database,
  pentagon: Pentagon,
  rhombus: RhombusIcon,
  hexagon: Hexagon,
} satisfies Record<NodeShape, ShapeIcon>;

interface ShapePanelProps {
  onShapeDragEnd?: () => void;
  onShapeDragStart?: (
    payload: CanvasShapeDragPayload,
    position: { x: number; y: number },
  ) => void;
}

function startShapeDrag(
  event: DragEvent<HTMLButtonElement>,
  shape: NodeShape,
  onShapeDragStart?: ShapePanelProps["onShapeDragStart"],
) {
  const payload = {
    shape,
    size: DEFAULT_NODE_SIZES[shape],
  } satisfies CanvasShapeDragPayload;

  event.dataTransfer.effectAllowed = "copy";
  event.dataTransfer.setData(SHAPE_DRAG_MIME_TYPE, JSON.stringify(payload));
  event.dataTransfer.setData("text/plain", shape);

  const dragImage = document.createElement("canvas");
  dragImage.width = 1;
  dragImage.height = 1;
  event.dataTransfer.setDragImage(dragImage, 0, 0);

  onShapeDragStart?.(payload, {
    x: event.clientX,
    y: event.clientY,
  });
}

export function ShapePanel({ onShapeDragEnd, onShapeDragStart }: ShapePanelProps) {
  return (
    <div className="pointer-events-auto absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-surface-border bg-surface/90 p-1.5 shadow-2xl backdrop-blur-md">
      {NODE_SHAPES.map((shape) => {
        const Icon = shapeIcons[shape];
        const label = `Drag ${shape}`;

        return (
          <Button
            aria-label={label}
            className="cursor-grab rounded-full border-surface-border-subtle bg-elevated text-copy-secondary hover:bg-subtle hover:text-copy-primary active:cursor-grabbing"
            draggable
            key={shape}
            onDragEnd={onShapeDragEnd}
            onDragStart={(event) => startShapeDrag(event, shape, onShapeDragStart)}
            size="icon"
            title={label}
            type="button"
            variant="ghost"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </Button>
        );
      })}
    </div>
  );
}
