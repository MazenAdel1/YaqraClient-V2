import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// get user id from token
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  uid: string;
};

export function getUserId(token: string) {
  const decoded = jwtDecode<DecodedToken>(token);
  return decoded.uid;
}

// auth token store utils

const TOKEN_API_ROUTE = "/api/auth/token";
let cachedToken: string | null | undefined;

export async function getAuthToken(): Promise<string | null> {
  if (cachedToken !== undefined) {
    return cachedToken;
  }

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
