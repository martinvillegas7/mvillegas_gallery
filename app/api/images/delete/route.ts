import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { isDeletableImagePath } from "@/lib/images";
import { isGalleryCategory } from "@/lib/categories";
import { removeImageFromLayout } from "@/lib/gallery-layout";
import { unregisterImageHashes } from "@/lib/gallery-hashes-store";

export const runtime = "nodejs";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function DELETE(request: NextRequest) {
  if (!requireAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || typeof body.url !== "string" || !body.url.trim()) {
      return NextResponse.json(
        { error: "Debes indicar la URL de la imagen a eliminar" },
        { status: 400 }
      );
    }

    const url = body.url.trim();
    const pathname =
      typeof body.pathname === "string" ? body.pathname.trim() : "";

    if (pathname && !isDeletableImagePath(pathname)) {
      return NextResponse.json(
        { error: "Solo se pueden eliminar fotos de las categorías de la galería" },
        { status: 400 }
      );
    }

    await del(url);

    if (pathname) {
      const [category] = pathname.split("/");
      if (isGalleryCategory(category)) {
        try {
          await removeImageFromLayout(category, pathname);
          await unregisterImageHashes(pathname);
        } catch (error) {
          console.error("Image deleted but layout could not be updated:", error);
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting image from Blob:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar la imagen" },
      { status: 500 }
    );
  }
}
