import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs-extra';
import { VideoMetadata } from './ffmpeg.types';

export class FfmpegService {
  /**
   * Extract metadata from a video file
   */
  async getVideoMetadata(filePath: string): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
          return;
        }
        
        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
        
        resolve({
          format: metadata.format.format_name || '',
          duration: metadata.format.duration || 0,
          width: videoStream?.width || 0,
          height: videoStream?.height || 0,
          bitrate: parseInt(String(metadata.format.bit_rate || '0'), 10),
        });
      });
    });
  }

  /**
   * Generate thumbnail from video
   */
  async generateThumbnail(videoPath: string, thumbnailPath: string, options = { size: '320x240' }): Promise<string> {
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on('error', (err) => {
          console.error('Error generating thumbnail:', err);
          reject(err);
        })
        .on('end', () => {
          resolve(thumbnailPath);
        })
        .screenshots({
          count: 1,
          folder: path.dirname(thumbnailPath),
          filename: path.basename(thumbnailPath),
          size: options.size
        });
    });
  }

  /**
   * Generate HLS segments for streaming
   */
  async generateHLS(videoPath: string, outputDir: string, videoId: number): Promise<string> {
    const hlsOutputDir = path.join(outputDir, videoId.toString());
    fs.ensureDirSync(hlsOutputDir);
    
    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          '-profile:v baseline',
          '-level 3.0',
          '-start_number 0',
          '-hls_time 10',          // 10 second segments
          '-hls_list_size 0',      // Keep all segments in the playlist
          '-f hls'                 // HLS format
        ])
        .output(path.join(hlsOutputDir, 'playlist.m3u8'))
        .on('end', () => {
          resolve(`/hls/${videoId}/playlist.m3u8`);
        })
        .on('error', (err) => {
          console.error('Error generating HLS:', err);
          reject(err);
        })
        .run();
    });
  }
}