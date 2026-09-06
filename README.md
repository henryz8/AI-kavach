# CyberShield AI Frontend

A working React + Vite + Tailwind CSS dashboard inspired by the visual language of the supplied Dribbble card UI reference, adapted for an AI cybersecurity threat-detection product.

## Features

- Responsive dark cybersecurity dashboard
- Card-based SaaS UI
- Sidebar navigation
- Threat statistics
- Threat activity area chart
- Risk distribution donut chart
- Search/filter recent threats
- Phishing / ATO / impersonation cards
- AI recommendation panel
- Action buttons with toast feedback
- Mobile sidebar
- Supabase Google and GitHub OAuth
- Local demo login and registration fallback

## Run in VS Code

### 1. Install Node.js

Use a current LTS version of Node.js.

### 2. Open the project

Open this folder in VS Code.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite, normally:

http://localhost:5173

### 5. Production build

```bash
npm run build
npm run preview
```

## Enable Supabase social auth

1. In the Supabase dashboard, open **Project Settings > API** and copy the project URL and publishable anon key.
2. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. In **Authentication > Providers**, enable **Google** and/or **GitHub** and enter the OAuth credentials from those providers.
4. In **Authentication > URL Configuration**, add `http://localhost:5173` to the allowed redirect URLs for local development. Add the deployed frontend URL there before production use.
5. Restart Vite after changing `.env.local`.

The login screen uses Supabase OAuth for Google and GitHub. After the provider redirects back, Supabase restores the session automatically. The local demo login and registration remain available when Supabase variables are not configured.

## Connect your FastAPI backend later

The current dashboard uses demo data. Replace the demo arrays in `src/main.jsx` with API calls such as:

- `GET /api/dashboard/statistics`
- `GET /api/threats`
- `GET /api/incidents`
- `POST /api/analyze/url`
- `POST /api/analyze/email`
- `POST /api/response/block-url`
- `POST /api/response/quarantine`
- `POST /api/response/revoke-session`

Keep the frontend and backend on separate ports during development, for example:

- Frontend: `http://localhost:5173`
- FastAPI: `http://localhost:8000`
