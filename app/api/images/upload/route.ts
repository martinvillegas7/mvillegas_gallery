import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { isGalleryCategory } from "@/lib/categories";
import { slugifyFilename } from "@/lib/slugify";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 1.5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const categoryValue = formData.get("category");
    const originalNameValue = formData.get("originalName");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 }
      );
    }

    if (typeof categoryValue !== "string" || !isGalleryCategory(categoryValue)) {
      return NextResponse.json(
        { error: "Categoría no válida" },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          error:
            "El archivo supera el tamaño máximo permitido (1.5 MB). Comprueba que la compresión se haya aplicado.",
        },
        { status: 413 }
      );
    }

    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa JPEG, PNG o WebP." },
        { status: 400 }
      );
    }

    const originalName =
      typeof originalNameValue === "string" && originalNameValue.trim()
        ? originalNameValue
        : file.name;

    const slug = slugifyFilename(originalName);
    const pathname = `${categoryValue}/${slug}-${Date.now()}.jpg`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: "image/jpeg",
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error("Error uploading image to Blob:", error);
    return NextResponse.json(
      { error: "No se pudo subir la imagen a Vercel Blob" },
      { status: 500 }
    );
  }
}
