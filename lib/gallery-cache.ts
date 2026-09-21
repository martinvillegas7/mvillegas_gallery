import { revalidatePath, revalidateTag } from "next/cache";

export const GALLERY_CACHE_TAG = "gallery";
export const SITE_CONTENT_CACHE_TAG = "site-content";

export function revalidateGalleryCache() {
  revalidateTag(GALLERY_CACHE_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/naturaleza");
  revalidatePath("/retratos");
  revalidatePath("/deporte");
}

export function revalidateSiteContentCache() {
  revalidateTag(SITE_CONTENT_CACHE_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/contacto");
}
