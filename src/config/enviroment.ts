import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs-extra';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_ACCESS_KEY_ID',
  'CLOUDFLARE_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET',
  'CLOUDFLARE_R2_PUBLIC_URL'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Ensure directories exist
const dirs = {
  videos: path.join(process.cwd(), 'videos'),
  thumbnails: path.join(process.cwd(), 'thumbnails'),
  hls: path.join(process.cwd(), 'hls')
};

// Create directories if they don't exist
Object.values(dirs).forEach(dir => fs.ensureDirSync(dir));

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  dirs,
  fileUpload: {
    maxSize: 5000000000, // 5GB limit
    allowedTypes: /mp4|mkv|avi|mov|wmv/,
  },
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
    bucketName: process.env.CLOUDFLARE_R2_BUCKET!,
    publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL!
  }
};