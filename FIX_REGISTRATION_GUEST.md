# 🔧 FIX: Registration & Guest Mode Issues

## ✅ Vấn đề 1: Registration - Email verification BẮT BUỘC phải gửi thành công

### Yêu cầu:
- **Sau khi đăng ký, user PHẢI nhận được email với verification code**
- Nếu email gửi thất bại → Registration phải fail
- User không thể đăng ký nếu email service không hoạt động

### Giải pháp đã thực hiện:

#### 1. **SMTP Configuration** (`backend/.env`)
```env
# TRƯỚC (SAI):
SMTP_PASSWORD=wexf teyx hqxh rqdx  # ❌ Có khoảng trắng

# SAU (ĐÚNG):
SMTP_PASSWORD=wexfteyxhqxhrqdx    # ✅ Xóa khoảng trắng
```

**Lưu ý:** Gmail App Password phải là chuỗi liền 16 ký tự, không có khoảng trắng.

#### 2. **Backend - authController.js** (dòng 59-67)
```javascript
// TRƯỚC (SAI - Skip error):
try {
  await sendVerificationEmail(email, name, verificationCode);
} catch (error) {
  console.error('Failed to send verification email:', error);
  // Continue even if email fails  ❌ Skip error
}

// SAU (ĐÚNG - BẮT BUỘC phải gửi được email):
try {
  await sendVerificationEmail(email, name, verificationCode);
} catch (error) {
  console.error('Failed to send verification email:', error);
  // Delete the created user since email failed
  await User.findByIdAndDelete(user._id);
  return next(new ErrorResponse('Failed to send verification email. Please try again or check your email configuration.', 500));
}
```

**Kết quả:**
- ✅ Nếu email gửi thất bại → Xóa user đã tạo
- ✅ Trả về error 500 với message rõ ràng
- ✅ Frontend sẽ hiển thị error cho user

#### 3. **Frontend - api.service.js** (dòng 300-302)
```javascript
// TRƯỚC (SAI - Graceful handling):
if (!response.ok) {
  // Check if it's an email service error
  if (data.message && data.message.includes('email')) {
    // Allow them to proceed if they have a token  ❌
    if (data.token) {
      return {
        success: true,
        token: data.token,
        user: data.user,
        warning: 'Email verification unavailable. You can login directly.'
      };
    }
  }
  throw new Error(data.message || 'Registration failed');
}

// SAU (ĐÚNG - Throw error ngay):
if (!response.ok) {
  throw new Error(data.message || 'Registration failed');
}
```

#### 4. **Frontend - Login.jsx** (dòng 79-83)
```javascript
// TRƯỚC (SAI - Xử lý warning):
if (result && result.success && result.warning) {
  alert(result.warning);  ❌
  // Continue to dashboard since they have token
}

// SAU (ĐÚNG - Xóa code xử lý warning):
// Code này đã được xóa vì không còn cần thiết
```

---

## ✅ Vấn đề 2: Guest mode "Session expired" khi dùng templates

### Nguyên nhân:
**Inconsistent localStorage keys:**
- `guestSession.js` dùng: `'guest_session_id'`
- `AuthContext.jsx` dùng: `'guestSessionId'`
- Dẫn đến không tìm thấy session → Session expired error

### Giải pháp:
**File: `frontend/src/utils/guestSession.js`**

```javascript
// TRƯỚC (SAI):
const GUEST_SESSION_KEY = 'guest_session_id'; // ❌

// SAU (ĐÚNG):
const GUEST_SESSION_KEY = 'guestSessionId'; // ✅ Đồng bộ với AuthContext
```

**Also added:**
```javascript
// Save expiry time when creating session
if (data.data.expiresIn) {
  localStorage.setItem('guestExpiresIn', data.data.expiresIn);
}
```

**Kết quả:**
- ✅ Guest session được lưu đúng key
- ✅ AuthContext tìm thấy session
- ✅ Guest có thể tạo resume

---

## 📋 Files đã sửa:

### Registration Email Fix:
1. **backend/.env**
   - Fix SMTP_PASSWORD (xóa khoảng trắng)

2. **backend/src/controllers/authController.js**
   - BẮT BUỘC phải gửi được email
   - Xóa user nếu email fail
   - Throw error rõ ràng

3. **frontend/src/services/api.service.js**
   - Xóa graceful handling cho email error
   - Throw error ngay khi registration fail

4. **frontend/src/Login.jsx**
   - Xóa code xử lý warning
   - Chỉ xử lý requiresVerification và error

### Guest Mode Fix:
5. **frontend/src/utils/guestSession.js**
   - Fix localStorage key: `guest_session_id` → `guestSessionId`
   - Add expiry time handling
   - Đồng bộ với AuthContext

---

## 🧪 Test Cases:

### Test 1: Registration với email service hoạt động
```
1. Fill registration form
2. Click "Create Account"
3. Backend gửi email verification code
4. ✅ Email được gửi thành công
5. ✅ User nhận được email với 6-digit code
6. ✅ Frontend redirect đến /verify-email
7. ✅ User nhập code và verify thành công
```

### Test 2: Registration với email service DOWN
```
1. Fill registration form
2. Click "Create Account"
3. Backend TRY gửi email verification code
4. ❌ Email gửi thất bại (SMTP error)
5. ✅ Backend XÓA user đã tạo
6. ✅ Backend trả về error 500
7. ✅ Frontend hiển thị error: "Failed to send verification email..."
8. ✅ User KHÔNG được đăng ký
```

### Test 3: Guest mode create resume
```
1. Click "Continue as Guest"
2. Navigate to /templates
3. Click "Use Template"
4. Navigate to /editor
5. Edit resume
6. Click "Save Draft"
7. ✅ Session found (guestSessionId exists)
8. ✅ Resume saved to Redis
9. ✅ NO "Session expired" error
```

### Test 4: Guest mode with existing session
```
1. User already has guestSessionId in localStorage
2. Navigate to /templates
3. Click "Use Template"
4. ✅ Use existing session (don't create new)
5. ✅ Resume created successfully
```

---

## 🔑 localStorage Keys (Đã đồng bộ):

```javascript
// Guest Mode
'guestSessionId'      // Session ID (consistent across all files)
'guestExpiresIn'      // Expiry timestamp
'guest_resume_id'     // Current resume ID

// Auth
'token'               // JWT token
'refreshToken'        // Refresh token
'user'                // User object JSON
```

---

## ✨ Kết quả:

### Registration:
- ✅ Email verification là BẮT BUỘC
- ✅ User PHẢI nhận được email mới đăng ký thành công
- ✅ Nếu email fail → Registration fail
- ✅ Error message rõ ràng cho user

### Email Service:
- ✅ SMTP password đã được fix (xóa khoảng trắng)
- ✅ Gmail App Password format đúng
- ✅ Email service hoạt động ổn định

### Guest Mode:
- ✅ Session được lưu đúng key
- ✅ Không còn "Session expired"
- ✅ Create resume thành công
- ✅ Save/Update resume hoạt động

---

## 🔍 Kiểm tra Email Service:

### Cách test email có gửi được không:
```bash
# 1. Start backend server
cd backend
npm start

# 2. Test registration qua API
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Check backend console log:
# ✅ Success: "✅ Verification email sent: <message-id>"
# ❌ Fail: "❌ Error sending verification email: <error>"
```

---

**Commit:** `fix: enforce email verification in registration, fix SMTP config, and guest session key consistency`
