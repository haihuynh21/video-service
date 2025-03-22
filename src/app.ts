import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/enviroment';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/videos', express.static(config.dirs.videos));
app.use('/thumbnails', express.static(config.dirs.thumbnails));
app.use('/hls', express.static(config.dirs.hls));

// Routes
app.use(routes);

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Custom error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;