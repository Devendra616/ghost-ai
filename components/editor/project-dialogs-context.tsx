"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { ProjectDialogsController } from "@/components/editor/use-project-dialogs";

const ProjectDialogsContext = createContext<ProjectDialogsController | null>(null);

interface ProjectDialogsProviderProps {
  children: ReactNode;
  value: ProjectDialogsController;
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
