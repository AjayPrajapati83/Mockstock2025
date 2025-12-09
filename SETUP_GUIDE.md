# MockStock Ubuntu 2025 - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Fill in:
   - **Name**: MockStock Ubuntu 2025
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to India
4. Wait 2-3 minutes for project creation

### Step 2: Database Schema Setup

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### Step 3: Create Admin Users

1. Go to **Authentication** > **Users** (left sidebar)
2. Click "Add user" > "Create new user"
3. Create first admin:
   - **Email**: `ajayadmin90@ubuntu.com`
   - **Password**: `Ajay90@`
   - Check "Auto Confirm User"
4. Click "Create user"
5. Repeat for second admin:
   - **Email**: `prathamadmin90@ubuntu.com`
   - **Password**: `Pratham80@`

### Step 4: Get API Credentials

1. Go to **Settings** > **API** (left sidebar)
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 5: Configure Environment Variables

1. Open `.env.local` file in the project root
2. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 6: Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📋 Testing the Application

### Test Player Flow

1. Go to homepage → Click "Join as Player"
2. Enter:
   - **Event Code**: `UB2025` (or any alphanumeric code)
   - **Participant 1**: Your name
   - **Participant 2**: Partner name
3. Click "Join Competition"
4. You'll be redirected to Waiting Lobby
5. Keep this tab open

### Test Admin Flow

1. Open new tab → Go to `/admin/login`
2. Login with:
   - **Email**: `ajayadmin90@ubuntu.com`
   - **Password**: `Ajay90@`
3. You should see the Admin Dashboard
4. You'll see your test team in "Pending Teams"
5. Click "Admit" button
6. Set "Elimination Count" (e.g., 2)
7. Click "Start Round 1"

### Test Round Gameplay

1. Go back to player tab (waiting lobby)
2. It should automatically redirect to Round screen
3. You'll see:
   - 30:00 countdown timer
   - ₹1,00,000 purse
   - 15 news cards
4. Click on a news card to expand
5. Enter quantity for stocks
6. Click "Submit Selections"
7. Confirm submission

---

## 🎨 Customization

### Change Event Code Format

Edit `app/player/join/page.tsx`:

```typescript
// Current: Alphanumeric validation
if (!isAlphanumeric(eventCode)) {
  // Change validation logic here
}
```

### Adjust Round Duration

Edit `app/admin/dashboard/page.tsx`:

```typescript
// Current: 30 minutes
const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)

// Change to 45 minutes:
const endTime = new Date(startTime.getTime() + 45 * 60 * 1000)
```

### Modify Virtual Purse

Edit `app/player/round/page.tsx`:

```typescript
// Current: ₹1,00,000
const PURSE = 100000

// Change to ₹2,00,000:
const PURSE = 200000
```

### Add More News Cards

1. Go to Supabase Dashboard → **Table Editor**
2. Select `news_cards` table
3. Click "Insert row"
4. Fill in:
   - **round**: 1, 2, or 3
   - **headline**: News title
   - **hint**: Detailed hint
   - **stock_name**: Stock symbol (e.g., RELIANCE)
   - **previous_price**: Current price
   - **impact_score**: 1-10 (higher = more impact)
   - **published**: true
5. Click "Save"

---

## 🔧 Troubleshooting

### "Failed to join" Error

**Cause**: Supabase credentials not configured

**Fix**:
1. Check `.env.local` has correct values
2. Restart dev server: `npm run dev`

### Teams Not Appearing in Admin Dashboard

**Cause**: RLS policies or auth issue

**Fix**:
1. Verify admin user exists in Supabase Auth
2. Check browser console for errors
3. Verify SQL schema was run completely

### Realtime Updates Not Working

**Cause**: Supabase Realtime not enabled

**Fix**:
1. Go to Supabase Dashboard → **Database** → **Replication**
2. Enable replication for tables: `teams`, `round_status`, `submissions`

### Timer Not Counting Down

**Cause**: Round not started properly

**Fix**:
1. Check `round_status` table has correct `start_time` and `end_time`
2. Verify `is_active` is `true`

---

## 📊 Database Management

### View All Teams

```sql
SELECT * FROM teams ORDER BY created_at DESC;
```

### Reset Round Status

```sql
UPDATE round_status 
SET is_active = false, is_locked = false 
WHERE round_number = 1;
```

### Clear All Submissions

```sql
DELETE FROM submissions WHERE round = 1;
```

### View Rankings

```sql
SELECT r.rank_position, t.team_code, t.participant1, t.participant2, r.score
FROM rankings r
JOIN teams t ON r.team_id = t.id
WHERE r.round = 1
ORDER BY r.rank_position;
```

---

## 🚀 Deployment to Vercel

### One-Click Deploy

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 📱 Mobile Testing

The app is mobile-responsive. Test on:

- Chrome DevTools (F12 → Toggle device toolbar)
- Real device: Use your local IP
  - Find IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
  - Access: `http://192.168.x.x:3000`

---

## 🎯 Event Day Checklist

- [ ] Supabase project is live
- [ ] Admin accounts tested
- [ ] Sample team can join and be admitted
- [ ] Round can start and countdown works
- [ ] Submissions are recorded
- [ ] Deployed to Vercel with custom domain
- [ ] Mobile view tested
- [ ] Backup admin credentials saved
- [ ] Database backup taken

---

## 📞 Support

For technical issues during the event:

1. Check Supabase Dashboard for errors
2. Check browser console (F12)
3. Verify environment variables
4. Restart the application

**Emergency Reset**: Run the SQL schema again (will clear all data)

---

## 🎉 You're All Set!

Your MockStock application is ready for Ubuntu 2025. Good luck with the event! 🚀
