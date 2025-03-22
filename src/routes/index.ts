import { Router } from 'express';
import videoRoutes from './video.routes';

const router = Router();

router.use('/api/videos', videoRoutes);

export default router;