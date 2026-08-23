import { NextRequest, NextResponse } from "next/server";
import { isValidAdminPassword } from "@/lib/auth";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD no está configurada en el servidor" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer la contraseña" },
      { status: 400 }
    );
  }

  if (!isRecord(body) || typeof body.password !== "string") {
    return NextResponse.json(
      { error: "La contraseña es obligatoria" },
      { status: 400 }
    );
  }

  if (!isValidAdminPassword(body.password)) {
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  return NextResponse.json({ ok: true });
}
