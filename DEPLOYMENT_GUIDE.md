# 🚀 Deployment Guide - Resume Builder

This guide will help you deploy the Resume Builder application with:
- **Frontend** on Netlify
- **Backend** on Render (with MongoDB Atlas & Redis)

---

## 📋 Prerequisites

Before deploying, you need:

1. **GitHub Account** - to connect your repository
2. **Netlify Account** - [Sign up here](https://app.netlify.com/signup)
3. **Render Account** - [Sign up here](https://dashboard.render.com/register)
4. **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

---

## 🗄️ Step 1: Set Up MongoDB Atlas

### 1.1 Create Database

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Build a Database"**
3. Select **"Free" (M0)** tier
4. Choose region closest to Singapore (for Render)
5. Click **"Create Cluster"**

### 1.2 Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Create username and strong password
4. Set **"Built-in Role"** to **"Read and write to any database"**
5. Click **"Add User"**

### 1.3 Whitelist IP Addresses

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Render)
4. Confirm by clicking **"Confirm"**

### 1.4 Get Connection String

1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/resume_builder?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your database user credentials
5. Save this string - you'll need it later

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub

If you haven't already:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.2 Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select **"resume-builder"** repository

### 2.3 Configure Service

Fill in the following settings:

- **Name**: `resume-builder-api`
- **Region**: `Singapore` (or closest to you)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free`

### 2.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

#### Required Variables (from MongoDB Atlas):
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resume_builder?retryWrites=true&w=majority
```

#### Auto-Generated Secrets:
```
JWT_SECRET=<click "Generate" button>
JWT_REFRESH_SECRET=<click "Generate" button>
SESSION_SECRET=<click "Generate" button>
ENCRYPTION_SECRET=<click "Generate" button>
```

#### OAuth Configuration (if you want social login):
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://resume-builder-api.onrender.com/api/v1/auth/google/callback

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_CALLBACK_URL=https://resume-builder-api.onrender.com/api/v1/auth/linkedin/callback
```

#### Email Configuration (for password reset):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@resumebuilder.com
FROM_NAME=ResumeBuilder
```

#### Other Required Variables:
```
NODE_ENV=production
PORT=10000
API_VERSION=v1
FRONTEND_URL=https://your-app-name.netlify.app
CLIENT_URL=https://your-app-name.netlify.app
```

### 2.5 Add Redis

1. In your Render dashboard, click **"New +"** → **"Redis"**
2. **Name**: `resume-builder-redis`
3. **Region**: `Singapore` (same as backend)
4. **Plan**: `Free`
5. Click **"Create Redis"**
6. Copy the **"Internal Redis URL"**
7. Go back to your web service → **Environment** → Add:
   ```
   REDIS_URL=<your-internal-redis-url>
   ```

### 2.6 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL:
   ```
   https://resume-builder-api.onrender.com
   ```

### 2.7 Seed Database

After deployment, seed templates and guides:

1. Go to your service → **Shell**
2. Run:
   ```bash
   npm run seed:all
   ```

---

## 🎨 Step 3: Deploy Frontend to Netlify

### 3.1 Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select **"resume-builder"** repository

### 3.2 Configure Build Settings

Netlify should auto-detect these settings:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

If not auto-detected, set them manually.

### 3.3 Add Environment Variables

Before deploying, click **"Add environment variables"**:

```
VITE_API_URL=https://resume-builder-api.onrender.com/api/v1
```

Replace with your actual Render backend URL from Step 2.6.

### 3.4 Deploy

1. Click **"Deploy site"**
2. Wait for deployment (2-3 minutes)
3. Once deployed, you'll get a URL like:
   ```
   https://random-name-12345.netlify.app
   ```

### 3.5 Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow instructions to connect your domain

---

## 🔄 Step 4: Update Backend URLs

Now that you have your Netlify URL, update backend environment variables:

1. Go to Render dashboard → Your backend service
2. Go to **Environment** tab
3. Update these variables:
   ```
   FRONTEND_URL=https://your-actual-site.netlify.app
   CLIENT_URL=https://your-actual-site.netlify.app
   ```
4. Click **"Save Changes"**
5. Service will automatically redeploy

---

## ✅ Step 5: Verify Deployment

### 5.1 Test Backend

Visit: `https://resume-builder-api.onrender.com/api/v1/health`

You should see:
```json
{
  "success": true,
  "message": "API is running"
}
```

### 5.2 Test Frontend

1. Visit your Netlify URL
2. Try to register/login
3. Create a new resume
4. Check if templates load correctly

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Service won't start
- Check **Logs** tab in Render dashboard
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct

**Problem**: Database connection error
- Verify MongoDB Atlas whitelist includes `0.0.0.0/0`
- Check username/password in connection string
- Ensure database user has correct permissions

**Problem**: Redis connection error
- Verify Redis service is running
- Check `REDIS_URL` environment variable
- Ensure both services are in the same region

### Frontend Issues

**Problem**: Can't connect to backend
- Check `VITE_API_URL` environment variable
- Ensure backend is deployed and running
- Check browser console for CORS errors

**Problem**: Build fails
- Check **Deploy log** in Netlify
- Verify `package.json` has correct dependencies
- Try building locally: `cd frontend && npm run build`

### CORS Issues

If you see CORS errors:

1. Check `FRONTEND_URL` and `CLIENT_URL` in backend
2. Ensure they match your exact Netlify URL
3. Don't include trailing slash

---

## 📝 Environment Variables Checklist

### Backend (Render)

- [x] `NODE_ENV=production`
- [x] `MONGODB_URI` (from MongoDB Atlas)
- [x] `REDIS_URL` (from Render Redis)
- [x] `JWT_SECRET` (generated)
- [x] `JWT_REFRESH_SECRET` (generated)
- [x] `SESSION_SECRET` (generated)
- [x] `ENCRYPTION_SECRET` (generated)
- [x] `FRONTEND_URL` (from Netlify)
- [x] `CLIENT_URL` (from Netlify)
- [ ] `GOOGLE_CLIENT_ID` (optional)
- [ ] `GOOGLE_CLIENT_SECRET` (optional)
- [ ] `SMTP_EMAIL` (optional, for password reset)
- [ ] `SMTP_PASSWORD` (optional)

### Frontend (Netlify)

- [x] `VITE_API_URL` (from Render backend)

---

## 🔄 Continuous Deployment

Both Netlify and Render support automatic deployments:

1. Push changes to GitHub
2. Netlify and Render will automatically:
   - Pull latest code
   - Run build commands
   - Deploy new version

To trigger manual deployment:
- **Netlify**: Deploys → Trigger deploy
- **Render**: Manual Deploy → Deploy latest commit

---

## 💰 Cost Breakdown

### Free Tier Limits

**Netlify (Free)**
- 100 GB bandwidth/month
- 300 build minutes/month
- Automatic HTTPS

**Render (Free)**
- 750 hours/month (enough for 1 service running 24/7)
- 0.5 GB RAM
- Services spin down after 15 min of inactivity
- Redis: 25 MB storage

**MongoDB Atlas (Free)**
- 512 MB storage
- Shared RAM
- No backup

### Upgrading

If you need more resources:
- **Netlify Pro**: $19/month
- **Render Starter**: $7/month per service
- **MongoDB M10**: $0.08/hour (~$57/month)

---

## 🎉 Success!

Your Resume Builder app is now live!

- **Frontend**: https://your-app.netlify.app
- **Backend**: https://resume-builder-api.onrender.com

Share the frontend URL with users to start building resumes!

---

## 📚 Additional Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## 🆘 Need Help?

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review deployment logs in Netlify/Render
3. Verify all environment variables are correct
4. Test backend health endpoint
5. Check browser console for frontend errors

Good luck with your deployment! 🚀
