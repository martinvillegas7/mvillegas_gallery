const STORE_PREFIX = /^store_/;

function getBlobStoreId(): string | null {
  const fromEnv = process.env.BLOB_STORE_ID?.trim();
  if (fromEnv) {
    return fromEnv.replace(STORE_PREFIX, "");
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) {
    return null;
  }

  const [, , , storeId] = token.split("_");
  return storeId || null;
}

export function getBlobPublicBaseUrl(): string | null {
  const fromEnv = process.env.BLOB_PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) {
    return fromEnv;
  }

  const storeId = getBlobStoreId();
  if (!storeId) {
    return null;
  }

  return `https://${storeId}.public.blob.vercel-storage.com`;
}

export function getBlobPublicUrl(pathname: string): string {
  const base = getBlobPublicBaseUrl();
  const normalized = pathname.replace(/^\//, "");
  if (!base) {
    return `/${normalized}`;
  }
  return `${base}/${normalized}`;
}
