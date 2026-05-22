"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

import type { CanvasNode as CanvasNodeType } from "@/types/canvas";

export function CanvasNode({ data, selected }: NodeProps<CanvasNodeType>) {
  return (
    <div
      className="group flex h-full min-h-16 w-full min-w-28 items-center justify-center rounded-xl border px-4 py-3 text-center text-sm font-medium shadow-lg outline-none"
      style={{
        backgroundColor: data.color.fill,
        borderColor: selected ? "var(--accent-primary)" : "var(--border-subtle)",
        color: data.color.text,
      }}
    >
      <Handle
        className="!size-2 !border-0 !bg-copy-primary opacity-0 transition-opacity group-hover:opacity-100"
        position={Position.Top}
        type="source"
      />
      <Handle
        className="!size-2 !border-0 !bg-copy-primary opacity-0 transition-opacity group-hover:opacity-100"
        position={Position.Right}
        type="source"
      />
      <Handle
        className="!size-2 !border-0 !bg-copy-primary opacity-0 transition-opacity group-hover:opacity-100"
        position={Position.Bottom}
        type="source"
      />
      <Handle
        className="!size-2 !border-0 !bg-copy-primary opacity-0 transition-opacity group-hover:opacity-100"
        position={Position.Left}
        type="source"
      />
      <span className="truncate">{data.label}</span>
    </div>
  );
}
