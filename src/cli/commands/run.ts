import { parseSpec } from "../../core/parser";
import { fireRequests } from "../../core/requester";
import { validateResults } from "../../core/validator";
import { printDriftReport } from "../../output/table";

export interface RunOptions {
  spec: string;
  baseUrl: string;
  auth?: string;
  strict?: boolean;
}

export async function runCommand(options: RunOptions): Promise<void> {
  const endpoints = await parseSpec(options.spec);
  const requestResults = await fireRequests(endpoints, options.baseUrl, options.auth);
  const validationResults = validateResults(requestResults);

  printDriftReport(validationResults);

  const hasDrift = validationResults.some(
    (result) => !result.statusMatch || !result.schemaValid || result.violations.length > 0,
  );

  if (options.strict && hasDrift) {
    process.exit(1);
  }
}
