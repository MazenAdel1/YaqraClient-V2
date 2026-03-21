import ax, { AxiosError } from "axios";
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/utils";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL
  ? `${process.env.NEXT_PUBLIC_SERVER_URL}`
  : "https://localhost:7282";

export const axios = ax.create({
  baseURL: `${baseURL}/api`,
  timeout: 5000,
});

let refreshTokenRequest: Promise<string | null> | null = null;

async function refreshAccessToken() {
  if (!refreshTokenRequest) {
    refreshTokenRequest = (async () => {
      const token = await getAuthToken();
      const { data } = await ax.post(
        `${baseURL}/api/auth/refreshtoken`,
        {},
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined,
      );

      const nextToken = data?.token ?? null;

      if (!nextToken || typeof nextToken !== "string") {
        throw new Error(
          "Refresh token response does not include an access token",
        );
      }

      await setAuthToken(nextToken);
      return nextToken;
    })().finally(() => {
      refreshTokenRequest = null;
    });
  }

  return refreshTokenRequest;
}

axios.interceptors.request.use((config) => {
  return (async () => {
    const token = await getAuthToken();

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.delete("Authorization");
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
      const nextToken = await refreshAccessToken();

      if (!nextToken) {
        throw new Error("Missing token after refresh");
      }

      originalRequest.headers.set("Authorization", `Bearer ${nextToken}`);
      return axios(originalRequest);
    } catch (refreshError) {
      await clearAuthToken();
      return Promise.reject(refreshError);
    }
  },
);
