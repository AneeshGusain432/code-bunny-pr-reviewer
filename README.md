
<div align="center">

# Code Bunny

### AI-powered pull request reviews for GitHub repositories

Code Bunny connects to GitHub, indexes repository context, reviews pull request changes with an LLM, and posts actionable feedback directly on the pull request.

</div>

## Features

- GitHub OAuth sign-in with Better Auth
- GitHub App installation and repository access through Octokit
- Automatic reviews for opened, reopened, and synchronized pull requests
- Repository codebase synchronization for broader review context
- Diff and repository chunking with vector search in Pinecone
- AI review generation through OpenRouter and the Vercel AI SDK
- Inngest background jobs for durable repository sync and review workflows
- Dashboard for review activity, recent pull requests, repositories, and usage
- Usage limits and subscription billing with Razorpay
- PostgreSQL persistence through Prisma ORM 7 and the Prisma PostgreSQL adapter

## How It Works

1. A user signs in with GitHub and installs the Code Bunny GitHub App.
2. GitHub sends installation and pull request webhook events to the Next.js API.
3. The webhook handler validates the signature, stores the pull request, and checks the user's review allowance.
4. An Inngest function fetches the pull request files, chunks the diff, and stores embeddings in a pull-request-specific Pinecone namespace.
5. The worker retrieves relevant diff context and optional repository-wide context, then asks OpenRouter to generate the review.
6. Code Bunny posts the generated Markdown comment to GitHub and records the completed review in PostgreSQL.

Repository sync follows a similar background workflow: it fetches a selected branch, chunks the codebase, replaces the repository's Pinecone namespace when necessary, and records the sync status and chunk count.

## Architecture

```mermaid
flowchart LR
	 Browser[Next.js dashboard] --> Auth[Better Auth]
	 Browser --> API[Next.js API routes]
	 Auth --> DB[(PostgreSQL / Prisma)]
	 API --> GitHub[GitHub App and webhooks]
	 GitHub --> API
	 API --> Jobs[Inngest]
	 Jobs --> DB
	 Jobs --> Octokit[Octokit]
	 Jobs --> Vectors[(Pinecone)]
	 Jobs --> AI[OpenRouter / AI SDK]
	 Jobs --> Octokit
	 Billing[Razorpay] --> API
```

### Main directories

| Directory | Responsibility |
| --- | --- |
| `app/` | Next.js App Router pages, layouts, and API routes |
| `features/auth/` | Authentication actions, GitHub sign-in, and user session UI |
| `features/github/` | GitHub App setup, installations, repositories, and webhook handling |
| `features/repo-sync/` | On-demand repository indexing and sync status |
| `features/reviews/` | Pull request persistence, diff processing, vector context, review generation, and GitHub comments |
| `features/ai/` | OpenRouter provider configuration |
| `features/inngest/` | Inngest client and background function registration |
| `features/billing/` | Razorpay subscriptions and usage enforcement |
| `features/dashboard/` | Protected dashboard data, layouts, and UI |
| `features/pinecone/` | Pinecone client configuration |
| `prisma/` | PostgreSQL schema and migrations |
| `components/ui/` | Shared UI primitives and application components |

## API Routes

- `POST /api/github/webhook` - receives signed GitHub installation and pull request events
- `GET /api/github/callback` - completes GitHub App installation flow
- `GET /api/github/repos` - returns repositories available to the connected installation
- `/api/auth/[...all]` - Better Auth handlers
- `/api/inngest` - Inngest serve endpoint for background functions
- `POST /api/razorpay/webhook` - receives subscription billing events

## Prerequisites

- Node.js compatible with Next.js 16
- PostgreSQL database
- GitHub OAuth application
- GitHub App with repository permissions and webhook delivery enabled
- Inngest account or local Inngest development server
- Pinecone index
- OpenRouter API key
- Razorpay account if billing is enabled

## Local Setup

1. Install dependencies:

	```bash
	npm install
	```

2. Create `.env.local` in the project root and provide the required values:

	```env
	DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"

	GITHUB_CLIENT_ID=""
	GITHUB_CLIENT_SECRET=""
	GITHUB_APP_ID=""
	GITHUB_APP_NAME=""
	GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\\n...\\n-----END RSA PRIVATE KEY-----"
	GITHUB_APP_WEBHOOK_SECRET=""

	OPEN_ROUTER_API_KEY=""
	PINECONE_API_KEY=""
	PINECONE_INDEX=""

	NEXT_PUBLIC_RAZORPAY_KEY_ID=""
	RAZORPAY_API_KEY_SECRET=""
	RAZORPAY_PLAN_ID=""
	RAZORPAY_WEBHOOK_SECRET=""
	```

	Keep private keys and API secrets server-side. The `NEXT_PUBLIC_RAZORPAY_KEY_ID` value is the only Razorpay variable intended for browser use.

3. Generate Prisma Client and apply the development migrations:

	```bash
	npx prisma generate
	npx prisma migrate dev
	```

4. Start the development server:

	```bash
	npm run dev
	```

	Open [http://localhost:3000](http://localhost:3000).

5. Configure your GitHub App webhook URL as `https://YOUR_DOMAIN/api/github/webhook`. For local development, expose the server with a secure tunnel and use the tunnel URL. Configure the Inngest endpoint as `https://YOUR_DOMAIN/api/inngest` or use the Inngest development tooling locally.

## Database

The Prisma schema stores Better Auth users, sessions, accounts, and verification records alongside:

- `GithubInstallation` - the GitHub App installation associated with a user
- `PullRequest` - pull request metadata, processing status, generated review, and timestamps
- `RepoSync` - repository branch, sync status, indexed chunk count, and sync timestamp

For production deployments, apply committed migrations with:

```bash
npx prisma migrate deploy
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Generate Prisma Client and build the Next.js application |
| `npm run start` | Start the production server after a build |
| `npm run lint` | Run ESLint |

Useful Prisma commands include `npx prisma studio` for inspecting data and `npx prisma migrate status` for checking migration state.

## Tech Stack

Next.js 16, React 19, TypeScript, Prisma ORM 7, PostgreSQL, Better Auth, Octokit, Inngest, Pinecone, OpenRouter, Vercel AI SDK, Razorpay, Tailwind CSS 4, and shared shadcn-style UI components.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
