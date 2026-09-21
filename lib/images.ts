import { altFromPathname } from "@/lib/slugify";
import { getBlobPublicUrl } from "@/lib/blob-public-url";
import {
  GALLERY_CATEGORIES,
  type GalleryCategory,
  isGalleryCategory,
} from "@/lib/categories";
import {
  DEFAULT_FOCAL_POINT,
  emptyCategoryLayout,
  type CategoryLayout,
  type GalleryImage,
} from "@/lib/gallery-types";
import { getGalleryLayout } from "@/lib/gallery-layout";

export type { GalleryImage };

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp)$/i;

export function isDeletableImagePath(pathname: string): boolean {
  const [category] = pathname.split("/");
  return Boolean(category && isGalleryCategory(category));
}

function imagesFromLayout(layout: CategoryLayout): GalleryImage[] {
  const seen = new Set<string>();
  const pathnames: string[] = [];

  for (const pathname of layout.order) {
    if (!pathname || seen.has(pathname) || !IMAGE_EXTENSIONS.test(pathname)) {
      continue;
    }
    seen.add(pathname);
    pathnames.push(pathname);
  }

  return pathnames.map((pathname, index) => {
    const url = layout.urls[pathname] || getBlobPublicUrl(pathname);
    const homeIndex = layout.home.indexOf(pathname);
    return {
      id: index + 1,
      src: url,
      url,
      pathname,
      alt: altFromPathname(pathname),
      isHero: layout.hero === pathname,
      isHome: homeIndex >= 0,
      homeIndex: homeIndex >= 0 ? homeIndex : null,
      focalPoint: layout.focalPoints[pathname] ?? DEFAULT_FOCAL_POINT,
      tags: layout.tags?.[pathname] ?? [],
    };
  });
}

export async function listCategoryImages(
  category: GalleryCategory,
  options?: { fresh?: boolean }
): Promise<GalleryImage[]> {
  const layout = await getGalleryLayout(options);
  return imagesFromLayout(layout[category] ?? emptyCategoryLayout());
}

export async function listAllCategoryImages(options?: {
  fresh?: boolean;
}): Promise<Record<GalleryCategory, GalleryImage[]>> {
  const layout = await getGalleryLayout(options);
  return Object.fromEntries(
    GALLERY_CATEGORIES.map((category) => [
      category,
      imagesFromLayout(layout[category] ?? emptyCategoryLayout()),
    ])
  ) as Record<GalleryCategory, GalleryImage[]>;
}
