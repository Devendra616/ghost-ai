"use client";

import { Maximize2, Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { ReactFlowInstance } from "@xyflow/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CanvasEdge, CanvasNode } from "@/types/canvas";

const viewportAnimationDuration = 180;

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

interface CanvasControlBarProps {
  canRedo: boolean;
  canUndo: boolean;
  onRedo: () => void;
  onUndo: () => void;
  reactFlowInstance: ReactFlowInstance<CanvasNode, CanvasEdge> | null;
}

interface ControlButtonProps {
  disabled?: boolean;
  icon: Icon;
  label: string;
  onClick: () => void;
}

function ControlButton({ disabled = false, icon: Icon, label, onClick }: ControlButtonProps) {
  return (
    <Button
      aria-label={label}
      className={cn(
        "rounded-full bg-elevated text-copy-secondary hover:bg-subtle hover:text-copy-primary",
        "disabled:cursor-not-allowed disabled:opacity-35",
      )}
      disabled={disabled}
      onClick={onClick}
      size="icon"
      title={label}
      type="button"
      variant="ghost"
    >
      <Icon aria-hidden="true" className="h-4 w-4" />
    </Button>
  );
}

export function CanvasControlBar({
  canRedo,
  canUndo,
  onRedo,
  onUndo,
  reactFlowInstance,
}: CanvasControlBarProps) {
  const isViewportDisabled = !reactFlowInstance;

  return (
    <div className="pointer-events-auto absolute bottom-24 left-6 z-10 flex items-center gap-1 rounded-full border border-surface-border bg-surface/90 p-1.5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-1">
        <ControlButton
          disabled={isViewportDisabled}
          icon={ZoomOut}
          label="Zoom out"
          onClick={() => {
            void reactFlowInstance?.zoomOut({ duration: viewportAnimationDuration });
          }}
        />
        <ControlButton
          disabled={isViewportDisabled}
          icon={Maximize2}
          label="Fit view"
          onClick={() => {
            void reactFlowInstance?.fitView({
              duration: viewportAnimationDuration,
              padding: 0.2,
            });
          }}
        />
        <ControlButton
          disabled={isViewportDisabled}
          icon={ZoomIn}
          label="Zoom in"
          onClick={() => {
            void reactFlowInstance?.zoomIn({ duration: viewportAnimationDuration });
          }}
        />
      </div>
      <div className="mx-1 h-6 w-px bg-surface-border" aria-hidden="true" />
      <div className="flex items-center gap-1">
        <ControlButton
          disabled={!canUndo}
          icon={Undo2}
          label="Undo"
          onClick={onUndo}
        />
        <ControlButton
          disabled={!canRedo}
          icon={Redo2}
          label="Redo"
          onClick={onRedo}
        />
      </div>
    </div>
  );
}
