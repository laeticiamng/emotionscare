# Contribution Guide — Local Imports

## Anti-barrel: `no-index-barrel` rule

To limit cycles and implicit dependencies, we ban local imports via `index.ts` / `index.tsx`.

- ✅ Import the specific file you need directly (`import { useFoo } from './useFoo'`).
- ❌ Do not import a folder or an `index` file (`import { useFoo } from './index'`, `import * from '../index'`).

A dependency-cruiser rule `no-index-barrel` will cause the CI to fail as soon as a relative import to `index` is detected.

```bash
npx dependency-cruiser --config .dependency-cruiser.js src
