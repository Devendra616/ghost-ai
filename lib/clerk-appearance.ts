import { dark } from "@clerk/ui/themes";

export const clerkAppearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorForeground: "var(--text-primary)",
    colorMutedForeground: "var(--text-muted)",
    colorBackground: "var(--bg-surface)",
    colorInput: "var(--bg-subtle)",
    colorInputForeground: "var(--text-primary)",
    colorBorder: "var(--border-default)",
    colorRing: "var(--accent-primary)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
    borderRadius: "var(--radius)",
  },
  elements: {
    rootBox: "font-sans",
    cardBox: "font-sans",
    card: "border border-surface-border bg-base shadow-none",
    headerTitle: "text-copy-primary",
    headerSubtitle: "text-copy-muted",
    formFieldLabel: "text-copy-secondary",
    formFieldInput: "border-surface-border-subtle bg-subtle text-copy-primary",
    footerActionText: "text-copy-muted",
    footerActionLink: "text-brand",
    formButtonPrimary: "bg-brand text-bg-base hover:bg-brand",
    socialButtonsBlockButton:
      "border-surface-border bg-subtle text-copy-primary hover:bg-elevated",
    dividerLine: "bg-surface-border",
    dividerText: "text-copy-muted",
  },
} as const;
