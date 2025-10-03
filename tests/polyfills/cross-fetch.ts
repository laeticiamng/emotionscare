import nodeFetch, { Headers, Request, Response } from 'node-fetch';

const fetchFn = (globalThis.fetch ?? nodeFetch) as typeof nodeFetch;

export const fetch = fetchFn as unknown as typeof globalThis.fetch;
export { Headers, Request, Response };
export default fetch;
