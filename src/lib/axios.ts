import ax, { AxiosError } from "axios";
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/utils";

const baseURL = "https://localhost:7282";

export const axios = ax.create({
  baseURL: `${baseURL}/api`,
  timeout: 5000,
  withCredentials: true,
});

type RefreshSession = {
  token: string;
  username?: string;
  email?: string;
  roles?: string[];
};

let refreshTokenRequest: Promise<RefreshSession> | null = null;

export async function refreshAuthSession() {
  if (!refreshTokenRequest) {
    refreshTokenRequest = (async () => {
      const { data } = await axios.get(`/auth/refreshtoken`);

      const nextToken = data?.token;

      if (!nextToken || typeof nextToken !== "string") {
        throw new Error(
          "Refresh token response does not include an access token",
        );
      }

      await setAuthToken(nextToken);
      return {
        username: data?.username,
        email: data?.email,
        roles: data?.roles,
        token: nextToken,
      };
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
      const session = await refreshAuthSession();
      const nextToken = session.token;

      originalRequest.headers.set("Authorization", `Bearer ${nextToken}`);
      return axios(originalRequest);
    } catch (refreshError) {
      await clearAuthToken();
      return Promise.reject(refreshError);
    }
  },
);
