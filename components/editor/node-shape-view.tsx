import { cn } from "@/lib/utils";
import type { NodeColor, NodeShape } from "@/types/canvas";

interface NodeShapeViewProps {
  color: NodeColor;
  label?: string;
  labelPlaceholder?: string;
  selected?: boolean;
  shape: NodeShape;
  className?: string;
}

interface SvgShapeProps {
  borderColor: string;
  color: NodeColor;
  label?: string;
  labelPlaceholder?: string;
  shape: Extract<NodeShape, "diamond" | "pentagon" | "hexagon" | "cylinder">;
}

const svgPaths = {
  diamond: "M50 2 L98 50 L50 98 L2 50 Z",
  pentagon: "M50 3 L96 38 L78 96 H22 L4 38 Z",
  hexagon: "M26 4 H74 L98 50 L74 96 H26 L2 50 Z",
} satisfies Record<"diamond" | "pentagon" | "hexagon", string>;

function SvgShape({ borderColor, color, label, labelPlaceholder, shape }: SvgShapeProps) {
  if (shape === "cylinder") {
    return (
      <>
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M12 16 C12 8 88 8 88 16 V84 C88 92 12 92 12 84 Z"
            fill={color.fill}
            stroke={borderColor}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <ellipse
            cx="50"
            cy="16"
            fill={color.fill}
            rx="38"
            ry="11"
            stroke={borderColor}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M12 16 C12 24 88 24 88 16"
            fill="none"
            opacity="0.65"
            stroke={borderColor}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <ShapeLabel color={color.text} label={label} placeholder={labelPlaceholder} />
      </>
    );
  }

  return (
    <>
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d={svgPaths[shape]}
          fill={color.fill}
          stroke={borderColor}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <ShapeLabel color={color.text} label={label} placeholder={labelPlaceholder} />
    </>
  );
}

function ShapeLabel({
  color,
  label,
  placeholder,
}: {
  color: string;
  label?: string;
  placeholder?: string;
}) {
  const hasLabel = Boolean(label?.trim());
  const text = hasLabel ? label : placeholder;

  return (
    <span
      className="relative z-10 max-w-[72%] truncate text-center text-sm font-medium"
      style={{ color: hasLabel ? color : "var(--text-muted)" }}
    >
      {text}
    </span>
  );
}

export function NodeShapeView({
  className,
  color,
  label,
  labelPlaceholder,
  selected = false,
  shape,
}: NodeShapeViewProps) {
  const borderColor = selected ? "var(--accent-primary)" : "var(--border-subtle)";
  const baseClassName =
    "relative flex h-full min-h-16 w-full min-w-16 items-center justify-center overflow-visible text-center shadow-lg";

  if (shape === "diamond" || shape === "pentagon" || shape === "hexagon" || shape === "cylinder") {
    return (
      <div className={cn(baseClassName, className)}>
        <SvgShape
          borderColor={borderColor}
          color={color}
          label={label}
          labelPlaceholder={labelPlaceholder}
          shape={shape}
        />
      </div>
    );
  }

  if (shape === "rhombus") {
    return (
      <div className={cn(baseClassName, className)}>
        <div
          className="absolute inset-1 skew-x-[-18deg] rounded-xl border"
          style={{
            backgroundColor: color.fill,
            borderColor,
        }}
      />
        <ShapeLabel color={color.text} label={label} placeholder={labelPlaceholder} />
      </div>
    );
  }

  const shapeClassName = {
    rectangle: "rounded-xl",
    circle: "rounded-full",
    pill: "rounded-full",
  } satisfies Record<Extract<NodeShape, "rectangle" | "circle" | "pill">, string>;

  return (
    <div
      className={cn(baseClassName, "border px-4 py-3", shapeClassName[shape], className)}
      style={{
        backgroundColor: color.fill,
        borderColor,
      }}
    >
      <ShapeLabel color={color.text} label={label} placeholder={labelPlaceholder} />
    </div>
  );
}
