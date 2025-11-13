const fs = require("fs");
const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");
// load .env when present so API_BASE_URL set there is available during build
try {
  require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });
} catch (e) {
  // ignore if dotenv is not available or .env missing
}

// This script should be run after `tsc` (i.e. in a postbuild step). It scans the
// compiled JS files in `dist/routes` (the place your runtime expects them) and
// writes dist/swagger.json so the server can serve a static swagger JSON at runtime.

const outPath = path.resolve(process.cwd(), "dist", "swagger.json");
const routesGlob = "./dist/routes/*.js";

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
  apis: [routesGlob],
};

try {
  const swaggerSpec = swaggerJSDoc(options);

  // Ensure the generated spec contains the API base URL when provided.
  // Prefer API_BASE_URL, then fall back to VERCEL_URL (without scheme).
  const apiBaseRaw = process.env.API_BASE_URL || process.env.VERCEL_URL || "";
  let apiBase = (apiBaseRaw || "").toString().trim();
  if (apiBase && !/^https?:\/\//i.test(apiBase)) {
    apiBase = `https://${apiBase}`;
  }

  if (apiBase) {
    swaggerSpec.servers = [{ url: apiBase }];
    console.log("Setting swagger servers to", apiBase);
  } else if (swaggerSpec.servers && swaggerSpec.servers.length) {
    // keep whatever swagger-jsdoc produced
  } else {
    // remove empty servers array to avoid an empty-string url
    delete swaggerSpec.servers;
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2), "utf-8");
  console.log("Generated swagger.json at", outPath);
  process.exit(0);
} catch (err) {
  console.error("Failed to generate swagger.json:", err);
  process.exit(1);
}
