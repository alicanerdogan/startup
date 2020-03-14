import { AuthorizedRequestHandler, RequestHandler } from "../router/router";
import * as UserRegistry from "../registry/UserRegistry";

export const getUser: AuthorizedRequestHandler = async (
  _req,
  res,
  _next,
  user
) => {
  delete user.password_hash;
  res.status(200).send(JSON.stringify(user));
};

export const createUser: RequestHandler = async (req, res, _next) => {
  const { email, password } = req.body;
  const user = await UserRegistry.createUser({ email, password });
  res
    .status(201)
    .contentType("json")
    .send(JSON.stringify(user));
};
