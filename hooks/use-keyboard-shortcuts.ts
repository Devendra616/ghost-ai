"use client";

import { useEffect } from "react";
import type { ReactFlowInstance } from "@xyflow/react";

import type { CanvasEdge, CanvasNode } from "@/types/canvas";

interface UseKeyboardShortcutsOptions {
  reactFlowInstance: ReactFlowInstance<CanvasNode, CanvasEdge> | null;
  onRedo: () => void;
  onUndo: () => void;
}

const viewportAnimationDuration = 180;

function isEditableElement(element: Element | null) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  const tagName = element.tagName.toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    element.isContentEditable ||
    Boolean(element.closest("[contenteditable='true']"))
  );
}

export function useKeyboardShortcuts({
  reactFlowInstance,
  onRedo,
  onUndo,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || isEditableElement(event.target as Element | null)) {
        return;
      }

      const key = event.key.toLowerCase();
      const usesCommandModifier = event.metaKey || event.ctrlKey;

      if (usesCommandModifier && !event.altKey && key === "z") {
        event.preventDefault();

        if (event.shiftKey) {
          onRedo();
        } else {
          onUndo();
        }

        return;
      }

      if (usesCommandModifier && !event.altKey && key === "y") {
        event.preventDefault();
        onRedo();
        return;
      }

      if (!usesCommandModifier && !event.altKey && (event.key === "+" || event.key === "=")) {
        event.preventDefault();
        void reactFlowInstance?.zoomIn({ duration: viewportAnimationDuration });
        return;
      }

      if (!usesCommandModifier && !event.altKey && event.key === "-") {
        event.preventDefault();
        void reactFlowInstance?.zoomOut({ duration: viewportAnimationDuration });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onRedo, onUndo, reactFlowInstance]);
}
