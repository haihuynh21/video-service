import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { VideoService } from './video.service';
import { config } from '../../config/enviroment';
import { PaginationParams } from './video.types';

export class VideoController {
  private videoService: VideoService;

  constructor() {
    this.videoService = new VideoService();
  }

  async getAllVideos(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const paginationParams: PaginationParams = { page, limit };
      const result = await this.videoService.getAllVideos(paginationParams);
      
      res.json({
        videos: result.items,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ error: 'Error fetching videos' });
    }
  }

  async getVideoById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const video = await this.videoService.getVideoById(id);
      
      if (!video) {
        res.status(404).json({ error: 'Video not found' });
        return;
      }
      
      res.json(video);
    } catch (error) {
      console.error('Error fetching video:', error);
      res.status(500).json({ error: 'Error fetching video' });
    }
  }

  async uploadVideo(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const videoInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };

      const result = await this.videoService.processVideo(videoInfo, req.file.path);

      res.json({
        message: 'Video uploaded successfully',
        video: {
          id: result.localVideo.id,
          filename: result.localVideo.filename,
          r2Url: result.r2Url,
          r2ThumbnailUrl: result.r2ThumbnailUrl,
          r2HlsUrl: result.r2HlsUrl
        }
      });
    } catch (error) {
      console.error('Error processing video upload:', error);
      res.status(500).json({ 
        error: 'Error uploading video',
        details: (error as Error).message 
      });
    }
  }

  async deleteVideo(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await this.videoService.deleteVideo(id);
      
      res.json({ message: 'Video deleted successfully' });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ error: `Error deleting video: ${(error as Error).message}` });
    }
  }

  async streamVideo(req: Request, res: Response): Promise<void> {
    try {
      const filename = req.params.filename;
      const videoPath = path.join(config.dirs.videos, filename);
      
      // Check if file exists
      if (!fs.existsSync(videoPath)) {
        res.status(404).send('Video not found');
        return;
      }
      
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;
      
      if (range) {
        // Parse Range header
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        
        // Calculate chunk size
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        
        // Set headers for partial content
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4'
        });
        
        // Stream the chunk
        file.pipe(res);
      } else {
        // If no range header, send the entire file
        res.writeHead(200, {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4'
        });
        fs.createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      console.error('Error streaming video:', error);
      res.status(500).send('Error streaming video');
    }
  }
}