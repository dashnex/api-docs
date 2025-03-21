# Swagger UI on Cloudflare Workers for DashNex.com API

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

1. Clone the repository:
   ```bash
   git clone https://github.com/dashnex/api-docs
   cd api-docs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

The development server will start at `http://localhost:8787` by default. Any changes you make to the code will automatically trigger a reload of the development server.

Note: If port 8787 is already in use, Wrangler will automatically select the next available port.

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

To update the Swagger documentation, add the `public/*.json` file with your own OpenAPI/Swagger specification and update `public/index.html`.  