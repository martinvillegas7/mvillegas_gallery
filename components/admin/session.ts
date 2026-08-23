export const ADMIN_PASSWORD_STORAGE_KEY = "admin-password";

export function getStoredAdminPassword(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return sessionStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) ?? "";
}

export function storeAdminPassword(password: string): void {
  sessionStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password);
}

export function clearAdminPassword(): void {
  sessionStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY);
}

export async function adminFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("x-admin-password", getStoredAdminPassword());
  return fetch(input, { ...init, headers });
}

export async function readApiError(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
    ) {
      return data.error;
    }
  } catch {
    // ignore JSON parse errors
  }
  return fallback;
}
