import { list } from "@vercel/blob";
import { altFromPathname } from "@/lib/slugify";
import {
  type GalleryCategory,
  isGalleryCategory,
} from "@/lib/categories";
import type { CategoryLayout, GalleryImage } from "@/lib/gallery-types";
import { emptyCategoryLayout } from "@/lib/gallery-types";
import { getGalleryLayout } from "@/lib/gallery-layout";

export type { GalleryImage };

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp)$/i;

export function isDeletableImagePath(pathname: string): boolean {
  const [category] = pathname.split("/");
  return Boolean(category && isGalleryCategory(category));
}

function applyLayout(
  images: Array<{
    url: string;
    pathname: string;
    uploadedAt: Date;
  }>,
  layout: CategoryLayout
): GalleryImage[] {
  const byPath = new Map(images.map((image) => [image.pathname, image]));
  const ordered: typeof images = [];

  for (const pathname of layout.order) {
    const image = byPath.get(pathname);
    if (image) {
      ordered.push(image);
      byPath.delete(pathname);
    }
  }

  const remaining = [...byPath.values()].sort(
    (a, b) => a.uploadedAt.getTime() - b.uploadedAt.getTime()
  );
  ordered.push(...remaining);

  return ordered.map((blob, index) => {
    const homeIndex = layout.home.indexOf(blob.pathname);
    return {
      id: index + 1,
      src: blob.url,
      url: blob.url,
      pathname: blob.pathname,
      alt: altFromPathname(blob.pathname),
      isHero: layout.hero === blob.pathname,
      isHome: homeIndex >= 0,
      homeIndex: homeIndex >= 0 ? homeIndex : null,
    };
  });
}

export async function listCategoryImages(
  category: GalleryCategory
): Promise<GalleryImage[]> {
  const prefix = `${category}/`;
  const blobs: Array<{
    url: string;
    pathname: string;
    uploadedAt: Date;
  }> = [];

  let cursor: string | undefined;

  do {
    const result = await list({
      prefix,
      cursor,
      limit: 1000,
    });

    blobs.push(
      ...result.blobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt,
      }))
    );

    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  const images = blobs.filter((blob) => IMAGE_EXTENSIONS.test(blob.pathname));
  const layout = await getGalleryLayout();

  return applyLayout(images, layout[category] ?? emptyCategoryLayout());
}
