
// Global type definitions for the application

// Extend the Window interface to add our custom properties
declare global {
  interface Window {
    __APP_DEBUG__: boolean;
  }
}

export {};
