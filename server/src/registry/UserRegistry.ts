import { dbConn } from "../db";
import bcrypt from "bcrypt";
import { UserPayload, UserPrimitive, User } from "../model/User";

async function hashPassword(password: string) {
  const SALT_ROUNDS = 10;
  const hashedPassword = await new Promise<string>((resolve, reject) => {
    bcrypt.hash(password, SALT_ROUNDS, (err, encrypted) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(encrypted);
    });
  });
  return hashedPassword;
}

export async function isPasswordCorrect(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export async function createUser(user: UserPrimitive): Promise<UserPayload> {
  const hashedPassword = await hashPassword(user.password);

  const res = await new Promise<UserPayload>(resolve => {
    dbConn("users")
      .insert({ email: user.email, password_hash: hashedPassword }, ["email"])
      .then(data => resolve(data[0] as UserPayload));
  });

  return res;
}

export async function getUser(id: number) {
  const res = await new Promise<User>(resolve => {
    dbConn<User>("users")
      .select("*")
      .where("id", id)
      .first()
      .then(data => resolve(data));
  });

  return res;
}

export async function getUserWithEmail(email: string) {
  const res = await new Promise<User>(resolve => {
    dbConn<User>("users")
      .select("*")
      .where("email", email)
      .first()
      .then(data => resolve(data));
  });

  return res;
}

export async function listUsers() {
  const res = await new Promise(resolve => {
    dbConn<UserPayload>("users")
      .select("email")
      .then(data => resolve(data));
  });

  return res;
}
