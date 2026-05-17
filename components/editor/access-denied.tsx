import { LockKeyhole } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6 text-copy-primary">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border bg-bg-elevated">
          <LockKeyhole className="h-7 w-7 text-brand" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold">Workspace unavailable</h1>
        <p className="mt-3 text-sm leading-6 text-copy-muted">
          This project does not exist, or you do not have access to open it.
        </p>
        <Button asChild className="mt-6">
          <Link href="/editor">Back to projects</Link>
        </Button>
      </div>
    </main>
  );
}
