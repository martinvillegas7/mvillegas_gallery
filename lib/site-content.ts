import { list, put } from "@vercel/blob";
import { unstable_noStore as noStore } from "next/cache";
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

export async function getSiteContent(): Promise<SiteContent> {
  noStore();

  try {
    const { blobs } = await list({
      prefix: SITE_CONTENT_PATH,
      limit: 10,
    });

    const blob = blobs.find((item) => item.pathname === SITE_CONTENT_PATH);
    if (!blob) {
      return DEFAULT_SITE_CONTENT;
    }

    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) {
      return DEFAULT_SITE_CONTENT;
    }

    const data: unknown = await response.json();
    return mergeSiteContent(data);
  } catch (error) {
    console.error("Error reading site content from Blob:", error);
    return DEFAULT_SITE_CONTENT;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await put(SITE_CONTENT_PATH, JSON.stringify(content, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
