import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export function setupSwagger(app: Express) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "My API",
        version: "1.0.0",
        description: "Backend API Documentation",
      },
      servers: [{ url: process.env.API_BASE_URL || "" }],
    },
    apis: ["./src/routes/*.ts", "./dist/routes/*.js"], // scan your route files for @swagger annotations
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
