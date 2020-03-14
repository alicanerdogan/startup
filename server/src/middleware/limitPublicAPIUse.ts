import { RequestMiddleware, RequestHandler } from "../router/router";
import { isIPAllowedToConsumeAPI } from "../utils/rateLimiter";

export const limitPublicAPIUse: RequestMiddleware = (
  handler: RequestHandler
) => {
  const wrappedHandler: RequestHandler = async (...args) => {
    const [req, res, next] = args;

    const userAllowedToConsumeAPI = await isIPAllowedToConsumeAPI(req.ip);
    if (!userAllowedToConsumeAPI) {
      res.status(429).send("Too Many Requests");
      return;
    }

    await handler(req, res, next);
  };

  return wrappedHandler;
};
