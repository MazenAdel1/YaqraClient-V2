import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// get user id from token
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  uid: string;
  roles?: string[];
};

export function getUserId(token: string) {
  const decoded = jwtDecode<DecodedToken>(token);
  return decoded.uid;
}

export function getUserRoles(token: string): string[] | undefined {
  const decoded = jwtDecode<DecodedToken>(token);
  const rawRoles = decoded.roles;

  if (Array.isArray(rawRoles)) {
    return rawRoles.filter((role) => typeof role === "string");
  }

  if (typeof rawRoles === "string") {
    return [rawRoles];
  }

  return undefined;
}

// auth token store utils

const TOKEN_API_ROUTE = "/api/auth/token";
let cachedToken: string | null | undefined;

export async function getAuthToken(): Promise<string | null> {
  if (cachedToken !== undefined) {
    return cachedToken;
  }

  if (typeof window !== "undefined") {
    const response = await fetch(TOKEN_API_ROUTE, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      cachedToken = null;
      return null;
    }

    const data = (await response.json()) as { token: string | null };
    cachedToken = data.token;

    return cachedToken;
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cachedToken = cookieStore.get("token")?.value ?? null;
  return cachedToken;
}

export async function setAuthToken(token: string) {
  const response = await fetch(TOKEN_API_ROUTE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error("Failed to store auth token");
  }

  cachedToken = token;
}

export async function clearAuthToken() {
  await fetch(TOKEN_API_ROUTE, {
    method: "DELETE",
    credentials: "include",
  });

  cachedToken = null;
}

export function timeAgo(createdAt: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(createdAt + "Z").getTime()) / 1000,
  );

  const intervals = [
    { label: ["سنة", "سنوات"], seconds: 31536000 },
    { label: ["شهر", "أشهر"], seconds: 2592000 },
    { label: ["أسبوع", "أسابيع"], seconds: 604800 },
    { label: ["يوم", "أيام"], seconds: 86400 },
    { label: ["ساعة", "ساعات"], seconds: 3600 },
    { label: ["دقيقة", "دقائق"], seconds: 60 },
  ];

  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s);
    if (count >= 1) return `${count} ${count === 1 ? label[0] : label[1]}`;
  }

  return "الآن";
}
