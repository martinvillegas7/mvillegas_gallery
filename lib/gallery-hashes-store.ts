import { createHash } from "crypto";
import { put } from "@vercel/blob";
import { fetchBlobJson } from "@/lib/blob-json";
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

export function sha256Buffer(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

export async function getGalleryHashes(): Promise<GalleryHashes> {
  const data = await fetchBlobJson(GALLERY_HASHES_PATH, {
    fresh: true,
    tag: "gallery-hashes",
  });

  if (data == null) {
    return emptyGalleryHashes();
  }

  return parseGalleryHashes(data);
}

export async function saveGalleryHashes(store: GalleryHashes): Promise<void> {
  await put(GALLERY_HASHES_PATH, JSON.stringify(store, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function listKnownContentHashes(): Promise<string[]> {
  const store = await getGalleryHashes();
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
