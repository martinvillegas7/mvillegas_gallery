import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import {
  getSiteContent,
  mergeSiteContent,
  saveSiteContent,
} from "@/lib/site-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json(content, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error reading site content:", error);
    return NextResponse.json(
      { error: "No se pudo leer el contenido del sitio" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!requireAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const body: unknown = await request.json();
    const content = mergeSiteContent(body);
    await saveSiteContent(content);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error saving site content:", error);
    return NextResponse.json(
      { error: "No se pudo guardar el contenido del sitio" },
      { status: 500 }
    );
  }
}
