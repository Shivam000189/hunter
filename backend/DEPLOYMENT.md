# Backend Deployment

This backend is a Node.js + Express + TypeScript API with Prisma and PostgreSQL.

## Required Environment Variables

Set these in your hosting provider:

```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.com
DATABASE_URL=postgresql://...
JWT_SECRET=use-a-long-random-secret
OPENROUTER_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
```

`CORS_ORIGIN` can contain multiple frontend URLs separated by commas.

## Build And Start Commands

Use these settings on a Node hosting provider:

```bash
npm ci
npm run build
npm run migrate:deploy
npm start
```

If the provider has only one start command field, use:

```bash
npm run start:prod
```

## Health Check

Use this path for deployment health checks:

```text
/health
```

## Render Example

1. Create a PostgreSQL database on Render, Neon, Supabase, or Railway.
2. Create a new Render Web Service from this repository.
3. Set the root directory to `backend`.
4. Set the runtime to Node.
5. Set the build command to `npm ci && npm run build`.
6. Set the start command to `npm run start:prod`.
7. Add all required environment variables.
8. Deploy the service.
9. After deploy, test `https://your-backend.onrender.com/health`.

## Fix Prisma P3005 On First Deploy

If deploy fails with:

```text
Error: P3005
The database schema is not empty.
```

Prisma found existing tables in the production database, but the `_prisma_migrations`
table does not know which migrations have already been applied.

Use one of these fixes:

### Option A: Empty Database

Use this if you do not need any data in the production database yet.

1. Open your database provider dashboard.
2. Delete/reset the database schema.
3. Redeploy the backend.

`npm run start:prod` will run `prisma migrate deploy` and create the schema cleanly.

### Option B: Keep Existing Data

Use this if the production database already has data you want to keep.

Run these commands once against the production `DATABASE_URL`, replacing the URL
with your real Neon/Render/Supabase connection string:

```bash
npx prisma migrate resolve --applied 20260414182628_init
npx prisma migrate resolve --applied 20260417140333_init
npx prisma migrate resolve --applied 20260419181451_add_jobs
npx prisma migrate resolve --applied 20260420122807_add_cover_letters
npx prisma migrate resolve --applied 20260420143513_add_resumes
npx prisma migrate resolve --applied 20260420170713_add_reminders
npx prisma migrate resolve --applied 20260420171805_add_reminders
npx prisma migrate resolve --applied 20260430210000_resume_intelligence
```

After that, redeploy the backend.
