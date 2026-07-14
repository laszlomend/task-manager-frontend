# Task Manager Frontend

Angular frontend for [task-manager-api](https://github.com/laszlomend/task-manager-api)
— a JWT-authenticated task manager with a Google Calendar connect flow. Built as the UI
half of a portfolio project; see the backend repo's README for the fuller pitch and the
live Swagger API docs.

**[Try it live](https://task-manager-frontend-beryl-ten.vercel.app)** — register an
account and use it directly. The backend runs on Render's free tier, so the first
request after a period of inactivity can take 30-50s to wake up (cold start).

## What it does

- **Auth** — register/login, JWT access + refresh tokens with an automatic
  refresh-and-retry on `401` (see `core/interceptors/auth.interceptor.ts`), route
  guarding for authenticated-only pages.
- **Task management** — create, edit, delete tasks; filter by status; change a task's
  status inline from the list (no need to open the full edit form for a one-field
  change).
- **Google Calendar connect** — a Settings page with a "Connect Google Calendar" button
  that starts the backend's OAuth2 flow and reports back connection status.

## Tech stack

Angular 21, standalone components (no `NgModule`s), signals for reactive state, SCSS,
Angular Router, Vitest as the test runner.

## Getting started

The backend ([task-manager-api](https://github.com/laszlomend/task-manager-api)) needs
to be running first — this app expects it at `http://localhost:3000` in development
(see `src/environments/environment.development.ts`).

```bash
npm install
npm start   # ng serve — http://localhost:4200
```

```bash
npm test    # Vitest, via the Angular CLI's builder
npm run build
```

## Project structure

```
src/app/
  core/         # models, services (auth/task/google), interceptor, route guard
  features/     # auth (login/register), tasks (list/form), settings (Google connect)
  layout/       # header/nav
```

## License

MIT
