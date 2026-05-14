"use client";

import { useState, type ReactNode } from "react";

import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectDialogsProvider } from "@/components/editor/project-dialogs-context";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { useProjectActions } from "@/hooks/use-project-actions";
import { cn } from "@/lib/utils";
import type { ProjectListItem } from "@/types/project";

interface EditorLayoutProps {
  children: ReactNode;
  activeProjectId?: string;
  ownedProjects: ProjectListItem[];
  sharedProjects: ProjectListItem[];
  className?: string;
}

export function EditorLayout({
  children,
  activeProjectId,
  ownedProjects,
  sharedProjects,
  className,
}: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const projectActions = useProjectActions();

  return (
    <ProjectDialogsProvider value={projectActions}>
      <div className={cn("flex min-h-screen flex-col bg-base text-copy-primary", className)}>
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((current) => !current)}
        />
        <ProjectSidebar
          activeProjectId={activeProjectId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
        />
        <main className="relative min-h-0 flex-1 overflow-hidden">{children}</main>
        <ProjectDialogs controller={projectActions} />
      </div>
    </ProjectDialogsProvider>
  );
}
