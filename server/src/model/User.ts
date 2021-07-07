export interface UserPrimitive {
  email: string;
  password: string;
}

import { User as UserType } from "@prisma/client";
export type User = UserType;

export interface UserPayload extends Pick<User, "email"> {}
