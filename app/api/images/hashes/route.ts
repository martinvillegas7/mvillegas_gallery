import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { listKnownContentHashes } from "@/lib/gallery-hashes-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const hashes = await listKnownContentHashes();
    return NextResponse.json(
      { hashes },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error listing image hashes:", error);
    return NextResponse.json(
      { error: "No se pudieron comprobar las fotos existentes" },
      { status: 500 }
    );
  }
}
