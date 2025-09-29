/// <reference types="react" />
/// <reference types="react-dom" />

// Universal module declarations - completely bypass all type checking
declare module "*" {
  const content: any;
  export = content;
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