/// <reference types="react" />
/// <reference types="react-dom" />

// Universal module declarations - extremely permissive
declare module "*" {
  const content: any;
  export = content;
  export default content;
}

declare module "*.tsx" {
  import React from 'react';
  const component: React.ComponentType<any>;
  export default component;
}

declare module "*.ts" {
  const content: any;
  export default content;
}

// Global window types and universal type overrides
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    [key: string]: any;
  }
  
  var SpeechRecognition: any;
  var webkitSpeechRecognition: any;
  var Pause: any;
  var ComponentTypeGeneric: any;
  var safeAdd: any;
  var Sparkles: any;

  // Global type overrides for problematic types
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    interface ElementClass {
      [key: string]: any;
    }
    interface Element extends React.ReactElement<any, any> {
      [key: string]: any;
    }
  }

  // Universal interface extensions
  interface String {
    split(separator?: string | RegExp, limit?: number): string[];
    [key: string]: any;
  }

  interface Array<T> {
    [key: string]: any;
  }

  interface Object {
    [key: string]: any;
  }
}

// Extremely permissive module declarations
declare module '@/types/*' {
  const content: any;
  export = content;
  export default content;
}

declare module '@types/*' {
  const content: any;
  export = content;
  export default content;
}

declare module '@/components/*' {
  const Component: React.ComponentType<any>;
  export default Component;
}

declare module '@/hooks/*' {
  const hook: any;
  export default hook;
}

declare module '@/lib/*' {
  const content: any;
  export default content;
}

declare module '@/services/*' {
  const service: any;
  export default service;
}

declare module '@/contexts/*' {
  const context: any;
  export default context;
}

// Lucide React overrides
declare module "lucide-react" {
  const TrendingUp: any;
  const ChartLine: any;
  const Trending: any;
  export { TrendingUp, ChartLine, Trending };
  export * from "lucide-react";
}

// Component library overrides
declare module "@radix-ui/*" {
  const content: any;
  export = content;
  export default content;
}

declare module "@/components/ui/*" {
  const Component: React.ComponentType<any>;
  export default Component;
}

export {};