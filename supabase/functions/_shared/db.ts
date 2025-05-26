export default {
  selectFrom() {
    return {
      selectAll() { return this; },
      where() { return this; },
      unionAll() { return this; },
      execute: async () => []
    };
  },
  raw(v: string) { return v; }
};
