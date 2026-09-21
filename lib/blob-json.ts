import { getBlobPublicUrl } from "@/lib/blob-public-url";

type FetchBlobJsonOptions = {
  fresh?: boolean;
  tag: string;
};

export async function fetchBlobJson(
  pathname: string,
  options: FetchBlobJsonOptions
): Promise<unknown | null> {
  const url = getBlobPublicUrl(pathname);

  try {
    const response = await fetch(
      url,
      options.fresh
        ? { cache: "no-store" }
        : { next: { revalidate: 300, tags: [options.tag] } }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error(`Error fetching blob ${pathname}: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching blob ${pathname}:`, error);
    return null;
  }
}
