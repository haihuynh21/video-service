import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { videos } from './routes/videos';
import { CloudflareEnv } from './types';

const app = new Hono<{ Bindings: CloudflareEnv }>();

app.use('/*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.route('/api/videos', videos);

app.get('/', (c) => c.json({ 
  status: 'ok',
  timestamp: new Date().toISOString(),
  env: {
    hasR2: !!c.env.VIDEO_BUCKET,
    hasDB: !!c.env.DATABASE_URL
  }
}));

export default {
  fetch: app.fetch,
};
