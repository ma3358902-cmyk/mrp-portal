# MRP Web Portal (Next.js + NestJS + Prisma + Postgres)

Contains:
- `backend-nest/` — NestJS API with Prisma (PostgreSQL), JWT auth
- `frontend-next/` — Next.js UI that calls the API with Bearer JWT

## Local quick start
### Backend
```
cd backend-nest
cp .env.example .env
# Set DATABASE_URL (or run docker-compose for local Postgres)
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev   # http://localhost:8080
```
### Frontend
```
cd ../frontend-next
cp .env.local.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:8080
npm install
npm run dev       # http://localhost:3000
```

### Seeded accounts
- admin@mrp.local / admin123
- sales.local@mrp.local / sales123
- ops@mrp.local / ops123
- sc@mrp.local / sc123

## Cloud deployment
- **DB:** Neon/Render/RDS → set `DATABASE_URL`
- **Backend (Render):** Build `npm install && npx prisma migrate deploy && npm run build` | Start `node dist/main.js` | Env: `DATABASE_URL`, `JWT_SECRET`, `PORT=8080`, `CORS_ORIGIN=https://your-frontend.vercel.app`
- **Frontend (Vercel):** Env `NEXT_PUBLIC_API_URL` = backend URL
