import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
} from "@/lib/categories";

export const MAX_HOME_IMAGES = 2;

export type FocalPoint = {
  x: number;
  y: number;
};

export const DEFAULT_FOCAL_POINT: FocalPoint = { x: 50, y: 50 };

export type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  url: string;
  pathname: string;
  isHero: boolean;
  isHome: boolean;
  homeIndex: number | null;
  focalPoint: FocalPoint;
};

export type CategoryLayout = {
  order: string[];
  hero: string | null;
  home: string[];
  focalPoints: Record<string, FocalPoint>;
};

export type GalleryLayout = Record<GalleryCategory, CategoryLayout>;

export function emptyCategoryLayout(): CategoryLayout {
  return { order: [], hero: null, home: [], focalPoints: {} };
}

export function emptyGalleryLayout(): GalleryLayout {
  return {
    naturaleza: emptyCategoryLayout(),
    retratos: emptyCategoryLayout(),
    deporte: emptyCategoryLayout(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function clampFocalPoint(point: FocalPoint): FocalPoint {
  return {
    x: Math.min(100, Math.max(0, point.x)),
    y: Math.min(100, Math.max(0, point.y)),
  };
}

export function parseFocalPoint(value: unknown): FocalPoint {
  if (!isRecord(value)) {
    return DEFAULT_FOCAL_POINT;
  }

  const x = typeof value.x === "number" && Number.isFinite(value.x) ? value.x : 50;
  const y = typeof value.y === "number" && Number.isFinite(value.y) ? value.y : 50;
  return clampFocalPoint({ x, y });
}

export function parseFocalPoints(value: unknown): Record<string, FocalPoint> {
  if (!isRecord(value)) {
    return {};
  }

  const result: Record<string, FocalPoint> = {};
  for (const [pathname, point] of Object.entries(value)) {
    result[pathname] = parseFocalPoint(point);
  }
  return result;
}

export function focalPointStyle(
  point: FocalPoint | undefined
): { objectPosition: string } {
  const { x, y } = point ?? DEFAULT_FOCAL_POINT;
  return { objectPosition: `${x}% ${y}%` };
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === "string");
}

export function parseCategoryLayout(value: unknown): CategoryLayout {
  if (!isRecord(value)) {
    return emptyCategoryLayout();
  }

  const home = asStringArray(value.home).slice(0, MAX_HOME_IMAGES);
  const hero =
    typeof value.hero === "string" && value.hero.trim()
      ? value.hero
      : null;

  return {
    order: asStringArray(value.order),
    hero,
    home,
    focalPoints: parseFocalPoints(value.focalPoints),
  };
}

export function parseGalleryLayout(value: unknown): GalleryLayout {
  const data = isRecord(value) ? value : {};
  const layout = emptyGalleryLayout();

  for (const category of GALLERY_CATEGORIES) {
    layout[category] = parseCategoryLayout(data[category]);
  }

  return layout;
}

export function parseGalleryImages(value: unknown): GalleryImage[] {
  if (!isRecord(value) || !Array.isArray(value.images)) {
    return [];
  }

  return value.images.flatMap((item, index) => {
    if (!isRecord(item)) {
      return [];
    }

    const src = typeof item.src === "string" ? item.src : "";
    const url = typeof item.url === "string" ? item.url : src;
    const pathname = typeof item.pathname === "string" ? item.pathname : "";
    const alt = typeof item.alt === "string" ? item.alt : "Fotografía";

    if (!src) {
      return [];
    }

    return [
      {
        id: typeof item.id === "number" ? item.id : index + 1,
        src,
        url,
        pathname,
        alt,
        isHero: item.isHero === true,
        isHome: item.isHome === true,
        homeIndex: typeof item.homeIndex === "number" ? item.homeIndex : null,
        focalPoint: parseFocalPoint(item.focalPoint),
      },
    ];
  });
}

export function removePathFromLayout(
  layout: CategoryLayout,
  pathname: string
): CategoryLayout {
  const { [pathname]: _removed, ...focalPoints } = layout.focalPoints;
  return {
    order: layout.order.filter((item) => item !== pathname),
    hero: layout.hero === pathname ? null : layout.hero,
    home: layout.home.filter((item) => item !== pathname),
    focalPoints,
  };
}

export function appendPathToLayout(
  layout: CategoryLayout,
  pathname: string
): CategoryLayout {
  if (layout.order.includes(pathname)) {
    return layout;
  }
  return {
    ...layout,
    order: [...layout.order, pathname],
  };
}
