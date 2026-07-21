# Smart Delivery Route Optimizer

A React 19 and Spring Boot application for managing deliveries and optimizing routes with graph construction, Haversine distance calculations, and Dijkstra's shortest-path algorithm.

## Project structure

```text
frontend/   React, Vite, Tailwind CSS, Axios
backend/    Spring Boot, Spring Security, Spring Data JPA, MySQL, Maven
frontend/src/assets/screenshots/
README.md
```

## Local development

Requirements: Node.js/npm, Java 21 or newer, and MySQL.

Start the backend on Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

On macOS or Linux, use `./mvnw spring-boot:run`. The backend runs at `http://localhost:8080`. Its existing local MySQL connection defaults remain in `backend/src/main/resources/application.properties` and can be overridden with environment variables.

Start the frontend in a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and defaults to the local backend. Copy `frontend/.env.example` to `frontend/.env` only when a local override is needed. Real `.env` files are ignored.

## Production architecture

- Vercel serves the Vite single-page application from `frontend/`.
- Railway builds and runs the Spring Boot API from `backend/`.
- Railway MySQL supplies the production database.
- The browser calls the Railway API using `VITE_API_BASE_URL`.
- The API permits the Vercel origin supplied through `FRONTEND_URL`.

## Railway backend deployment

Create a Railway service from this repository and use:

- Root directory: `backend`
- Build command: `./mvnw clean package -DskipTests`
- Start command: `java -jar target/*.jar`

`backend/railway.json` provides these settings. Railway supplies `PORT`; the application reads it automatically. Do not add production secrets to repository files.

## Railway MySQL setup

Add a MySQL service to the Railway project. In the backend service, map the MySQL service values to `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` using Railway references. The datasource URL must be a JDBC MySQL URL, for example `jdbc:mysql://host:port/database`; use Railway's actual private host, port, and database values.

Keep the database and backend in the same Railway project/environment when using Railway's private network. After deployment, verify the backend logs show a successful datasource connection and schema update.

## Vercel frontend deployment

Import the repository into Vercel and configure:

- Root directory: `frontend`
- Framework preset: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

Set `VITE_API_BASE_URL` to the public Railway backend URL without a trailing slash, then redeploy. `frontend/vercel.json` rewrites browser routes to `index.html` so React Router routes work after refresh.

## Required environment variables

Railway backend:

| Variable | Value |
| --- | --- |
| `SPRING_DATASOURCE_URL` | Railway MySQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | Railway MySQL username |
| `SPRING_DATASOURCE_PASSWORD` | Railway MySQL password |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |
| `FRONTEND_URL` | Deployed Vercel origin, such as `https://your-app.vercel.app` |

Vercel frontend:

| Variable | Value |
| --- | --- |
| `VITE_API_BASE_URL` | Public Railway backend URL, such as `https://your-api.up.railway.app` |

Only the public API origin belongs in a `VITE_` variable. Never expose database credentials, passwords, or other secrets through Vite variables.

## Deployment testing checklist

- Open the Vercel site and refresh on each React Router route.
- Register a new user and log in.
- Create, view, update, and delete a delivery.
- Run route optimization and verify the map and route sequence.
- Confirm browser requests target the Railway API over HTTPS.
- Confirm authenticated requests succeed from the configured Vercel origin.
- Confirm requests from unconfigured origins are rejected by CORS.
- Review Railway logs for startup, database connectivity, and unexpected errors.
- Confirm no `.env`, database credential, build output, or generated report was committed.

## REST APIs

Endpoint paths are unchanged:

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/deliveries
POST   /api/deliveries
PUT    /api/deliveries/{id}
DELETE /api/deliveries/{id}
GET    /api/graph
GET    /api/routes/optimize
```
