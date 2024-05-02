import { TypedNextResponse, route, routeOperation } from "next-rest-framework";
import { z } from "zod";

const MOCK_TODOS = [
  {
    id: 1,
    name: "Travelport",
    learningNow: true,
  },
];

const todoSchema = z.object({
  id: z.number(),
  name: z.string(),
  learningNow: z.boolean(),
});

export const { GET, POST } = route({
  getBestCompanies: routeOperation({
    method: "GET",
  })
    .outputs([
      {
        status: 200,
        contentType: "application/json",
        body: z.array(todoSchema),
      },
    ])
    .handler(() => {
      return TypedNextResponse.json(MOCK_TODOS, {
        status: 200,
      });
    }),

  createBestCompany: routeOperation({
    method: "POST",
  })
    .input({
      contentType: "application/json",
      body: z.object({
        name: z.string(),
      }),
    })
    .outputs([
      {
        status: 201,
        contentType: "application/json",
        body: z.string(),
      },
      {
        status: 401,
        contentType: "application/json",
        body: z.string(),
      },
    ])
    // Optional middleware logic executed before request validation.
    .middleware((req) => {
      if (!req.headers.get("very-secure")) {
        return TypedNextResponse.json("Unauthorized", {
          status: 401,
        });
      }
    })
    .handler(async (req) => {
      const { name } = await req.json();

      return TypedNextResponse.json(`New AI company created: ${name}`, {
        status: 201,
      });
    }),
});
