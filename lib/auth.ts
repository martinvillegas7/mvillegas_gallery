import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function isValidAdminPassword(
  password: string | null | undefined
): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) {
    return false;
  }

  try {
    return timingSafeEqual(sha256(password), sha256(expected));
  } catch {
    return false;
  }
}

export function getAdminPasswordFromRequest(request: NextRequest): string | null {
  return request.headers.get("x-admin-password");
}

export function requireAdmin(request: NextRequest): boolean {
  return isValidAdminPassword(getAdminPasswordFromRequest(request));
}

export function unauthorizedResponse(
  message = "No autorizado"
): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}
