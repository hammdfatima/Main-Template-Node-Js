import type { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import logger from "~/lib/logger";
import { version } from "../../package.json";
//import exp from "constants";
//import swaggerDocs from "../lib/swagger-docs";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API Docs",
      version,
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/v1/routes/**/*.ts", "./src/lib/schemas/*.ts"],
};

const swaggerSpecs = swaggerJsdoc(options);

function swaggerDocs(app: Express) {
  //swagger page
  app.use("/api/v1", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

  //Docs in json format
  app.get("/api/v1/docs.json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpecs);
    logger.info(
      `API Documentation available at http://localhost:${process.env.PORT}/api/v1`,
    );
  });
}

export default swaggerDocs;
