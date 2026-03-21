export type Role = "Admin" | "User";

export type UserState = Partial<{
  id: string;
  username: string;
  email: string;
  roles: Role[];
  token: string;
  picture: string;
  bio: string;
  followersCount: number;
  followingCount: number;
}>;

export type UserActions = {
  updateUser: (user: Partial<UserState>) => void;
};

export type UserStore = UserState & UserActions;
