# Typescript Clean Architecture (NestJS + DDD + Functional Programming Style)

A TypeScript [NestJS](https://nestjs.com/) API that models todos and users with **Domain-Driven Design** boundaries: domain rules stay in `domain/`, use cases in `application/`, HTTP and DTOs in `presentation/`, and persistence in `infrastructure/`. **CQRS** (`@nestjs/cqrs`) routes each operation through explicit commands and queries, and **functional-style** `Result` / `Option` types plus `match` keep success and failure explicit until the HTTP layer maps them to status codes.

## Architecture

| Layer              | Path alias          | Role                                                                                                                             |
| ------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**         | `@domain/*`         | Aggregates, value objects, domain errors, port interfaces (e.g. `TodoRepository`, `UserRepository`)                              |
| **Application**    | `@application/*`    | Command/query handlers; orchestration; returns `Result` to callers                                                               |
| **Infrastructure** | `@infrastructure/*` | Adapters implementing domain ports (currently **in-memory** stores)                                                              |
| **Presentation**   | `@presentation/*`   | Controllers, request/response DTOs, HTTP ↔ domain mapping                                                                        |
| **Core**           | `@core/*`           | Shared DDD primitives (`AggregateRoot`, `Repository`, value object base), `Result` / `Option` / `match`, application error types |
| **Common**         | `@common/*`         | NestJS integration: global `HttpException` filter, JWT `AuthGuard`, `CurrentUser`, shared types (`UserContext`, `JwtClaims`)     |

Path aliases are defined in `tsconfig.json` (`@application`, `@common`, `@core`, `@domain`, `@infrastructure`, `@presentation`).

**Wiring:** Feature modules (`todo.module.ts`, `user.module.ts`) bind each abstract repository port to a concrete adapter and register CQRS command/query providers. That keeps the domain and application layers free of NestJS database or framework details except where handlers are registered.

## Functional success and error handling

- **`Result<T, E>`** — `Ok(value)` or `Err(error)` with `isOk()` / `isErr()` for narrowing.
- **`Option<T>`** — `Some(value)` or `None` for optional values (e.g. todo description, completion time).
- **`match.fromResult` / `fromOption` / `fromBoolean`** — exhaustive-style branching without deep nesting.

Handlers return `Result` (or types built from it). Controllers use `match.fromResult` and map `ValidationError`, `NotFoundError`, `DomainError`, and generic `Error` to `HttpException` and appropriate HTTP status codes. The global `HttpFilter` formats `HttpException` responses with a `traceId` (from `x-trace-id` or a generated UUID).

## Tech stack

- **NestJS 11**, **@nestjs/cqrs**, **@nestjs/jwt**, **@nestjs/config**
- **nestjs-cls** — request-scoped user context after JWT validation
- **bcrypt** — password hashing (infrastructure/value object flow)
- **TypeScript** (strict), **Jest** for unit tests, e2e config under `test/`

## Configuration

`ConfigModule` loads environment files by `NODE_ENV`:

- `development` → `.env.development.local`
- `production` → `.env.production.local`

Set at least:

| Variable              | Purpose                              |
| --------------------- | ------------------------------------ |
| `JWT_SECRET`          | Signing key for access tokens        |
| `JWT_EXPIRATION_TIME` | JWT `expiresIn` (e.g. `1d`, `3600s`) |

The app listens on **`PORT`** (default **8080**).

## Getting started

```bash
pnpm install
pnpm run dev
```

Other scripts: `build`, `start`, `prod`, `lint`, `format`, `test`, `test:watch`, `test:cov`, `test:e2e`, `debug`.

## HTTP API (summary)

- **`POST /auth/register`** — Public. Body: `name`, `email`, `password`. Returns `{ accessToken }` on success.
- **`GET /auth/info`** — `Authorization: Bearer <token>`. Returns current user payload.
- **`GET /todos`** — Authenticated. Lists todos for the user in the JWT.
- **`POST /todos`** — Authenticated. Create todo (`title`, optional `description`).
- **`PATCH /todos/:todoId`** — Mark todo complete (by id in path).

Protected routes use the `AuthGuard` (Bearer JWT); the guard stores `UserContext` in CLS for `@CurrentUser()`.

## Testing

- Unit: `*.spec.ts` under `src/` (`pnpm test`)
- E2E: `test/app.e2e-spec.ts` with `pnpm run test:e2e`

## License

Private / `UNLICENSED` (see `package.json`).

## Author

Mudzia Hutama — [GitHub @devSTROYA](https://github.com/devSTROYA) · [Repository](https://github.com/devSTROYA/nestjs-todo-ddd)
