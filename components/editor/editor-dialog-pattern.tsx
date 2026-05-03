import type { ReactNode } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EditorDialogPatternProps {
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function EditorDialogPattern({
  title,
  description,
  footer,
  children,
  className,
}: EditorDialogPatternProps) {
  return (
    <DialogContent
      className={cn(
        "rounded-3xl border border-surface-border bg-bg-elevated text-copy-primary shadow-2xl shadow-bg-base/70 backdrop-blur",
        className
      )}
    >
      <DialogHeader>
        <DialogTitle className="text-copy-primary">{title}</DialogTitle>
        {description ? (
          <DialogDescription className="text-copy-muted">
            {description}
          </DialogDescription>
        ) : null}
      </DialogHeader>
      {children}
      {footer ? (
        <DialogFooter className="border-surface-border bg-bg-subtle/60">
          {footer}
        </DialogFooter>
      ) : null}
    </DialogContent>
  );
}
