import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // Stub: accepter et "OK".
  return NextResponse.json({ ok: true, received: (body?.events?.length ?? 0) }, { status: 200 });
}
