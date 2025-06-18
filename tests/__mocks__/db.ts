export default {
  deleteFrom: () => ({ execute: () => Promise.resolve() }),
  insertInto: () => ({ values: () => ({ execute: () => Promise.resolve() }) }),
  insert: () => ({ values: () => ({ execute: () => Promise.resolve() }) }),
  selectFrom: () => ({
    where: () => ({
      select: () => ({
        execute: () => Promise.resolve([]),
        executeTakeFirst: () => Promise.resolve(undefined),
        executeTakeFirstOrThrow: () => Promise.resolve(undefined),
      }),
      execute: () => Promise.resolve([]),
      executeTakeFirst: () => Promise.resolve(undefined),
    }),
  }),
  exec: () => Promise.resolve(),
  raw: () => Promise.resolve(),
  clear: () => Promise.resolve(),
};
