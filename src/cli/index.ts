import { Command } from "commander";
import { runCommand } from "./commands/run";

const program = new Command();

program
  .name("specwatch")
  .command("run")
  .requiredOption("--spec <path>", "Path or URL to OpenAPI spec")
  .requiredOption("--base-url <url>", "Base URL of the live API")
  .option("--auth <token>", "Bearer token")
  .option("--strict", "Exit 1 if any drift found")
  .action(async (opts) => {
    await runCommand(opts);
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
