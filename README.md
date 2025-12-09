# MockStock - Ubuntu 2025

A modern, realtime, highly-interactive web app for the MockStock duo event at UBUNTU 2025.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + TailwindCSS
- **UI/UX**: Framer Motion (animations) + Recharts (graphs) + Lucide Icons
- **Backend**: Supabase (Postgres + Auth + Realtime)
- **Deployment**: Vercel

## Features

- 🎮 3 rounds of increasing difficulty (30 minutes each)
- 💰 ₹1,00,000 virtual purse per team per round
- 📰 15 news cards per round with stock hints
- ⚡ Realtime updates using Supabase
- 🎨 Dark fintech theme with neon accents
- 📱 Mobile-first responsive design
- 🔐 Admin authentication & team admission system

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the `supabase-schema.sql` file
3. Go to Authentication > Users and create admin users:
   - Email: `ajayadmin90@ubuntu.com`, Password: `Ajay90@`
   - Email: `prathamadmin90@ubuntu.com`, Password: `Pratham80@`
4. Copy your project URL and anon key from Settings > API

### 2. Environment Variables

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## User Flows

### Player Flow

1. **Join**: Enter event code (alphanumeric) + 2 participant names
2. **Waiting Lobby**: Wait for admin to admit the team
3. **Round Screen**: View news cards, select stocks, submit before timer ends
4. **Results**: View rankings after round ends

### Admin Flow

1. **Login**: Use admin credentials
2. **Dashboard**: 
   - View pending teams and admit them
   - Set elimination count per round
   - Start/Stop rounds
   - Monitor live submissions
3. **Manage News**: Upload/edit news cards for each round

## Key Pages

- `/` - Landing page
- `/player/join` - Player registration
- `/player/waiting` - Waiting lobby (realtime)
- `/player/round` - Active round gameplay
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Admin control panel

## Database Schema

- `admins` - Admin users
- `teams` - Player teams with admission status
- `news_cards` - Stock news for each round
- `submissions` - Team stock selections
- `round_status` - Round state management
- `rankings` - Leaderboard data

## Realtime Features

- Team admission status updates
- Round start/stop notifications
- Live countdown timer
- Auto-submission at time end
- Instant ranking updates

## Deployment

### Deploy to Vercel

```bash
npm run build
vercel --prod
```

Add environment variables in Vercel dashboard.

## Color Scheme

- **Neon Blue**: `#00A8E8` - Primary actions
- **Neon Green**: `#32CD32` - Success states
- **Neon Violet**: `#8B5CF6` - Accents
- **Dark Background**: Gray-900 to Black gradient

## Development Notes

- All times are in IST
- Round duration: 30 minutes (configurable)
- Auto-submit triggers when timer reaches 0
- Admins must admit teams before Round 1 can start
- Event codes must be alphanumeric (validated client & server side)

## Support

For issues or questions, contact the Ubuntu 2025 tech team.
