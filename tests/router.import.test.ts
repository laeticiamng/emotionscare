import defaultRouter, { router } from '@/routerV2/router';

describe('router exports', () => {
  it('exposes the stable router instance', () => {
    expect(router).toBeDefined();
  });

  it('provides the same router as default export', () => {
    expect(defaultRouter).toBe(router);
  });
});
