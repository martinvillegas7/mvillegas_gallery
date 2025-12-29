import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");

  if (!category) {
    return NextResponse.json(
      { error: "Category parameter is required" },
      { status: 400 }
    );
  }

  const validCategories = ["naturaleza", "deporte", "paisaje", "selection"];
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  try {
    const publicPath = path.join(process.cwd(), "public", category);

    // Verificar si la carpeta existe
    if (!fs.existsSync(publicPath)) {
      return NextResponse.json({ images: [] });
    }

    // Leer los archivos de la carpeta
    const files = fs.readdirSync(publicPath);

    // Filtrar solo archivos de imagen
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map((file, index) => ({
        id: index + 1,
        src: `/${category}/${file}`,
        alt: file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error reading images:", error);
    return NextResponse.json(
      { error: "Failed to read images" },
      { status: 500 }
    );
  }
}
