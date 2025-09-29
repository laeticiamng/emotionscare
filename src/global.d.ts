/// <reference types="react" />
/// <reference types="react-dom" />

declare module "*.tsx" {
  import React from 'react';
  const component: React.ComponentType<any>;
  export default component;
}

declare module "*.ts" {
  const content: any;
  export default content;
}

// Global window types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  
  var SpeechRecognition: any;
  var webkitSpeechRecognition: any;
  var Pause: any;
  var ComponentTypeGeneric: any;
  var safeAdd: any;
  var Sparkles: any;
}

export {};