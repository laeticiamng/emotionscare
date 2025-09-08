// Production logging setup - safe console override
if (import.meta.env.PROD) {
  const noop = () => {};
  // Safely bind console methods to avoid "Illegal invocation" errors
  const originalConsole = {
    log: console.log.bind(console),
    debug: console.debug.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    group: console.group.bind(console),
    groupCollapsed: console.groupCollapsed.bind(console),
    groupEnd: console.groupEnd.bind(console)
  };
  
  // Override with bound noop functions
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop;
  console.group = noop;
  console.groupCollapsed = noop;
  console.groupEnd = noop;
}
