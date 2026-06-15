"use client";

import { Download } from "lucide-react";

import { EditorDialogPattern } from "@/components/editor/editor-dialog-pattern";
import { NodeShapeView } from "@/components/editor/node-shape-view";
import { CANVAS_TEMPLATES } from "@/components/editor/starter-templates";
import type { CanvasTemplate } from "@/components/editor/starter-templates";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CanvasNode } from "@/types/canvas";

interface StarterTemplatesModalProps {
  open: boolean;
  onImport: (template: CanvasTemplate) => void;
  onOpenChange: (isOpen: boolean) => void;
}

interface Bounds {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
}

const previewSize = {
  height: 220,
  width: 520,
};
const previewPadding = 32;

function getNodeSize(node: CanvasNode) {
  return {
    height: Number(node.style?.height ?? 88),
    width: Number(node.style?.width ?? 160),
  };
}

function getNodeCenter(node: CanvasNode) {
  const size = getNodeSize(node);

  return {
    x: node.position.x + size.width / 2,
    y: node.position.y + size.height / 2,
  };
}

function getTemplateBounds(nodes: CanvasNode[]): Bounds {
  return nodes.reduce<Bounds>(
    (bounds, node) => {
      const size = getNodeSize(node);

      return {
        maxX: Math.max(bounds.maxX, node.position.x + size.width),
        maxY: Math.max(bounds.maxY, node.position.y + size.height),
        minX: Math.min(bounds.minX, node.position.x),
        minY: Math.min(bounds.minY, node.position.y),
      };
    },
    {
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
    },
  );
}

function getPreviewTransform(template: CanvasTemplate) {
  const bounds = getTemplateBounds(template.nodes);
  const graphWidth = Math.max(bounds.maxX - bounds.minX, 1);
  const graphHeight = Math.max(bounds.maxY - bounds.minY, 1);
  const availableWidth = previewSize.width - previewPadding * 2;
  const availableHeight = previewSize.height - previewPadding * 2;
  const scale = Math.min(availableWidth / graphWidth, availableHeight / graphHeight);
  const offsetX = previewPadding + (availableWidth - graphWidth * scale) / 2;
  const offsetY = previewPadding + (availableHeight - graphHeight * scale) / 2;

  return {
    scale,
    translateX: offsetX - bounds.minX * scale,
    translateY: offsetY - bounds.minY * scale,
  };
}

function transformPoint(
  point: { x: number; y: number },
  transform: ReturnType<typeof getPreviewTransform>,
) {
  return {
    x: point.x * transform.scale + transform.translateX,
    y: point.y * transform.scale + transform.translateY,
  };
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const transform = getPreviewTransform(template);
  const nodesById = new Map(template.nodes.map((node) => [node.id, node]));

  return (
    <div
      className="relative aspect-[26/11] w-full overflow-hidden rounded-xl border border-surface-border bg-bg-subtle"
      style={{
        maxHeight: previewSize.height,
      }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${previewSize.width} ${previewSize.height}`}
      >
        {template.edges.map((edge) => {
          const source = nodesById.get(edge.source);
          const target = nodesById.get(edge.target);

          if (!source || !target) {
            return null;
          }

          const sourcePoint = transformPoint(getNodeCenter(source), transform);
          const targetPoint = transformPoint(getNodeCenter(target), transform);

          return (
            <line
              key={edge.id}
              stroke="var(--text-secondary)"
              strokeLinecap="round"
              strokeWidth="2"
              x1={sourcePoint.x}
              x2={targetPoint.x}
              y1={sourcePoint.y}
              y2={targetPoint.y}
            />
          );
        })}
      </svg>
      {template.nodes.map((node) => {
        const size = getNodeSize(node);

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              height: size.height * transform.scale,
              left: node.position.x * transform.scale + transform.translateX,
              top: node.position.y * transform.scale + transform.translateY,
              width: size.width * transform.scale,
            }}
          >
            <NodeShapeView
              className="shadow-none [&_span]:max-w-[78%] [&_span]:text-[8px] [&_span]:font-semibold [&_span]:leading-none"
              color={node.data.color}
              label={node.data.label}
              shape={node.data.shape}
            />
          </div>
        );
      })}
    </div>
  );
}

export function StarterTemplatesModal({
  onImport,
  onOpenChange,
  open,
}: StarterTemplatesModalProps) {
  function importTemplate(template: CanvasTemplate) {
    onImport(template);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <EditorDialogPattern
        title="Starter templates"
        description="Replace the current canvas with a predefined system design."
        className="sm:max-w-6xl"
      >
        <ScrollArea className="max-h-[min(68vh,680px)] pr-3">
          <div className="grid gap-4 lg:grid-cols-2">
            {CANVAS_TEMPLATES.map((template) => (
              <article
                key={template.id}
                className="flex min-h-0 flex-col gap-4 rounded-2xl border border-surface-border bg-bg-surface p-4"
              >
                <TemplatePreview template={template} />
                <div className="min-h-[5rem] space-y-2">
                  <h3 className="text-sm font-medium text-copy-primary">
                    {template.name}
                  </h3>
                  <p className="text-sm leading-5 text-copy-muted">
                    {template.description}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-auto border-surface-border-subtle"
                  onClick={() => importTemplate(template)}
                >
                  <Download className="h-4 w-4" />
                  Import
                </Button>
              </article>
            ))}
          </div>
        </ScrollArea>
      </EditorDialogPattern>
    </Dialog>
  );
}
