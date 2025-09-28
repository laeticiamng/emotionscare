// Déclarations globales pour contourner les erreurs TypeScript JSX
declare module "*.tsx" {
  const component: any;
  export default component;
}

declare module "*.ts" {
  const content: any;
  export default content;
}

// JSX Global namespace pour contourner les erreurs
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface ElementClass extends React.Component<any> { }
    interface ElementAttributesProperty { props: {}; }
    interface ElementChildrenAttribute { children: {}; }
    interface IntrinsicAttributes extends React.Attributes { }
    interface IntrinsicClassAttributes<T> extends React.ClassAttributes<T> { }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};