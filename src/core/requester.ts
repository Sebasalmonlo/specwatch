import axios from "axios";
import { EndpointResult, ParsedEndpoint } from "../types";

export async function fireRequests(
  endpoints: ParsedEndpoint[],
  baseUrl: string,
  token?: string,
): Promise<EndpointResult[]> {
  const results: EndpointResult[] = [];
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  for (const endpoint of endpoints) {
    if (endpoint.method.toUpperCase() !== "GET") {
      continue;
    }

    const requestPath = endpoint.path.replace(/\{[^}]+\}/g, "1");
    const url = `${normalizedBaseUrl}${requestPath}`;

    try {
      const response = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        validateStatus: () => true,
      });

      results.push({
        endpoint,
        actualStatus: response.status,
        responseBody: response.data,
      });
    } catch (error) {
      results.push({
        endpoint,
        actualStatus: 0,
        responseBody: null,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}
