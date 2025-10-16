# 🔧 UPDATE SMTP ON RENDER

## Copy these exact values to Render.com Dashboard:

1. Go to: https://dashboard.render.com/
2. Select your **Backend** service
3. Go to **Environment** tab
4. Update/Add these variables:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=miyamoth129@gmail.com
SMTP_PASSWORD=pclkfggwwhxgcagu
FROM_EMAIL=miyamoth129@gmail.com
FROM_NAME=ResumeBuilder
```

## ⚠️ IMPORTANT:
- **NO SPACES** in SMTP_PASSWORD
- Password is: `pclkfggwwhxgcagu` (16 chars, no spaces)
- After update, click **Save Changes**
- Backend will auto-restart (takes ~2-3 minutes)

## ✅ Test after restart:
1. Go to: https://resume-builder-frontend-behg.onrender.com/login
2. Click "Register"
3. Enter email: miyamoth129@gmail.com
4. Submit → should receive 6-digit code in inbox
5. Check spam folder if not in inbox

## 🔍 If still not working:
Check backend logs on Render for SMTP errors:
- Dashboard → Backend service → Logs
- Look for lines with "❌ Error sending verification email"
