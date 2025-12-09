# MockStock - Event Day Operations Guide

## 🎯 Quick Reference for Event Organizers

### Before the Event (1 Day Prior)

- [ ] Deploy application to Vercel
- [ ] Test admin login with both accounts
- [ ] Verify Supabase is operational
- [ ] Create test team and run through full flow
- [ ] Prepare event codes for distribution
- [ ] Print QR codes linking to the app
- [ ] Brief volunteers on player registration process

---

## 👥 Player Registration Process

### What Players Need to Do:

1. Visit the app URL (e.g., `mockstock-ubuntu.vercel.app`)
2. Click "Join as Player"
3. Enter:
   - **Event Code**: Provide them with code (e.g., `UB2025`)
   - **Participant 1 Name**: First team member
   - **Participant 2 Name**: Second team member
4. Click "Join Competition"
5. Wait in lobby for admission

### Event Code Format:
- Must be **alphanumeric only** (letters + numbers)
- Suggested format: `UB2025`, `UBUNTU25`, `MS2025`
- Same code for all participants or unique per team (your choice)

---

## 🔐 Admin Access

### Admin Credentials:

**Admin 1 - Ajay**
- Email: `ajayadmin90@ubuntu.com`
- Password: `Ajay90@`

**Admin 2 - Pratham**
- Email: `prathamadmin90@ubuntu.com`
- Password: `Pratham80@`

### Admin Dashboard URL:
`https://your-app-url.vercel.app/admin/login`

---

## 🎮 Running the Event

### Phase 1: Team Registration (Before Round 1)

1. **Admin logs in** to dashboard
2. **Teams join** via player interface
3. **Admin sees pending teams** in "Pending Teams" section
4. **Admin admits teams** by clicking "Admit" or "Admit All"
5. Admitted teams see status change in waiting lobby

### Phase 2: Round 1 Start

1. **Set elimination count** (how many teams to eliminate after this round)
2. **Verify admitted teams count** is correct
3. **Click "Start Round 1"** button
4. Confirm the action
5. **30-minute timer starts** for all admitted teams
6. Teams are auto-redirected to round screen

### Phase 3: During Round 1

**What Players See:**
- Countdown timer (30:00 → 00:00)
- Virtual purse: ₹1,00,000
- 15 news cards with stock hints
- Stock selection interface
- Submit button

**What Players Do:**
- Read news cards
- Select stocks and quantities
- Click "Submit Selections"
- Confirm submission
- Wait for round to end

**Admin Monitoring:**
- Can see live team count
- Can stop round early if needed
- Cannot see individual submissions during round

### Phase 4: Round 1 End

**Automatic:**
- Timer reaches 00:00
- All unsubmitted teams get auto-submitted
- Round locks automatically

**Manual:**
- Admin clicks "Stop Round 1"
- Confirms action
- Round stops immediately

### Phase 5: Scoring & Rankings

**Manual Process (Admin does this in Supabase):**

1. Go to Supabase Dashboard → **Table Editor**
2. Open `submissions` table
3. Review each team's `selected_stocks`
4. Calculate scores based on:
   - Stock performance vs news hints
   - Impact scores from news cards
   - Investment amounts
5. Update `total_score` for each submission
6. Insert rankings into `rankings` table:

```sql
INSERT INTO rankings (round, team_id, rank_position, score)
VALUES 
  (1, 'team-uuid-1', 1, 850.50),
  (1, 'team-uuid-2', 2, 720.30),
  (1, 'team-uuid-3', 3, 680.00);
```

**Automated Scoring (Future Enhancement):**
- Create a Supabase Edge Function
- Trigger on round end
- Calculate scores automatically

### Phase 6: Eliminations

1. Based on elimination count set earlier
2. Bottom N teams are eliminated
3. Update their status:

```sql
UPDATE teams 
SET status = 'eliminated' 
WHERE id IN (
  SELECT team_id FROM rankings 
  WHERE round = 1 
  ORDER BY rank_position DESC 
  LIMIT 2  -- elimination count
);
```

### Phase 7: Round 2 & 3

Repeat the same process:
1. Update `round` field for continuing teams
2. Ensure Round 2/3 news cards are published
3. Start next round
4. Monitor, score, eliminate
5. Final round shows Top 3 winners

---

## 📊 Scoring Logic (Recommended)

### Formula:
```
Team Score = Σ (Stock Selection Score × Impact Score)

Stock Selection Score = 
  - Positive if stock aligns with news hint
  - Negative if stock contradicts news hint
  - Weighted by investment amount
```

### Example:

**News Card:**
- Headline: "Tech Giant Announces Record Profits"
- Stock: INFY
- Previous Price: ₹1,650
- Impact Score: 8.5
- Hint: Positive news

**Team Selection:**
- Stock: INFY
- Quantity: 50
- Investment: ₹82,500

**Scoring:**
- Correct choice (positive news) = +1
- Impact weight = 8.5
- Investment weight = 82,500 / 100,000 = 0.825
- **Points = 1 × 8.5 × 0.825 = 7.01**

Sum all stock selections for total score.

---

## 🚨 Troubleshooting

### Players Can't Join

**Check:**
- Is event code alphanumeric?
- Are both participant names filled?
- Is Supabase operational?

**Fix:**
- Verify `.env.local` variables
- Check Supabase dashboard for errors
- Restart application if needed

### Teams Not Appearing in Admin Dashboard

**Check:**
- Is admin logged in correctly?
- Are teams actually created in database?

**Fix:**
- Check `teams` table in Supabase
- Verify RLS policies are correct
- Refresh admin dashboard

### Round Won't Start

**Check:**
- Are there admitted teams? (count > 0)
- Is previous round still active?

**Fix:**
- Admit at least one team
- Stop previous round if stuck
- Check `round_status` table

### Timer Not Working

**Check:**
- Is `start_time` and `end_time` set correctly?
- Is `is_active` = true?

**Fix:**
- Verify times in `round_status` table
- Check browser console for errors
- Refresh player page

### Realtime Updates Not Working

**Check:**
- Is Supabase Realtime enabled?
- Are tables replicated?

**Fix:**
- Go to Database → Replication in Supabase
- Enable replication for: `teams`, `round_status`, `submissions`

---

## 📱 Player Support

### Common Player Questions:

**Q: Can I change my submission?**
A: No, submissions are final once confirmed.

**Q: What happens if time runs out?**
A: Your current selections are auto-submitted.

**Q: Can I see other teams' selections?**
A: No, selections are private until results.

**Q: How is scoring calculated?**
A: Based on stock performance vs news hints and impact scores.

---

## 🎉 Post-Event

### Data Export

Export final rankings:

```sql
SELECT 
  r.rank_position,
  t.team_code,
  t.participant1,
  t.participant2,
  r.score,
  r.round
FROM rankings r
JOIN teams t ON r.team_id = t.id
ORDER BY r.round, r.rank_position;
```

Save as CSV for certificates/prizes.

### Backup Database

1. Go to Supabase Dashboard
2. Settings → Database
3. Click "Download backup"
4. Save for records

---

## 📞 Emergency Contacts

**Technical Issues:**
- Check Supabase status: status.supabase.com
- Check Vercel status: vercel-status.com

**Database Access:**
- Supabase Dashboard: supabase.com/dashboard
- Direct SQL access available in SQL Editor

---

## ✅ Event Day Checklist

**Morning of Event:**
- [ ] Verify app is accessible
- [ ] Test admin login
- [ ] Test player registration
- [ ] Prepare event codes
- [ ] Brief volunteers
- [ ] Set up projection screen

**During Event:**
- [ ] Monitor admin dashboard
- [ ] Admit teams promptly
- [ ] Start rounds on time
- [ ] Monitor for technical issues
- [ ] Calculate scores after each round
- [ ] Publish rankings

**After Event:**
- [ ] Export final data
- [ ] Backup database
- [ ] Announce winners
- [ ] Collect feedback

---

## 🏆 Winner Announcement

Top 3 teams from Round 3 are the winners!

Display on projection screen or announce:
1. 🥇 First Place - Team Code, Names, Score
2. 🥈 Second Place - Team Code, Names, Score
3. 🥉 Third Place - Team Code, Names, Score

---

Good luck with Ubuntu 2025! 🚀
