import { createHash } from "crypto";
import { list, put } from "@vercel/blob";
import { unstable_noStore as noStore } from "next/cache";
import { GALLERY_CATEGORIES } from "@/lib/categories";
import {
  allKnownHashes,
  emptyGalleryHashes,
  findDuplicateEntry,
  parseGalleryHashes,
  removeHashEntry,
  upsertHashEntry,
  type GalleryHashes,
  type HashEntry,
} from "@/lib/gallery-hashes";

export const GALLERY_HASHES_PATH = "gallery-hashes.json";

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp)$/i;

export function sha256Buffer(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

export async function getGalleryHashes(): Promise<GalleryHashes> {
  noStore();

  try {
    const { blobs } = await list({
      prefix: GALLERY_HASHES_PATH,
      limit: 10,
    });

    const blob = blobs.find((item) => item.pathname === GALLERY_HASHES_PATH);
    if (!blob) {
      return emptyGalleryHashes();
    }

    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) {
      return emptyGalleryHashes();
    }

    const data: unknown = await response.json();
    return parseGalleryHashes(data);
  } catch (error) {
    console.error("Error reading gallery hashes from Blob:", error);
    return emptyGalleryHashes();
  }
}

export async function saveGalleryHashes(store: GalleryHashes): Promise<void> {
  await put(GALLERY_HASHES_PATH, JSON.stringify(store, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function listImageBlobs(): Promise<Array<{ pathname: string; url: string }>> {
  const images: Array<{ pathname: string; url: string }> = [];

  for (const category of GALLERY_CATEGORIES) {
    let cursor: string | undefined;
    do {
      const result = await list({
        prefix: `${category}/`,
        cursor,
        limit: 1000,
      });
      images.push(
        ...result.blobs
          .filter((blob) => IMAGE_EXTENSIONS.test(blob.pathname))
          .map((blob) => ({ pathname: blob.pathname, url: blob.url }))
      );
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
  }

  return images;
}

export async function getGalleryHashesWithBackfill(): Promise<GalleryHashes> {
  const store = await getGalleryHashes();
  const known = new Set(store.entries.map((entry) => entry.pathname));
  const blobs = await listImageBlobs();
  let next = store;
  let changed = false;

  for (const blob of blobs) {
    if (known.has(blob.pathname)) {
      continue;
    }

    try {
      const response = await fetch(blob.url, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      next = upsertHashEntry(next, {
        pathname: blob.pathname,
        originalHash: null,
        blobHash: sha256Buffer(buffer),
      });
      changed = true;
    } catch (error) {
      console.error(`Could not hash existing blob ${blob.pathname}:`, error);
    }
  }

  if (changed) {
    await saveGalleryHashes(next);
  }

  return next;
}

export async function listKnownContentHashes(): Promise<string[]> {
  const store = await getGalleryHashesWithBackfill();
  return allKnownHashes(store);
}

export async function findContentDuplicate(
  originalHash: string | null,
  blobHash: string | null
): Promise<HashEntry | null> {
  const store = await getGalleryHashes();
  return findDuplicateEntry(store, originalHash, blobHash);
}

export async function registerImageHashes(entry: HashEntry): Promise<void> {
  const store = await getGalleryHashes();
  await saveGalleryHashes(upsertHashEntry(store, entry));
}

export async function unregisterImageHashes(pathname: string): Promise<void> {
  const store = await getGalleryHashes();
  await saveGalleryHashes(removeHashEntry(store, pathname));
}
