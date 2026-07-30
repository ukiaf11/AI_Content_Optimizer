# AI Content Optimizer — Production Deployment Plan

This guide outlines how to deploy the entire full-stack application for **free** with persistent data storage and system dependencies like `ffmpeg`.

---

## 🏛️ Zero-Cost Production Architecture

1. **Frontend**: **Vercel** (Free Tier)
   - Serves the React SPA on a global CDN.
   - Automatically builds from the `apps/web` directory.
2. **Backend**: **Render** (Free Web Service)
   - Builds our custom Docker container containing `ffmpeg` and host the FastAPI server.
3. **Database**: **Supabase** (Free Postgres Database)
   - Provides a persistent database connection string (relational PostgreSQL).
   - *Why Supabase instead of SQLite?* SQLite databases on Render's free tier are ephemeral and reset whenever the container spins down or restarts. Supabase Postgres provides persistent storage for free.

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Push Code to GitHub
Before starting, push the latest code to your GitHub repository (I have already initialized, staged, and committed all local changes for you):
```bash
git push -u origin main
```

---

### Step 2: Set Up the Persistent Database (Supabase)
1. Go to [Supabase](https://supabase.com) and sign up for a free account.
2. Create a new Project (name it `ai-content-optimizer` or similar).
3. Wait for the database to provision (takes ~1 minute).
4. Go to **Project Settings** -> **Database**.
5. Scroll down to **Connection String**, select **URI**, and copy the string.
   - It will look like: `postgresql://postgres.[username]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
   - *Replace `[password]` with the database password you chose.*

---

### Step 3: Deploy the Backend API (Render)
1. Go to [Render](https://render.com) and log in.
2. Click **New** -> **Web Service**.
3. Link your GitHub account and import the repository `AI_Content_Optimizer`.
4. Configure the service settings:
   - **Name**: `ai-content-optimizer-api`
   - **Region**: Choose the region closest to your audience.
   - **Branch**: `main`
   - **Root Directory**: `apps/api` *(Critical: This directs Render to build from our backend sub-folder)*
   - **Runtime**: `Docker` *(Critical: Render will automatically detect our Dockerfile, installing FFmpeg and setting up Python)*
   - **Instance Type**: `Free`
5. Click **Advanced** and add the following **Environment Variables**:
   - `DATABASE_URL`: Paste the Supabase connection URI from Step 2.
   - `GEMINI_API_KEY`: *(Optional)* Your Gemini or Google AI Studio key. If left blank, the app will run in high-fidelity mock mode.
6. Click **Create Web Service**.
7. Once deployed, Render will provide a public URL (e.g. `https://ai-content-optimizer-api.onrender.com`). **Copy this URL**.

---

### Step 4: Deploy the Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and log in.
2. Click **Add New** -> **Project**.
3. Import the repository `AI_Content_Optimizer`.
4. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `apps/web` *(Click Edit and select apps/web)*
   - Keep build/output settings as default (`npm run build`, `dist`).
5. Open the **Environment Variables** dropdown and add:
   - **Key**: `VITE_API_URL`
   - **Value**: The Render backend URL you copied from Step 3 (e.g., `https://ai-content-optimizer-api.onrender.com`).
6. Click **Deploy**.

🎉 **Your full-stack application is now live on the internet!**
