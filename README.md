# my-api

Express + Sequelize + PostgreSQL REST API with auto-loaded layers and JWT auth.

## Run
```bash
npm install
cp .env.example .env      # edit DB_* and JWT_SECRET
createdb my_api
npm run dev               # nodemon  (npm start for production)
```

## Auto-loading rules
| Layer | File | Key / mount |
|---|---|---|
| model | `models/deployed/<name>.model.js` | `db.<name>` |
| service | `services/deployed/<name>.service.js` | `services.<name>` |
| controller | `controllers/deployed/<name>.controller.js` | `controllers.<name>` |
| route | `routes/deployed/<name>.route.js` | mounted at `/api/<name>` |
| route | `routes/deployed/route<Anything>.route.js` | mounted at `/api` (paths defined in file) |

Drop a file in, restart — it's registered. No manual edits to any `index.js`.

## Endpoints (all under `/api`)
| Method | Path | Auth |
|---|---|---|
| POST | `/auth/register` | – |
| POST | `/auth/login` | – |
| GET | `/user/me` | Bearer |
| GET/DELETE | `/user`, `/user/:id` | Bearer (admin) |
| GET/PUT | `/user/:id` | Bearer (self or admin) |
| GET/POST | `/v1.0.1/cbc/countries` (`?page=&limit=&search=`) | Bearer |
| GET/PUT/DELETE | `/v1.0.1/cbc/countries/:id` | Bearer |
| POST | `/upload/single` (field `file`) | Bearer |
| POST | `/upload/multiple` (field `files`) | Bearer |

## Quick test
```bash
curl -X POST localhost:3000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"Admin@12345"}'

TOKEN=...   # data.token from above
curl -X POST localhost:3000/api/v1.0.1/cbc/countries -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"name":"Cambodia","isoCode2":"KH","isoCode3":"KHM","phoneCode":"+855"}'

curl -X POST localhost:3000/api/upload/multiple -H "Authorization: Bearer $TOKEN" \
  -F files=@a.png -F files=@b.png
```

## Production notes
- Set `DB_SYNC=false` and use migrations (sequelize-cli) instead of `sync({alter:true})`.
- Set a strong `JWT_SECRET` (the app refuses to boot in production otherwise) and change the bootstrap admin password.
- Files in `/uploads` are served publicly by URL (random filenames); put auth/CDN in front if they are sensitive.
