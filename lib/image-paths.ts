import { isGalleryCategory } from "@/lib/categories";

export function isDeletableImagePath(pathname: string): boolean {
  const [category] = pathname.split("/");
  return Boolean(category && isGalleryCategory(category));
}
