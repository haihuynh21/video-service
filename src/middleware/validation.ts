import { Context, Next } from 'hono';

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

function isFile(value: unknown): value is File {
  return (
    value !== null &&
    typeof value === 'object' &&
    'size' in value &&
    'type' in value &&
    'name' in value
  );
}

export async function validateVideoUpload(c: Context, next: Next) {
  const formData = await c.req.formData();
  const videoFile = formData.get('video');

  if (!videoFile || !isFile(videoFile)) {
    return c.json({ error: 'No video file provided' }, 400);
  }

  if (!ALLOWED_TYPES.includes(videoFile.type)) {
    return c.json({ error: 'Invalid file type' }, 400);
  }

  if (videoFile.size > MAX_FILE_SIZE) {
    return c.json({ error: 'File too large' }, 400);
  }

  c.set('videoFile', videoFile);
  await next();
}

export async function validateUpdateVideo(c: Context, next: Next) {
  const body = await c.req.json();
  if (!body) {
    return c.json({ error: 'Request body required' }, 400);
  }
  
  await next();
}
