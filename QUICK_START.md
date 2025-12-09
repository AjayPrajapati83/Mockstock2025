# MockStock - Quick Start Checklist ✅

## 🚀 5-Minute Setup

### ☑️ Step 1: Supabase Account
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up / Log in
- [ ] Create new project: "MockStock Ubuntu 2025"
- [ ] Wait for project to be ready (~2 minutes)

### ☑️ Step 2: Database Setup
- [ ] Open Supabase Dashboard
- [ ] Go to **SQL Editor** (left sidebar)
- [ ] Copy contents of `supabase-schema.sql`
- [ ] Paste and click **Run**
- [ ] Verify: "Success. No rows returned"

### ☑️ Step 3: Admin Users
- [ ] Go to **Authentication** > **Users**
- [ ] Click "Add user" > "Create new user"
- [ ] Create Admin 1:
  - Email: `ajayadmin90@ubuntu.com`
  - Password: `Ajay90@`
  - ✅ Check "Auto Confirm User"
- [ ] Create Admin 2:
  - Email: `prathamadmin90@ubuntu.com`
  - Password: `Pratham80@`
  - ✅ Check "Auto Confirm User"

### ☑️ Step 4: Get API Keys
- [ ] Go to **Settings** > **API**
- [ ] Copy **Project URL**
- [ ] Copy **anon public** key

### ☑️ Step 5: Configure App
- [ ] Open `.env.local` file
- [ ] Paste your Project URL
- [ ] Paste your anon key
- [ ] Save file

### ☑️ Step 6: Install & Run
```bash
npm install
npm run dev
```
- [ ] Open http://localhost:3000
- [ ] See landing page ✨

---

## 🧪 Quick Test (2 Minutes)

### Test 1: Player Registration
- [ ] Click "Join as Player"
- [ ] Enter event code: `UB2025`
- [ ] Enter names: `Test Player 1`, `Test Player 2`
- [ ] Click "Join Competition"
- [ ] See waiting lobby

### Test 2: Admin Login
- [ ] Open new tab: `/admin/login`
- [ ] Login: `ajayadmin90@ubuntu.com` / `Ajay90@`
- [ ] See admin dashboard
- [ ] See test team in "Pending Teams"

### Test 3: Admit & Start
- [ ] Click "Admit" on test team
- [ ] Set elimination count: `2`
- [ ] Click "Start Round 1"
- [ ] Confirm

### Test 4: Play Round
- [ ] Go back to player tab
- [ ] Should auto-redirect to round screen
- [ ] See 30:00 timer
- [ ] See ₹1,00,000 purse
- [ ] See 15 news cards
- [ ] Click a card to expand
- [ ] Enter quantity
- [ ] Click "Submit Selections"

---

## ✅ You're Ready!

If all tests passed, your app is working perfectly!

### Next Steps:
1. Read `SETUP_GUIDE.md` for detailed configuration
2. Read `EVENT_DAY_GUIDE.md` for event operations
3. Deploy to Vercel (see README.md)

### Need Help?
- Check `PROJECT_SUMMARY.md` for architecture
- Check browser console (F12) for errors
- Verify Supabase credentials in `.env.local`

---

## 🎯 Pre-Event Checklist

### 1 Week Before:
- [ ] Deploy to Vercel
- [ ] Test on mobile devices
- [ ] Prepare event codes
- [ ] Brief volunteers

### 1 Day Before:
- [ ] Verify app is accessible
- [ ] Test full player flow
- [ ] Test admin controls
- [ ] Backup database

### Event Day:
- [ ] Open admin dashboard
- [ ] Monitor team registrations
- [ ] Admit teams promptly
- [ ] Start rounds on time
- [ ] Calculate scores
- [ ] Announce winners

---

## 🆘 Common Issues

### "Failed to join"
→ Check `.env.local` has correct Supabase credentials
→ Restart dev server: `npm run dev`

### Teams not showing in admin
→ Verify admin is logged in
→ Check browser console for errors

### Timer not working
→ Verify round was started correctly
→ Check `round_status` table in Supabase

### Realtime not updating
→ Enable replication in Supabase Dashboard
→ Database > Replication > Enable for all tables

---

## 📞 Emergency Commands

### Reset Everything:
```sql
-- Run in Supabase SQL Editor
DELETE FROM submissions;
DELETE FROM rankings;
UPDATE teams SET is_admitted = false, status = 'waiting';
UPDATE round_status SET is_active = false, is_locked = false;
```

### Check Team Status:
```sql
SELECT team_code, participant1, participant2, is_admitted, status 
FROM teams 
ORDER BY created_at DESC;
```

### Check Round Status:
```sql
SELECT * FROM round_status WHERE round_number = 1;
```

---

**You're all set! Good luck with Ubuntu 2025! 🎉**
