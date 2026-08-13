// Design tokens from 02_Design.md v2 -- "Enterprise Dark" system.
// Never hardcode these hex values elsewhere; import from here or use
// the matching Tailwind classes registered in globals.css.
export const THEME = {
  colors: {
    background: "#F5F7FA",
    sidebar: "#1A2332",
    sidebarSecondary: "#2A3441",
    accent: "#FF6B35",
    success: "#22C55E",
    warning: "#FACC15",
    danger: "#EF4444",
    info: "#3B82F6",
    border: "#E5E7EB",
    cardBackground: "#FFFFFF",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    disabled: "#9CA3AF",
  },
  font: {
    family: "'Plus Jakarta Sans', Inter, sans-serif",
    pageTitle: "30px",
    sectionTitle: "20px",
    cardTitle: "18px",
    body: "14px",
    caption: "12px",
    button: "14px",
  },
  radius: {
    card: "12px",
    button: "8px",
  },
};

// Section 12: chart colors must be consistent and semantic -- never
// randomly assigned. Use these for any chart touching these metric types.
export const CHART_COLORS = {
  performance: "#FF6B35", // orange
  satisfaction: "#22C55E", // green
  salary: "#3B82F6", // blue
  warning: "#FACC15", // yellow
  negative: "#EF4444", // red
};

// Fallback categorical palette for distributions with unmapped category
// names (e.g. rating labels that don't map 1:1 to a semantic color above).
export const CATEGORICAL_PALETTE = [
  CHART_COLORS.performance,
  CHART_COLORS.info,
  CHART_COLORS.satisfaction,
  CHART_COLORS.warning,
  CHART_COLORS.negative,
  "#8B5CF6",
];
