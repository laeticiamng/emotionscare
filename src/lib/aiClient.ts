
// This file re-exports AI modules using import/export syntax that works with the current TypeScript configuration
// It avoids direct imports from node modules that may require specific JSX settings

// Import directly from our index.ts which already has the AI client implementations
import * as aiModules from '../index';

// Re-export everything from our index file
export * from '../index';
