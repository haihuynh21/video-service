import path from 'path';
import fs from 'fs-extra';
import { Video } from '@prisma/client';
import { config } from '../../config/enviroment';
import { VideoRepository } from './video.repository';
import { FfmpegService } from '../ffmpeg/ffmpeg.service';
import { StorageService } from '../storage/storage.service';
import { 
  CreateVideoDto, 
  PaginatedResult, 
  PaginationParams, 
  ProcessVideoResult, 
  VideoCreateInput,
  VideoModel
} from './video.types';

export class VideoService {
  private videoRepository: VideoRepository;
  private ffmpegService: FfmpegService;
  private storageService: StorageService;

  constructor() {
    this.videoRepository = new VideoRepository();
    this.ffmpegService = new FfmpegService();
    this.storageService = new StorageService();
  }

  async getAllVideos(params: PaginationParams): Promise<PaginatedResult<VideoModel>> {
    return this.videoRepository.findAll(params);
  }

  async getVideoById(id: number): Promise<VideoModel | null> {
    return this.videoRepository.findById(id);
  }

  async generateUploadUrls(videoInfo: CreateVideoDto): Promise<{
    uploadUrl: string;
    publicUrl: string;
    key: string;
  }> {
    const key = `videos/${Date.now()}-${videoInfo.filename}`;
    const uploadUrl = await this.storageService.getPresignedUploadUrl(key, videoInfo.mimeType);
    const publicUrl = this.storageService.getPublicUrl(key);

    return {
      uploadUrl,
      publicUrl,
      key
    };
  }

  async processVideo(videoInfo: CreateVideoDto, filePath: string): Promise<ProcessVideoResult> {
    try {
      // Get video metadata
      const metadata = await this.ffmpegService.getVideoMetadata(filePath);
      
      // Generate video key for R2
      const videoKey = `videos/${Date.now()}-${videoInfo.filename}`;
      
      // Upload video to R2
      const videoUpload = await this.storageService.uploadFile({
        filePath,
        key: videoKey,
        contentType: videoInfo.mimeType
      });

      // Create video record in database
      const videoData: VideoCreateInput = {
        filename: videoInfo.filename,
        originalName: videoInfo.originalName,
        url: '',
        streamUrl: '',
        thumbnailUrl: '',
        r2Url: videoUpload.publicUrl,
        r2ThumbnailUrl: '',
        r2HlsUrl: '',
        hlsUrl: '',
        mimeType: videoInfo.mimeType,
        size: videoInfo.size,
        duration: metadata.duration,
        width: metadata.width,
        height: metadata.height,
        bitrate: metadata.bitrate,
        format: metadata.format,
      };

      const video = await this.videoRepository.create(videoData);

      // Clean up local file after successful upload
      await fs.unlink(filePath);

      return {
        localVideo: video,
        r2Url: videoUpload.publicUrl,
        r2ThumbnailUrl: '',
        r2HlsUrl: '',
        uploadUrl: '' // Not needed since we're uploading directly
      };
    } catch (error) {
      // Clean up on error
      try {
        await fs.unlink(filePath);
      } catch (e) {
        console.error('Error cleaning up file:', e);
      }
      throw error;
    }
  }

  async deleteVideo(id: number): Promise<void> {
    try {
      const video = await this.videoRepository.findById(id);
      if (!video) {
        throw new Error('Video not found');
      }
      
      // Delete local files
      if (video.filename) {
        const videoPath = path.join(config.dirs.videos, video.filename);
        if (fs.existsSync(videoPath)) {
          await fs.unlink(videoPath);
        }
      }
      
      // Delete local thumbnail
      if (video.thumbnailUrl) {
        const thumbnailPath = path.join(process.cwd(), video.thumbnailUrl.replace(/^\//, ''));
        if (fs.existsSync(thumbnailPath)) {
          await fs.unlink(thumbnailPath);
        }
      }
      
      // Delete local HLS directory
      if (video.hlsUrl) {
        const hlsPath = path.join(config.dirs.hls, id.toString());
        if (fs.existsSync(hlsPath)) {
          await fs.remove(hlsPath);
        }
      }
      
      // Delete R2 objects
      if (video.r2Url) {
        const videoKey = `videos/${video.id}/${video.filename}`;
        await this.storageService.deleteFile(videoKey);
      }
      
      if (video.r2ThumbnailUrl) {
        const thumbnailName = `${path.parse(video.filename).name}.jpg`;
        const thumbnailKey = `thumbnails/${video.id}/${thumbnailName}`;
        await this.storageService.deleteFile(thumbnailKey);
      }
      
      if (video.r2HlsUrl) {
        // We need to delete all HLS files
        const hlsKey = `hls/${video.id}`;
        // This would require listing and deleting all files with this prefix
        // For simplicity, we'd need to implement a deletePrefix method in the StorageService
      }
      
      // Delete from database
      await this.videoRepository.delete(id);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error(`Failed to delete video: ${(error as Error).message}`);
    }
  }
}