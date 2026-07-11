import { formatCurrency, formatNumber } from "@/shared/lib/utils";

export const CHART_COLORS = [
  "#2065D1",
  "#00B8D9",
  "#FFAB00",
  "#FF4842",
  "#7635DC",
  "#00AB55",
] as const;

export const chartMargins = {
  default: { top: 8, right: 8, left: 4, bottom: 0 },
  withBottomLabels: { top: 8, right: 8, left: 4, bottom: 4 },
  compact: { top: 4, right: 8, left: 4, bottom: 0 },
  compactWithBottomLabels: { top: 4, right: 8, left: 4, bottom: 4 },
  horizontal: { top: 4, right: 16, left: 4, bottom: 4 },
} as const;

export const axisTickStyle = {
  fontSize: 11,
  fill: "var(--muted-foreground)",
};

export const tooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  color: "var(--foreground)",
  fontSize: "12px",
  boxShadow: "none",
};

export function formatCategoryLabel(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatChartValue(value: number, type: "currency" | "number" = "number"): string {
  return type === "currency" ? formatCurrency(value) : formatNumber(value);
}

export function formatCompactAxisValue(
  value: number,
  type: "currency" | "number" = "number"
): string {
  if (type === "currency") {
    return value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`;
  }
  return value >= 1000 ? `${Math.round(value / 1000)}k` : String(value);
}
