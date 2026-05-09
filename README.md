# AI Todo

A modern, AI-powered task management application built with Next.js, Supabase, and Tailwind CSS. Features an intuitive dark-themed UI, offline PWA support, and an AI assistant for smart task generation.

## Features

- **Smart Task Generation**: Use AI to automatically break down complex goals into actionable tasks.
- **Offline Support (PWA)**: Install the app on your device and access your tasks even without an internet connection. Data syncs automatically when you're back online.
- **Calendar View**: Visualize your tasks across the month with an integrated calendar.
- **Cross-Device Sync**: Sign in with Google to synchronize your tasks across all your devices using Supabase.
- **Dark Mode UI**: A beautiful, modern interface designed for focus.

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-todo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your `.env.local` file with the following variables:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Your Supabase project public anon key |
| `GEMINI_API_KEY` | Google Gemini API key for AI task generation |
| `ANTHROPIC_API_KEY` | (Optional) Anthropic API key if using Claude |

### 4. Supabase Setup

1. Create a new project at [Supabase](https://supabase.com).
2. Go to the SQL Editor in your Supabase dashboard.
3. Run the SQL commands in `supabase/schema.sql` (if you have one) or set up a `tasks` table with:
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `title` (text)
   - `description` (text, nullable)
   - `status` (text, default 'todo')
   - `priority` (text, default 'medium')
   - `category` (text, default 'personal')
   - `due_date` (timestamp with time zone, nullable)
   - `completed` (boolean, default false)
   - `created_at` (timestamp with time zone)
   - `updated_at` (timestamp with time zone)
4. Enable **Google OAuth** in Supabase Auth Providers:
   - Obtain Client ID and Client Secret from Google Cloud Console.
   - Add them to your Supabase Auth configuration.
   - Add your Supabase project URL + `/auth/v1/callback` to the Google Cloud Console Authorized redirect URIs.
5. Set up Row Level Security (RLS) policies to ensure users can only access their own tasks.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Vercel Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Import the project into Vercel.
3. Add the required Environment Variables in the Vercel project settings.
4. Click Deploy!
