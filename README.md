# Hunter

Hunter is a full-stack job application tracker that helps users manage applications, resumes, reminders, analytics, and AI-assisted cover letters from one dashboard.

Live project: https://hunter-orcin.vercel.app/

## What The Project Does

- User authentication with signup, login, protected routes, and JWT-based API access.
- Job application tracking with company, role, status, notes, job URL, and applied date.
- Kanban-style job status flow for `APPLIED`, `INTERVIEW`, `OFFER`, and `REJECTED`.
- Resume upload and management using Cloudinary.
- Resume analytics that show how often each resume is used and how it performs.
- AI cover letter generation, resume feedback, and resume/job matching through OpenRouter.
- Dashboard and analytics charts for application activity and outcomes.
- Follow-up reminder settings and reminder logs.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Chart.js and React Chart.js 2

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Bcrypt password hashing
- Cloudinary for resume uploads
- OpenRouter/OpenAI SDK for AI features
- Nodemailer for email reminders
- Node Cron for scheduled reminder work

## How It Works

The frontend is a Vite React app located in `client/hunter`. It reads `VITE_API_URL` from `.env` and sends API requests to the backend with Axios. After login, the JWT token is stored in local storage and attached to protected requests as a Bearer token.

The backend is an Express API located in `backend`. It exposes routes for auth, jobs, AI tools, resumes, analytics, and reminders. Prisma connects the API to PostgreSQL, while Cloudinary stores uploaded resume files. Protected routes use the JWT auth middleware to identify the logged-in user.

## Project Structure

```text
hunter/
|-- README.md
|-- backend/
|   |-- prisma/
|   |   |-- schema.prisma
|   |   `-- migrations/
|   |-- scripts/
|   |   `-- backfillResumeMetrics.ts
|   |-- src/
|   |   |-- app.ts
|   |   |-- server.ts
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- cron/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- utils/
|   |   `-- validation/
|   |-- package.json
|   `-- tsconfig.json
`-- client/
    `-- hunter/
        |-- public/
        |-- src/
        |   |-- api/
        |   |-- charts/
        |   |-- components/
        |   |-- context/
        |   |-- pages/
        |   |-- App.tsx
        |   `-- main.tsx
        |-- package.json
        `-- vite.config.ts
```

## Main API Routes

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/v1/jobs
POST   /api/v1/jobs
GET    /api/v1/jobs/:id
PATCH  /api/v1/jobs/:id
PATCH  /api/v1/jobs/:id/status
DELETE /api/v1/jobs/:id

POST   /api/v1/resumes/upload
GET    /api/v1/resumes
GET    /api/v1/resumes/analytics
GET    /api/v1/resumes/:id
DELETE /api/v1/resumes/:id

POST   /api/v1/ai/cover-letter
POST   /api/v1/ai/resume-feedback
POST   /api/v1/ai/resume-match
GET    /api/v1/ai/cover-letters

GET    /api/v1/analytics
GET    /api/v1/analytics/weekly

GET    /api/v1/reminders
GET    /api/v1/reminders/settings
PATCH  /api/v1/reminders/settings
POST   /api/v1/reminders/trigger
```

## Run Locally

### Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL database
- Cloudinary account
- OpenRouter API key

### 1. Clone The Project

```bash
git clone <your-repository-url>
cd hunter
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:5173

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your-long-random-secret

OPENROUTER_API_KEY=your-openrouter-api-key

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password
```

Run database migrations and start the backend:

```bash
npx prisma migrate dev
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

### 3. Setup Frontend

Open a new terminal:

```bash
cd client/hunter
npm install
```

Create `client/hunter/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```



## Author

Built by Shivam.
