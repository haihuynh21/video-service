import { Router } from 'express';
import { VideoController } from '../modules/video/video.controller';
import { uploadMiddleware } from '../middlewares/upload.middleware';

const router = Router();
const videoController = new VideoController();

// Get all videos with pagination
router.get('/', (req, res) => videoController.getAllVideos(req, res));

// Get video by ID
router.get('/:id', (req, res) => videoController.getVideoById(req, res));

// Upload new video
router.post('/', uploadMiddleware, (req, res) => videoController.uploadVideo(req, res));

// Upload new video
router.post('/upload', uploadMiddleware, (req, res) => videoController.uploadVideo(req, res));

// Delete video
router.delete('/:id', (req, res) => videoController.deleteVideo(req, res));

// Stream video
router.get('/stream/:filename', (req, res) => videoController.streamVideo(req, res));

export default router;