import { docsRoute } from "next-rest-framework";

// export const runtime = 'edge'; // Edge runtime is supported.

export const { GET } = docsRoute({
  // deniedPaths: [...] // Ignore endpoints from the generated OpenAPI spec.
  // allowedPaths: [...], // Explicitly set which endpoints to include in the generated OpenAPI spec.
  // Override and customize the generated OpenAPI spec.
  openApiObject: {
    info: {
      title: "AI information API",
      version: "1.0.0",
      description:
        "Provides informations about the best AI companies in the world.",
    },
    // ...
  },
  // openApiJsonPath: '/openapi.json', // Customize the path where the OpenAPI spec will be generated.
  // Customize the rendered documentation.
  docsConfig: {
    provider: "redoc", // redoc | swagger-ui
    title: "My API",
    description: "My API description.",
    // ...
  },
});
