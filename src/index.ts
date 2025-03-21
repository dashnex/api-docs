export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      const asset = await env.ASSETS.fetch(request);
      
      if (asset.status === 404) {
        // If the asset is not found, try serving index.html for SPA-like behavior
        if (!url.pathname.includes('.')) {
          return env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
        }
      }
      
      return asset;
    } catch (error) {
      if (error instanceof Error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
      }
      return new Response('Internal Server Error', { status: 500 });
    }
  },
} 