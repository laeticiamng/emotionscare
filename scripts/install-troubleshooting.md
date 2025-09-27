
# Installation Troubleshooting Guide

If you're experiencing timeouts or issues during dependency installation, here are some steps to resolve them:

## Quick Solutions

1. **Use the optimized install script:**
   ```
   node scripts/optimize-install.js
   node scripts/install.js
   ```

2. **Skip Cypress installation:**
   ```
   CYPRESS_SKIP_BINARY_INSTALL=1 bun install
   ```

3. **Try with increased timeouts:**
   ```
   NODE_OPTIONS="--max-old-space-size=4096" bun install --network-timeout 600000
   ```

## For CI/CD Environments

Add these lines to your CI configuration:

```yaml
env:
  CYPRESS_INSTALL_BINARY: 0
  CYPRESS_SKIP_BINARY_INSTALL: 1
  HUSKY_SKIP_INSTALL: 1
  PUPPETEER_SKIP_DOWNLOAD: 1
```

## Advanced Troubleshooting

If issues persist:

1. Clear your node_modules folder and try again:
   ```
   rm -rf node_modules
   bun install
   ```

2. Check for disk space issues:
   ```
   df -h
   ```

3. Try using npm instead of bun:
   ```
   npm install --no-fund --no-audit --prefer-offline
   ```

4. Inspect the .npmrc file for proper settings:
   ```
   cat .npmrc
   ```
