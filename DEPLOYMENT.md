# Vercel Deployment Guide

## Deploy to Vercel

1. **Push your code to GitHub** (already done)
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your `Pipeline-Builder` repository
   - Vercel will automatically detect the configuration from `vercel.json`
   - Click "Deploy"

## Environment Variables

No environment variables are needed for this deployment as the API uses relative paths.

## Project Structure for Vercel

- `frontend/` - React application (builds to `frontend/build`)
- `api/` - Serverless functions for backend API
- `vercel.json` - Deployment configuration

## API Endpoints

In production, the API will be available at:
- `https://your-app.vercel.app/api/pipelines/parse` - POST endpoint for pipeline parsing

## Local Development

For local development, continue using:
- Frontend: `cd frontend && npm start` (runs on localhost:3000)
- Backend: `cd backend && uvicorn main:app --reload` (runs on localhost:8000)

The frontend automatically detects the environment and uses the appropriate API URL.
