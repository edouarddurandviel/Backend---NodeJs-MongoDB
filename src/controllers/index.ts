import express from "express";
import UsersController from "./user";
import CompanyController from "./company";
import { Server } from "socket.io";

export default (io: Server) => {
  const app = express.Router({
    mergeParams: false,
    caseSensitive: true,
    strict: true
  });

  app.use("/company", CompanyController(io));
  app.use("/user", UsersController(io));

  return app;
};
