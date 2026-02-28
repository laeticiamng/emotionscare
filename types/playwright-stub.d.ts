/**
 * Stub for @playwright/test to prevent playwright-core type errors in main tsconfig.
 * Playwright tests should use their own tsconfig or be excluded from the main build.
 */
declare module '@playwright/test' {
  export const test: any;
  export const expect: any;
  export type Page = any;
  export type Browser = any;
  export type BrowserContext = any;
}

declare module '@axe-core/playwright' {
  const AxeBuilder: any;
  export default AxeBuilder;
}
