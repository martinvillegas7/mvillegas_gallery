import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";
import { isGalleryCategory } from "@/lib/categories";
import {
  getGalleryLayout,
  saveGalleryLayout,
} from "@/lib/gallery-layout";
import {
  MAX_HOME_IMAGES,
  parseCategoryLayout,
} from "@/lib/gallery-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function belongsToCategory(pathname: string, category: string): boolean {
  return pathname === category || pathname.startsWith(`${category}/`);
}

export async function PUT(request: NextRequest) {
  if (!requireAdmin(request)) {
    return unauthorizedResponse();
  }

  try {
    const body: unknown = await request.json();
    if (!isRecord(body) || typeof body.category !== "string") {
      return NextResponse.json(
        { error: "Debes indicar la categoría" },
        { status: 400 }
      );
    }

    if (!isGalleryCategory(body.category)) {
      return NextResponse.json(
        { error: "Categoría no válida" },
        { status: 400 }
      );
    }

    const category = body.category;
    const parsed = parseCategoryLayout(body);
    const order = parsed.order.filter((pathname) =>
      belongsToCategory(pathname, category)
    );
    const home = parsed.home
      .filter(
        (pathname) =>
          belongsToCategory(pathname, category) && order.includes(pathname)
      )
      .slice(0, MAX_HOME_IMAGES);
    const hero =
      parsed.hero &&
      belongsToCategory(parsed.hero, category) &&
      order.includes(parsed.hero)
        ? parsed.hero
        : null;

    const layout = await getGalleryLayout();
    layout[category] = {
      order,
      hero,
      home,
      focalPoints: Object.fromEntries(
        Object.entries(parsed.focalPoints).filter(([pathname]) =>
          order.includes(pathname)
        )
      ),
      tags: Object.fromEntries(
        Object.entries(parsed.tags).filter(
          ([pathname, tags]) => order.includes(pathname) && tags.length > 0
        )
      ),
    };
    await saveGalleryLayout(layout);

    return NextResponse.json(layout[body.category]);
  } catch (error) {
    console.error("Error saving gallery layout:", error);
    return NextResponse.json(
      { error: "No se pudo guardar el orden de las fotos" },
      { status: 500 }
    );
  }
}
