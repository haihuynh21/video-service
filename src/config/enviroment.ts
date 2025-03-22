import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs-extra';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const isProduction = process.env.NODE_ENV === 'production';

// Default values for local development
const defaultConfig = {
  port: 3000,
  databaseUrl: 'postgresql://localhost:5432/video_service',
  cloudflare: {
    accountId: 'local',
    accessKeyId: 'local',
    secretAccessKey: 'local',
    bucketName: 'local-bucket',
    publicUrl: 'http://localhost:3000'
  }
};

// Production config from environment variables
const productionConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL!,
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
    bucketName: process.env.CLOUDFLARE_R2_BUCKET!,
    publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL!
  }
};

// Use production or default config based on environment
export const config = isProduction ? productionConfig : defaultConfig;

// Ensure required directories exist for local development
if (!isProduction) {
  const dirs = {
    uploads: path.join(process.cwd(), 'uploads'),
    videos: path.join(process.cwd(), 'videos'),
    thumbnails: path.join(process.cwd(), 'thumbnails'),
    hls: path.join(process.cwd(), 'hls')
  };

  Object.values(dirs).forEach(dir => fs.ensureDirSync(dir));
}