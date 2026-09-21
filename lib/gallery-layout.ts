import { put } from "@vercel/blob";
import type { GalleryCategory } from "@/lib/categories";
import { fetchBlobJson } from "@/lib/blob-json";
import { GALLERY_CACHE_TAG, revalidateGalleryCache } from "@/lib/gallery-cache";
import {
  appendPathToLayout,
  emptyGalleryLayout,
  parseGalleryLayout,
  removePathFromLayout,
  type CategoryLayout,
  type GalleryLayout,
} from "@/lib/gallery-types";

export const GALLERY_LAYOUT_PATH = "gallery-layout.json";

export async function getGalleryLayout(options?: {
  fresh?: boolean;
}): Promise<GalleryLayout> {
  const data = await fetchBlobJson(GALLERY_LAYOUT_PATH, {
    fresh: options?.fresh,
    tag: GALLERY_CACHE_TAG,
  });

  if (data == null) {
    return emptyGalleryLayout();
  }

  return parseGalleryLayout(data);
}

export async function saveGalleryLayout(layout: GalleryLayout): Promise<void> {
  await put(GALLERY_LAYOUT_PATH, JSON.stringify(layout, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  revalidateGalleryCache();
}

export async function updateCategoryLayout(
  category: GalleryCategory,
  updater: (current: CategoryLayout) => CategoryLayout
): Promise<GalleryLayout> {
  const layout = await getGalleryLayout({ fresh: true });
  layout[category] = updater(layout[category]);
  await saveGalleryLayout(layout);
  return layout;
}

export async function appendImageToLayout(
  category: GalleryCategory,
  pathname: string,
  url: string
): Promise<void> {
  await updateCategoryLayout(category, (current) =>
    appendPathToLayout(current, pathname, url)
  );
}

export async function removeImageFromLayout(
  category: GalleryCategory,
  pathname: string
): Promise<void> {
  await updateCategoryLayout(category, (current) =>
    removePathFromLayout(current, pathname)
  );
}
