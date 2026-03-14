import type { Express, Request, Response } from "express";

import { HTTP_STATUS } from "@/constants/http-status.ts";
import { apiReference } from "@scalar/express-api-reference";
import { getRedocHtml } from "@/docs/redoc.ts";
import { swaggerSpec } from "@/docs/swagger.ts";
import swaggerUi from "swagger-ui-express";

const OPENAPI_PATH = "/openapi.json";

export const registerDocs = (app: Express): void => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(
    "/scalar",
    apiReference({
      theme: "default",
      url: OPENAPI_PATH,
    }),
  );

  app.get("/redoc", (_req: Request, res: Response) => {
    res.type("html").send(getRedocHtml(OPENAPI_PATH));
  });

  app.get(OPENAPI_PATH, (_req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json(swaggerSpec);
  });
};
