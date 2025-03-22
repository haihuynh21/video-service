import { Prisma, } from '@prisma/client';

// Sử dụng Prisma generated type thay vì import Video trực tiếp
export type VideoModel = Prisma.VideoGetPayload<{}>;

export type VideoCreateInput = Prisma.VideoCreateInput;

export interface CreateVideoDto {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface VideoMetadataDto {
  duration: number;
  width: number;
  height: number;
  bitrate: number;
  format: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ProcessVideoResult {
  localVideo: VideoModel;
  r2Url: string;
  r2ThumbnailUrl: string;
  r2HlsUrl: string;
  uploadUrl: string; // Add presigned upload URL
}