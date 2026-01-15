import express, { Request, Response } from "express";
import CompanyController from "@services/company";
import * as companySchemas from "../_joiSchemas/company";
import * as generalSchemas from "../_joiSchemas/general";
import { handleErrors } from "@libs/server";
import { sessionToken } from "@middleware/sessionToken";
import { remotePostAccess } from "@middleware/remoteAccess";
import { ExtendedRequest } from "../_interfaces/requests";
import { Server } from "socket.io";

export default (io: Server) => {
  const router = express.Router();

  const companyServices = new CompanyController(io);

  // Write
  router.post("/create", async (req: Request, res: Response) => {
    try {
      const data = await companySchemas.fullCompany.validateAsync(req.body);

      const result = await companyServices.createOneCompany(data);

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.patch("/replace/:companyId", async (req: Request, res: Response) => {
    try {
      const data = await companySchemas.fullCompany.validateAsync(req.body);
      const companyId = await generalSchemas.textSchema.validateAsync(req.params.companyId);

      await companyServices.replaceOneCompany(companyId, data);

      res.status(200).json({ err: false });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.patch("/update/many", sessionToken, async (req: Request, res: Response) => {
    try {
      const data = await companySchemas.fullCompany.validateAsync(req.body);
      const companyId = await generalSchemas.textSchema.validateAsync(req.params.companyId);

      const result = await companyServices.updateManyCompanies(companyId, data);

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.patch("/update/:companyId", sessionToken, async (req: Request, res: Response) => {
    try {
      const data = await companySchemas.company.validateAsync(req.body);
      const companyId = await generalSchemas.textSchema.validateAsync(req.params.companyId);

      const result = await companyServices.updateOneCompany(companyId, data);

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.delete("/delete/:companyId", async (req: Request, res: Response) => {
    try {
      const companyId = await generalSchemas.textSchema.validateAsync(req.params.companyId);

      const result = await companyServices.deleteOneCompany(companyId);

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.get("/all", async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await companyServices.getCompanies();

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.get("/one/:companyId", async (req: ExtendedRequest, res: Response) => {
    try {
      const companyId = await generalSchemas.textSchema.validateAsync(req.params.companyId);
      const result = await companyServices.getOneCompany(companyId);

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.post("/remote/post", remotePostAccess, async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await companyServices.getCompanyLogs();

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  return router;
};
