import {
  AuthorizationMidddleware,
  RequestHandler,
  AuthorizedRequestHandler,
  ExpressRequest
} from "../router/router";
import { verifyToken, JWTPayload } from "../utils/token";
import { getUser } from "../registry/UserRegistry";

async function getAuthorizedPayload(req: ExpressRequest) {
  const token = req.headers.authorization;
  return token && (await verifyToken(token));
}
async function getUserFromRequest(jwtPayload: JWTPayload) {
  return await getUser(jwtPayload.id);
}

export const authorize: AuthorizationMidddleware = (
  handler: AuthorizedRequestHandler
) => {
  const wrappedHandler: RequestHandler = async (...args) => {
    const [req, res, next] = args;

    const authPayload = await getAuthorizedPayload(req);
    if (!authPayload) {
      res.sendStatus(401);
      return;
    }

    const user = await getUserFromRequest(authPayload);
    if (!user) {
      res.sendStatus(401);
      return;
    }

    await handler(req, res, next, user);
  };

  return wrappedHandler;
};
