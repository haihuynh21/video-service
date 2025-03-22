/// <reference types="@cloudflare/workers-types" />

interface Env {
  DATABASE_URL: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_ACCESS_KEY_ID: string;
  CLOUDFLARE_SECRET_ACCESS_KEY: string;
  CLOUDFLARE_R2_BUCKET: string;
  CLOUDFLARE_R2_PUBLIC_URL: string;
  VIDEO_BUCKET: R2Bucket;
  __STATIC_CONTENT: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // Serve static assets
      if (!url.pathname.startsWith('/api')) {
        const asset = await env.__STATIC_CONTENT.get(url.pathname);
        if (asset) {
          const metadata = await env.__STATIC_CONTENT.get(url.pathname + '.metadata');
          const manifest = metadata ? JSON.parse(metadata) as { contentType: string } : null;
          
          const headers = new Headers({
            'content-type': manifest?.contentType || 'text/plain',
            'cache-control': 'public, max-age=31536000',
          });
          return new Response(asset, { headers });
        }
      }

      // API endpoints
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
