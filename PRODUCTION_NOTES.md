# 📝 Production Notes

## ⚠️ **Email Registration on Production**

### **Current Setup:**

- **Localhost (Development):** ✅ Registration works with SMTP
- **Production (Render):** ❌ Registration disabled (SMTP blocked by Render free tier)

### **Why Registration Disabled on Production:**

Render free tier **blocks all outbound SMTP connections** (ports 587, 465, 25) to prevent spam abuse.

**Email API services** (Resend, SendGrid, Mailgun) require paid features or domain verification, which we're not using currently to avoid costs.

### **Workarounds Considered:**

1. ✅ **Current approach:** Keep registration on localhost only
2. ❌ Resend API - Requires domain verification ($10/year for domain)
3. ❌ SendGrid API - Free tier only 100 emails/day, requires sender verification
4. ❌ Upgrade Render Plan - $7/month to unlock SMTP
5. ❌ Deploy to different platform - Migration effort

### **What Works on Production:**

- ✅ Login (existing accounts)
- ✅ OAuth login (Google, LinkedIn)
- ✅ Guest mode
- ✅ All resume features
- ✅ Dashboard and templates

### **What Doesn't Work on Production:**

- ❌ Email registration (new accounts with email verification)
- ❌ Password reset emails

### **Recommendation:**

**For Development:**
- Use localhost for testing registration flow
- Register test accounts locally
- Export/import user data to production if needed

**For Production Users:**
- Use **OAuth login** (Google/LinkedIn) - No email required!
- Use **Guest mode** for quick testing
- Contact admin to create accounts manually if needed

---

## 🔧 **Environment Setup**

### **Localhost (.env):**
```env
PORT=5001
MONGODB_URI=mongodb+srv://...
SMTP_HOST=smtp.gmail.com
SMTP_EMAIL=miyamoth129@gmail.com
SMTP_PASSWORD=pclkfggwwhxgcagu
```

### **Production (Render Environment Variables):**
```env
PORT=10000
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://resume-builder-frontend-behg.onrender.com

# SMTP configs exist but won't work (blocked by Render)
```

---

## 🚀 **Deploy Instructions**

### **Backend Deploy:**
```bash
git add .
git commit -m "your message"
git push origin main
```

Render will auto-deploy when detecting new commits.

### **Frontend Deploy:**
Frontend is also auto-deployed via Render when git push is detected.

---

## 📊 **Summary**

| Feature | Localhost | Production (Render) |
|---------|-----------|---------------------|
| Email Registration | ✅ Works | ❌ Disabled (SMTP blocked) |
| Login | ✅ Works | ✅ Works |
| OAuth (Google/LinkedIn) | ✅ Works | ✅ Works |
| Guest Mode | ✅ Works | ✅ Works |
| Resume Features | ✅ Works | ✅ Works |
| Email Verification | ✅ Works | ❌ Disabled |
| Password Reset | ✅ Works | ❌ Disabled |

**Last Updated:** 2025-10-17
