import { 
    PutObjectCommand, 
    GetObjectCommand, 
    DeleteObjectCommand 
  } from '@aws-sdk/client-s3';
  import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
  import fs from 'fs-extra';
  import path from 'path';
  import { r2Client } from '../../config/cloudflare';
  import { config } from '../../config/enviroment';
  import { StorageUploadParams, StorageUploadResult } from './storage.types';
  
  export class StorageService {
    private readonly bucketName: string;
    private readonly publicUrl: string;
  
    constructor() {
      this.bucketName = config.cloudflare.bucketName;
      // Use R2.dev URL from config
      this.publicUrl = config.cloudflare.publicUrl;
    }
  
    /**
     * Upload a file to Cloudflare R2
     */
    async uploadFile(params: StorageUploadParams): Promise<StorageUploadResult> {
      try {
        const { filePath, key, contentType } = params;
        
        // Create readable stream from file
        const fileStream = fs.createReadStream(filePath);
        
        const uploadCommand = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: fileStream,
          ContentType: contentType,
        });
  
        await r2Client.send(uploadCommand);
        
        // Return R2 public URL
        const publicUrl = `${this.publicUrl}/${key}`;
        
        return {
          r2Key: key,
          publicUrl,
        };
      } catch (error) {
        console.error('Error uploading to R2:', error);
        throw new Error(`R2 upload failed: ${(error as Error).message}`);
      }
    }
  
    /**
     * Generate a signed URL for a file in R2
     */
    async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
      try {
        const command = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
        
        return await getSignedUrl(r2Client, command, { expiresIn });
      } catch (error) {
        console.error('Error generating signed URL:', error);
        throw new Error(`Failed to generate signed URL: ${(error as Error).message}`);
      }
    }

    /**
     * Generate presigned URL for upload
     */
    async getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
      try {
        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          ContentType: contentType
        });
        
        const url = await getSignedUrl(r2Client, command, { expiresIn });
        return url;
      } catch (error) {
        console.error('Error generating presigned upload URL:', error);
        throw new Error(`Failed to generate presigned upload URL: ${(error as Error).message}`);
      }
    }

    /**
     * Get public URL for a file using R2.dev domain
     */
    getPublicUrl(key: string): string {
      // Public URL will be in format:
      // https://pub-dafea69342db4ec593c6d0d001af4f41.r2.dev/videos/filename.mp4
      return `${this.publicUrl}/${key}`;
    }
  
    /**
     * Delete a file from R2
     */
    async deleteFile(key: string): Promise<void> {
      try {
        const command = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
        
        await r2Client.send(command);
      } catch (error) {
        console.error('Error deleting file from R2:', error);
        throw new Error(`Failed to delete file from R2: ${(error as Error).message}`);
      }
    }
  
    /**
     * Upload a directory to R2
     */
    async uploadDirectory(dirPath: string, r2Prefix: string): Promise<string[]> {
      const files = await fs.readdir(dirPath);
      const uploadPromises = files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory()) {
          return this.uploadDirectory(filePath, `${r2Prefix}/${file}`);
        } else {
          const key = `${r2Prefix}/${file}`;
          const contentType = this.getContentType(file);
          await this.uploadFile({ filePath, key, contentType });
          return key;
        }
      });
  
      const results = await Promise.all(uploadPromises);
      return results.flat();
    }
  
    /**
     * Get content type based on file extension
     */
    private getContentType(filename: string): string {
      const ext = path.extname(filename).toLowerCase();
      const contentTypes: Record<string, string> = {
        '.mp4': 'video/mp4',
        '.mkv': 'video/x-matroska',
        '.avi': 'video/x-msvideo',
        '.mov': 'video/quicktime',
        '.wmv': 'video/x-ms-wmv',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.m3u8': 'application/vnd.apple.mpegurl',
        '.ts': 'video/mp2t',
      };
      
      return contentTypes[ext] || 'application/octet-stream';
    }
  }