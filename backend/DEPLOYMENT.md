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
