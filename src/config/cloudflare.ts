import { S3Client } from '@aws-sdk/client-s3';
import { config } from './enviroment';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.cloudflare.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.cloudflare.accessKeyId,
    secretAccessKey: config.cloudflare.secretAccessKey,
  },
});