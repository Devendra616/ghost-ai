import type { ReactNode } from "react";
import { BrainCircuit, FileText, Share2 } from "lucide-react";

interface AuthPageShellProps {
  children: ReactNode;
}

const features = [
  {
    icon: BrainCircuit,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <main className="grid min-h-screen bg-base font-sans text-copy-primary lg:grid-cols-2">
      <section className="hidden border-r border-surface-border bg-surface px-12 py-10 lg:flex lg:flex-col">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-border bg-brand text-sm font-semibold text-bg-base">
            G
          </div>
          <p className="text-base font-semibold text-copy-primary">Ghost AI</p>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div className="max-w-xl">
            <h1 className="text-5xl font-semibold leading-tight text-copy-primary">
              Design systems at the speed of thought.
            </h1>
            <p className="mt-8 max-w-lg text-xl leading-8 text-copy-secondary">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="mt-16 max-w-2xl space-y-8">
            {features.map((feature) => (
              <li key={feature.title} className="flex gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-surface-border bg-accent-dim text-brand">
                  <feature.icon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-base font-semibold text-copy-primary">
                    {feature.title}
                  </span>
                  <span className="mt-1 block text-base leading-7 text-copy-muted">
                    {feature.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center bg-elevated px-4 py-8 sm:px-6 lg:px-12">
        {children}
      </section>
    </main>
  );
}
