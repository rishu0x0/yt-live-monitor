# YT Live Monitor
Next.js app to monitor a YouTube live stream, persist start-time in MongoDB,
send threaded emails, and show a dashboard.
## Setup
1. Clone repo
2. Install: `npm install`
3. Create env vars (see list below)
4. Run locally: `npm run dev`
## Env vars
production:
Set the following in `.env.local` for local dev or in the Vercel dashboard for
- MONGODB_URI
- MONGODB_DB (optional)
- MONGODB_COLLECTION (optional)
- MONGODB_EVENTS_COLL (optional)
- YT_API_KEY
- YT_VIDEO_ID
- AUTH_TOKEN
- SMTP_HOST
- SMTP_PORT
- SMTP_USER
- SMTP_PASS
- FROM_EMAIL
- TO_EMAILS
- APP_BASE_URL
## Deploy
Push to GitHub and connect to Vercel. Add env vars in the Vercel dashboard.
Optionally set up a cron to hit `/api/youtube-check` every minute.
