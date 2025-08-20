# MRP Backend (NestJS + Prisma + Postgres)

## Local quick start
1. Copy `.env.example` to `.env`, set `DATABASE_URL` (or run `docker-compose up -d` and use: `postgresql://mrp:mrp@localhost:5432/mrp?schema=public`).
2. Install deps:
```
npm install
```
3. Generate DB + seed:
```
npx prisma migrate dev --name init
npm run prisma:seed
```
4. Run:
```
npm run start:dev
```
Default port: 8080

## Endpoints
- `POST /auth/login` → `{ token, user }` (use as `Authorization: Bearer <token>`)
- Masters: `GET/POST /master/items|raw|boms`, `GET /master/plants`
- Plans: `POST /plans/demand/:month`, `POST /plans/supply/:month`, `POST /plans/production/:month`
- RM: `POST /rm/availability/:month`, `GET /rm/availability/:month`
- Reports: `GET /reports/rm-req/:month`, `GET /reports/demand-vs-supply/:month`
