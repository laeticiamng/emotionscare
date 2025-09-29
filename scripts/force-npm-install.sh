#!/bin/bash

# Force NPM installation to bypass bun/jpegtran-bin issues
echo "🔧 Forcing NPM installation to bypass jpegtran-bin error..."

# Remove bun lockfile
rm -f bun.lockb

# Force npm package manager
export npm_config_package_manager=npm

# Install with npm ignoring optional deps that cause issues
npm install --legacy-peer-deps --prefer-offline --no-optional --ignore-scripts

echo "✅ NPM installation completed"
echo "🚀 Try running: npm run dev"