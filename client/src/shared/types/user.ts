export type User = {
  _id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  accountStatus: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  __v: number;
} | null;
