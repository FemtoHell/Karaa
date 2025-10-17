# 🔧 FIX: Đăng ký bị đơ trên Render

## ❌ **CÁC VẤN ĐỀ ĐÃ TÌM THẤY**

### 1. **Email Service Blocking Request** (VẤN ĐỀ CHÍNH!)
- **File:** `backend/src/controllers/authController.js:31`
- **Vấn đề:** Khi gửi email bị lỗi hoặc timeout, request bị HANG và frontend hiển thị "..." mãi
- **Đã fix:** ✅ Thêm try-catch và timeout 15 giây

### 2. **Build Command không inject ENV đúng**
- **File:** `render.yaml:86`
- **Vấn đề:** `VITE_API_URL=... npm run build` không hoạt động với Vite
- **Đã fix:** ✅ Vite tự đọc từ `.env.production`

### 3. **CORS có thể bị sai**
- **File:** `backend/src/app.js:34`
- **Cần kiểm tra:** FRONTEND_URL trong Render Dashboard

---

## ✅ **ĐÃ SỬA CÁC FILE**

### **1. backend/src/controllers/authController.js**
```javascript
// Line 30-36: Thêm try-catch cho sendVerificationEmail
try {
  await sendVerificationEmail(email, name, verificationCode);
} catch (error) {
  console.error('Failed to send verification email:', error);
  return next(new ErrorResponse('Failed to send verification email...', 500));
}
```

### **2. backend/src/utils/emailService.js**
```javascript
// Line 29-32: Thêm timeout 15 giây
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Email service timeout after 15 seconds')), 15000)
);

// Line 197-202: Race condition giữa send email và timeout
return await Promise.race([sendEmailPromise, timeoutPromise]);
```

### **3. render.yaml**
```yaml
# Line 86: Bỏ VITE_API_URL khỏi build command
buildCommand: cd frontend && rm -rf node_modules package-lock.json && npm install --force && npm run build
```

---

## 🚀 **HƯỚNG DẪN DEPLOY LÊN RENDER**

### **Bước 1: Push code lên Git**
```bash
cd D:\Dev\Thanh\resume-builder
git add .
git commit -m "fix: registration timeout and CORS issues for Render deployment"
git push origin main
```

### **Bước 2: Kiểm tra Render Dashboard - Backend**

1. Truy cập: https://dashboard.render.com
2. Chọn service: **resume-builder-api-t701**
3. Click vào **Environment**
4. **QUAN TRỌNG:** Kiểm tra các biến sau:

```env
✅ FRONTEND_URL = https://resume-builder-frontend-behg.onrender.com
✅ CLIENT_URL = https://resume-builder-frontend-behg.onrender.com
✅ SMTP_HOST = smtp.gmail.com
✅ SMTP_PORT = 587
✅ SMTP_EMAIL = miyamoth129@gmail.com
✅ SMTP_PASSWORD = pclkfggwwhxgcagu
✅ FROM_EMAIL = miyamoth129@gmail.com
✅ FROM_NAME = ResumeBuilder
```

5. Click **Manual Deploy** → **Deploy latest commit**

### **Bước 3: Kiểm tra Frontend**

Frontend sẽ tự động rebuild khi có commit mới. Kiểm tra:
- URL: https://resume-builder-frontend-behg.onrender.com
- API URL trong build: `https://resume-builder-api-t701.onrender.com/api/v1`

### **Bước 4: Test đăng ký**

1. Mở: https://resume-builder-frontend-behg.onrender.com/login
2. Click tab **"Create Account"**
3. Điền thông tin: name, email, password
4. Click **"Create Account"**

**Kết quả mong đợi:**
- ✅ Không bị đơ "..."
- ✅ Redirect sang `/verify-email` trong **15 giây**
- ✅ Nhận email với mã 6 số (hoặc báo lỗi rõ ràng)

---

## 🔍 **DEBUG NẾU VẪN LỖI**

### **1. Check Backend Logs trên Render**
```
Dashboard → resume-builder-api → Logs
```

Tìm các dòng log:
- `✅ Verification email sent: <messageId>` → Email OK
- `❌ Error sending verification email:` → Email lỗi (check SMTP config)
- `❌ Email send failed or timed out` → Timeout (bình thường, sẽ show error)

### **2. Check Network trong Browser DevTools**

1. Mở DevTools (F12) → Network tab
2. Click "Create Account"
3. Xem request `POST /api/v1/auth/register`

**Nếu thành công:**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email...",
  "requiresVerification": true,
  "email": "your@email.com"
}
```

**Nếu lỗi:**
```json
{
  "success": false,
  "message": "Failed to send verification email..."
}
```

### **3. Check CORS Error**

Nếu thấy lỗi CORS trong console:
```
Access to fetch at 'https://resume-builder-api-t701.onrender.com/api/v1/auth/register'
from origin 'https://resume-builder-frontend-behg.onrender.com'
has been blocked by CORS policy
```

**FIX:** Kiểm tra lại `FRONTEND_URL` trong Render Backend Environment

---

## 📝 **CHECKLIST TRƯỚC KHI PUSH**

- [x] Đã sửa `authController.js` - thêm try-catch email
- [x] Đã sửa `emailService.js` - thêm timeout 15s
- [x] Đã sửa `render.yaml` - bỏ VITE_API_URL khỏi build command
- [x] File `.env.production` có đúng URL backend
- [ ] Đã test local với `npm run dev` (backend) và `npm run dev` (frontend)
- [ ] Đã commit và push lên git

---

## 🎯 **KẾT QUẢ SAU KHI FIX**

### **Trước:**
- Đăng ký bị đơ "..." mãi không response
- Frontend không nhận được error hoặc success message
- User không biết chuyện gì đang xảy ra

### **Sau:**
- ✅ Đăng ký response trong **tối đa 15 giây**
- ✅ Frontend nhận được success/error message rõ ràng
- ✅ Redirect sang verify email page nếu thành công
- ✅ Hiển thị lỗi nếu email không gửi được

---

## 📧 **LƯU Ý VỀ EMAIL**

Nếu email không gửi được (lỗi 500), có thể do:

1. **Gmail App Password sai:**
   - Tạo mới tại: https://myaccount.google.com/apppasswords
   - Cập nhật `SMTP_PASSWORD` trong Render

2. **Gmail block:**
   - Kiểm tra email có bật "Less secure app access"
   - Thử gửi test email từ local trước

3. **SMTP timeout:**
   - Render free tier có thể block port 587
   - Thử dùng port 465 với `secure: true`

---

## 🔗 **LINKS QUAN TRỌNG**

- Backend API: https://resume-builder-api-t701.onrender.com
- Frontend: https://resume-builder-frontend-behg.onrender.com
- Render Dashboard: https://dashboard.render.com
- GitHub Repo: (your-repo-url)

---

**Tạo bởi:** Claude Code
**Ngày:** 2025-10-17
