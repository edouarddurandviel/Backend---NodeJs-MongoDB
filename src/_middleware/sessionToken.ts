import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { NotFound } from "http-json-errors";
import * as userActions from "@services/user/actions";

export const sessionToken: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const user = await userActions.getUserToken(req.cookies.jwt);
    if (user) {
      // should check user in DB
      const decode = (await jwt.decode(user.token)) as any;
      const isValid = new Date(decode.exp).getTime() > new Date().getTime();
      if (isValid) {
        req.user = { id: user._id };
        next();
      } else {
        throw new NotFound("Session expiry");
      }
    } else {
      throw new NotFound("Unauthorized session token");
    }
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
