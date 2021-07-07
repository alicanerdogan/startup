import validator from "validator";
import { AuthorizedRequestHandler, RequestHandler } from "../router/router";
import * as UserRegistry from "../registry/UserRegistry";
import { createToken } from "../utils/token";

export const getUser: AuthorizedRequestHandler = async (
  _req,
  res,
  _next,
  user
) => {
  const payload = JSON.stringify({ email: user.email });
  res.status(200).contentType("json").send(payload);
};

function validatePassword(password: string) {
  return validator.isLength(password, { min: 8 });
}

export const createUser: RequestHandler = async (req, res, _next) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      res
        .status(400)
        .contentType("json")
        .send(
          JSON.stringify({
            error: { code: 1001, description: "Invalid email" },
          })
        );
      return;
    }
    if (!validatePassword(password)) {
      res
        .status(400)
        .contentType("json")
        .send(
          JSON.stringify({
            error: {
              code: 1001,
              description:
                "Invalid password: It should be at least 8 characters long",
            },
          })
        );
      return;
    }
    const user = await UserRegistry.createUser({ email, password });

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

const _1_DAY = 60 * 60 * 24 * 1000;

export const setNewPassword: RequestHandler = async (req, res, _next) => {
  const { reset_token, password } = req.body;
  try {
    if (!reset_token) {
      throw new Error("Invalid reset token: " + reset_token);
    }

    const user = await UserRegistry.getUserWithResetToken(reset_token);
    if (!user || !user.resetTokenExpirationDate) {
      throw new Error("Reset token is not found: " + reset_token);
    }

    if (!validatePassword(password)) {
      res
        .status(400)
        .contentType("json")
        .send(
          JSON.stringify({
            error: {
              code: 1001,
              description:
                "Invalid password: It should be at least 8 characters long",
            },
          })
        );
      return;
    }

    const expiredTime =
      Date.now() - new Date(user.resetTokenExpirationDate).getTime();

    if (expiredTime > _1_DAY) {
      throw new Error("Expired reset token: " + reset_token);
    }

    await UserRegistry.setPassword(user.id, password);

    try {
      await UserRegistry.setPasswordToken(user.id, null, null);
    } catch (error) {
      console.error(error);
    }

    const token = await createToken({ email: user.email, id: user.id });
    res
      .status(201)
      .contentType("json")
      .send(JSON.stringify({ jwt: token }));
  } catch (error) {
    res.sendStatus(400);
  }
};
