export type HashEntry = {
  pathname: string;
  originalHash: string | null;
  blobHash: string;
};

export type GalleryHashes = {
  entries: HashEntry[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function emptyGalleryHashes(): GalleryHashes {
  return { entries: [] };
}

export function parseGalleryHashes(value: unknown): GalleryHashes {
  if (!isRecord(value) || !Array.isArray(value.entries)) {
    return emptyGalleryHashes();
  }

  const entries = value.entries.flatMap((item) => {
    if (!isRecord(item) || typeof item.pathname !== "string") {
      return [];
    }

    const originalHash =
      typeof item.originalHash === "string" ? item.originalHash : null;
    const blobHash = typeof item.blobHash === "string" ? item.blobHash : "";

    if (!blobHash && !originalHash) {
      return [];
    }

    return [
      {
        pathname: item.pathname,
        originalHash,
        blobHash,
      },
    ];
  });

  return { entries };
}

export function parseKnownHashes(value: unknown): string[] {
  if (!isRecord(value) || !Array.isArray(value.hashes)) {
    return [];
  }

  return value.hashes.filter((item): item is string => typeof item === "string");
}

export function allKnownHashes(store: GalleryHashes): string[] {
  const hashes = new Set<string>();
  for (const entry of store.entries) {
    if (entry.originalHash) {
      hashes.add(entry.originalHash);
    }
    if (entry.blobHash) {
      hashes.add(entry.blobHash);
    }
  }
  return [...hashes];
}

export function findDuplicateEntry(
  store: GalleryHashes,
  originalHash: string | null,
  blobHash: string | null
): HashEntry | null {
  return (
    store.entries.find((entry) => {
      if (originalHash && entry.originalHash === originalHash) {
        return true;
      }
      if (blobHash && entry.blobHash === blobHash) {
        return true;
      }
      if (originalHash && entry.blobHash === originalHash) {
        return true;
      }
      return false;
    }) ?? null
  );
}

export function upsertHashEntry(
  store: GalleryHashes,
  entry: HashEntry
): GalleryHashes {
  const without = store.entries.filter(
    (item) => item.pathname !== entry.pathname
  );
  return { entries: [...without, entry] };
}

export function removeHashEntry(
  store: GalleryHashes,
  pathname: string
): GalleryHashes {
  return {
    entries: store.entries.filter((item) => item.pathname !== pathname),
  };
}
