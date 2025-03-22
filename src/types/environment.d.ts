/// <reference types="@cloudflare/workers-types" />

declare global {
  interface Env {
    VIDEO_BUCKET: R2Bucket;
    CLOUDFLARE_R2_BUCKET: string;
    CLOUDFLARE_R2_PUBLIC_URL: string;
  }
}

export {};
