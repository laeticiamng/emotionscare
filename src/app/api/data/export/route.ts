import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const payload = { exportedAt: new Date().toISOString(), scope: body?.scope ?? "all", data: { journal: [], scores: [], settings: {} } };
  return NextResponse.json(payload, { status: 200 });
}
