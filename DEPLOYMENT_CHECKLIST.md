# ✅ Deployment Checklist

Use this checklist to ensure all steps are completed correctly.

---

## 📋 Pre-Deployment

- [ ] Code pushed to GitHub
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] MongoDB Atlas account created
- [ ] Netlify account created
- [ ] Render account created

---

## 🗄️ MongoDB Atlas Setup

- [ ] Database cluster created (Free M0 tier)
- [ ] Database user created with read/write permissions
- [ ] Network access set to "Allow from anywhere" (0.0.0.0/0)
- [ ] Connection string copied and saved
- [ ] Connection string tested (replace username/password)

**Connection String Format:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/resume_builder?retryWrites=true&w=majority
```

---

## 🔧 Render Backend Deployment

### Service Configuration
- [ ] Web service created from GitHub repo
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Region: Singapore (or closest)
- [ ] Plan: Free

### Environment Variables - Required
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `API_VERSION=v1`
- [ ] `MONGODB_URI=<from-mongodb-atlas>`
- [ ] `JWT_SECRET=<generated>`
- [ ] `JWT_REFRESH_SECRET=<generated>`
- [ ] `SESSION_SECRET=<generated>`
- [ ] `ENCRYPTION_SECRET=<generated>`
- [ ] `FRONTEND_URL=<will-add-after-netlify>`
- [ ] `CLIENT_URL=<will-add-after-netlify>`

### Environment Variables - Optional
- [ ] `GOOGLE_CLIENT_ID` (for Google OAuth)
- [ ] `GOOGLE_CLIENT_SECRET` (for Google OAuth)
- [ ] `LINKEDIN_CLIENT_ID` (for LinkedIn OAuth)
- [ ] `LINKEDIN_CLIENT_SECRET` (for LinkedIn OAuth)
- [ ] `SMTP_EMAIL` (for password reset emails)
- [ ] `SMTP_PASSWORD` (for password reset emails)

### Redis Setup
- [ ] Redis service created
- [ ] Region matches backend (Singapore)
- [ ] Plan: Free
- [ ] Internal Redis URL copied
- [ ] `REDIS_URL` added to backend environment variables

### Post-Deployment
- [ ] Service deployed successfully
- [ ] Backend URL copied (e.g., https://resume-builder-api.onrender.com)
- [ ] Health check working: `/api/v1/health`
- [ ] Database seeded: `npm run seed:all` in Shell
- [ ] Logs checked for errors

---

## 🎨 Netlify Frontend Deployment

### Service Configuration
- [ ] Site created from GitHub repo
- [ ] Base directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `frontend/dist`

### Environment Variables
- [ ] `VITE_API_URL=<backend-url-from-render>/api/v1`

### Post-Deployment
- [ ] Site deployed successfully
- [ ] Frontend URL copied (e.g., https://your-app.netlify.app)
- [ ] Site loads correctly
- [ ] No console errors in browser

---

## 🔄 Final Configuration

### Update Backend with Frontend URL
- [ ] Go to Render backend → Environment
- [ ] Update `FRONTEND_URL=<netlify-url>`
- [ ] Update `CLIENT_URL=<netlify-url>`
- [ ] Save changes (will trigger redeploy)
- [ ] Wait for redeploy to complete

### Update OAuth Callback URLs (if using)
- [ ] Google Cloud Console → Update callback URL
- [ ] LinkedIn Developer Portal → Update callback URL
- [ ] Callback format: `https://your-backend.onrender.com/api/v1/auth/google/callback`

---

## ✅ Testing Checklist

### Backend Tests
- [ ] Health endpoint responds: `GET /api/v1/health`
- [ ] Templates endpoint: `GET /api/v1/templates`
- [ ] CORS headers present in responses
- [ ] MongoDB connection active (check logs)
- [ ] Redis connection active (check logs)

### Frontend Tests
- [ ] Homepage loads correctly
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard displays
- [ ] Template selection works
- [ ] Resume editor loads
- [ ] Drag & drop reordering works
- [ ] Resume preview displays correctly
- [ ] PDF export works
- [ ] No CORS errors in console
- [ ] No API connection errors

### Integration Tests
- [ ] Create new resume from template
- [ ] Edit resume details
- [ ] Save changes (persists after refresh)
- [ ] Duplicate resume
- [ ] Delete resume
- [ ] Logout and login again
- [ ] Notifications display (if configured)
- [ ] OAuth login works (if configured)

---

## 🐛 Common Issues

### "Cannot connect to backend"
✅ Check `VITE_API_URL` in Netlify
✅ Verify backend is running on Render
✅ Check CORS configuration in backend

### "Database connection failed"
✅ Verify MongoDB connection string
✅ Check database user permissions
✅ Ensure IP whitelist includes 0.0.0.0/0

### "Redis connection error"
✅ Verify `REDIS_URL` environment variable
✅ Check Redis service is running
✅ Ensure both services in same region

### "Service unavailable" (Render)
✅ Free tier spins down after 15 min inactivity
✅ First request may take 30-60 seconds to wake up
✅ Consider upgrading to paid plan for always-on

---

## 📊 Deployment URLs

Record your deployment URLs here:

**Backend (Render):**
```
https://_____________________.onrender.com
```

**Frontend (Netlify):**
```
https://_____________________.netlify.app
```

**MongoDB Atlas:**
```
Cluster: _____________________
Database: resume_builder
```

**Redis (Render):**
```
Internal URL: redis://red-_____________________:6379
```

---

## 🎉 Post-Deployment

- [ ] Update README.md with deployment URLs
- [ ] Share frontend URL with team/users
- [ ] Set up monitoring (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate (automatic on Netlify/Render)
- [ ] Enable continuous deployment (automatic)

---

## 📈 Monitoring

### Render Dashboard
- Check deployment logs
- Monitor service health
- View memory/CPU usage
- Check error logs

### Netlify Dashboard
- View build logs
- Check deploy history
- Monitor bandwidth usage
- View function logs (if any)

### MongoDB Atlas
- Monitor database size
- Check connection count
- View slow queries
- Monitor performance

---

## 🚀 You're Done!

Congratulations! Your Resume Builder is now live and ready to use.

**Next Steps:**
1. Test all features thoroughly
2. Monitor logs for any errors
3. Share the URL with users
4. Gather feedback and iterate

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
