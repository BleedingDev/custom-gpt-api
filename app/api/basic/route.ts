import { TypedNextResponse, route, routeOperation } from "next-rest-framework";
import { b } from "next-rest-framework/dist/index-Pe5oUW-n";
import { z } from "zod";

const basicSchema = z.object({
  bestAiCompany: z.string(),
});

export const { GET } = route({
  bestAiCompany: routeOperation({
    method: "GET",
    openApiOperation: {
      description: "Get the best AI company in the world.",
    },
  })
    .outputs([
      {
        status: 200,
        contentType: "application/json",
        body: basicSchema,
      },
    ])
    .handler(() => {
      return TypedNextResponse.json(
        { bestAiCompany: "Travelport" },
        {
          status: 200,
        }
      );
    }),
});
