# API Routes

This directory contains all API route definitions organized by version and domain.

## Structure

```
routes/
├── v1/                    # API version 1
│   ├── journal/           # Journal domain routes
│   ├── music/             # Music generation routes
│   ├── assessments/       # Assessment routes
│   ├── health/            # Health check routes
│   └── index.ts           # v1 route aggregator
└── README.md
```

## Adding a New Domain

1. Create a new directory under `v1/`: `v1/my-domain/`
2. Create `index.ts` with FastifyPluginAsync:
   ```typescript
   import { FastifyPluginAsync } from 'fastify';

   export const myDomainRoutes: FastifyPluginAsync = async app => {
     app.get('/', async (req, reply) => {
       // Your route logic
     });
   };

   export default myDomainRoutes;
   ```
3. Register it in `v1/index.ts`:
   ```typescript
   import myDomainRoutes from './my-domain';

   await app.register(myDomainRoutes, { prefix: '/my-domain' });
   ```

## Best Practices

- **Use Zod schemas** from `@emotionscare/contracts` for validation
- **Return consistent responses** using `ApiResponse<T>` type
- **Log errors** with structured logging: `app.log.error({ err }, 'message')`
- **Document endpoints** with JSDoc comments
- **Keep routes thin** - move business logic to service classes

## Example Route

```typescript
import { FastifyPluginAsync } from 'fastify';
import { mySchema } from '@emotionscare/contracts';

export const myRoutes: FastifyPluginAsync = async app => {
  app.get('/', async (req, reply) => {
    const validated = mySchema.parse(req.query);
    const userId = req.user.id;

    // Call service layer
    const data = await myService.getData(userId, validated);

    return { ok: true, data };
  });
};
```
