import { dbConn } from "../db";
import bcrypt from "bcrypt";
import { UserPrimitive } from "../model/User";

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

export async function createUser(user: UserPrimitive) {
  const passwordHash = await hashPassword(user.password);
  return await dbConn.user.create({
    data: {
      email: user.email,
      passwordHash,
    },

    select: { id: true, email: true, createdAt: true, updatedAt: true },
  });
}

export async function createUserWithProvider(user: {
  email: string;
  provider: string;
}) {
  return await dbConn.user.create({
    data: user,
    select: { id: true, email: true, createdAt: true, updatedAt: true },
  });
}

export async function getUser(id: string) {
  return await dbConn.user.findUnique({
    where: { id },
    select: { id: true, email: true, createdAt: true, updatedAt: true },
  });
}

export async function getAllUserFields(id: string) {
  return await dbConn.user.findUnique({
    where: { id },
  });
}

export async function getUserWithEmail(email: string) {
  return await dbConn.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      passwordHash: true,
    },
  });
}

export async function getUserWithResetToken(resetToken: string) {
  return await dbConn.user.findUnique({
    where: { resetToken },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      resetTokenExpirationDate: true,
    },
  });
}

export async function listUsers() {
  return await dbConn.user.findMany({ select: { email: true } });
}

export async function setPasswordToken(
  id: string,
  resetToken: string | null,
  resetTokenExpirationDate: string | null
) {
  await dbConn.user.update({
    where: { id },
    data: { resetToken, resetTokenExpirationDate },
  });
}

export async function setPassword(id: string, password: string) {
  const passwordHash = await hashPassword(password);
  await dbConn.user.update({
    where: { id },
    data: { passwordHash },
  });
}
