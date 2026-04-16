# Backend Feature Context (base_server)

This file documents the backend in a feature-wise format for fast onboarding and implementation planning.

## Core Platform

### App Bootstrap and Server Startup
- Entry: `src/bin/server.ts`
- Boot sequence:
  1. `bootstrap()` connects MongoDB and initializes rate limiter.
  2. Express app starts on configured port.
- App wiring: `src/app.ts`
  - Security middleware: `helmet`
  - CORS with explicit allowlist and credentials
  - `cookie-parser`
  - JSON parsing + static files
  - API router mount + notFound + error handler

### Configuration and Environment
- File: `src/config/config.ts`
- Uses `dotenv-flow`.
- Contains:
  - `ENV`, `PORT`, `SERVER_URL`
  - `DATABASE_URL`
  - `CORS_ORIGIN`
  - token secrets and expiry for access/refresh JWTs

### Logging and Error System
- Logger: `src/handlers/logger.ts` (console/file/db transports)
- Response wrapper: `src/handlers/httpResponse.ts`
- Error object factory: `src/handlers/errorHandler/errorObject.ts`
- Error pass-through helper: `src/handlers/errorHandler/httpError.ts`
- Global error middleware: `src/middlewares/errorHandler.ts`

## Feature: General APIs

### Health and Self Endpoints
- Router: `src/APIs/router.ts`
- Endpoints (mounted under `API_ROOT`):
  - `GET /self`
  - `GET /health`
- Controller: `src/APIs/controller.ts`
- Health utility: `src/utils/health.ts`

## Feature: Authentication (Legacy Module)

### Routing
- File: `src/APIs/user/authentication/index.ts`
- Endpoints:
  - `POST /register`
  - `PATCH /registeration/confirm/:token`
  - `POST /login`
  - `PUT /logout`

### Flow
- Controller: `authentication.controller.ts`
- Service: `authentication.service.ts`
- Includes:
  - phone parsing and timezone deduction
  - account confirmation token + OTP generation
  - registration email and confirmation email
  - login with JWT generation and refresh token storage
  - cookie set/clear on login/logout

### Validation
- Joi schemas: `validation/validation.schema.ts`
- service-level rule: `validation/validations.ts`

## Feature: Authentication (New Module)

### Routing
- File: `src/APIs/user/auth/auth.routes.ts`
- Endpoints:
  - `POST /register`
  - `POST /login`
  - `GET /me`

### Flow
- Controller: `auth.controller.ts`
- Service: `auth.service.ts`
- Behavior:
  - direct register/login with JWT tokens in response body
  - no account confirmation step
  - no cookie write in this service path

## Feature: User Management

### Routing
- File: `src/APIs/user/management/index.ts`
- Endpoint:
  - `GET /user/me`

### Flow
- Controller: `management.controller.ts`
- Service file exists but empty: `management.service.ts`

## Feature: Authorization and Security

### Authentication Middleware
- File: `src/middlewares/authenticate.ts`
- Reads `accessToken` from cookies and resolves user.

### Role Authorization
- File: `src/middlewares/authorize.ts`
- `authorize(...allowedRoles)` checks authenticated user role.

### Rate Limiting
- Middleware: `src/middlewares/rateLimiter.ts`
- Store: Mongo-backed limiter in `src/config/rate-limiter.ts`
- Initialized during bootstrap.

## Feature: Data Layer

### User Entity
- Model: `src/APIs/user/_shared/models/user.model.ts`
- Repository: `src/APIs/user/_shared/repo/user.repository.ts`
- Shared type: `src/APIs/user/_shared/types/users.interface.ts`

### Token Entity
- Model: `src/APIs/user/_shared/models/token.model.ts`
- Repository: `src/APIs/user/_shared/repo/token.repository.ts`

### Database
- Connector: `src/services/database.ts`
- Uses mongoose connection from `config.DATABASE_URL`.

## Feature: Utility Layer

- JWT helper: `src/utils/jwt.ts`
- Password hashing: `src/utils/hashing.ts`
- Input validation helper: `src/utils/joi-validate.ts`
- Phone parsing: `src/utils/parsers.ts`
- Date/time helpers: `src/utils/date-and-time.ts`
- Random code/token helpers: `src/utils/code.ts`
- Email service: `src/services/email.ts`

## Test Coverage

- Existing unit tests focused on legacy auth service:
  - `src/__tests__/unit-tests/authentication.spec.ts`

## Current Integration Notes

- Two auth modules coexist and overlap endpoint names (`/register`, `/login`).
- Legacy flow is cookie-oriented; new flow is token-in-body oriented.
- API mount file (`src/APIs/index.ts`) currently mounts both stacks.

Recommended sequence before adding major features:
1. Select one canonical auth flow and deprecate the other.
2. Align token transport strategy with frontend expectations.
3. Expand management module into service-backed endpoints.

