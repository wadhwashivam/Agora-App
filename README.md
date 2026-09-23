# Agora

A text-only social platform for long-form opinions and discourse — no images, no video, just argument. Built as the capstone project ("Odin Book") for The Odin Project's NodeJS course, then taken further with a full production deployment on Docker, AWS RDS, and AWS EC2.

The core premise: strip away every form of visual noise and media, and what's left is a feed that rewards people who actually think through and write out their positions, rather than react in a single line. Posts run up to ~500 words; comments up to ~100.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Data Model](#data-model)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
- [Docker Setup](#docker-setup)
- [Production Deployment (AWS)](#production-deployment-aws)
- [Environment Variables](#environment-variables)
- [Challenges & Problem-Solving](#challenges--problem-solving)
- [Known Limitations & Future Work](#known-limitations--future-work)

---

## Tech Stack

**Backend**
- Node.js + Express
- PostgreSQL
- Prisma ORM 7 (driver-adapter architecture via `@prisma/adapter-pg`, no bundled Rust query engine)
- Passport.js — Local strategy (username/password) + JWT strategy for stateless auth; GitHub OAuth strategy built but currently disabled (see [Known Limitations](#known-limitations--future-work))
- bcryptjs for password hashing
- express-validator for input validation
- jsonwebtoken for JWT issuing/verification

**Frontend**
- React (Vite)
- React Router (protected routes via a layout-route pattern)
- Material UI (MUI) with a fully custom theme — no default Material look
- React Context API for auth state (login/signup/logout/session persistence)
- jwt-decode for client-side token expiry checks

**DevOps / Deployment**
- Docker (multi-stage builds for both backend and frontend)
- Docker Compose (local orchestration)
- Nginx (serving the built frontend + handling SPA client-side routing)
- AWS RDS (managed PostgreSQL, production database)
- AWS EC2 (Ubuntu, Docker installed and configured manually — no managed container service)
- Faker.js for database seeding

---

## Features

- **Authentication** — signup/login with hashed passwords and JWT-based sessions; session persistence across page refreshes via token validation on load
- **Feed** — paginated list of posts from the logged-in user and everyone they follow, newest first, with an inline post composer
- **Posts** — text-only, enforced length bounds (minimum and ~500-word maximum), word counter in the composer
- **Comments** — nested under posts, ~100-word maximum
- **Likes** — toggleable, with live counts
- **Follows** — instant, one-way (Twitter-style — no request/approval flow)
- **User profiles** — bio, avatar, a user's own posts; branches between a Follow button (viewing someone else) and an Edit Profile button (viewing yourself)
- **Explore / user index** — browse all users, with client-side search filtering by name or username
- **Profile editing** — update display name, bio, and avatar URL
- **Fully custom visual identity** — bespoke MUI theme (Lora for long-form reading content, Work Sans for UI chrome), custom logo/wordmark/favicon set, no default Material Design styling anywhere in the app

---

## Data Model

Five core models in PostgreSQL, managed via Prisma:

```
User
 ├─ id, username (unique), password (nullable), name, bio, avatar, githubId (nullable, unique)
 ├─ posts        → Post[]
 ├─ comments     → Comment[]
 ├─ likes        → Like[]
 ├─ following    → Follow[] (self-relation: users this user follows)
 └─ followers    → Follow[] (self-relation: users who follow this user)

Post
 ├─ id, content, createdAt, authorId → User
 ├─ comments → Comment[]
 └─ likes    → Like[]

Follow
 ├─ id, followerId → User, followingId → User, createdAt
 └─ @@unique([followerId, followingId])

Like
 ├─ id, userId → User, postId → Post, createdAt
 └─ @@unique([userId, postId])

Comment
 ├─ id, content, createdAt, authorId → User, postId → Post
```

`Follow` and `Like` both use compound unique constraints at the database level to prevent duplicate follows/likes, rather than relying solely on application logic. All child records cascade-delete when their parent `User` or `Post` is removed.

---

## API Endpoints

All endpoints except `/signup` and `/login` require a valid JWT in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Create a new account |
| POST | `/login` | Authenticate, receive a JWT |
| GET | `/users` | List all users (excluding self), with follow-status per user |
| GET | `/users/:id` | Get a user's profile, posts, and follow-status |
| PATCH | `/users/:id` | Update own profile (name, bio, avatar) — ownership-enforced |
| POST | `/users/:id/follow` | Toggle follow/unfollow |
| POST | `/posts` | Create a post |
| GET | `/posts` | Get the feed (paginated: `?page=&limit=`) |
| GET | `/posts/:postId` | Get a single post with comments and like status |
| POST | `/posts/:postId/comments` | Add a comment to a post |
| POST | `/posts/:postId/likes` | Toggle like/unlike |

---

## Project Structure

```
Agora-App/
├── app.js
├── Dockerfile
├── docker-compose.yml
├── prisma.config.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── database/
│   ├── prisma.js          # Prisma client + driver adapter setup
│   ├── queries.js         # All Prisma queries
│   └── seeds.js           # Faker-based seed script
├── config/
│   └── passport.js        # Local, JWT, and (disabled) GitHub strategies
├── controllers/
│   ├── authenticationController.js
│   ├── usersController.js
│   └── postsController.js
├── routes/
│   ├── authenticationRouter.js
│   ├── usersRouter.js
│   └── postsRouter.js
├── middleware/
│   ├── error.js
│   └── requireOwnership.js
└── frontend/
    ├── Dockerfile          # multi-stage: Node build → nginx serve
    ├── nginx.conf          # SPA fallback routing
    └── src/
        ├── api/            # client.js, token.js, auth.js, users.js, posts.js
        ├── context/        # AuthContext.jsx
        ├── components/     # NavBar, PostCard, PostComposer, LikeButton,
        │                   # FollowButton, UserCard, CommentCard,
        │                   # CommentComposer, PaginationControls,
        │                   # AuthLayout, LoginForm, SignupForm,
        │                   # EditProfileForm, ProtectedRoute, ProtectedLayout
        ├── pages/           # LoginPage, SignupPage, FeedPage, UserIndexPage,
        │                    # UserProfile, EditProfile, PostPage
        └── theme.js         # custom MUI theme
```

---

## Local Development Setup

### Prerequisites
- Node.js 20+
- PostgreSQL (local instance)
- npm

### Backend

```bash
git clone <repo-url>
cd Agora-App
npm install
```

Create a `.env` file at the project root:

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/odinbook?schema=public
JWT_SECRET=<your-secret>
```

Run migrations and seed the database:

```bash
npx prisma generate
npx prisma migrate deploy
npm run seed
```

Start the server:

```bash
node --watch app.js
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
```

---

## Docker Setup

Both the backend and frontend are containerized. The backend uses a single-stage Node build; the frontend uses a two-stage build (Node to compile the Vite build, then nginx to serve the static output).

### Build and run individually

```bash
# Backend
docker build -t agora-backend .
docker run -p 3000:3000 --env-file .env -e DATABASE_URL="postgresql://user:pass@host.docker.internal:5432/odinbook?schema=public" agora-backend

# Frontend
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:3000 -t agora-frontend .
docker run -p 5173:80 agora-frontend
```

### Or, run both together with Compose

```bash
docker compose up --build
```

`docker-compose.yml` orchestrates both services. (An earlier version of this file also containerized Postgres itself for fully self-contained local testing — since the project moved to AWS RDS for production, the deployed Compose file points at RDS instead and no longer includes a local Postgres service.)

---

## Production Deployment (AWS)

The app is deployed using:
- **AWS RDS** — managed PostgreSQL, running the same schema and (separately) seeded data as local development
- **AWS EC2** — a `t3.micro` Ubuntu instance with Docker installed manually (not a managed container service like ECS/Fargate), chosen deliberately for the deeper hands-on learning value over convenience

### Deployment flow
1. RDS instance created, public access enabled, security group scoped to specific trusted sources (see below)
2. EC2 instance launched, Docker installed via the official install script, non-root Docker usage configured
3. Repository cloned directly onto the EC2 instance; a production `.env` created there by hand (never committed, never carried over from local)
4. `docker-compose.yml` adjusted for production: local Postgres service removed, `DATABASE_URL` pointed at RDS via `.env`, frontend's `VITE_API_URL` build-arg set to the EC2 instance's public IP
5. `docker compose up --build` run directly on the server

### Security groups
- **RDS security group**: inbound PostgreSQL (5432) allowed from the developer's IP (for direct testing/migrations) and, separately, from the EC2 instance's own security group (not its IP — security-group-based rules survive EC2 IP changes on restart, IP-based ones don't)
- **EC2 security group**: inbound SSH (22) from developer IP only; inbound 5173 (frontend) and 3000 (backend API) open to `0.0.0.0/0`

---

## Environment Variables

| Variable | Used by | Description |
|---|---|---|
| `DATABASE_URL` | Backend | PostgreSQL connection string. Production (RDS) requires `sslmode=no-verify` appended — see [Challenges](#challenges--problem-solving) |
| `JWT_SECRET` | Backend | Signing secret for JWTs |
| `PORT` | Backend | Port the Express server listens on |
| `VITE_API_URL` | Frontend (build-time only) | Base URL the frontend calls for API requests. Baked into the built JS bundle at `docker build` time via `--build-arg`, not read at runtime |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Backend | For the currently-disabled GitHub OAuth strategy |

---

## Challenges & Problem-Solving

A genuine account of real problems hit during this build, and how each was actually diagnosed and resolved — not a polished list, the real debugging trail.

**Prisma 7's architectural shift.** Prisma 7 removed the bundled Rust query engine in favor of driver adapters (`@prisma/adapter-pg`) and moved the database connection URL out of `schema.prisma` entirely into a separate `prisma.config.js`. This also meant the CLI stopped auto-loading `.env` — it now has to be explicitly imported. A CLI/client version mismatch (`prisma` on 6.x, `@prisma/client` on 7.x) at one point produced a cryptic `Cannot find module './runtime/library.js'` error, traced back to the two packages needing matching major versions.

**A missing auth middleware that Postman testing never caught.** `postsRouter.js` never had `passport.authenticate('jwt', ...)` applied to any of its routes — every post/comment/like endpoint ran with effectively no authentication for weeks. It went undetected because manual testing always included a valid token out of habit; the bug only surfaced once the frontend made a request without one, throwing `Cannot read properties of undefined (reading 'id')` inside the controller.

**Recurring frontend bugs from a specific JavaScript footgun.** `.map((x) => { <Component /> })` with curly braces silently returns `undefined` for every item, because curly braces switch an arrow function into a full function body requiring an explicit `return` — unlike parentheses, which implicitly return an expression. This exact mistake reappeared independently across multiple components (a user's post list, a post's comment list) before becoming a recognized pattern to check for.

**Docker layer caching.** Understanding *why* `COPY package*.json ./` and `RUN npm install` need to happen before `COPY . .` — not because later steps depend on it functionally, but because Docker invalidates and re-runs every layer after the first one that changes. Copying all source code before installing dependencies means *any* code change forces a full dependency reinstall on every rebuild.

**Docker networking vs. host networking.** `localhost` inside a container refers to the container itself, not the host machine — connecting a containerized backend to a database running directly on the host (via Postgres.app) required `host.docker.internal` instead.

**Zsh quoting swallowing special characters.** Both a git commit message and a database password containing `!` triggered zsh's history-expansion behavior even inside double quotes, silently mangling the string before the command ever ran. Resolved by URL-encoding the `!` (`%21`) in connection strings and using single quotes for shell commands containing `!`.

**Single-page app routing breaking under nginx.** Once the frontend was served by nginx instead of Vite's dev server, directly navigating to or refreshing on any route other than `/` returned a 404 — nginx was looking for a literal file at that path. Fixed with a custom `nginx.conf` using `try_files $uri $uri/ /index.html;`, falling back to the SPA's entry point for any unrecognized path so React Router can take over client-side.

**Vite environment variables are build-time, not runtime.** Unlike the backend (which reads `process.env` live on every request), Vite bakes `import.meta.env.VITE_*` values into the compiled bundle at `npm run build` time. Passing `VITE_API_URL` as a `docker run -e` flag has no effect after the fact — it has to be a `docker build --build-arg`.

**A misleading AWS RDS error that looked like a credentials problem but wasn't.** After moving to RDS, `prisma migrate deploy` succeeded but the app's own runtime queries failed with `P1010: User was denied access on the database`. A master password reset didn't fix it — because the actual cause, per Prisma's own documentation, was that RDS enforces SSL by default and the `pg` driver adapter validates certificates strictly unless told otherwise. The fix was appending `sslmode=no-verify` to the connection string, not touching credentials at all. The tell, in hindsight: the identical error before and after a password change meant the password was never the variable at fault.

**AWS security group scoping.** Getting RDS reachable required two separate fixes — enabling "Publicly accessible," and, independently, adding an inbound rule on the security group itself, since public access alone doesn't bypass the firewall layer sitting in front of it. Later, connecting EC2 to RDS specifically used a security-group-based source rule rather than an IP-based one, since EC2's public IP changes on every stop/start unless an Elastic IP is attached.

---

## Known Limitations & Future Work

- **GitHub OAuth** — the Passport strategy and supporting schema fields (`githubId`) are fully built but intentionally disabled, since local auth alone satisfies the project's requirements and the added complexity wasn't worth the time tradeoff at this stage
- **Guest sign-in** — not implemented (listed as extra credit in the original project spec)
- **Post/comment images** — deliberately out of scope; the entire product premise is text-only discourse
- **No instant UI update after posting/commenting** — new posts and comments require a manual refresh to appear, a deliberate simplicity tradeoff made consistently across the app rather than wiring up local state synchronization
- **`EmptyState` / `LoadingState` are not extracted as shared components** — the same loading-spinner and empty-message JSX is currently duplicated inline across several pages; a good candidate for future refactoring now that the pattern has repeated enough times to justify it
- **No reverse proxy in front of the backend** — the frontend calls the backend directly on its own exposed port (3000) rather than routing through nginx on the same origin; a more production-typical setup would proxy `/api` requests through nginx internally, reducing the public attack surface
- **No HTTPS** — the deployed site currently runs over plain HTTP
- **No Elastic IP** — the EC2 instance's public IP changes if the instance is stopped and restarted, which would require updating the frontend's baked-in `VITE_API_URL` and rebuilding

---

## Author

Built by Shivam Wadhwa as a capstone project for The Odin Project's Node.js curriculum, extended with a full Docker + AWS production deployment as a self-directed learning exercise in containerization and cloud infrastructure.