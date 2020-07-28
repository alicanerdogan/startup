import { RequestHandler } from "../router/router";
import * as UserRegistry from "../registry/UserRegistry";
import { createToken } from "../utils/token";

export const createSession: RequestHandler = async (req, res, _next) => {
  try {
    const { email, password } = req.body;
    const user = await UserRegistry.getUserWithEmail(email);
    if (!user) {
      res.sendStatus(401);
      return;
    }
    if (!user.password_hash) {
      res.sendStatus(400);
      return;
    }
    const passwordCorrect = await UserRegistry.isPasswordCorrect(
      password,
      user.password_hash
    );
    if (!passwordCorrect) {
      res.sendStatus(401);
      return;
    }
    const token = await createToken({ email: user.email, id: user.id });
    res
      .status(201)
      .contentType("json")
      .send(JSON.stringify({ jwt: token }));
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};
