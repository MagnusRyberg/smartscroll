# Azure Static Web Apps CI/CD

This application is configured for deployment to Azure Static Web Apps.

## Deployment Options

### Option 1: Azure Static Web Apps (Recommended)

1. **Create Azure Static Web App** in Azure Portal
2. **Connect GitHub repository**
3. **Configure build settings:**
   - Build command: `npm run build`
   - Output location: `client/build`
   - API location: `server` (optional)

### Option 2: Azure App Service

1. **Create Web App** in Azure Portal
2. **Configure deployment source** (GitHub/GitLab/Azure DevOps)
3. **Set startup command:** `npm start`

### Option 3: Vercel (Alternative)

If you prefer Vercel over Azure:

1. **Connect GitHub repository** to Vercel
2. **Configure build settings:**
   - Build command: `npm run build`
   - Output directory: `client/build`
   - Install command: `npm run install-all`

## Environment Variables

No environment variables are required for basic functionality.

## Local Development

```bash
npm run install-all  # Install all dependencies
npm run dev         # Build and start development server
```

## Production Build

```bash
npm run build       # Build React app
npm start          # Start production server
```

The app will be available at the Azure domain once deployed.