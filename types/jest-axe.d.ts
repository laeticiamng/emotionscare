import 'jest-axe';

declare global {
  namespace Vi {
    interface Assertion {
      toHaveNoViolations(): void;
    }
  }
}

export {};
