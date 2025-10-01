// @ts-nocheck
"use client";
import * as React from "react";

export function usePrefetchOnHover(href?: string) {
  return React.useMemo(() => ({ onMouseEnter: () => {} }), [href]);
}
