import Ajv from "ajv";
import { EndpointResult, ValidationResult } from "../types";

const ajv = new Ajv({ strict: false });

export function validateResults(results: EndpointResult[]): ValidationResult[] {
  return results.map((result) => {
    const statusMatch = result.actualStatus === result.endpoint.expectedStatus;
    const violations: string[] = [];
    let schemaValid = true;

    if (result.error) {
      violations.push(`request: ${result.error}`);
    }

    if (statusMatch && result.endpoint.responseSchema) {
      const validate = ajv.compile(result.endpoint.responseSchema);
      schemaValid = validate(result.responseBody);

      if (!schemaValid) {
        for (const error of validate.errors ?? []) {
          const fieldPath = error.instancePath || "/";
          violations.push(`${fieldPath}: ${error.message ?? "schema validation failed"}`);
        }
      }
    }

    if (!statusMatch) {
      schemaValid = false;
      violations.push(
        `status: expected ${result.endpoint.expectedStatus}, got ${result.actualStatus}`,
      );
    }

    return {
      endpoint: result.endpoint.path,
      method: result.endpoint.method,
      expectedStatus: result.endpoint.expectedStatus,
      actualStatus: result.actualStatus,
      statusMatch,
      schemaValid,
      violations,
    };
  });
}
