import { R2Bucket } from '@cloudflare/workers-types';

export interface CloudflareEnv {
  VIDEO_BUCKET: R2Bucket;
  DATABASE_URL: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_ACCESS_KEY_ID: string;
  CLOUDFLARE_SECRET_ACCESS_KEY: string;
  CLOUDFLARE_R2_BUCKET: string;
  CLOUDFLARE_R2_PUBLIC_URL: string;
  NODE_ENV?: string;
  ENVIRONMENT?: string;
}
