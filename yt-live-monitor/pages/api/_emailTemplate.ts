// pages/api/_emailTemplate.ts
export function formatDuration(ms: number) {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
  if (mins > 0) parts.push(`${mins} m`);
  if (hours === 0 && mins === 0) parts.push(`${secs} s`);
  return parts.join(" ");
}
export function buildStreamEmail({ videoId, elapsed, streamUrl, startTime, status }: {
  videoId: string;
  elapsed: string;
  streamUrl: string;
  startTime?: string | null;
  status?: string;
}) {
  return `
<div style="font-family: Arial, sans-serif; line-height:1.4;">
  <h2>Stream ${status === "started" ? "started" : "update"}</h2>
  <p><strong>Video ID:</strong> ${videoId}</p>
  ${startTime ? `<p><strong>Start Time (UTC):</strong> ${startTime}</p>` : ""}
  <p><strong>Elapsed:</strong> ${elapsed}</p>
  <p><a href="${streamUrl}">Open YouTube Live</a></p>
  <hr/>
  <small>Automated by TechWithJoshi live monitor.</small>
</div>
`;
}
