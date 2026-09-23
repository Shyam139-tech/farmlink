# FarmLink zero-cost deployment

This deployment targets a public SIH demonstration at zero hosting cost:

```text
Vercel Hobby static frontend
        |
        v
Render Free Docker web service (Express API)
```

The current backend serves deterministic prototype data from memory. It creates a
PostgreSQL pool only when `DATABASE_URL` is present, but it does not execute any
database queries. Redis and the FastAPI service are not called by the frontend or
backend at runtime. They remain available for local Docker development and are
not deployed for this demo.

## Free-plan constraints

- Vercel Hobby hosts the Vite static frontend.
- Render Free hosts one Docker web service. It sleeps after inactivity and may
   take about a minute to wake.
- Render Free is ephemeral: registrations, listings, orders, pickup changes, and
  other in-memory mutations reset when the service restarts.
- No credit card, paid plan, paid domain, database, Redis service, or separate AI
  service is required for the current prototype behavior.

## 1. Create a GitHub repository

From the project root:

```powershell
git add .
git commit -m "Prepare FarmLink zero-cost deployment"
git remote add origin https://github.com/YOUR_USER/farmlink.git
git push -u origin main
```

Create the empty GitHub repository first. Do not commit `.env` files, secrets,
`node_modules`, `dist`, Python caches, or database data; the root `.gitignore`
already excludes them. GitHub authentication must be completed in the browser or
with Git Credential Manager; never put a password in a remote URL.

## 2. Deploy the backend to Render Free

1. Open the Render dashboard and choose **New > Blueprint**.
2. Select the GitHub repository and branch `main`.
3. Confirm the repository `render.yaml` file.
4. Keep the service on the **Free** plan. Do not upgrade it.
5. Set these service environment variables:

   ```text
   JWT_SECRET=<long random value>
   CORS_ORIGIN=https://YOUR-FARMLINK.vercel.app
   ```

   Render supplies `PORT`; the backend binds to `0.0.0.0`.
6. Deploy and copy the generated URL, for example:
   `https://farmlink-backend.onrender.com`.

Verify:

```text
https://YOUR-BACKEND.onrender.com/api/health
```

The response should include `status: "ok"` and
`service: "farmlink-backend"`.

## 3. Deploy the frontend to Vercel Hobby

1. Import the same GitHub repository into Vercel.
2. Set **Root Directory** to `frontend`.
3. Use the Vite preset, build command `npm run build`, and output directory
   `dist`.
4. Add this Production environment variable:

   ```text
   VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
   ```

5. Deploy. `frontend/vercel.json` keeps React Router routes working on refresh.
6. Copy the Vercel URL and update Render's `CORS_ORIGIN` to that exact origin,
   without a trailing slash or path. Redeploy the backend after changing it.

The jury URL is the Vercel URL. No custom domain is needed.

## 4. Services intentionally not deployed

### PostgreSQL/PostGIS

The SQL schema uses PostGIS, but the active Express routes use seeded in-memory
arrays and do not query PostgreSQL. Deploying a database would add an external
dependency without changing this build's behavior. Do not claim database
persistence in the demo. The schema and migrations remain available for a later
persistence implementation.

### Redis

There is no Redis client or Redis call in the active backend. `REDIS_URL` is not
needed for this deployment.

### FastAPI AI service

The backend implements the `/api/ai/*` prototype responses locally and never
reads `AI_SERVICE_URL`. The separate FastAPI service stays available for local
Docker use but is not needed publicly.

## 5. Environment variables

Render backend:

```text
NODE_ENV=production
JWT_SECRET=<secret>
CORS_ORIGIN=https://YOUR-FARMLINK.vercel.app
```

Vercel frontend:

```text
VITE_API_URL=https://YOUR-BACKEND.onrender.com/api
```

Do not put `JWT_SECRET`, `DATABASE_URL`, or `REDIS_URL` in Vercel.

## 6. Smoke test

Run these against the public Vercel URL:

- `/`, `/farmer`, `/farmer/voice`, `/farmer/ussd`, `/farmer/ivr`
- `/fpo`, `/buyer`, `/logistics`, `/orders`
- Login with `farmer@farmlink.demo` / `farmer123`
- Create a listing, run AI pricing, match a buyer, create an order, submit a
  pickup request, assign a vehicle, pool a route, view the map, mark delivery,
  run demo payment, and verify the ledger
- Refresh each SPA route after navigation

Remember that Render may need to wake before the first API request. Prototype
labels remain intentional: demo payment, demo locations, prototype AI estimate,
prototype route optimization, USSD prototype simulation, IVR prototype
simulation, and blockchain-style ledger verification.

## 7. Preserve local Docker

The local stack still includes PostgreSQL, Redis, FastAPI, Express, and Nginx:

```powershell
docker compose down
docker compose up -d --build
```

Expected local endpoints remain:

```text
http://localhost:5173
http://localhost:5001
http://localhost:8000
localhost:5432
localhost:6379
```
