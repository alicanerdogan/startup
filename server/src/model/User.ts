export interface UserPrimitive {
  email: string;
  password: string;
}

export interface User extends Omit<UserPrimitive, "password"> {
  id: number;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface UserPayload extends Pick<User, "email"> {}
