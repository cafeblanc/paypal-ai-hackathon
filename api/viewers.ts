import type { IncomingMessage, ServerResponse } from 'http';

// In-memory active presence map across warm serverless invocations
// Map<sessionId, lastSeenTimestamp>
const activeViewers = new Map<string, number>();

export default function handler(req: IncomingMessage & { query?: Record<string, string>, body?: any }, res: ServerResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = new URL(req.url || '', 'http://localhost');
  const now = Date.now();
  const id = url.searchParams.get('id');
  const action = url.searchParams.get('action');

  if (id) {
    if (action === 'leave') {
      activeViewers.delete(id);
    } else {
      activeViewers.set(id, now);
    }
  }

  // Prune inactive sessions older than 7 seconds (handles closed tabs, mobile app switches, network disconnects)
  for (const [vId, timestamp] of activeViewers.entries()) {
    if (now - timestamp > 7000) {
      activeViewers.delete(vId);
    }
  }

  const count = Math.max(1, activeViewers.size);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.end(JSON.stringify({ count, success: true, timestamp: now }));
}
