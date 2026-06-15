"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent, PointerEvent } from "react";

import { Handle, NodeResizer, Position, useReactFlow } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";

import { NodeShapeView } from "@/components/editor/node-shape-view";
import { cn } from "@/lib/utils";
import { MIN_NODE_SIZE, NODE_COLORS } from "@/types/canvas";
import type {
  CanvasEdge,
  CanvasNode as CanvasNodeType,
  NodeColor,
} from "@/types/canvas";

const handleClassName =
  "!z-30 !size-3 !border !border-bg-base !bg-copy-primary opacity-0 shadow-md transition-opacity group-hover:opacity-100";
const labelPlaceholder = "Add label";
const resizeHandleClassName =
  "!size-2.5 !border !border-bg-base !bg-brand !opacity-80 !shadow-md";
const resizeLineClassName = "!border-brand !opacity-40";

function stopCanvasInteraction(event: PointerEvent<HTMLTextAreaElement>) {
  event.stopPropagation();
}

export function CanvasNode({ data, id, selected }: NodeProps<CanvasNodeType>) {
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredColorFill, setHoveredColorFill] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { updateNodeData } = useReactFlow<CanvasNodeType, CanvasEdge>();
  const handleVisibilityClassName = selected ? "!opacity-100" : "";

  const handleColorChange = useCallback(
    (color: NodeColor) => {
      updateNodeData(id, {
        color,
      });
    },
    [id, updateNodeData],
  );

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, [isEditing]);

  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleLabelChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, {
        label: event.target.value,
      });
    },
    [id, updateNodeData],
  );

  const handleLabelKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      event.stopPropagation();

      if (event.key === "Escape") {
        event.preventDefault();
        setIsEditing(false);
        textareaRef.current?.blur();
      }
    },
    [],
  );

  return (
    <div className="group relative h-full w-full outline-none">
      <NodeResizer
        color="var(--accent-primary)"
        handleClassName={resizeHandleClassName}
        isVisible={selected}
        lineClassName={resizeLineClassName}
        minHeight={MIN_NODE_SIZE.height}
        minWidth={MIN_NODE_SIZE.width}
      />
      <NodeShapeView
        className="pointer-events-none"
        color={data.color}
        label={isEditing ? undefined : data.label}
        labelPlaceholder={isEditing ? undefined : labelPlaceholder}
        selected={selected}
        shape={data.shape}
      />
      {selected ? (
        <div className="absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-full gap-2 rounded-full border border-border-subtle bg-bg-default/95 p-2 shadow-2xl shadow-black/20 backdrop-blur-sm">
          {NODE_COLORS.map((colorOption) => {
            const isActive =
              colorOption.fill === data.color.fill &&
              colorOption.text === data.color.text;

            const boxShadow = isActive
              ? `0 0 0 3px ${colorOption.text}`
              : hoveredColorFill === colorOption.fill
                ? `0 0 0 8px ${colorOption.text}`
                : undefined;

            return (
              <button
                key={colorOption.fill}
                type="button"
                aria-label={`Set node color to ${colorOption.fill}`}
                className={cn(
                  "h-8 w-8 rounded-full border transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  !isActive && "border-border-subtle",
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  handleColorChange(colorOption);
                }}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerMove={(event) => event.stopPropagation()}
                onPointerEnter={(event) => {
                  event.stopPropagation();
                  setHoveredColorFill(colorOption.fill);
                }}
                onPointerLeave={(event) => {
                  event.stopPropagation();
                  setHoveredColorFill(null);
                }}
                style={{
                  backgroundColor: colorOption.fill,
                  color: colorOption.text,
                  borderColor: isActive ? colorOption.text : undefined,
                  boxShadow,
                }}
              />
            );
          })}
        </div>
      ) : null}
      {isEditing ? (
        <textarea
          ref={textareaRef}
          aria-label="Node label"
          className="nodrag nopan nowheel absolute left-1/2 top-1/2 z-20 max-h-[70%] w-[72%] -translate-x-1/2 -translate-y-1/2 resize-none overflow-hidden border-none bg-transparent p-0 text-center text-sm font-medium leading-tight text-copy-primary outline-none placeholder:text-copy-muted"
          onBlur={() => setIsEditing(false)}
          onChange={handleLabelChange}
          onDoubleClick={(event) => event.stopPropagation()}
          onKeyDown={handleLabelKeyDown}
          onPointerDown={stopCanvasInteraction}
          onPointerMove={stopCanvasInteraction}
          placeholder={labelPlaceholder}
          rows={2}
          value={data.label}
        />
      ) : (
        <button
          aria-label="Edit node label"
          className="absolute left-1/2 top-1/2 z-20 h-[70%] w-[72%] -translate-x-1/2 -translate-y-1/2 cursor-text bg-transparent"
          onDoubleClick={(event) => {
            event.stopPropagation();
            handleStartEditing();
          }}
          type="button"
        />
      )}
      <Handle
        className={cn(handleClassName, handleVisibilityClassName)}
        id="top"
        position={Position.Top}
        type="source"
      />
      <Handle
        className={cn(handleClassName, handleVisibilityClassName)}
        id="right"
        position={Position.Right}
        type="source"
      />
      <Handle
        className={cn(handleClassName, handleVisibilityClassName)}
        id="bottom"
        position={Position.Bottom}
        type="source"
      />
      <Handle
        className={cn(handleClassName, handleVisibilityClassName)}
        id="left"
        position={Position.Left}
        type="source"
      />
    </div>
  );
}
