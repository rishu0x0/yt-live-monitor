// pages/index.tsx
import Link from "next/link";
export default function Home() {
  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif' }}>
      <h1>YT Live Monitor</h1>
      <p>This app monitors a YouTube live stream, stores start time in MongoDB, and can send threaded emails.</p>
      <p><Link href="/dashboard">Open Dashboard</Link></p>
      <p>APIs:</p>
      <ul>
        <li><code>/api/youtube-check</code> - Poll YouTube and auto set start time</li>
        <li><code>/api/starttime</code> - POST (auth) - reset start time & send initial email</li>
        <li><code>/api/time</code> - GET - current elapsed</li>
        <li><code>/api/email-now</code> - POST (auth) - send update email into thread</li>
        <li><code>/api/state</code> - GET - state + events for dashboard</li>
      </ul>
    </div>
  );
}
