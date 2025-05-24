
# Installation Help Guide

If you're experiencing timeout issues with `bun install`, here are several solutions:

## Quick Solutions

### Option 1: Emergency Install Script
```bash
node scripts/emergency-install.js
```

### Option 2: Complete Reset
```bash
node scripts/reset-and-install.js
```

### Option 3: Manual npm install
```bash
# Set environment variables
export CYPRESS_INSTALL_BINARY=0
export HUSKY_SKIP_INSTALL=1
export PUPPETEER_SKIP_DOWNLOAD=1

# Install with npm
npm install --prefer-offline --no-audit --no-fund --legacy-peer-deps
```

## Troubleshooting Steps

1. **Clear everything and start fresh:**
   ```bash
   rm -rf node_modules package-lock.json bun.lockb
   npm cache clean --force
   node scripts/emergency-install.js
   ```

2. **Check disk space:**
   ```bash
   df -h
   ```

3. **Try different package manager:**
   ```bash
   # With yarn
   yarn install

   # With pnpm
   pnpm install
   ```

4. **Network issues:**
   ```bash
   # Use different registry
   npm config set registry https://registry.npmmirror.com
   npm install
   ```

## Environment Variables

The following environment variables are automatically set to speed up installation:

- `CYPRESS_INSTALL_BINARY=0` - Skips Cypress binary
- `HUSKY_SKIP_INSTALL=1` - Skips Git hooks
- `PUPPETEER_SKIP_DOWNLOAD=1` - Skips Puppeteer binary
- `NODE_OPTIONS=--max-old-space-size=4096` - Increases Node.js memory

## If All Else Fails

1. Try installing on a different network
2. Use Docker for a clean environment
3. Contact support with your error logs

## Success Indicators

After successful installation, you should see:
- `node_modules` folder created
- No timeout errors
- Ability to run `npm run dev`
