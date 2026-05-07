# Behavior Tools SaaS

## Setup
1. Copy `.env.example` to `.env`
2. Add your Supabase keys
3. Run `supabase.sql` in the Supabase SQL editor
4. Run `npm install`
5. Run `npm run dev`

## Features
- Demo sign-in
- Supabase-backed habit persistence when env vars are configured
- Local browser fallback when Supabase keys are missing
- SaaS dashboard UI
- OpenAI-powered weekly coaching notes through a Vercel serverless function

## Deploy
1. Import `luismartos1029-creator/luis` into Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional; defaults to `gpt-5.4-mini`)
6. Deploy

## Test
- Sign in with an email
- Add a habit
- Generate an AI coaching review
- Refresh the page
- Confirm the habit persists

## Next
- Connect OpenAI API
- Add Stripe billing
- Replace demo sign-in with Supabase Auth
