import express, { Request, Response } from "express";
import { ExtendedRequest } from "../_interfaces/requests";
import * as userSchemas from "../_joiSchemas/users";
import { handleErrors } from "@libs/server";
import { sessionToken } from "@middleware/sessionToken";
import UserController from "@services/user";
import { Server } from "socket.io";
import { Storage } from "@google-cloud/storage";
import config from "../_config/google";

export default (io: Server) => {
  const router = express.Router({
    mergeParams: false,
    caseSensitive: true,
    strict: true
  });

  const userServices = new UserController(io);

  /* users pages. */
  router.post("/create", async (req: ExtendedRequest, res: Response) => {
    try {
      const data = await userSchemas.user.validateAsync(req.body);
      const result = await userServices.createOneUser(data);

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.post("/login", async (req: Request, res: Response) => {
    try {
      const data = await userSchemas.userAuth.validateAsync(req.body);
      const result = await userServices.login(data);

      res.cookie("jwt", result, {
        expires: new Date(Date.now() + 1 * 3600000),
        secure: true,
        httpOnly: true,
        domain: "example.com",
        path: "/"
      });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.post("/logout/:userId", async (req: Request, res: Response) => {
    try {
      const data = await userSchemas.uidSchema.validateAsync(req.params.userId);
      const result = await userServices.logout(data);

      res.clearCookie("jwt");
      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.get("/all", sessionToken, async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await userServices.getAllUsers();

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.get("/:userId", sessionToken, async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = await userSchemas.userId.validateAsync(req.params.userId);
      const result = await userServices.getUserData(userId);

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.get("/gcloud/picture", async (req: ExtendedRequest, res: Response) => {
    try {
      const options = {
        projectId: "progresswebapp-cf1d7",
        keyFilename: config.buckets.google || "default"
      };
      const storage = new Storage(options);
      const [buckets] = await storage.getBuckets();
      res.status(200).json({ err: false, data: buckets });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  return router;
};
