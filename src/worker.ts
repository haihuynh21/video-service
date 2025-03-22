/// <reference types="@cloudflare/workers-types" />

interface Env {
  DATABASE_URL: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_ACCESS_KEY_ID: string;
  CLOUDFLARE_SECRET_ACCESS_KEY: string;
  CLOUDFLARE_R2_BUCKET: string;
  CLOUDFLARE_R2_PUBLIC_URL: string;
  VIDEO_BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // Worker logic here
      return new Response('Worker is running', {
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (error) {
      return new Response('Error in worker', { status: 500 });
    }
  }
};
