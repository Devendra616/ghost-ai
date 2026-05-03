import { EditorLayout } from "@/components/editor/editor-layout";

export default function Home() {
  return (
    <EditorLayout>
      <div className="h-full min-h-[calc(100vh-3.5rem)] bg-base">
        <div className="absolute inset-0 bg-[linear-gradient(var(--border-default)_1px,transparent_1px),linear-gradient(90deg,var(--border-default)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      </div>
    </EditorLayout>
  );
}
