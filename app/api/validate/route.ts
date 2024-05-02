import { TypedNextResponse, route, routeOperation } from "next-rest-framework";
import { z } from "zod";
import Ajv from "ajv";

export const { POST } = route({
  validateJson: routeOperation({
    method: "POST",
    openApiOperation: {
      description: "Validate JSON against schema",
    },
  })
    .input({
      contentType: "application/json",
      body: z.object({
        json: z.string(),
        schema: z.string(),
      }),
    })
    .outputs([
      {
        status: 201,
        contentType: "application/json",
        body: z.string(),
      },
      {
        status: 400,
        contentType: "application/json",
        body: z.string(),
      },
    ])
    .handler(async (req) => {
      try {
        const { json, schema } = await req.json();
        const schemaObject = JSON.parse(schema);

        const ajv = new Ajv();

        const validate = ajv.compile(schemaObject);
        const valid = validate(json);
        if (!valid) {
          return TypedNextResponse.json(JSON.stringify(validate.errors), {
            status: 400,
          });
        }

        return TypedNextResponse.json("Provided JSON is valid", {
          status: 201,
        });
      } catch (error) {
        return TypedNextResponse.json(`${error}`, {
          status: 400,
        });
      }
    }),
});
