# Video Service

A video processing service using Cloudflare Workers and R2 storage.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup local environment:
- Copy `.env.local` from `.env.local.example`
- Install and start PostgreSQL
- Create database: `video_service`
- For Windows users: Install cross-env: `npm install -D cross-env`

3. Setup database:
```bash
npm run db:migrate
```

## Development

Run locally:
```bash 
npm run dev:local
```

Run with Wrangler:
```bash
npm run dev
```

## Production

1. Setup Cloudflare:
- Create R2 bucket
- Configure Worker
- Set environment variables

2. Deploy:
```bash
npm run deploy
```

## Environment Variables

Required variables in production:
- `DATABASE_URL`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ACCESS_KEY_ID` 
- `CLOUDFLARE_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET`
- `CLOUDFLARE_R2_PUBLIC_URL`

## API Routes

- POST `/api/videos` - Upload video
- GET `/api/videos` - List videos
- GET `/api/videos/:id` - Get video
- DELETE `/api/videos/:id` - Delete video
