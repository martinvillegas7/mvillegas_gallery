import { NextRequest, NextResponse } from "next/server";
import { isGalleryCategory } from "@/lib/categories";
import { listCategoryImages } from "@/lib/images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  if (!category) {
    return NextResponse.json(
      { error: "El parámetro category es obligatorio" },
      { status: 400 }
    );
  }

  if (!isGalleryCategory(category)) {
    return NextResponse.json({ error: "Categoría no válida" }, { status: 400 });
  }

  try {
    const images = await listCategoryImages(category);
    return NextResponse.json(
      { images },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error listing images from Blob:", error);
    return NextResponse.json(
      {
        error:
          "No se pudieron leer las imágenes. Comprueba que BLOB_READ_WRITE_TOKEN esté configurada.",
      },
      { status: 500 }
    );
  }
}
