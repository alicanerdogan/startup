import { RequestMiddleware, RequestHandler } from "../router/router";

export const handleErrors: RequestMiddleware = (handler: RequestHandler) => {
  const wrappedHandler: RequestHandler = async (...args) => {
    try {
      await handler(...args);
    } catch (error) {
      const [, , next] = args;
      next(error);
    }
  };

  return wrappedHandler;
};
