export class NextResponse extends Response {
  constructor(body: BodyInit | null, init?: ResponseInit) {
    super(body, init);
  }

  static json(data: unknown, init?: ResponseInit) {
    const headers = new Headers(init?.headers);
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json; charset=utf-8');
    }
    return new NextResponse(JSON.stringify(data), { ...init, headers });
  }
}
