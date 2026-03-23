"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type UserState } from "@/stores/user-store";
import {
  clearAuthToken,
  getAuthToken,
  getUserId,
  getUserRoles,
} from "@/lib/utils";
import { AUTH_INVALID_EVENT, axios, refreshAuthSession } from "@/lib/axios";
import { usePathname, useRouter } from "next/navigation";

type UserStoreContextValue = {
  user: UserState | null;
  isHydratingUser: boolean;
  updateUser: (user: UserState | null) => void;
};

const UserStoreContext = createContext<UserStoreContextValue | undefined>(
  undefined,
);

export type UserStoreProviderProps = {
  children: ReactNode;
};

export const UserStoreProvider = ({ children }: UserStoreProviderProps) => {
  const [user, setUser] = useState<UserState | null>(null);
  const [isHydratingUser, setIsHydratingUser] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleInvalidSession = useCallback(async () => {
    await clearAuthToken();
    setUser(null);

    if (pathname !== "/login") {
      router.replace("/login");
    }
  }, [pathname, router]);

  useEffect(() => {
    const onAuthInvalid = () => {
      void handleInvalidSession();
    };

    window.addEventListener(AUTH_INVALID_EVENT, onAuthInvalid);

    return () => {
      window.removeEventListener(AUTH_INVALID_EVENT, onAuthInvalid);
    };
  }, [handleInvalidSession]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        let session: Awaited<ReturnType<typeof refreshAuthSession>> | null =
          null;
        const storedToken = await getAuthToken();

        try {
          session = await refreshAuthSession();
        } catch {
          if (isMounted) {
            await handleInvalidSession();
          }
          return;
        }

        const token = session?.token ?? storedToken;

        if (!token) {
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        const userId = getUserId(token);
        let profileData: {
          username?: string;
          profilePicture?: string;
          bio?: string;
          followersCount?: number;
          followingsCount?: number;
        } | null = null;

        try {
          const { data } = await axios.get(`/user/user?userId=${userId}`);
          profileData = data?.result ?? null;
        } catch {
          profileData = null;
        }

        if (!isMounted) {
          return;
        }

        setUser((prevUser) => ({
          ...prevUser,
          token,
          id: userId,
          username: session?.username ?? profileData?.username,
          email: session?.email ?? prevUser?.email,
          roles: Array.isArray(session?.roles)
            ? (session.roles as UserState["roles"])
            : ((getUserRoles(token) as UserState["roles"]) ?? prevUser?.roles),
          picture: profileData?.profilePicture,
          bio: profileData?.bio,
          followersCount: profileData?.followersCount,
          followingsCount: profileData?.followingsCount,
        }));
      } catch {
        if (!isMounted) return;
        await handleInvalidSession();
      } finally {
        if (isMounted) {
          setIsHydratingUser(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [handleInvalidSession]);

  const updateUser = useCallback((nextUser: UserState | null) => {
    setUser((prevUser) => (nextUser ? { ...prevUser, ...nextUser } : null));
  }, []);

  const value = useMemo(
    () => ({ user, isHydratingUser, updateUser }),
    [user, isHydratingUser, updateUser],
  );

  return (
    <UserStoreContext.Provider value={value}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = () => {
  const store = useContext(UserStoreContext);

  if (!store) {
    throw new Error("useUserStore must be used within a UserStoreProvider");
  }

  return store;
};
