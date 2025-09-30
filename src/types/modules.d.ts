/**
 * Type declarations for modules that are not part of the main app bundle
 * but may be referenced in scripts, tests, or legacy code
 */

declare module 'next' {
  export const dynamic: string;
  export const metadata: any;
}

declare module 'next/link' {
  const Link: any;
  export default Link;
}

declare module 'next/navigation' {
  export function usePathname(): string;
  export function useRouter(): any;
  export function useSearchParams(): any;
}

declare module 'eslint' {
  export class ESLint {
    constructor(options?: any);
    lintText(code: string, options?: any): Promise<any[]>;
    close?(): Promise<void>;
  }
}

declare module '../src/router/buildUnifiedRoutes' {
  export function buildUnifiedRoutes(): any;
}

declare module '@/app/modules/bubble-beat/page' {
  const Page: any;
  export default Page;
}

declare module '@/app/modules/flash-glow/page' {
  const Page: any;
  export default Page;
}

declare module '@/app/modules/page' {
  const Page: any;
  export default Page;
}

declare module '@/app/modules/mood-mixer/page' {
  const Page: any;
  export default Page;
}

declare module '@/app/onboarding/page' {
  const Page: any;
  export default Page;
}

declare module '@/app/modules/scan/page' {
  const Page: any;
  export default Page;
}
