import {
  AuthorizedRequestMiddleware,
  AuthorizedRequestHandler
} from "../router/router";
import { isUserAllowedToConsumeAPI } from "../utils/rateLimiter";

export const limitAPIUse: AuthorizedRequestMiddleware = (
  handler: AuthorizedRequestHandler
) => {
  const wrappedHandler: AuthorizedRequestHandler = async (...args) => {
    const [req, res, next, user] = args;

    const userAllowedToConsumeAPI = await isUserAllowedToConsumeAPI(user.id);
    if (!userAllowedToConsumeAPI) {
      res.status(429).send("Too Many Requests");
      return;
    }

    await handler(req, res, next, user);
  };

  return wrappedHandler;
};
