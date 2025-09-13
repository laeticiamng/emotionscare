import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ acceptedAt: new Date().toISOString(), message: "Demande de suppression enregistrée." }, { status: 202 });
}
