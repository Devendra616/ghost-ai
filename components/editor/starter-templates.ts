import { MarkerType } from "@xyflow/react";

import type { CanvasEdge, CanvasNode, NodeColor, NodeShape } from "@/types/canvas";
import { CANVAS_NODE_TYPE, DEFAULT_NODE_SIZES, NODE_COLORS } from "@/types/canvas";

export const OPEN_STARTER_TEMPLATES_EVENT = "ghost-ai:open-starter-templates";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

interface TemplateNodeInput {
  id: string;
  label: string;
  x: number;
  y: number;
  color: NodeColor;
  shape: NodeShape;
}

const edgeDefaults = {
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

function node({ color, id, label, shape, x, y }: TemplateNodeInput): CanvasNode {
  const size = DEFAULT_NODE_SIZES[shape];

  return {
    id,
    type: CANVAS_NODE_TYPE,
    position: { x, y },
    data: {
      label,
      color,
      shape,
    },
    style: {
      width: size.width,
      height: size.height,
    },
  };
}

function edge(id: string, source: string, target: string): CanvasEdge {
  return {
    id,
    source,
    target,
    ...edgeDefaults,
  };
}

export const CANVAS_TEMPLATES = [
  {
    id: "microservices-commerce",
    name: "Microservices Commerce",
    description: "A web client, API gateway, service cluster, database, cache, and event bus for a modular product platform.",
    nodes: [
      node({
        id: "micro-web",
        label: "Web App",
        x: 0,
        y: 120,
        color: NODE_COLORS[1],
        shape: "pentagon",
      }),
      node({
        id: "micro-gateway",
        label: "API Gateway",
        x: 240,
        y: 132,
        color: NODE_COLORS[7],
        shape: "pill",
      }),
      node({
        id: "micro-auth",
        label: "Auth Service",
        x: 520,
        y: 0,
        color: NODE_COLORS[2],
        shape: "rectangle",
      }),
      node({
        id: "micro-orders",
        label: "Orders Service",
        x: 520,
        y: 140,
        color: NODE_COLORS[3],
        shape: "rectangle",
      }),
      node({
        id: "micro-inventory",
        label: "Inventory Service",
        x: 520,
        y: 280,
        color: NODE_COLORS[6],
        shape: "rectangle",
      }),
      node({
        id: "micro-db",
        label: "Postgres",
        x: 800,
        y: 80,
        color: NODE_COLORS[1],
        shape: "cylinder",
      }),
      node({
        id: "micro-cache",
        label: "Redis Cache",
        x: 800,
        y: 250,
        color: NODE_COLORS[4],
        shape: "cylinder",
      }),
      node({
        id: "micro-events",
        label: "Event Bus",
        x: 520,
        y: 440,
        color: NODE_COLORS[5],
        shape: "hexagon",
      }),
    ],
    edges: [
      edge("micro-web-gateway", "micro-web", "micro-gateway"),
      edge("micro-gateway-auth", "micro-gateway", "micro-auth"),
      edge("micro-gateway-orders", "micro-gateway", "micro-orders"),
      edge("micro-gateway-inventory", "micro-gateway", "micro-inventory"),
      edge("micro-auth-db", "micro-auth", "micro-db"),
      edge("micro-orders-db", "micro-orders", "micro-db"),
      edge("micro-inventory-cache", "micro-inventory", "micro-cache"),
      edge("micro-orders-events", "micro-orders", "micro-events"),
      edge("micro-inventory-events", "micro-inventory", "micro-events"),
    ],
  },
  {
    id: "ci-cd-pipeline",
    name: "CI/CD Pipeline",
    description: "A delivery pipeline from source control through tests, artifact build, approval, deployment, and observability.",
    nodes: [
      node({
        id: "cicd-repo",
        label: "Git Repository",
        x: 0,
        y: 120,
        color: NODE_COLORS[6],
        shape: "pentagon",
      }),
      node({
        id: "cicd-ci",
        label: "CI Runner",
        x: 220,
        y: 132,
        color: NODE_COLORS[1],
        shape: "pill",
      }),
      node({
        id: "cicd-tests",
        label: "Test Suite",
        x: 460,
        y: 20,
        color: NODE_COLORS[2],
        shape: "diamond",
      }),
      node({
        id: "cicd-build",
        label: "Build Artifact",
        x: 460,
        y: 240,
        color: NODE_COLORS[3],
        shape: "rectangle",
      }),
      node({
        id: "cicd-registry",
        label: "Container Registry",
        x: 720,
        y: 240,
        color: NODE_COLORS[7],
        shape: "cylinder",
      }),
      node({
        id: "cicd-approval",
        label: "Manual Approval",
        x: 720,
        y: 20,
        color: NODE_COLORS[5],
        shape: "rhombus",
      }),
      node({
        id: "cicd-deploy",
        label: "Production Deploy",
        x: 980,
        y: 132,
        color: NODE_COLORS[4],
        shape: "hexagon",
      }),
      node({
        id: "cicd-monitoring",
        label: "Monitoring",
        x: 1220,
        y: 132,
        color: NODE_COLORS[0],
        shape: "circle",
      }),
    ],
    edges: [
      edge("cicd-repo-ci", "cicd-repo", "cicd-ci"),
      edge("cicd-ci-tests", "cicd-ci", "cicd-tests"),
      edge("cicd-ci-build", "cicd-ci", "cicd-build"),
      edge("cicd-tests-approval", "cicd-tests", "cicd-approval"),
      edge("cicd-build-registry", "cicd-build", "cicd-registry"),
      edge("cicd-approval-deploy", "cicd-approval", "cicd-deploy"),
      edge("cicd-registry-deploy", "cicd-registry", "cicd-deploy"),
      edge("cicd-deploy-monitoring", "cicd-deploy", "cicd-monitoring"),
    ],
  },
  {
    id: "event-driven-system",
    name: "Event-Driven System",
    description: "A producer-to-broker architecture with stream processing, projections, notifications, and analytics consumers.",
    nodes: [
      node({
        id: "event-client",
        label: "Client Apps",
        x: 0,
        y: 170,
        color: NODE_COLORS[1],
        shape: "pentagon",
      }),
      node({
        id: "event-api",
        label: "Ingestion API",
        x: 240,
        y: 182,
        color: NODE_COLORS[7],
        shape: "pill",
      }),
      node({
        id: "event-broker",
        label: "Message Broker",
        x: 500,
        y: 168,
        color: NODE_COLORS[5],
        shape: "hexagon",
      }),
      node({
        id: "event-processor",
        label: "Stream Processor",
        x: 760,
        y: 30,
        color: NODE_COLORS[2],
        shape: "rectangle",
      }),
      node({
        id: "event-projection",
        label: "Read Model",
        x: 1020,
        y: 30,
        color: NODE_COLORS[6],
        shape: "cylinder",
      }),
      node({
        id: "event-notifications",
        label: "Notification Worker",
        x: 760,
        y: 210,
        color: NODE_COLORS[3],
        shape: "rectangle",
      }),
      node({
        id: "event-warehouse",
        label: "Data Warehouse",
        x: 1020,
        y: 210,
        color: NODE_COLORS[1],
        shape: "cylinder",
      }),
      node({
        id: "event-decision",
        label: "Retry?",
        x: 500,
        y: 390,
        color: NODE_COLORS[4],
        shape: "diamond",
      }),
    ],
    edges: [
      edge("event-client-api", "event-client", "event-api"),
      edge("event-api-broker", "event-api", "event-broker"),
      edge("event-broker-processor", "event-broker", "event-processor"),
      edge("event-processor-projection", "event-processor", "event-projection"),
      edge("event-broker-notifications", "event-broker", "event-notifications"),
      edge("event-notifications-warehouse", "event-notifications", "event-warehouse"),
      edge("event-broker-decision", "event-broker", "event-decision"),
      edge("event-decision-api", "event-decision", "event-api"),
    ],
  },
] satisfies CanvasTemplate[];
