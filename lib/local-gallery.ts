import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
} from "@/lib/categories";
import {
  DEFAULT_FOCAL_POINT,
  MAX_HOME_IMAGES,
  type GalleryImage,
} from "@/lib/gallery-types";
import { altFromPathname } from "@/lib/slugify";
import manifest from "@/lib/local-gallery-manifest.json";

const LOCAL_GALLERY_ROOT = "TEMPORAL";

export const LOCAL_GALLERY_FOLDERS: Record<GalleryCategory, string> = {
  naturaleza: `${LOCAL_GALLERY_ROOT}/NATURALEZA`,
  retratos: `${LOCAL_GALLERY_ROOT}/RETRATOS`,
  deporte: `${LOCAL_GALLERY_ROOT}/DEPORTE`,
};

/** El cupo de Vercel Blob se reinicia el 20/10/2026. */
const LOCAL_GALLERY_UNTIL = Date.parse("2026-10-20T00:00:00.000Z");

export function useLocalGalleryFallback(): boolean {
  const forced = process.env.USE_LOCAL_GALLERY?.trim().toLowerCase();
  if (forced === "1" || forced === "true") {
    return true;
  }
  if (forced === "0" || forced === "false") {
    return false;
  }
  return Date.now() < LOCAL_GALLERY_UNTIL;
}

function publicSrc(folder: string, filename: string): string {
  return `/${folder}/${filename
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

function filenamesFor(category: GalleryCategory): string[] {
  const files = (manifest as Record<string, string[]>)[category];
  return Array.isArray(files) ? files : [];
}

export async function listLocalCategoryImages(
  category: GalleryCategory
): Promise<GalleryImage[]> {
  const folder = LOCAL_GALLERY_FOLDERS[category];
  const images = filenamesFor(category);

  return images.map((filename, index) => {
    const src = publicSrc(folder, filename);
    return {
      id: index + 1,
      src,
      url: src,
      pathname: `${folder}/${filename}`,
      alt: altFromPathname(filename),
      isHero: index === 0,
      isHome: index < MAX_HOME_IMAGES,
      homeIndex: index < MAX_HOME_IMAGES ? index : null,
      focalPoint: DEFAULT_FOCAL_POINT,
      tags: [],
    };
  });
}

export async function listAllLocalCategoryImages(): Promise<
  Record<GalleryCategory, GalleryImage[]>
> {
  const entries = await Promise.all(
    GALLERY_CATEGORIES.map(async (category) => {
      const images = await listLocalCategoryImages(category);
      return [category, images] as const;
    })
  );

  return Object.fromEntries(entries) as Record<GalleryCategory, GalleryImage[]>;
}
