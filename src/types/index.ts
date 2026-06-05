export interface ParsedEndpoint {
  method: string;
  path: string;
  expectedStatus: number;
  responseSchema: object | null;
}

export interface EndpointResult {
  endpoint: ParsedEndpoint;
  actualStatus: number;
  responseBody: any;
  error?: string;
}

export interface ValidationResult {
  endpoint: string;
  method: string;
  expectedStatus: number;
  actualStatus: number;
  statusMatch: boolean;
  schemaValid: boolean;
  violations: string[];
}
