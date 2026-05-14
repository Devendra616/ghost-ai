"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { ProjectActionsController } from "@/hooks/use-project-actions";

const ProjectDialogsContext = createContext<ProjectActionsController | null>(null);

interface ProjectDialogsProviderProps {
  children: ReactNode;
  value: ProjectActionsController;
}

export function ProjectDialogsProvider({
  children,
  value,
}: ProjectDialogsProviderProps) {
  return (
    <ProjectDialogsContext.Provider value={value}>
      {children}
    </ProjectDialogsContext.Provider>
  );
}

export function useProjectDialogsContext() {
  const context = useContext(ProjectDialogsContext);

  if (!context) {
    throw new Error(
      "useProjectDialogsContext must be used within ProjectDialogsProvider"
    );
  }

  return context;
}
