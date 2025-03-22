import { PrismaClient } from '@prisma/client';
import { VideoModel, PaginatedResult, PaginationParams, VideoCreateInput } from './video.types';

export class VideoRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(params: PaginationParams): Promise<PaginatedResult<VideoModel>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    
    const [videos, total] = await Promise.all([
      this.prisma.video.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.video.count()
    ]);
    
    return {
      items: videos,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: number): Promise<VideoModel | null> {
    return this.prisma.video.findUnique({
      where: { id }
    });
  }

  async create(data: VideoCreateInput): Promise<VideoModel> {
    return this.prisma.video.create({
      data
    });
  }

  async update(id: number, data: Partial<VideoCreateInput>): Promise<VideoModel> {
    return this.prisma.video.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<VideoModel> {
    return this.prisma.video.delete({
      where: { id }
    });
  }

  async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}