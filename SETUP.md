# ManoDweep — Local Setup Guide

## Prerequisites

Install these before starting:

1. **Node.js 22+** — https://nodejs.org/en/download
2. **Docker Desktop** — https://www.docker.com/products/docker-desktop
   - This gives you PostgreSQL and Redis with one command, no separate installs needed.

---

## Step 1 — Install dependencies

Open a terminal in the `manodweep` folder:

```bash
npm install
```

---

## Step 2 — Start the database and cache

Make sure Docker Desktop is running, then:

```bash
docker compose up -d
```

This starts PostgreSQL on port 5432 and Redis on port 6379.
To stop them later: `docker compose down`

---

## Step 3 — Configure environment

Copy the example env file and fill it in:

```bash
copy .env.example .env.local
```

Open `.env.local` and set:

```
DATABASE_URL="postgresql://manodweep:manodweep_secret@localhost:5432/manodweep_db"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="<your Resend API key from resend.com>"
EMAIL_FROM="ManoDweep <noreply@yourdomain.com>"
```

**Getting a Resend API key** (for password reset emails):
- Sign up free at https://resend.com
- Go to API Keys → Create API Key
- Paste it into `RESEND_API_KEY`
- You can use `onboarding@resend.dev` as `EMAIL_FROM` during development

---

## Step 4 — Set up the database

```bash
npm run db:generate   # generates Prisma client
npm run db:push       # creates tables in PostgreSQL
```

---

## Step 5 — Run the app

```bash
npm run dev
```

Open http://localhost:3000 — you'll be redirected to the login screen.

---

## Auth flow overview

| URL | Screen |
|-----|--------|
| `/login` | Login (0.0) |
| `/register/age` | Age Verification (R-00-A) |
| `/register/consent` | Informed Consent (R-00-B) |
| `/register/form` | Register Form (R-01) |
| `/forgot-password` | Enter Email (0.FP-1) |
| `/forgot-password/verify` | Enter OTP (0.FP-2) |
| `/forgot-password/reset` | Set New Password (0.FP-3) |
| `/welcome` | Welcome Splash (0.1) |

---

## Troubleshooting

**`Cannot connect to database`** — make sure Docker is running: `docker compose up -d`

**`Redis connection refused`** — same as above, Redis is in the same docker compose file.

**OTP emails not arriving** — check your `RESEND_API_KEY` in `.env.local`. In dev you can watch the Resend dashboard to see if emails are being sent.

**`prisma generate` errors** — run `npm install` first, then retry.
