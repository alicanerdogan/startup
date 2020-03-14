import {
  RequestHandler as ExpressRequestHandler,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction
} from "express";
export {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction
} from "express";

import { User } from "./../model/User";

export type RequestHandler = (
  ...args: Parameters<ExpressRequestHandler>
) => Promise<void>;

export type AuthorizedRequestHandler = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
  user: User
) => Promise<void>;

export type RequestMiddleware = (handler: RequestHandler) => RequestHandler;

export type AuthorizationMidddleware = (
  handler: AuthorizedRequestHandler
) => RequestHandler;

export type AuthorizedRequestMiddleware = (
  handler: AuthorizedRequestHandler | RequestHandler
) => AuthorizedRequestHandler;
