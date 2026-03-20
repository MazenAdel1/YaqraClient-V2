"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  type UserState,
  type UserStore,
  defaultUserState,
} from "@/stores/user-store";

type UserStoreContextValue = {
  user: UserState;
  updateUser: (user: UserState) => void;
};

const UserStoreContext = createContext<UserStoreContextValue | undefined>(
  undefined,
);

export type UserStoreProviderProps = {
  children: ReactNode;
};

export const UserStoreProvider = ({ children }: UserStoreProviderProps) => {
  const [user, setUser] = useState<UserState>(defaultUserState);

  const updateUser = useCallback((nextUser: UserState) => {
    setUser(nextUser);
  }, []);

  const value = useMemo(() => ({ user, updateUser }), [user, updateUser]);

  return (
    <UserStoreContext.Provider value={value}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (state: UserStore) => T) => {
  const store = useContext(UserStoreContext);

  if (!store) {
    throw new Error("useUserStore must be used within a UserStoreProvider");
  }

  const storeLike: UserStore = {
    ...store.user,
    updateUser: store.updateUser,
  };

  return selector(storeLike);
};
