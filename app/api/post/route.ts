import { TypedNextResponse, route, routeOperation } from "next-rest-framework";
import { z } from "zod";
import { kv } from "@vercel/kv";

const MOCK_COMPANIES = [
  {
    id: 1,
    name: "Travelport",
    learningNow: true,
  },
  {
    id: 2,
    name: "OpenAI",
    learningNow: false,
  },
  {
    id: 3,
    name: "Antrophic",
    learningNow: false,
  },
  {
    id: 4,
    name: "Meta",
    learningNow: false,
  },
];

const companySchema = z.object({
  id: z.number(),
  name: z.string(),
  learningNow: z.boolean().optional(),
});

export const { GET, POST } = route({
  getBestCompanies: routeOperation({
    method: "GET",
    openApiOperation: {
      description: "Get list of best AI companies in the world.",
    },
  })
    .outputs([
      {
        status: 200,
        contentType: "application/json",
        body: z.array(companySchema),
      },
    ])
    .handler(async () => {
      const companies = await kv.get("bestCompanies");
      if (!companies) {
        await kv.set("bestCompanies", MOCK_COMPANIES);
        return TypedNextResponse.json(MOCK_COMPANIES, {
          status: 200,
        });
      }
      const parsedCompanies = z.array(companySchema).parse(companies);
      return TypedNextResponse.json(parsedCompanies, {
        status: 200,
      });
    }),

  createBestCompany: routeOperation({
    method: "POST",
    openApiOperation: {
      description:
        "Add new company to the list of best AI companies in the world.",
    },
  })
    .input({
      contentType: "application/json",
      body: z.object({
        id: z.number().optional(),
        name: z.string(),
        learningNow: z.boolean().optional(),
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
        return TypedNextResponse.json(
          "Unauthorized, you are missing 'very-secure' header in your request",
          {
            status: 401,
          }
        );
      }
    })
    .handler(async (req) => {
      const { id, name, learningNow } = await req.json();
      const company = {
        id: id ?? Math.floor(Math.random() * 1000),
        name,
        learningNow: learningNow ?? false,
      };
      const parsedCompany = companySchema.parse(company);

      const companies = await kv.get("bestCompanies");
      const parsedCompanies = z.array(companySchema).parse(companies);

      await kv.set("bestCompanies", [...parsedCompanies, parsedCompany]);

      return TypedNextResponse.json(`New AI company created: ${name}`, {
        status: 201,
      });
    }),
});
