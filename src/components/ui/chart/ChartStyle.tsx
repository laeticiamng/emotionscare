import * as React from "react";
import { THEMES, ChartConfig } from "./types";

/**
 * Generates CSS custom properties for chart theming.
 * Uses a <style> element with textContent instead of dangerouslySetInnerHTML
 * to prevent XSS vectors.
 */
export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  const cssText = Object.entries(THEMES)
    .map(
      ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join("\n")}
}
`
    )
    .join("\n");

  return (
    <style>{cssText}</style>
  );
};
