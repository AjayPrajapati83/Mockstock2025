# 🔧 Quick Fix Guide

## ✅ Fixed Issues:

1. ✅ **CSS Error** - Updated globals.css for Tailwind v4 compatibility
2. ✅ **Created cleanup script** for database

## 🚨 To Fix Database Error:

You got "relation 'admins' already exists" because the SQL ran partially. Here's how to fix:

### Step 1: Clean Up Partial Tables

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Click **SQL Editor**
3. Copy contents of `supabase-cleanup.sql` file
4. Paste and click **Run**
5. You should see "Success"

### Step 2: Run Full Schema

1. Still in SQL Editor, click **New Query**
2. Copy ALL contents of `supabase-schema.sql` file
3. Paste and click **Run**
4. Wait for "Success. No rows returned"

### Step 3: Verify Tables Created

1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - ✅ admins
   - ✅ teams
   - ✅ news_cards
   - ✅ submissions
   - ✅ round_status
   - ✅ rankings

### Step 4: Create Admin Users

1. Go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Create both admins:
   - Email: `ajayadmin90@ubuntu.com`, Password: `Ajay90@`
   - Email: `prathamadmin90@ubuntu.com`, Password: `Pratham80@`
4. ✅ Check "Auto Confirm User" for both

### Step 5: Enable Realtime (Already Done! ✅)

I can see from your screenshot that realtime is already enabled. Great!

## 🧪 Test Your App

The dev server should now be working. Check:

1. Open http://localhost:3000
2. You should see the landing page without errors
3. Try joining as a player
4. Try logging in as admin

## 📊 Current Status:

- ✅ CSS fixed (Tailwind v4 compatible)
- ✅ Dev server running
- ✅ Realtime enabled in Supabase
- ⏳ Database tables need cleanup + recreation
- ⏳ Admin users need creation

## 🆘 If Still Having Issues:

### Check Dev Server Output:
The server should show:
```
✓ Ready in 2s
✓ Compiled / in Xs
```

### Check Browser:
1. Open http://localhost:3000
2. Press F12 to open console
3. Look for any red errors

### Common Issues:

**"Cannot find module" errors:**
```bash
npm install
```

**Port 3000 already in use:**
```bash
# Stop the current process and restart
npm run dev
```

**Database connection errors:**
- Verify `.env.local` has correct Supabase URL and key
- Check Supabase project is active

---

**After fixing database, your app will be fully functional! 🎉**
