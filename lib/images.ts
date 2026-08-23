import { list } from "@vercel/blob";
import { altFromPathname } from "@/lib/slugify";
import {
  type GalleryCategory,
  isGalleryCategory,
} from "@/lib/categories";
import type { GalleryImage } from "@/lib/gallery-types";

export type { GalleryImage };

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp)$/i;

export function isDeletableImagePath(pathname: string): boolean {
  const [category] = pathname.split("/");
  return Boolean(category && isGalleryCategory(category));
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

  return blobs
    .filter((blob) => IMAGE_EXTENSIONS.test(blob.pathname))
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    .map((blob, index) => ({
      id: index + 1,
      src: blob.url,
      url: blob.url,
      pathname: blob.pathname,
      alt: altFromPathname(blob.pathname),
    }));
}
