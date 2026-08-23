export type GalleryImage = {
  id: number;
  src: string;
  alt: string;
  url: string;
  pathname: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseGalleryImages(value: unknown): GalleryImage[] {
  if (!isRecord(value) || !Array.isArray(value.images)) {
    return [];
  }

  return value.images.flatMap((item, index) => {
    if (!isRecord(item)) {
      return [];
    }

    const src = typeof item.src === "string" ? item.src : "";
    const url = typeof item.url === "string" ? item.url : src;
    const pathname = typeof item.pathname === "string" ? item.pathname : "";
    const alt = typeof item.alt === "string" ? item.alt : "Fotografía";

    if (!src) {
      return [];
    }

    return [
      {
        id: typeof item.id === "number" ? item.id : index + 1,
        src,
        url,
        pathname,
        alt,
      },
    ];
  });
}

