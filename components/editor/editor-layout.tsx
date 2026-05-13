"use client";

import { useState, type ReactNode } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-context";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { useProjectDialogs } from "@/components/editor/use-project-dialogs";
import { cn } from "@/lib/utils";

interface EditorLayoutProps {
  children: ReactNode;
  className?: string;
}

export function EditorLayout({ children, className }: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const projectDialogs = useProjectDialogs();

  return (
    <ProjectDialogsProvider value={projectDialogs}>
      <div className={cn("flex min-h-screen flex-col bg-base text-copy-primary", className)}>
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((current) => !current)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="relative min-h-0 flex-1 overflow-hidden">{children}</main>
        <ProjectDialogs controller={projectDialogs} />
      </div>
    </ProjectDialogsProvider>
  );
}
