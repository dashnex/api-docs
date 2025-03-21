export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      
      // Handle /docs path specifically
      if (url.pathname.startsWith('/docs')) {
        // If it's exactly /docs, serve index.html
        if (url.pathname === '/docs') {
          const indexRequest = new Request(`${url.origin}/index.html`, {
            method: request.method,
            headers: request.headers,
          });
          const response = await env.ASSETS.fetch(indexRequest);
          return new Response(response.body, {
            status: 200,
            headers: {
              'Content-Type': 'text/html',
              ...Object.fromEntries(response.headers),
            },
          });
        }
        
        // If it's a JSON file request, serve it directly
        if (url.pathname.endsWith('.json')) {
          const jsonRequest = new Request(`${url.origin}${url.pathname.replace('/docs', '')}`, {
            method: request.method,
            headers: request.headers,
          });
          const response = await env.ASSETS.fetch(jsonRequest);
          return new Response(response.body, {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...Object.fromEntries(response.headers),
            },
          });
        }
      }
      
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