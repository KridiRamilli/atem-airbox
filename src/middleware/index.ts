import { Request, Response, NextFunction } from "express";
import z, { ZodSchema } from "zod";
import logger from "../utils/logger";

export const formData = z.object({
  atemIp: z.string().ip({
    version: "v4",
    message: "IP should be in the format xxx.xxx.xxx.xxx",
  }),
  primaryIp: z.string().ip({
    version: "v4",
    message: "IP should be in the format xxx.xxx.xxx.xxx",
  }),
  secondaryIp: z.string().ip({
    version: "v4",
    message: "IP should be in the format xxx.xxx.xxx.xxx",
  }),
  primaryInputNumber: z.number({
    invalid_type_error: "Primary Input should be a number",
  }),
  secondaryInputNumber: z.number({
    invalid_type_error: "Secondary Input should be a number",
  }),
});

export const verifyInput =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      logger.error(error);
      res.status(401).json({ error });
    }
  };
