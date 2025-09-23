/**
 * Dependency-cruiser configuration to prevent local barrel imports.
 *
 * @type {import('dependency-cruiser').IConfiguration}
 */
export default {
  forbidden: [
    {
      name: 'no-index-barrel',
      severity: 'error',
      comment:
        'Import directly from the module file instead of routing through a local index barrel.',
      from: {
        path: '^src',
      },
      to: {
        path: '(^|/)index\\.(ts|tsx|js|jsx)$',
        dependencyTypes: ['local'],
      },
    },
  ],
};
