# One-click Deploy on Render

## What you get
- A PostgreSQL database (`mrp-db`)
- A Node web service for the API (`mrp-backend`) – NestJS + Prisma
- A Node web service for the UI (`mrp-frontend`) – Next.js

The services are wired together automatically via environment variables:
- `DATABASE_URL` comes from the database
- `CORS_ORIGIN` (backend) and `NEXT_PUBLIC_API_URL` (frontend) are set to each other's public URL

## Steps
1. Push this repo to GitHub (include `render.yaml` in the root).
2. Go to Render → **+ New** → **Blueprint** → select your repo.
3. When prompted for **JWT_SECRET**, Render will auto-generate it. Accept the default.
4. Click **Apply**. Render will:
   - provision the Postgres DB,
   - build the backend, run Prisma migrations and seed data,
   - build and start the frontend.
5. When both web services show **Live**, open the frontend URL and log in:
   - admin@mrp.local / admin123

Notes:
- You can find all environment variables in each service’s **Environment** tab.
- If you change the Prisma schema, push to GitHub → Render will run migrations on the next deploy.
