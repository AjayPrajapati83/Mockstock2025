# 🎉 Your MockStock App is Ready!

## ✅ What's Done

- ✅ Project created with Next.js + TypeScript + Tailwind
- ✅ Supabase credentials configured
- ✅ Development server running at http://localhost:3000
- ✅ All pages and components built
- ✅ Realtime features implemented
- ✅ Admin authentication ready
- ✅ Dark fintech theme applied

## 🚨 IMPORTANT: Database Setup Required

Before you can use the app, you need to set up the database tables in Supabase:

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: **lxubihwvcxlwypqhfgcq**

### Step 2: Run Database Schema
1. Click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `supabase-schema.sql` in this project
4. Copy ALL the contents
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)
7. Wait for "Success. No rows returned" message

### Step 3: Create Admin Users
1. Go to **Authentication** > **Users** in Supabase
2. Click **Add user** > **Create new user**
3. Create Admin 1:
   - Email: `ajayadmin90@ubuntu.com`
   - Password: `Ajay90@`
   - ✅ Check "Auto Confirm User"
   - Click "Create user"
4. Create Admin 2:
   - Email: `prathamadmin90@ubuntu.com`
   - Password: `Pratham80@`
   - ✅ Check "Auto Confirm User"
   - Click "Create user"

### Step 4: Enable Realtime (Important!)
1. In Supabase Dashboard, go to **Database** > **Replication**
2. Enable replication for these tables:
   - ✅ teams
   - ✅ round_status
   - ✅ submissions
   - ✅ rankings
3. Click "Save"

## 🧪 Test Your App

### Your App is Running At:
- **Local**: http://localhost:3000
- **Network**: http://192.168.138.1:3000 (for mobile testing)

### Quick Test Flow:

#### 1. Test Landing Page
- Open http://localhost:3000
- You should see the MockStock landing page with animated ticker

#### 2. Test Player Registration
- Click "Join as Player"
- Enter:
  - Event Code: `UB2025`
  - Participant 1: `Test Player 1`
  - Participant 2: `Test Player 2`
- Click "Join Competition"
- You should see the waiting lobby

#### 3. Test Admin Login
- Open new tab: http://localhost:3000/admin/login
- Login with:
  - Email: `ajayadmin90@ubuntu.com`
  - Password: `Ajay90@`
- You should see the admin dashboard
- You should see your test team in "Pending Teams"

#### 4. Test Admission & Round Start
- Click "Admit" on the test team
- Set elimination count to `2`
- Click "Start Round 1"
- Confirm the action

#### 5. Test Round Gameplay
- Go back to the player tab (waiting lobby)
- It should automatically redirect to the round screen
- You should see:
  - 30:00 countdown timer
  - ₹1,00,000 purse
  - 15 news cards
- Click on a news card to expand it
- Enter a quantity (e.g., 10)
- Click "Submit Selections"
- Confirm submission

## 🎨 Customization Options

### Change Event Code Format
Edit `app/player/join/page.tsx` line 30-32

### Change Round Duration
Edit `app/admin/dashboard/page.tsx` line 82
```typescript
// Current: 30 minutes
const endTime = new Date(startTime.getTime() + 30 * 60 * 1000)

// Change to 45 minutes:
const endTime = new Date(startTime.getTime() + 45 * 60 * 1000)
```

### Change Virtual Purse Amount
Edit `app/player/round/page.tsx` line 18
```typescript
const PURSE = 100000 // Change to desired amount
```

### Modify Colors
Edit `tailwind.config.ts` lines 14-18

## 🚀 Deploy to Production

When you're ready to deploy:

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/mockstock-ubuntu.git
git push -u origin main
```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: https://lxubihwvcxlwypqhfgcq.supabase.co
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (your anon key)
   - Click Deploy

See `DEPLOYMENT.md` for detailed instructions.

## 📚 Documentation Files

- **README.md** - Project overview
- **QUICK_START.md** - 5-minute setup checklist
- **SETUP_GUIDE.md** - Detailed setup instructions
- **EVENT_DAY_GUIDE.md** - How to run the event
- **DEPLOYMENT.md** - Deployment to Vercel
- **PROJECT_SUMMARY.md** - Technical details
- **CREDENTIALS.md** - All URLs and credentials

## 🆘 Troubleshooting

### "Failed to join" Error
- Make sure you ran the SQL schema in Supabase
- Check that tables exist in Supabase Dashboard > Table Editor

### Admin Can't Login
- Make sure you created admin users in Supabase Auth
- Check email and password are correct

### Realtime Not Working
- Enable replication in Supabase Dashboard > Database > Replication
- Refresh the page

### Timer Not Counting Down
- Make sure round was started from admin dashboard
- Check browser console (F12) for errors

## 📞 Need Help?

Check the documentation files or:
1. Open browser console (F12) to see errors
2. Check Supabase Dashboard > Logs for database errors
3. Verify all tables exist in Table Editor

## ✅ Final Checklist

Before the event:
- [ ] Database schema executed in Supabase
- [ ] Admin users created
- [ ] Realtime replication enabled
- [ ] Test player flow works
- [ ] Test admin flow works
- [ ] Round start/stop works
- [ ] Deployed to Vercel (optional for testing)
- [ ] Mobile responsive tested
- [ ] Event codes prepared

---

**Your MockStock app is ready for Ubuntu 2025! 🎉**

**Current Status:**
- ✅ Development server running
- ⏳ Database setup needed (follow steps above)
- ⏳ Admin users creation needed
- ⏳ Testing needed

**Access your app at:** http://localhost:3000
