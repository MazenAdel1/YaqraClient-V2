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
import { getUserId } from "@/lib/utils";
import { axios } from "@/lib/axios";
import { getAuthToken } from "@/lib/utils";

type UserStoreContextValue = {
  user: UserState | null;
  updateUser: (user: UserState) => void;
};

const UserStoreContext = createContext<UserStoreContextValue | undefined>(
  undefined,
);

export type UserStoreProviderProps = {
  children: ReactNode;
};

export const UserStoreProvider = ({ children }: UserStoreProviderProps) => {
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getAuthToken();

      if (!token) {
        return;
      }

      const userId = getUserId(token);

      const { data } = await axios.get(`/user/user?userId=${userId}`);
      setUser((prevUser) => ({
        ...prevUser,
        token,
        username: data.result.username,
        picture: data.result.profilePicture,
        bio: data.result.bio,
        followersCount: data.result.followersCount,
        followingCount: data.result.followingCount,
        id: userId,
      }));
    })();
  }, []);

  const updateUser = useCallback((nextUser: UserState) => {
    setUser((prevUser) => ({ ...prevUser, ...nextUser }));
  }, []);

  const value = useMemo(() => ({ user, updateUser }), [user, updateUser]);

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
