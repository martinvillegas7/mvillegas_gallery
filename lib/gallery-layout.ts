import { list, put } from "@vercel/blob";
import { unstable_noStore as noStore } from "next/cache";
import type { GalleryCategory } from "@/lib/categories";
import {
  appendPathToLayout,
  emptyGalleryLayout,
  parseGalleryLayout,
  removePathFromLayout,
  type CategoryLayout,
  type GalleryLayout,
} from "@/lib/gallery-types";

export const GALLERY_LAYOUT_PATH = "gallery-layout.json";

export async function getGalleryLayout(): Promise<GalleryLayout> {
  noStore();

  try {
    const { blobs } = await list({
      prefix: GALLERY_LAYOUT_PATH,
      limit: 10,
    });

    const blob = blobs.find((item) => item.pathname === GALLERY_LAYOUT_PATH);
    if (!blob) {
      return emptyGalleryLayout();
    }

    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) {
      return emptyGalleryLayout();
    }

    const data: unknown = await response.json();
    return parseGalleryLayout(data);
  } catch (error) {
    console.error("Error reading gallery layout from Blob:", error);
    return emptyGalleryLayout();
  }
}

export async function saveGalleryLayout(layout: GalleryLayout): Promise<void> {
  await put(GALLERY_LAYOUT_PATH, JSON.stringify(layout, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function updateCategoryLayout(
  category: GalleryCategory,
  updater: (current: CategoryLayout) => CategoryLayout
): Promise<GalleryLayout> {
  const layout = await getGalleryLayout();
  layout[category] = updater(layout[category]);
  await saveGalleryLayout(layout);
  return layout;
}

export async function appendImageToLayout(
  category: GalleryCategory,
  pathname: string,
  allPathnamesOldestFirst: string[]
): Promise<void> {
  await updateCategoryLayout(category, (current) => {
    if (current.order.length === 0) {
      const seeded = allPathnamesOldestFirst.filter(
        (item, index, list) => list.indexOf(item) === index
      );
      return {
        ...current,
        order: seeded.includes(pathname) ? seeded : [...seeded, pathname],
      };
    }

    return appendPathToLayout(current, pathname);
  });
}

export async function removeImageFromLayout(
  category: GalleryCategory,
  pathname: string
): Promise<void> {
  await updateCategoryLayout(category, (current) =>
    removePathFromLayout(current, pathname)
  );
}
