import * as jwt from "jsonwebtoken";
import secret from "./../../secret.json";
import { User } from "../model/User";

export type JWTPayload = Pick<User, "email" | "id">;

const JWT_OPTIONS: jwt.SignOptions = {
  algorithm: "HS512",
  expiresIn: "7 days",
  issuer: "nailsapp"
};

export async function createToken(payload: JWTPayload): Promise<string> {
  return jwt.sign({ payload }, secret.passphrase, JWT_OPTIONS);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  return (jwt.verify(token, secret.passphrase, JWT_OPTIONS) as any)
    .payload as JWTPayload;
}
