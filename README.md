# FarmLink SIH 2026 prototype

FarmLink is a working prototype for SIH26033: a direct farmer-to-consumer and bulk-buyer marketplace. It demonstrates listings, prototype AI pricing and matching, FPO aggregation, pooled route planning, order traceability, demo settlement splits, and a verifiable local ledger record.

## Run the demo quickly

1. Start the API: `npm run dev --prefix backend`
2. In another terminal install and start the frontend: `npm install --prefix frontend` then `npm run dev --prefix frontend`
3. Open http://localhost:5173
4. Use **Jury demo**, or sign in at `/login` with `farmer@farmlink.demo` / `farmer123`.

The backend defaults to seeded prototype mode so the UI is usable without Postgres. It does not silently claim database writes while in this mode.

## Full local stack

- PostgreSQL/PostGIS: `docker compose up postgres redis`
- Initialize manually: `psql "$env:DATABASE_URL" -f database/schema.sql` then `psql "$env:DATABASE_URL" -f database/seed.sql`
- Backend: copy `backend/.env.example` to `backend/.env`, set `DEMO_MODE=false`, then `npm install --prefix backend` and `npm run dev --prefix backend`
- AI service: create a Python 3.12 environment, install `ai-service/requirements.txt`, then `uvicorn app:app --app-dir ai-service --port 8000`
- Frontend: copy `frontend/.env.example` to `frontend/.env`, then `npm install --prefix frontend && npm run dev --prefix frontend`

`docker compose up --build` is also provided. The backend Docker image currently serves the API and the frontend Dockerfile can be added for a production static serving stage when deploying.

## Demo identities

- Farmer: `farmer@farmlink.demo` / `farmer123`
- Consumer: `consumer@farmlink.demo` / `consumer123`
- Bulk buyer: `buyer@farmlink.demo` / `buyer123`
- FPO admin: `fpo@farmlink.demo` / `fpo123`
- Admin: `admin@farmlink.demo` / `admin123`

## API surface

Auth: `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me`.
Listings: `GET /api/listings`, `GET /api/listings/:id`, `POST /api/listings`.
AI: `POST /api/ai/price`, `POST /api/ai/match`, `POST /api/ai/forecast`.
Orders: `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id`, `PUT /api/orders/:id/status`.
FPO/logistics: `GET /api/fpo/dashboard`, `GET /api/fpo/hub`, `GET /api/routes`, `POST /api/routes/optimize`.
Settlement: `POST /api/payments/demo`, `GET /api/ledger`, `GET /api/ledger/:id/verify`.

## Jury sequence

Open `/demo`, start the guided story, then inspect `/marketplace`, `/farmer`, `/farmer/list-crop`, `/fpo/hub` (API-backed), `/logistics`, `/orders/ORD-FL-00128/traceability`, and `/ledger`.

## Honesty boundary

Price, match, forecast, route savings, payment, and ledger are explicitly prototype simulations. No live market feed, UPI transfer, blockchain transaction, real-time GPS, or guaranteed outcome is represented. The SQL schema includes PostGIS and all requested domain entities; the default UI uses deterministic demo fixtures for reliable hackathon presentation.

## Voice and maps

`/farmer/voice` uses the browser Web Speech API with `en-IN`, `ta-IN`, `hi-IN`, `te-IN`, `ml-IN`, and `kn-IN` language selection. The parser extracts a crop, quantity, unit, and availability phrase for farmer confirmation. Unsupported browsers get a `Demo Voice Simulation` fallback; raw microphone audio never reaches the backend.

`/fpo/hub`, `/logistics`, and order traceability use React Leaflet with OpenStreetMap. The route API attempts OSRM first and falls back to deterministic Haversine distance and seeded coordinates when routing or tiles are unavailable. Locations and tracking are explicitly demo data, not live GPS.

## USSD and IVR simulations

Open `/farmer/ussd` for the dark basic-phone `*123#` flow or `/farmer/ivr` for keypad plus browser SpeechSynthesis. Both authenticate as the seeded Ravi demo farmer when necessary and submit confirmed listings through the same `/api/listings` endpoint as web and voice listings. Listing provenance is stored as `WEB`, `VOICE`, `USSD`, or `IVR`.

Run the demo buttons to show the full listing sequence. Production deployment would require a telecom USSD or IVR gateway; this browser interaction is explicitly a **USSD + IVR Prototype Simulation**. No telecom network, real DTMF call, or offline phone connection is present.
