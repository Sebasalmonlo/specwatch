import chalk from "chalk";
import Table from "cli-table3";
import { ValidationResult } from "../types";

export function printDriftReport(results: ValidationResult[]): void {
  const table = new Table({
    head: ["Endpoint", "Method", "Status", "Schema", "Violations"],
    wordWrap: true,
  });

  for (const result of results) {
    table.push([
      result.endpoint,
      result.method,
      result.statusMatch ? chalk.green("✅") : chalk.red("❌"),
      getSchemaIcon(result),
      result.violations[0] ?? "None",
    ]);
  }

  console.log(table.toString());

  const drifted = results.filter(
    (result) => !result.statusMatch || !result.schemaValid || result.violations.length > 0,
  ).length;
  const compliant = results.length - drifted;

  console.log(
    `${results.length} endpoints checked • ${drifted} drifted • ${compliant} compliant`,
  );
}

function getSchemaIcon(result: ValidationResult): string {
  if (!result.statusMatch) {
    return chalk.dim("—");
  }

  return result.schemaValid ? chalk.green("✅") : chalk.yellow("⚠️");
}
