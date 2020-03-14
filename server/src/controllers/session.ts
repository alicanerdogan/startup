import { RequestHandler } from "../router/router";
import * as UserRegistry from "../registry/UserRegistry";
import { createToken } from "../utils/token";

export const createSession: RequestHandler = async (req, res, _next) => {
  const { email, password } = req.body;
  const user = await UserRegistry.getUserWithEmail(email);
  const passwordCorrect = await UserRegistry.isPasswordCorrect(
    password,
    user.password_hash
  );
  if (!passwordCorrect) {
    res.sendStatus(404);
    return;
  }
  const token = await createToken({ email: user.email, id: user.id });
  res
    .status(201)
    .contentType("json")
    .send(JSON.stringify({ token }));
};
