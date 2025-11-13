import fs from "fs";
import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Serve a pre-generated swagger.json when available (recommended for production
// deployments such as Vercel). If not present, fall back to runtime generation
// (useful during local development).
export function setupSwagger(app: Express) {
  const builtPath = path.resolve(process.cwd(), "dist", "swagger.json");
  const publicPath = path.resolve(process.cwd(), "public", "swagger.json");

  // prefer a pre-built swagger.json (produced by the build step)
  const prebuilt = fs.existsSync(builtPath)
    ? builtPath
    : fs.existsSync(publicPath)
    ? publicPath
    : null;

  if (prebuilt) {
    try {
      const swaggerSpec = JSON.parse(fs.readFileSync(prebuilt, "utf-8"));
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
      return;
    } catch (err) {
      // continue and try runtime generation if the JSON is malformed
      // (we intentionally fall through)
      // eslint-disable-next-line no-console
      console.warn(
        "Failed to load prebuilt swagger.json, falling back to runtime generation:",
        err
      );
    }
  }

  // runtime generation fallback. Use .ts sources in dev and compiled .js in prod.
  const apis =
    process.env.NODE_ENV === "production"
      ? ["./dist/routes/*.js"]
      : ["./src/routes/*.ts"];

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
    apis,
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
