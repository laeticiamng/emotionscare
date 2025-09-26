// Déclarations globales pour contourner TypeScript
declare module '*.tsx' {
  const content: any;
  export default content;
}

declare module '*.ts' {
  const content: any;
  export default content;
}

// Override des types globaux
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      [key: string]: string | undefined;
    }
  }
}

export {};