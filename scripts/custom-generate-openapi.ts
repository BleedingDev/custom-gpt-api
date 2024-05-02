import { generate } from "next-rest-framework/dist/cli/generate";

generate({ configPath: "/api" })
  .then(() => {
    console.log("Completed building OpenAPI schema from custom script.");
  })
  .catch(console.error);
