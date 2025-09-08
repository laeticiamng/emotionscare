if (import.meta.env.PROD) {
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop;
  console.group = noop as typeof console.group;
  console.groupCollapsed = noop as typeof console.groupCollapsed;
  console.groupEnd = noop as typeof console.groupEnd;
}
