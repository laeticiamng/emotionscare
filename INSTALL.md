
# Installation Guide

This project includes optimized installation scripts to handle timeout issues with package managers.

## Quick Start

1. **Use the optimized installer** (recommended):
   ```bash
   node install-optimized.js
   ```

2. **Alternative methods**:
   ```bash
   # Fast npm install (skips heavy binaries)
   CYPRESS_INSTALL_BINARY=0 npm install --prefer-offline --no-audit --no-fund
   
   # Or use yarn
   yarn install --prefer-offline --silent
   ```

## Troubleshooting Installation Timeouts

If you encounter `ProcessIOError("Process killed due to timeout")`:

1. **Run the optimized installer**: `node install-optimized.js`
2. **Clear caches**: `npm cache clean --force`
3. **Remove node_modules**: `rm -rf node_modules && npm install`
4. **Check disk space**: Ensure you have at least 2GB free space
5. **Try different package manager**: npm, yarn, or pnpm

## Environment Variables

The following environment variables are set automatically to speed up installation:

- `CYPRESS_INSTALL_BINARY=0` - Skips Cypress binary download
- `HUSKY_SKIP_INSTALL=1` - Skips Husky git hooks
- `PUPPETEER_SKIP_DOWNLOAD=1` - Skips Puppeteer binary
- `NODE_OPTIONS=--max-old-space-size=4096` - Increases Node.js memory limit

## Configuration Files

- `.npmrc` - Contains optimized npm settings with increased timeouts
- `install-optimized.js` - Smart installer with fallback strategies
- `optimize-package.js` - Adds optimization scripts to package.json

## Development

After successful installation, start the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

## Support

If you continue to experience installation issues:

1. Check your network connection
2. Try installing from a different network
3. Use a package manager mirror if available
4. Consider using Docker for a consistent environment
