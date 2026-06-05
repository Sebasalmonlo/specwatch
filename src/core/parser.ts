import SwaggerParser from "@apidevtools/swagger-parser";
import { ParsedEndpoint } from "../types";

type OpenApiResponse = {
  content?: {
    "application/json"?: {
      schema?: object;
    };
  };
};

type OpenApiOperation = {
  responses?: Record<string, OpenApiResponse>;
};

type OpenApiSpec = {
  paths?: Record<string, Record<string, OpenApiOperation>>;
};

export async function parseSpec(specPath: string): Promise<ParsedEndpoint[]> {
  const spec = (await SwaggerParser.dereference(specPath)) as OpenApiSpec;
  const endpoints: ParsedEndpoint[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    const operation = pathItem.get;

    if (!operation) {
      continue;
    }

    const responses = operation.responses ?? {};
    const expectedStatus = findExpectedStatus(responses);
    const responseSchema =
      responses[String(expectedStatus)]?.content?.["application/json"]?.schema ?? null;

    endpoints.push({
      method: "GET",
      path,
      expectedStatus,
      responseSchema,
    });
  }

  return endpoints;
}

function findExpectedStatus(responses: Record<string, OpenApiResponse>): number {
  const firstSuccessStatus = Object.keys(responses)
    .map((statusCode) => Number(statusCode))
    .filter((statusCode) => statusCode >= 200 && statusCode < 300)
    .sort((a, b) => a - b)[0];

  return firstSuccessStatus ?? 200;
}
