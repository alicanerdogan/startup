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

export async function createUser(user: UserPrimitive): Promise<User> {
  const hashedPassword = await hashPassword(user.password);

  const res = await new Promise<User>((resolve, reject) => {
    dbConn("users")
      .insert({ email: user.email, password_hash: hashedPassword }, [
        "email",
        "id",
      ])
      .then((data) => resolve(data[0] as User))
      .catch(reject);
  });

  return res;
}

export async function createUserWithProvider(user: {
  email: string;
  provider: string;
}): Promise<User> {
  const res = await new Promise<User>((resolve, reject) => {
    dbConn("users")
      .insert({ email: user.email, provider: user.provider }, ["email", "id"])
      .then((data) => resolve(data[0] as User))
      .catch(reject);
  });

  return res;
}

export async function getUser(id: string) {
  const res = await new Promise<User>((resolve) => {
    dbConn<User>("users")
      .select("*")
      .where("id", id)
      .first()
      .then((data) => resolve(data));
  });

  return res;
}

export async function getUserWithEmail(email: string) {
  const res = await new Promise<User>((resolve) => {
    dbConn<User>("users")
      .select("*")
      .where("email", email)
      .first()
      .then((data) => resolve(data));
  });

  return res;
}

export async function getUserWithResetToken(reset_token: string) {
  const res = await new Promise<User & { reset_token_expiration_date: string }>(
    (resolve) => {
      dbConn("users")
        .select("*")
        .where("reset_token", reset_token)
        .first()
        .then((data) => resolve(data));
    }
  );

  return res;
}

export async function listUsers() {
  const res = await new Promise((resolve) => {
    dbConn<UserPayload>("users")
      .select("email")
      .then((data) => resolve(data));
  });

  return res;
}

export async function setPasswordToken(
  id: string,
  resetToken: string | null,
  resetTokenExpirationDate: string | null
) {
  await new Promise((resolve) => {
    dbConn("users")
      .where({ id })
      .update({
        reset_token: resetToken,
        reset_token_expiration_date: resetTokenExpirationDate,
      })
      .then(resolve);
  });
}

export async function setPassword(id: string, password: string) {
  await new Promise((resolve) => {
    dbConn("users")
      .where({ id })
      .update({
        password_hash: hashPassword(password),
      })
      .then(resolve);
  });
}
