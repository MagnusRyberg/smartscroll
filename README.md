SmartScroll — New SPA for Azure Static Web Apps

This folder contains a minimal single-page application (`app/`) and Azure Functions (`api/`) intended for deployment to Azure Static Web Apps.

Quick start (local)

1. Install dependencies for the functions (from repo root):

```bash
cd new-app
npm install
```

2a. Serve the static app locally on port 8080:

```bash
npm start
# then open http://localhost:8080
```

2b. (Optional) Use Azure Static Web Apps CLI to run both app and functions locally (requires `@azure/static-web-apps-cli`):

```bash
npx swa-cli@latest start ./app --api ./api
```

Deployment (Azure Static Web Apps)

- Point the Static Web App to the `new-app` folder as the repository root (or move files to repo root). Set the app artifact location to `app` and API location to `api`.

GitHub Actions (CI/CD)

This repository includes a GitHub Actions workflow that deploys the app to Azure Static Web Apps on pushes to `main`.

How to configure:

1. Create an Azure Static Web App in the Azure Portal and connect it to this GitHub repository.
2. In the Static Web App's Deployment Center, you can create a deployment token (API token) or use the publish profile.
3. In your GitHub repo settings, add a secret named `AZURE_STATIC_WEB_APPS_API_TOKEN` with the token value.
4. The included workflow will run on push to `main` and deploy the repository root as the app location.

Notes:
- This repo is a simple static SPA with `index.html` at the root; there is no build step by default. If you add a build step (for example with a framework that outputs to `build` or `dist`), update the workflow's `output_location` accordingly.
- If you prefer Azure App Service instead of Static Web Apps, see `AZURE_DEPLOYMENT.md` for App Service guidance.

Notes
- The `api/` functions use `axios` to call Wikipedia REST API; they are written as Azure Functions (JavaScript) and expect to be deployed behind Azure Static Web Apps which maps `/api/*` to them.



# Purpose of the app:
Purpose — short
SmartScroll is a lightweight, mobile‑first feed app that shows random Wikipedia articles as a swipe/scrollable feed. It’s designed to give quick, readable article summaries in a dark, card‑style UI and let users open full articles on Wikipedia.

What it does (features)
Fetches random article summaries from Wikipedia and displays them as cards.
Infinite scroll (loads more when you reach the bottom) and a “load more” fallback.
Each card shows a thumbnail (if available), title, short extract and a link to the full article.
Dark, mobile‑friendly UI with a compact card layout and loading/error states.
Two deployment patterns supported:
Static SPA + Azure Functions (serverless) under api — recommended for Azure Static Web Apps.
Local Express server option (archived under old) for running backend + static together.
