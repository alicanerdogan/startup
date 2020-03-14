import { AuthorizedRequestHandler, RequestHandler } from "../router/router";

export const getResource: AuthorizedRequestHandler = async (_req, res) => {
  res.status(200).send("OK");
};

export const getPublicResource: RequestHandler = async (_req, res) => {
  res.status(200).send("Public OK");
};
