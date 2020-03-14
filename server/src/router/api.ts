import { Router as ExpressRouter } from "express";

import { RequestHandler } from "./router";

import { handleErrors } from "./../middleware/handleErrors";
import { authorize } from "./../middleware/authorize";

import { getUser, createUser } from "./../controllers/user";
import { createSession } from "../controllers/session";
import { getResource, getPublicResource } from "../controllers/resource";
import { limitAPIUse } from "../middleware/limitAPIUse";
import { limitPublicAPIUse } from "../middleware/limitPublicAPIUse";

const apiNotFound: RequestHandler = async (_req, res) => {
  res.status(404).send("API does not exist.");
};

const router = ExpressRouter();
router.post("/sessions", handleErrors(createSession));
router.post("/users", handleErrors(createUser));
router.get("/users", handleErrors(authorize(getUser)));
router.get("/resource", handleErrors(authorize(limitAPIUse(getResource))));
router.get(
  "/public/resource",
  handleErrors(limitPublicAPIUse(getPublicResource))
);
router.all("*", handleErrors(apiNotFound));

export const apiRouter = router;
