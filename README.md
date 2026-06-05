# Specwatch

Specwatch is a local-first CLI tool that checks whether a live API still matches its OpenAPI spec.

It loads an OpenAPI document, sends real HTTP requests to the API, validates the responses with AJV, and prints a drift report showing which endpoints no longer match the contract.

This is the second QA portfolio project after `playwright-sentinel`.

## The Simple Idea

Think of an OpenAPI spec like a menu.

The menu says:

> This API endpoint returns a user with an id, name, and email.

Specwatch checks the real API and asks:

> Did the API actually return what the menu promised?

If the API returns the wrong status code, removes a field, changes a field type, or sends a different response shape, Specwatch reports the drift.

## What Problem It Solves

Production APIs can silently drift away from their documentation.

That creates real risk:

- Frontend screens break because a field changed.
- Mobile apps fail after a backend deployment.
- Customer integrations stop working.
- API documentation becomes untrusted.
- QA and engineering teams find issues only after users report them.

Specwatch gives QA teams and engineering teams a fast way to verify that the live API still matches the documented contract.

## Use Case

If you have a production software product, Specwatch acts as a lightweight API contract check.

It helps answer one important question:

> Does our live API still keep the promises written in our OpenAPI spec?

For a production product, this helps with:

- Safer deployments
- Fewer API regressions
- More reliable customer integrations
- Faster debugging when an endpoint changes
- Better trust between backend, frontend, mobile, and QA teams
- A simple quality gate before or after release

Specwatch is intentionally simple: no servers, no Docker, no cloud account, and no database.

## What It Checks

Specwatch currently checks GET endpoints from an OpenAPI spec.

For each endpoint, it reports:

- Whether the actual HTTP status matches the expected status
- Whether the JSON response matches the documented schema
- Field-level schema validation errors
- A summary of compliant and drifted endpoints

Example violation:

```text
/email: must be string
```

Example status drift:

```text
status: expected 200, got 500
```

## Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Sebasalmonlo/specwatch.git
cd specwatch
npm install
```

## Usage

Run Specwatch against an OpenAPI spec and a live API base URL:

```bash
npx tsx src/cli/index.ts run \
  --spec https://petstore3.swagger.io/api/v3/openapi.json \
  --base-url https://petstore3.swagger.io/api/v3
```

Or run the built-in demo command:

```bash
npm run demo
```

Run in strict mode to exit with code `1` if any drift is found:

```bash
npx tsx src/cli/index.ts run \
  --spec ./petstore.yaml \
  --base-url https://petstore3.swagger.io/api/v3 \
  --strict
```

Use a bearer token:

```bash
npx tsx src/cli/index.ts run \
  --spec ./openapi.yaml \
  --base-url https://api.example.com \
  --auth YOUR_TOKEN
```

## Example Output

```text
Endpoint                  Method   Status   Schema   Violations
/pet/findByStatus         GET      ❌       —        status: expected 200, got 400
/user/login               GET      ✅       ✅       None

8 endpoints checked • 6 drifted • 2 compliant
```

## Project Structure

```text
specwatch/
├── src/
│   ├── cli/
│   │   ├── commands/
│   │   │   └── run.ts
│   │   └── index.ts
│   ├── core/
│   │   ├── parser.ts
│   │   ├── requester.ts
│   │   └── validator.ts
│   ├── output/
│   │   └── table.ts
│   └── types/
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Project Commands

```bash
npm run demo
npm run typecheck
npm test
```

## Why This Belongs In A QA Portfolio

Specwatch shows practical API testing skills beyond clicking through a UI.

It demonstrates:

- API contract testing
- OpenAPI parsing
- Live HTTP validation
- JSON schema validation
- Drift reporting
- CLI tool design
- TypeScript implementation
- QA thinking for production systems

This kind of tool is useful for QA engineers who want to catch API regressions before customers, frontend teams, mobile teams, or external partners are affected.

## Current Scope

Specwatch is intentionally MVP-sized.

Included:

- OpenAPI 3.x parsing
- GET endpoint discovery
- Path parameter substitution using `1`
- Live HTTP requests with Axios
- AJV response validation
- CLI table report
- Optional strict mode
- Optional bearer token

Not included yet:

- POST, PUT, PATCH, or DELETE requests
- Request body generation
- Advanced auth flows
- Mock servers
- Databases
- Cloud services
- GraphQL

## Tech Stack

- TypeScript
- tsx
- Commander
- Axios
- AJV
- @apidevtools/swagger-parser
- Chalk
- cli-table3
