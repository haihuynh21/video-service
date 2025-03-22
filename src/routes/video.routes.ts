import { Hono } from 'hono';
import { VideoService } from '../modules/videos/video.service';
import { CloudflareEnv } from '../modules/videos/video.types';

export const videos = new Hono<{ Bindings: CloudflareEnv }>();

videos.get('/', async (c) => {
  const page = Number(c.req.query('page')) || 1;
  const limit = Number(c.req.query('limit')) || 10;
  const videoService = new VideoService(c.env);
  
  const result = await videoService.getAllVideos({ page, limit });
  return c.json({
    videos: result.items,
    pagination: result.pagination
  });
});

videos.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const videoService = new VideoService(c.env);
  
  const video = await videoService.getVideoById(id);
  if (!video) {
    return c.json({ error: 'Video not found' }, 404);
  }
  
  return c.json(video);
});

// Add type guard
interface VideoFile extends File {
  name: string;
  size: number;
  type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
}

function isVideoFile(value: unknown): value is VideoFile {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'size' in value &&
    'type' in value &&
    'arrayBuffer' in value
  );
}

// POST handler với file upload
videos.post('/', async (c) => {
  const formData = await c.req.formData();
  const file = formData.get('video') as unknown;
  
  if (!file || !isVideoFile(file)) {
    return c.json({ error: 'No valid file uploaded' }, 400);
  }

  const videoService = new VideoService(c.env);
  const videoInfo = {
    filename: file.name,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url: '' // Will be set by service
  };

  const video = await videoService.uploadVideo(videoInfo, file);
  return c.json({ message: 'Video uploaded successfully', video });
});