import { Hono } from 'hono';
import { videos } from './video.routes';

const app = new Hono();
app.route('/api/videos', videos);

export { app };