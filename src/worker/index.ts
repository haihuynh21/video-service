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
      return new Response(JSON.stringify({
        status: 'ok',
        message: 'Worker is running',
        env: {
          hasDatabase: !!env.DATABASE_URL,
          hasR2: !!env.VIDEO_BUCKET
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response('Error in worker', { status: 500 });
    }
  }
};