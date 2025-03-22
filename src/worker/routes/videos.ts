import { Hono } from 'hono';
import type { CloudflareEnv } from '../types';

const videos = new Hono<{ Bindings: CloudflareEnv }>();

videos.get('/', async (c) => {
  return c.json({ videos: [] });
});

videos.post('/', async (c) => {
  const { VIDEO_BUCKET } = c.env;
  // Handle video upload
  return c.json({ message: 'Upload endpoint' });
});

export { videos };
