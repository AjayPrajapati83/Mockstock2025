# MockStock - Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

### Method 1: GitHub + Vercel (Easiest)

#### Step 1: Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - MockStock Ubuntu 2025"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/mockstock-ubuntu.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Click "Add New" > "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Step 3: Add Environment Variables
In Vercel project settings:
1. Go to "Settings" > "Environment Variables"
2. Add:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Your Supabase project URL
   - **Environment**: Production, Preview, Development
3. Add:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anon key
   - **Environment**: Production, Preview, Development

#### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Get your URL: `https://mockstock-ubuntu.vercel.app`

---

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? mockstock-ubuntu
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key

# Deploy to production
vercel --prod
```

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain in Vercel

1. Go to Vercel Dashboard > Your Project
2. Click "Settings" > "Domains"
3. Add your domain: `mockstock.yourdomain.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (~5-60 minutes)

### DNS Configuration Example

**For subdomain (mockstock.yourdomain.com):**
- Type: `CNAME`
- Name: `mockstock`
- Value: `cname.vercel-dns.com`

**For root domain (yourdomain.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`

---

## 🔒 Security Checklist

### Before Going Live:

- [ ] Environment variables are set in Vercel
- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] Supabase RLS policies are enabled (already done)
- [ ] Admin passwords are strong
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] CORS is configured in Supabase (if needed)

### Supabase Security:

1. Go to Supabase Dashboard > Settings > API
2. Verify **Row Level Security** is enabled
3. Check **Allowed domains** (optional):
   - Add your Vercel domain
   - Add `localhost:3000` for development

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Free)

1. Go to Vercel Dashboard > Your Project
2. Click "Analytics" tab
3. Enable Web Analytics
4. Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Supabase Monitoring

1. Go to Supabase Dashboard > Reports
2. Monitor:
   - Database size
   - API requests
   - Active connections
   - Query performance

---

## 🔄 Continuous Deployment

### Automatic Deployments

Once connected to GitHub, Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

### Manual Deployment

```bash
# Deploy latest changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys
```

---

## 🧪 Testing Production

### Test Checklist:

- [ ] Landing page loads
- [ ] Player can register
- [ ] Admin can login
- [ ] Realtime updates work
- [ ] Timer counts down
- [ ] Submissions save
- [ ] Mobile responsive
- [ ] All images load
- [ ] No console errors

### Load Testing (Optional)

Use tools like:
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (Chrome DevTools)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

---

## 📱 Mobile Optimization

### PWA Setup (Optional)

Add to `app/manifest.json`:

```json
{
  "name": "MockStock Ubuntu 2025",
  "short_name": "MockStock",
  "description": "Realtime stock trading competition",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#00A8E8",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🔧 Environment-Specific Configs

### Development
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-key
```

### Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
```

---

## 📦 Build Optimization

### Reduce Bundle Size

Already optimized:
- ✅ Tree-shaking enabled
- ✅ Code splitting automatic
- ✅ Image optimization with Next.js
- ✅ CSS purging with Tailwind

### Performance Tips

1. **Lazy load heavy components**:
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />
})
```

2. **Optimize images**:
```typescript
import Image from 'next/image'

<Image 
  src="/logo.png" 
  width={200} 
  height={100} 
  alt="Logo"
  priority // for above-the-fold images
/>
```

---

## 🚨 Rollback Strategy

### Quick Rollback in Vercel

1. Go to Vercel Dashboard > Deployments
2. Find previous working deployment
3. Click "..." > "Promote to Production"
4. Confirm

### Git Rollback

```bash
# View commit history
git log --oneline

# Rollback to specific commit
git reset --hard <commit-hash>

# Force push
git push origin main --force

# Vercel will auto-deploy the rollback
```

---

## 📊 Scaling Considerations

### Supabase Limits (Free Tier)

- **Database**: 500 MB
- **API Requests**: 50,000/month
- **Bandwidth**: 2 GB
- **Realtime**: 200 concurrent connections

### Upgrade if Needed

For large events (>200 concurrent users):
1. Upgrade Supabase to Pro ($25/month)
2. Increase connection pooling
3. Add database indexes
4. Enable caching

### Vercel Limits (Free Tier)

- **Bandwidth**: 100 GB/month
- **Builds**: 6,000 minutes/month
- **Serverless Functions**: 100 GB-hours

---

## ✅ Pre-Launch Checklist

### Technical:
- [ ] App deployed to Vercel
- [ ] Custom domain configured (if applicable)
- [ ] Environment variables set
- [ ] Supabase database ready
- [ ] Admin users created
- [ ] News cards populated
- [ ] SSL certificate active (automatic)

### Testing:
- [ ] Full player flow tested
- [ ] Admin controls tested
- [ ] Realtime updates verified
- [ ] Mobile responsive checked
- [ ] Cross-browser tested (Chrome, Safari, Firefox)
- [ ] Load time < 3 seconds

### Content:
- [ ] Event codes prepared
- [ ] Scoring logic documented
- [ ] Volunteer instructions ready
- [ ] Backup plan documented

---

## 🎉 Launch Day

### Morning Checklist:
1. [ ] Verify app is accessible
2. [ ] Test admin login
3. [ ] Clear test data (if any)
4. [ ] Monitor Vercel dashboard
5. [ ] Monitor Supabase dashboard
6. [ ] Have backup admin credentials ready

### During Event:
- Monitor Vercel Analytics for traffic
- Watch Supabase for database issues
- Keep admin dashboard open
- Have technical support ready

### Post-Event:
- Export data from Supabase
- Download database backup
- Review analytics
- Collect feedback

---

## 📞 Support Resources

### Vercel:
- [Documentation](https://vercel.com/docs)
- [Status Page](https://vercel-status.com)
- [Community](https://github.com/vercel/next.js/discussions)

### Supabase:
- [Documentation](https://supabase.com/docs)
- [Status Page](https://status.supabase.com)
- [Discord](https://discord.supabase.com)

### Next.js:
- [Documentation](https://nextjs.org/docs)
- [GitHub](https://github.com/vercel/next.js)

---

**Your app is ready to launch! 🚀**
