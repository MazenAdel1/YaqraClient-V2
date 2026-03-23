import ax, { AxiosError } from "axios";
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/utils";
import { jwtDecode } from "jwt-decode";

const baseURL = "https://localhost:7282";

export const axios = ax.create({
  baseURL: `${baseURL}/api`,
  timeout: 5000,
  withCredentials: true,
});

export const AUTH_INVALID_EVENT = "auth:invalid";

function emitAuthInvalidEvent() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_INVALID_EVENT));
}

type RefreshSession = {
  token: string;
  username?: string;
  email?: string;
  roles?: string[];
};

let refreshTokenRequest: Promise<RefreshSession> | null = null;

type JwtPayload = {
  exp?: number;
};

const isValidAccessToken = (token: unknown) => {
  if (typeof token !== "string" || token.length === 0) {
    return false;
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);

    if (typeof payload.exp === "number") {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp <= nowInSeconds) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
};

export async function refreshAuthSession() {
  if (!refreshTokenRequest) {
    refreshTokenRequest = (async () => {
      try {
        const { data } = await axios.get(`/auth/refreshtoken`);

        const nextToken = data?.token;

        if (!isValidAccessToken(nextToken)) {
          throw new Error(
            "Refresh token response does not include a valid access token",
          );
        }

        await setAuthToken(nextToken);
        return {
          username: data?.username,
          email: data?.email,
          roles: data?.roles,
          token: nextToken,
        };
      } catch (error) {
        await clearAuthToken();
        emitAuthInvalidEvent();
        throw error;
      }
    })().finally(() => {
      refreshTokenRequest = null;
    });
  }

  return refreshTokenRequest;
}

axios.interceptors.request.use((config) => {
  return (async () => {
    const token = await getAuthToken();

    if (isValidAccessToken(token)) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.delete("Authorization");

      if (token) {
        await clearAuthToken();
        emitAuthInvalidEvent();
      }
    }

    return config;
  })();
});

axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as
      | (typeof error.config & {
          _retry?: boolean;
        })
      | null;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refreshtoken")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const session = await refreshAuthSession();
      const nextToken = session.token;

      originalRequest.headers.set("Authorization", `Bearer ${nextToken}`);
      return axios(originalRequest);
    } catch (refreshError) {
      await clearAuthToken();
      emitAuthInvalidEvent();
      return Promise.reject(refreshError);
    }
  },
);
