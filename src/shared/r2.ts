import { R2Bucket, R2Object } from '@cloudflare/workers-types';
import { config } from './config';

export async function uploadToR2(
  bucket: R2Bucket,
  key: string,
  data: ArrayBuffer,
  contentType: string
): Promise<string> {
  if (!bucket) throw new Error('R2 bucket not configured');
  
  await bucket.put(key, data, {
    httpMetadata: { contentType }
  });
  
  return `${config.r2.videosPrefix}${key}`;
}

export async function deleteFromR2(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key);
}

export async function getR2Object(bucket: R2Bucket, key: string): Promise<R2Object | null> {
  return bucket.get(key);
}
