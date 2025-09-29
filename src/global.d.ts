/// <reference types="react" />
/// <reference types="react-dom" />

// Removed universal module declarations that interfere with lucide-react

// Global window types and universal type overrides
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    [key: string]: any;
  }
  
  var SpeechRecognition: any;
  var webkitSpeechRecognition: any;

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
}

export {};