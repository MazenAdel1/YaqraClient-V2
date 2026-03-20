export type Role = "Admin" | "User";

export type UserState = {
  username: string;
  email: string;
  roles: Role[];
  token: string;
  picture: string;
};

export type UserActions = {
  updateUser: (user: UserState) => void;
};

export type UserStore = UserState & UserActions;

export const defaultUserState: UserState = {
  username: "",
  email: "",
  roles: [],
  token: "",
  picture: "",
};
