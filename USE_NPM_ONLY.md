
# 🚨 IMPORTANT: USE NPM ONLY FOR THIS PROJECT

## Why this change?
The `@vitest/browser` package has an integrity conflict with Bun package manager. This is a known issue that causes installation failures.

## Quick Fix
Run this script to resolve the issue:
```bash
node scripts/final-vitest-fix.js
```

## Commands to use going forward:
- ✅ `npm run dev` (instead of `bun dev`)
- ✅ `npm install` (instead of `bun install`)  
- ✅ `npm run build` (instead of `bun run build`)
- ✅ `npm test` (instead of `bun test`)

## What was changed?
- `.npmrc` configured to force npm usage
- All lock files removed to start fresh
- Dependencies installed with npm to avoid the conflict

## Verification
After running the fix script, you should be able to:
```bash
npm run dev
```

If this works, the issue is resolved! 🎉

## Support
If you continue to have issues, the problem is specifically with the `@vitest/browser` package and Bun compatibility. The solution is to stick with npm for this project.
