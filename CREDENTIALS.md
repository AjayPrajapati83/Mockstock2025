# MockStock - Credentials & URLs Reference

## 🔐 Admin Credentials

### Admin 1 - Ajay
```
Email: ajayadmin90@ubuntu.com
Password: Ajay90@
```

### Admin 2 - Pratham
```
Email: prathamadmin90@ubuntu.com
Password: Pratham80@
```

**⚠️ IMPORTANT**: Change these passwords after initial setup for security!

---

## 🌐 Application URLs

### Development (Local)
```
Landing Page: http://localhost:3000
Player Join: http://localhost:3000/player/join
Admin Login: http://localhost:3000/admin/login
Admin Dashboard: http://localhost:3000/admin/dashboard
```

### Production (After Deployment)
```
Landing Page: https://your-app.vercel.app
Player Join: https://your-app.vercel.app/player/join
Admin Login: https://your-app.vercel.app/admin/login
Admin Dashboard: https://your-app.vercel.app/admin/dashboard
```

---

## 🗄️ Supabase Configuration

### Project Details
```
Project Name: MockStock Ubuntu 2025
Project URL: https://[your-project-id].supabase.co
Database: PostgreSQL
Region: [Your selected region]
```

### API Keys (Get from Supabase Dashboard > Settings > API)
```
Project URL: [Paste here]
anon public key: [Paste here]
service_role key: [Keep secret - not needed for this app]
```

### Database Connection (Optional - for direct access)
```
Host: db.[your-project-id].supabase.co
Database: postgres
Port: 5432
User: postgres
Password: [Your database password]
```

---

## 📊 Database Tables

### Tables Created:
1. `admins` - Admin user information
2. `teams` - Player team registrations
3. `news_cards` - Stock news for each round
4. `submissions` - Team stock selections
5. `round_status` - Round state management
6. `rankings` - Leaderboard data

### Quick Access Queries:

**View all teams:**
```sql
SELECT * FROM teams ORDER BY created_at DESC;
```

**View pending teams:**
```sql
SELECT * FROM teams WHERE is_admitted = false AND status = 'waiting';
```

**View admitted teams:**
```sql
SELECT * FROM teams WHERE is_admitted = true;
```

**View round status:**
```sql
SELECT * FROM round_status;
```

**View submissions:**
```sql
SELECT s.*, t.team_code, t.participant1, t.participant2
FROM submissions s
JOIN teams t ON s.team_id = t.id
ORDER BY s.submitted_at DESC;
```

**View rankings:**
```sql
SELECT r.rank_position, t.team_code, t.participant1, t.participant2, r.score
FROM rankings r
JOIN teams t ON r.team_id = t.id
WHERE r.round = 1
ORDER BY r.rank_position;
```

---

## 🎮 Event Codes

### Suggested Event Codes (Alphanumeric Only):
```
UB2025
UBUNTU25
MS2025
MOCKSTOCK
FINTECH25
```

**Format Rules:**
- Must be alphanumeric (letters + numbers only)
- No spaces or special characters
- Case insensitive (stored as uppercase)
- 4-8 characters recommended

---

## 🔧 Environment Variables

### .env.local (Development)
```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Vercel Environment Variables (Production)
```
Variable 1:
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://[your-project-id].supabase.co
Environments: Production, Preview, Development

Variable 2:
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: Production, Preview, Development
```

---

## 📱 QR Codes (Generate These)

### For Player Registration
```
URL: https://your-app.vercel.app/player/join
Tool: qr-code-generator.com or qrcode.com
```

### For Admin Login
```
URL: https://your-app.vercel.app/admin/login
Tool: qr-code-generator.com or qrcode.com
```

---

## 🚨 Emergency Access

### Supabase Dashboard
```
URL: https://supabase.com/dashboard
Login: [Your Supabase account email]
```

### Vercel Dashboard
```
URL: https://vercel.com/dashboard
Login: [Your Vercel account email]
```

### GitHub Repository (if using)
```
URL: https://github.com/[username]/mockstock-ubuntu
```

---

## 📞 Support Contacts

### Technical Support
```
Supabase Status: https://status.supabase.com
Vercel Status: https://vercel-status.com
```

### Event Day Contacts
```
Tech Lead: [Name] - [Phone] - [Email]
Backup Admin: [Name] - [Phone] - [Email]
```

---

## 🔄 Reset Commands

### Reset All Data (Emergency)
```sql
-- Run in Supabase SQL Editor
DELETE FROM submissions;
DELETE FROM rankings;
DELETE FROM teams;
UPDATE round_status SET is_active = false, is_locked = false;
```

### Reset Round Only
```sql
DELETE FROM submissions WHERE round = 1;
DELETE FROM rankings WHERE round = 1;
UPDATE round_status SET is_active = false, is_locked = false WHERE round_number = 1;
UPDATE teams SET status = 'admitted' WHERE status = 'eliminated';
```

### Reset Team Admissions
```sql
UPDATE teams SET is_admitted = false, status = 'waiting';
```

---

## 📊 Monitoring URLs

### Application Monitoring
```
Vercel Analytics: https://vercel.com/[username]/mockstock-ubuntu/analytics
Vercel Logs: https://vercel.com/[username]/mockstock-ubuntu/logs
```

### Database Monitoring
```
Supabase Reports: https://supabase.com/dashboard/project/[project-id]/reports
Supabase Logs: https://supabase.com/dashboard/project/[project-id]/logs
```

---

## 🎯 Quick Reference

### Player Flow:
1. Visit app URL
2. Click "Join as Player"
3. Enter event code + names
4. Wait in lobby
5. Play round when admitted
6. View results

### Admin Flow:
1. Visit `/admin/login`
2. Login with credentials
3. Admit teams
4. Set elimination count
5. Start round
6. Monitor submissions
7. Calculate scores
8. Publish rankings

---

## 📝 Notes Section

Use this space to write down your specific details:

```
My Supabase Project ID: ___________________________

My Supabase URL: ___________________________

My Vercel App URL: ___________________________

Event Code for Event: ___________________________

Event Date: ___________________________

Expected Participants: ___________________________

Additional Notes:
___________________________
___________________________
___________________________
```

---

**Keep this file secure and accessible during the event! 🔒**
