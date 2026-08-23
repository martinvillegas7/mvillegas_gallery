export function slugify(value: string): string {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug;
}

export function slugifyFilename(originalName: string): string {
  const withoutExtension = originalName.replace(/\.[^.]+$/, "");
  return slugify(withoutExtension) || "foto";
}

export function altFromPathname(pathname: string): string {
  const filename = pathname.split("/").pop() ?? pathname;
  const withoutExtension = filename.replace(/\.[^.]+$/, "");
  const withoutTimestamp = withoutExtension.replace(/-\d+$/, "");
  const alt = withoutTimestamp.replace(/[-_]+/g, " ").trim();
  return alt || "Fotografía";
}
