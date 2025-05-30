#!/usr/bin/env bash
set -euo pipefail

# Optimize install environment to skip heavy binaries
export CYPRESS_INSTALL_BINARY=0
export CYPRESS_SKIP_BINARY_INSTALL=1
export HUSKY_SKIP_INSTALL=1
export PUPPETEER_SKIP_DOWNLOAD=1
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export NODE_OPTIONS=--max-old-space-size=4096

# Optionally clean bun caches (skip if SKIP_BUN_CLEAN=true)
if [ "${SKIP_BUN_CLEAN:-false}" != "true" ]; then
  rm -rf ~/.bun ~/.cache/bun || true
fi

# Install dependencies with npm
npm ci --prefer-offline --audit=false

# Ensure vitest is installed before running tests
if ! npx --no-install vitest --version >/dev/null 2>&1; then
  echo "Installing vitest..."
  npm install vitest -D
fi
