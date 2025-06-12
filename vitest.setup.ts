import fetch, { Headers, Request, Response } from 'cross-fetch';

if (!globalThis.fetch) globalThis.fetch = fetch as any;
if (!globalThis.Headers) globalThis.Headers = Headers as any;
if (!globalThis.Request) globalThis.Request = Request as any;
if (!globalThis.Response) globalThis.Response = Response as any;

