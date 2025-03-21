# Swagger UI on Cloudflare Workers

This project deploys a Swagger UI interface using Cloudflare Workers, serving your OpenAPI/Swagger documentation with a modern, responsive UI.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Cloudflare account
- Wrangler CLI (installed via npm)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Login to Cloudflare (if not already logged in):
   ```bash
   npx wrangler login
   ```

## Development

To run the project locally:

```bash
npm run dev
```

This will start a local development server, typically at `http://localhost:8787`.

## Deployment

To deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Project Structure

- `public/` - Contains static assets (index.html and swagger.json)
- `src/` - Contains the Worker code
- `wrangler.toml` - Cloudflare Workers configuration
- `tsconfig.json` - TypeScript configuration

## Customization

To update the Swagger documentation, replace the `public/swagger.json` file with your own OpenAPI/Swagger specification. 