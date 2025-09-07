// pages/dashboard.tsx
import React, { useEffect, useState } from "react";
type Event = {
  _id?: any;
  videoId: string;
  type: string;
  messageId?: string;
  subject?: string;
  timestamp: string;
  meta?: any;
};
export default function Dashboard() {
  const [state, setState] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [timeObj, setTimeObj] = useState<{ running: boolean; startTime?: string; elapsed?: string } | null>(null);
  async function fetchState() {
    const r = await fetch("/api/state");
    const j = await r.json();
    setState(j.state);
    setEvents(j.events || []);
  }
  async function fetchTime() {
    const r = await fetch("/api/time");
    const j = await r.json();
    setTimeObj(j);
  }
  useEffect(() => {
    fetchState();
    fetchTime();
    const i1 = setInterval(fetchTime, 5000);
    const i2 = setInterval(fetchState, 15000);
    return () => { clearInterval(i1); clearInterval(i2); };
  }, []);
  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", padding: 20 }}>
      <h1>Live Monitor Dashboard</h1>
      <section style={{ marginBottom: 20 }}>
        <h3>Stream State</h3>
        {state ? (
          <div>
            <p><strong>Video ID:</strong> {state.videoId}</p>
            <p><strong>Start Time:</strong> {state.startTime ?? "not set"}</p>
            <p><strong>Thread Message-ID:</strong> {state.threadMessageId ?? "none"}</p>
            <p><strong>Updated At:</strong> {state.updatedAt}</p>
          </div>
        ) : <p>Loading state...</p>}
      </section>
      <section style={{ marginBottom: 20 }}>
        <h3>Live Elapsed</h3>
        {timeObj ? (
          timeObj.running ? <p style={{ fontSize: 20 }}>{timeObj.elapsed} (since {new Date(timeObj.startTime!).toLocaleString()})</p> : <p>Not running</p>
        ) : <p>Loading...</p>}
      </section>
      <section>
        <h3>Events (most recent)</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>When</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Type</th>
              <th style={{ borderBottom: "1px solid #ddd", textAlign: "left", padding: 8 }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan={3} style={{ padding: 8 }}>No events yet</td></tr>
            ) : events.map((e, i) => (
              <tr key={i}>
                <td style={{ padding: 8, borderBottom: "1px solid #f1f1f1" }}>{new Date(e.timestamp).toLocaleString()}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f1f1f1" }}>{e.type}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f1f1f1" }}>
                  {e.subject && <div><strong>{e.subject}</strong></div>}
                  {e.messageId && <div>msg: {e.messageId}</div>}
                  <div>{e.meta ? JSON.stringify(e.meta) : null}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
