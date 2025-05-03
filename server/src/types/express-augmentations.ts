import type { User } from "@prisma/client";

export type AuthenticatedUser = Pick<User, "email" | "id">;

declare module "express" {
  interface Request {
    user?: AuthenticatedUser;
  }
}

export {};
