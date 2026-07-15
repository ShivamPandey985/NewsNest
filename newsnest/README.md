# 📰 NewsNest — Personalized Interest-Based News Aggregator

NewsNest is a modern, responsive news aggregation platform that delivers a **personalized homepage** based on each user's selected interests — UPSC, Technology, AI, Business, Sports, Cricket, Science, and 15+ more categories. Built as a **stateless microservices system** with **zero database** — all user data (name, theme, interests, bookmarks) lives entirely in the browser's `localStorage`.

---

## 🏗️ Architecture

```
Browser ──▶ frontend (static HTML/CSS/JS, Express static server)
              │
              ▼  (the ONLY service the browser talks to)
         api-gateway  ──▶  news-service      ──▶  External News API (NewsAPI.org)
                      ──▶  category-service
```

- **frontend/** — Pure HTML5, CSS3, Vanilla JavaScript (no frameworks). Served via a minimal Express static file server for Docker/Kubernetes parity.
- **api-gateway/** — Single entry point. Handles routing, CORS, rate limiting, centralized error handling, and API versioning (`/api/v1/...`).
- **news-service/** — The only service that talks to the external News API. Fetches, normalizes, searches, and filters articles. Caches responses in-memory for 5 minutes. Hides the API key.
- **category-service/** — Serves static JSON category/keyword mappings (UPSC, Technology, Business, etc.) used both by the frontend interest picker and by news-service for keyword filtering.

**No database is used anywhere.** The backend is completely stateless; only `category-service`'s static `categories.json` file holds configuration data.

---

## 📁 Project Structure

```
newsnest/
├── frontend/               # Static HTML/CSS/JS + Express static server
├── api-gateway/             # Express API Gateway
├── news-service/            # Express News microservice
├── category-service/        # Express Category microservice
├── kubernetes/               # K8s manifests (Deployments, Services, ConfigMap, Secret, Ingress)
├── docker-compose.yml
├── .gitignore
├── README.md
└── LICENSE
```

Each backend service contains: `Dockerfile`, `package.json`, `src/`, `.env.example`, `.dockerignore`.

---

## 🔑 Getting a News API Key

NewsNest uses **[NewsAPI.org](https://newsapi.org)** as its single external news source.

1. Go to https://newsapi.org/register and create a free account.
2. Copy your API key.
3. You'll paste it into `news-service/.env` (local) or a Kubernetes Secret (cluster) — see below.

---

## 🚀 Running Locally (without Docker)

Each service runs independently on its own port. Open **4 terminals**:

```bash
# 1. category-service (port 4002)
cd category-service
cp .env.example .env
npm install
npm start

# 2. news-service (port 4001)
cd news-service
cp .env.example .env
# edit .env and set NEWS_API_KEY=your_key_here
npm install
npm start

# 3. api-gateway (port 4000)
cd api-gateway
cp .env.example .env
npm install
npm start

# 4. frontend (port 8080)
cd frontend
cp .env.example .env
npm install
npm start
```

Visit **http://localhost:8080** in your browser.

---

## 🐳 Running with Docker Compose (recommended)

This is the fastest way to run the entire stack.

```bash
# From the project root:
export NEWS_API_KEY=your_newsapi_org_key_here   # Linux/Mac
# set NEWS_API_KEY=your_newsapi_org_key_here     # Windows CMD
# $env:NEWS_API_KEY="your_newsapi_org_key_here"  # Windows PowerShell

docker compose up --build
```

This builds and starts all 4 services with proper networking, health checks, and `depends_on` ordering:

| Service            | URL                          |
|---------------------|-------------------------------|
| Frontend            | http://localhost:8080         |
| API Gateway         | http://localhost:4000/health  |
| News Service        | internal only (port 4001)     |
| Category Service    | internal only (port 4002)     |

Stop everything with `docker compose down`.

> Alternatively, create a `.env` file in the project root with `NEWS_API_KEY=your_key` — Docker Compose automatically reads root-level `.env` files for variable substitution.

---

## ☸️ Deploying to Kubernetes

### 1. Build and push images

Replace `YOUR_DOCKERHUB_USERNAME` with your actual Docker Hub (or other registry) username in **all files under `kubernetes/`**, then:

```bash
docker build -t YOUR_DOCKERHUB_USERNAME/newsnest-frontend:latest ./frontend
docker build -t YOUR_DOCKERHUB_USERNAME/newsnest-api-gateway:latest ./api-gateway
docker build -t YOUR_DOCKERHUB_USERNAME/newsnest-news-service:latest ./news-service
docker build -t YOUR_DOCKERHUB_USERNAME/newsnest-category-service:latest ./category-service

docker push YOUR_DOCKERHUB_USERNAME/newsnest-frontend:latest
docker push YOUR_DOCKERHUB_USERNAME/newsnest-api-gateway:latest
docker push YOUR_DOCKERHUB_USERNAME/newsnest-news-service:latest
docker push YOUR_DOCKERHUB_USERNAME/newsnest-category-service:latest
```

### 2. Set your News API key as a Secret

**Do not commit real API keys.** Either edit `kubernetes/secret.yaml` locally before applying (and don't commit the edit), or create it imperatively:

```bash
kubectl create secret generic newsnest-secrets \
  --from-literal=NEWS_API_KEY=your_newsapi_org_key_here
```

### 3. Apply the manifests

```bash
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml         # skip if you created it imperatively above
kubectl apply -f kubernetes/category-deployment.yaml
kubectl apply -f kubernetes/category-service.yaml
kubectl apply -f kubernetes/news-deployment.yaml
kubectl apply -f kubernetes/news-service.yaml
kubectl apply -f kubernetes/gateway-deployment.yaml
kubectl apply -f kubernetes/gateway-service.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/frontend-service.yaml
kubectl apply -f kubernetes/ingress.yaml
```

Or apply everything in the folder at once:

```bash
kubectl apply -f kubernetes/
```

### 4. Access the app

The Ingress routes `/` to `frontend` and `/api` to `api-gateway` on the same host, so the frontend's `/api/v1` calls work without CORS issues. Update `spec.rules[0].host` in `kubernetes/ingress.yaml` to your actual domain (or add `newsnest.local` to your local `/etc/hosts` pointing at your ingress controller's external IP for local testing), then visit that host in your browser.

```bash
kubectl get ingress newsnest-ingress
kubectl get pods -l app=newsnest
kubectl get svc -l app=newsnest
```

> If you're not using an Ingress controller, you can instead change `frontend-service.yaml`'s `type` to `LoadBalancer` or `NodePort` and set `API_GATEWAY_URL` in `configmap.yaml` to the api-gateway's externally reachable URL.

---

## ⚙️ Environment Variables Reference

| Service            | Variable                | Description                                       |
|---------------------|--------------------------|---------------------------------------------------|
| category-service    | `PORT`                  | Port to listen on (default `4002`)                |
|                      | `ALLOWED_ORIGINS`       | Comma-separated CORS allowlist                     |
| news-service         | `PORT`                  | Port to listen on (default `4001`)                |
|                      | `NEWS_API_KEY`          | Your NewsAPI.org key (**required**, keep secret)   |
|                      | `NEWS_API_BASE_URL`     | Upstream News API base URL                         |
|                      | `CATEGORY_SERVICE_URL`  | Internal URL of category-service                   |
|                      | `CACHE_TTL_MS`          | In-memory cache TTL in ms (default `300000` = 5m)  |
| api-gateway          | `PORT`                  | Port to listen on (default `4000`)                |
|                      | `NEWS_SERVICE_URL`      | Internal URL of news-service                       |
|                      | `CATEGORY_SERVICE_URL`  | Internal URL of category-service                   |
|                      | `API_VERSION`           | API version prefix (default `v1`)                  |
| frontend             | `PORT`                  | Port to listen on (default `8080`)                |
|                      | `API_GATEWAY_URL`       | Full origin of api-gateway, or empty for relative `/api` behind an Ingress |

---

## ✨ Features

- Personalized homepage based on selected interests
- 22 interest categories (UPSC, Government Policies, International Affairs, Technology, AI, Programming, Business, Finance, Economy, Stock Market, Startups, Health, Medical Research, Sports, Cricket, Football, Education, Science, Environment, Space, Cybersecurity, Entertainment)
- Trending, Latest, and "For You" feeds
- Full-text search with debounced live results
- Bookmarking (stored in `localStorage`)
- Article detail pages with related articles and reading-time estimates
- Light/Dark theme toggle
- Responsive design (desktop, tablet, mobile)
- Glassmorphism UI, gradient hero, animated cards, sticky navbar
- Loading skeletons, spinners, toast notifications, offline detection
- Custom 404 page

---

## 🔒 Security

- `helmet` on every backend service
- CORS allowlists per service
- Rate limiting at the API Gateway (and news-service)
- Server-side input validation on required query params
- The News API key never leaves `news-service` and is never exposed to the frontend

---

## ✅ Pre-Deployment Checklist

- [x] No database used anywhere — fully stateless backend
- [x] Only one external News API used (NewsAPI.org), isolated to `news-service`
- [x] Frontend communicates only with `api-gateway`
- [x] Services communicate over internal Docker/Kubernetes networking only
- [x] Every service has its own `Dockerfile`, `.dockerignore`, `.env.example`
- [x] `docker-compose.yml` builds and runs all 4 services with health checks
- [x] Kubernetes manifests cover Deployments, Services, ConfigMap, Secret, and Ingress for all 4 services

---

## 📄 License

MIT — see [LICENSE](./LICENSE).
