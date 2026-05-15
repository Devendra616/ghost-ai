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
  activeProjectName?: string;
  ownedProjects: ProjectListItem[];
  sharedProjects: ProjectListItem[];
  className?: string;
}

export function EditorLayout({
  children,
  activeProjectId,
  activeProjectName,
  ownedProjects,
  sharedProjects,
  className,
}: EditorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
  const projectActions = useProjectActions();
  const isWorkspace = Boolean(activeProjectName);

  return (
    <ProjectDialogsProvider value={projectActions}>
      <div className={cn("flex min-h-screen flex-col bg-base text-copy-primary", className)}>
        <EditorNavbar
          isAiSidebarOpen={isAiSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          onAiSidebarToggle={() => setIsAiSidebarOpen((current) => !current)}
          onSidebarToggle={() => setIsSidebarOpen((current) => !current)}
          projectName={activeProjectName}
        />
        <ProjectSidebar
          activeProjectId={activeProjectId}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
        />
        <main className="relative min-h-0 flex-1 overflow-hidden">
          {isWorkspace ? (
            <div className="flex h-full min-h-[calc(100vh-3.5rem)]">
              <section className="min-w-0 flex-1">{children}</section>
              <aside
                className={cn(
                  "hidden w-80 shrink-0 border-l border-surface-border bg-surface/95 p-4 transition-[width] duration-200 lg:block",
                  isAiSidebarOpen ? "w-80" : "w-0 overflow-hidden border-l-0 p-0"
                )}
                aria-hidden={!isAiSidebarOpen}
              >
                <div className="flex h-full flex-col rounded-2xl border border-surface-border bg-bg-elevated p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-copy-primary">
                    AI Assistant
                  </div>
                  <div className="flex flex-1 items-center justify-center text-center">
                    <p className="text-sm leading-6 text-copy-muted">
                      AI chat will appear here in a future step.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            children
          )}
        </main>
        <ProjectDialogs controller={projectActions} />
      </div>
    </ProjectDialogsProvider>
  );
}
