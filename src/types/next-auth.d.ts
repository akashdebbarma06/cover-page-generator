import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      uniqueUserId: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    uniqueUserId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    uniqueUserId?: string;
  }
}
