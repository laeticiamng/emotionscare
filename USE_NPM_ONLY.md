
# 🚨 CRITICAL: Use npm only for this project

## Problem
The `@vitest/browser` package has an integrity conflict with Bun package manager that prevents installation.

## Immediate Solution
Run this emergency script:
```bash
node scripts/force-npm-emergency.js
```

## Going Forward
- ✅ Use `npm run dev` (NOT `bun dev`)
- ✅ Use `npm install` (NOT `bun install`)
- ✅ Use `npm run build` (NOT `bun run build`)
- ✅ Use `npm test` (NOT `bun test`)

## What was done
- Completely removed Bun from the build process
- Removed the problematic @vitest/browser dependency
- Configured `.npmrc` to force npm usage
- Cleaned all lock files and caches
- Installed dependencies with npm to avoid the conflict

## Verification
After running the emergency script, test with:
```bash
npm run dev
```

If this works, the issue is resolved! 🎉

## If problems persist
The issue is specifically with `@vitest/browser` and Bun compatibility. Stick with npm for this project.
