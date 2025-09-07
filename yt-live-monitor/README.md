# YT Live Monitor

Next.js app to monitor a YouTube live stream, persist start-time in MongoDB, send threaded emails, and show a dashboard.

## Setup
1. Clone repo
2. Install: `npm install`
3. Create env vars (see list below)
4. Run locally: `npm run dev`

## Env vars
Set the following in `.env.local` for local dev or in Vercel dashboard for production:
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
Push to GitHub and connect to Vercel. Add env vars in Vercel dashboard.
Optionally set up a cron to hit `/api/youtube-check` every minute.

### Quick Git commands to create the repo and push to GitHub
```sh
# in your projects folder
mkdir yt-live-monitor && cd yt-live-monitor
# create files with content from this doc (or paste into editor)
git init
git add .
git commit -m "Initial commit - YT Live Monitor"
# create repo on GitHub (replace USER/REPO) OR use gh cli:
# gh repo create yourusername/yt-live-monitor --public --source=. --remote=origin --push
git remote add origin https://github.com/<your-username>/yt-live-monitor.git
git branch -M main
git push -u origin main
```
If you have GitHub CLI, gh repo create will automate repo creation and push.

### Connect to Vercel
1. In Vercel → New Project → Import Git Repository → choose this repo.
2. Configure Environment Variables in Vercel (paste same env vars).
3. Deploy.
4. (Optional) Create a Vercel Cron Job or use GitHub Actions to poll `/api/youtube-check` every minute.

## Final notes
- After deployment, open `https://<your-vercel>.vercel.app/dashboard` to see the dashboard.
- Test endpoints with curl (examples in README). Make sure AUTH_TOKEN is used for protected endpoints.
