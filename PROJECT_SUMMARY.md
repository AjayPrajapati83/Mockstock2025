# MockStock Ubuntu 2025 - Project Summary

## 📁 Project Structure

```
mockstock-ubuntu/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Admin control panel
│   │   └── login/
│   │       └── page.tsx          # Admin authentication
│   ├── player/
│   │   ├── join/
│   │   │   └── page.tsx          # Player registration
│   │   ├── waiting/
│   │   │   └── page.tsx          # Waiting lobby (realtime)
│   │   ├── round/
│   │   │   └── page.tsx          # Active round gameplay
│   │   └── results/
│   │       └── page.tsx          # Rankings display
│   ├── globals.css               # Global styles + theme
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/
│   │   └── button.tsx            # Reusable button component
│   └── Loading.tsx               # Loading spinner
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server Supabase client
│   └── utils.ts                  # Utility functions
├── types/
│   └── database.ts               # TypeScript types
├── .env.local                    # Environment variables
├── .gitignore                    # Git ignore rules
├── middleware.ts                 # Auth middleware
├── supabase-schema.sql           # Database schema
├── tailwind.config.ts            # Tailwind configuration
├── README.md                     # Project overview
├── SETUP_GUIDE.md                # Detailed setup instructions
├── EVENT_DAY_GUIDE.md            # Event operations manual
└── package.json                  # Dependencies
```

## 🎨 Design System

### Color Palette
- **Neon Blue** (`#00A8E8`): Primary actions, highlights
- **Neon Green** (`#32CD32`): Success states, positive indicators
- **Neon Violet** (`#8B5CF6`): Accent elements
- **Dark Background**: Gray-900 to Black gradient
- **Card Background**: Gray-800 with transparency

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, large sizes with neon colors
- **Body**: Regular weight, gray-300/400
- **Monospace**: Team codes, event codes

### Components
- **Cards**: Dark background, subtle borders, hover glow effects
- **Buttons**: Bold, rounded, with glow effects on primary actions
- **Inputs**: Dark background, focus states with neon borders
- **Animations**: Framer Motion for smooth transitions

## 🔧 Technical Architecture

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts (for future enhancements)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Realtime**: Supabase Realtime subscriptions
- **API**: Next.js Server Actions (future)

### Deployment
- **Hosting**: Vercel
- **Database**: Supabase Cloud
- **CDN**: Vercel Edge Network

## 📊 Database Schema

### Tables

**admins**
- Stores admin user information
- Links to Supabase Auth

**teams**
- Player team registrations
- Tracks admission status and round progress
- Fields: team_code, event_code, participants, is_admitted, status, round

**news_cards**
- Stock news for each round
- 15 cards per round
- Fields: headline, hint, stock_name, previous_price, impact_score

**submissions**
- Team stock selections per round
- Stores selected_stocks as JSONB
- Fields: team_id, round, selected_stocks, total_score, submitted_at

**round_status**
- Controls round state
- Fields: round_number, is_active, start_time, end_time, elimination_count

**rankings**
- Final rankings per round
- Fields: round, team_id, rank_position, score

## 🔄 Data Flow

### Player Registration Flow
1. Player enters event code + names
2. Frontend validates alphanumeric event code
3. Creates team record with `is_admitted = false`
4. Redirects to waiting lobby
5. Realtime subscription listens for admission status
6. Admin admits team → status updates → player redirected

### Round Start Flow
1. Admin sets elimination count
2. Admin clicks "Start Round"
3. Creates/updates round_status record
4. Realtime broadcast to all admitted teams
5. Players auto-redirected to round screen
6. Timer starts counting down

### Submission Flow
1. Player selects stocks and quantities
2. Frontend validates against remaining purse
3. Player clicks Submit → confirmation modal
4. Submission saved to database
5. Submit button disabled
6. Auto-submit triggers at timer end

### Scoring Flow (Manual)
1. Round ends (timer or admin stop)
2. Admin reviews submissions in Supabase
3. Calculates scores based on logic
4. Updates total_score in submissions
5. Creates ranking records
6. Players see results page

## 🎮 Game Mechanics

### Virtual Purse
- ₹1,00,000 per team per round
- Resets each round
- Cannot exceed purse limit

### Stock Selection
- Choose from 15 news cards
- Enter quantity for each stock
- Investment = Quantity × Previous Price
- Can select multiple stocks
- Must submit before timer ends

### Scoring (Recommended Logic)
```
Score = Σ (Correctness × Impact Score × Investment Weight)

Where:
- Correctness: +1 if aligned with hint, -1 if opposite
- Impact Score: From news card (1-10)
- Investment Weight: Investment / Total Purse
```

### Elimination
- Set by admin per round
- Bottom N teams eliminated
- Cannot participate in next round

### Rounds
- **Round 1**: Easy (15 news cards, clear hints)
- **Round 2**: Intermediate (harder hints, fewer teams)
- **Round 3**: Hard (final round, top 3 winners)

## 🔐 Security Features

### Authentication
- Admin: Email + password via Supabase Auth
- Players: No password (event code validation only)

### Row Level Security (RLS)
- Teams: Public read, authenticated update
- News cards: Public read published, admin full access
- Submissions: Public read, anyone can insert
- Round status: Public read, admin update
- Rankings: Public read, admin manage

### Middleware
- Protects `/admin/dashboard` routes
- Redirects unauthenticated users
- Handles session management

## ⚡ Realtime Features

### Subscriptions
1. **Team Updates** (Waiting Lobby)
   - Listens to `teams` table changes
   - Updates admission status instantly

2. **Round Status** (All Players)
   - Listens to `round_status` table
   - Triggers round start/stop

3. **Admin Dashboard**
   - Listens to `teams` table
   - Shows new registrations instantly

### Implementation
```typescript
const channel = supabase
  .channel('channel-name')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'table_name'
  }, (payload) => {
    // Handle update
  })
  .subscribe()
```

## 🚀 Performance Optimizations

### Frontend
- Client-side routing (Next.js App Router)
- Optimistic UI updates
- Lazy loading for heavy components
- Debounced input handlers

### Database
- Indexed columns: team_code, event_code, round
- Efficient queries with filters
- JSONB for flexible stock selections

### Deployment
- Static generation where possible
- Edge functions for auth
- CDN for assets
- Automatic code splitting

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Optimizations
- Touch-friendly buttons (min 44px)
- Simplified navigation
- Stacked layouts
- Reduced animations on low-end devices

## 🧪 Testing Checklist

### Player Flow
- [ ] Can register with valid event code
- [ ] Cannot register with invalid event code
- [ ] Waiting lobby shows correct status
- [ ] Auto-redirects when admitted
- [ ] Round screen loads with timer
- [ ] Can select stocks within purse limit
- [ ] Cannot exceed purse limit
- [ ] Can submit selections
- [ ] Cannot submit twice
- [ ] Auto-submit works at timer end
- [ ] Results page shows rankings

### Admin Flow
- [ ] Can login with credentials
- [ ] Cannot access dashboard without auth
- [ ] Sees pending teams
- [ ] Can admit individual teams
- [ ] Can admit all teams
- [ ] Cannot start round with 0 teams
- [ ] Can start round with admitted teams
- [ ] Timer starts correctly
- [ ] Can stop round manually
- [ ] Logout works

### Realtime
- [ ] Admission updates instantly
- [ ] Round start triggers redirect
- [ ] Multiple tabs sync correctly
- [ ] No race conditions

## 🔮 Future Enhancements

### Phase 2 Features
1. **Automated Scoring**
   - Supabase Edge Function
   - Real-time price simulation
   - Automatic ranking calculation

2. **Live Leaderboard**
   - Real-time score updates during round
   - Animated position changes
   - Team performance graphs

3. **Admin Analytics**
   - Team participation stats
   - Popular stock selections
   - Round completion rates
   - Export to Excel/PDF

4. **Enhanced UX**
   - Stock price charts (Recharts)
   - News card categories
   - Team chat/comments
   - Push notifications

5. **Multi-Event Support**
   - Multiple concurrent events
   - Event-specific configurations
   - Historical data archive

## 📚 Key Files to Understand

### For Customization
- `tailwind.config.ts` - Colors, animations
- `app/globals.css` - Global styles
- `supabase-schema.sql` - Database structure
- `types/database.ts` - TypeScript types

### For Logic Changes
- `app/player/round/page.tsx` - Game mechanics
- `app/admin/dashboard/page.tsx` - Admin controls
- `lib/utils.ts` - Helper functions

### For Deployment
- `.env.local` - Environment variables
- `middleware.ts` - Auth protection
- `package.json` - Dependencies

## 🎓 Learning Resources

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### Supabase
- [Supabase Documentation](https://supabase.com/docs)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind v4 Guide](https://tailwindcss.com/docs/v4-beta)

### Framer Motion
- [Framer Motion Docs](https://www.framer.com/motion/)

## 📄 License

This project is created for Ubuntu 2025 event. Feel free to modify and use for your events.

---

**Built with ❤️ for Ubuntu 2025**
