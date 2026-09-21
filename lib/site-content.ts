import { put } from "@vercel/blob";
import { fetchBlobJson } from "@/lib/blob-json";
import {
  SITE_CONTENT_CACHE_TAG,
  revalidateSiteContentCache,
} from "@/lib/gallery-cache";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  type SiteContent,
} from "@/lib/site-content-types";

export {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  instagramProfileUrl,
  type ExtraSocial,
  type SiteContent,
} from "@/lib/site-content-types";

export const SITE_CONTENT_PATH = "site-content.json";

export async function getSiteContent(options?: {
  fresh?: boolean;
}): Promise<SiteContent> {
  const data = await fetchBlobJson(SITE_CONTENT_PATH, {
    fresh: options?.fresh,
    tag: SITE_CONTENT_CACHE_TAG,
  });

  if (data == null) {
    return DEFAULT_SITE_CONTENT;
  }

  return mergeSiteContent(data);
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await put(SITE_CONTENT_PATH, JSON.stringify(content, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  revalidateSiteContentCache();
}
