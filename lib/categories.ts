export const GALLERY_CATEGORIES = ["naturaleza", "retratos", "deporte"] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  naturaleza: "Naturaleza",
  retratos: "Retratos",
  deporte: "Deporte",
};

export function isGalleryCategory(value: string): value is GalleryCategory {
  return (GALLERY_CATEGORIES as readonly string[]).includes(value);
}
