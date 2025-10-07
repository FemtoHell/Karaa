# 🔐 Google OAuth cho WEB Application - Hướng dẫn chi tiết

## ⚠️ Lưu ý: Đây là WEB APP, KHÔNG phải Mobile/Desktop App!

---

## 📝 Bước 1: Vào Google Cloud Console

1. Truy cập: **https://console.cloud.google.com/**
2. Login bằng Google account

---

## 📦 Bước 2: Tạo Project

1. Click **Select a project** (dropdown bên logo Google Cloud)
2. Click **NEW PROJECT** (góc trên bên phải popup)
3. Điền:
   - **Project name**: `Resume Builder`
   - **Organization**: Để trống (No organization)
   - **Location**: Để trống
4. Click **CREATE**
5. Đợi ~10 giây → Click **SELECT PROJECT** để chọn project vừa tạo

---

## 🔑 Bước 3: Configure OAuth Consent Screen (BẮT BUỘC!)

**Google bắt phải config consent screen trước khi tạo credentials!**

1. Menu (☰) → **APIs & Services** → **OAuth consent screen**

2. **User Type**:
   - Chọn: ⭕ **External** (cho phép bất kỳ ai login)
   - Click **CREATE**

3. **OAuth consent screen** (Trang 1/4):
   - **App name**: `Resume Builder`
   - **User support email**: Chọn email của bạn từ dropdown
   - **App logo**: BỎ QUA (không bắt buộc)
   - **App domain**: BỎ QUA tất cả (Application home page, Privacy, Terms)
   - **Authorized domains**: BỎ QUA (để trống)
   - **Developer contact information**: Điền email của bạn
   - Click **SAVE AND CONTINUE**

4. **Scopes** (Trang 2/4):
   - Click **ADD OR REMOVE SCOPES**
   - Tìm và tick ✅:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click **UPDATE**
   - Click **SAVE AND CONTINUE**

5. **Test users** (Trang 3/4):
   - Click **+ ADD USERS**
   - Thêm email của bạn (để test)
   - Click **ADD**
   - Click **SAVE AND CONTINUE**

6. **Summary** (Trang 4/4):
   - Review thông tin
   - Click **BACK TO DASHBOARD**

✅ **OAuth Consent Screen đã xong!**

---

## 🌐 Bước 4: Enable Google+ API (hoặc People API)

1. Menu (☰) → **APIs & Services** → **Library**

2. Search: `Google People API` (hoặc `Google+ API`)

3. Click **Google People API** → Click **ENABLE**

✅ Đợi vài giây để enable

---

## 🔐 Bước 5: Tạo OAuth Client ID cho WEB

1. Menu (☰) → **APIs & Services** → **Credentials**

2. Click **+ CREATE CREDENTIALS** (góc trên)

3. Chọn: **OAuth client ID**

4. **Application type**:
   - Chọn: **Web application** ⭐ (QUAN TRỌNG!)

5. **Name**:
   - Điền: `Resume Builder Web Client`

6. **Authorized JavaScript origins** (Tùy chọn):
   - Click **+ ADD URI**
   - Thêm: `http://localhost:5173` (Frontend URL)
   - Click **+ ADD URI**
   - Thêm: `http://localhost:5000` (Backend URL)

7. **Authorized redirect URIs** ⭐ (QUAN TRỌNG NHẤT!):
   - Click **+ ADD URI**
   - Thêm chính xác:
     ```
     http://localhost:5000/api/v1/auth/google/callback
     ```
   - ⚠️ **KHÔNG có dấu cách, KHÔNG có / cuối, CHÍNH XÁC từng ký tự!**

8. Click **CREATE**

---

## 📋 Bước 6: Copy Credentials

Popup **OAuth client created** hiện ra:

- **Your Client ID**:
  ```
  123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
  ```

- **Your Client Secret**:
  ```
  GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
  ```

✅ Click **DOWNLOAD JSON** (lưu backup) hoặc copy ngay!

**⚠️ QUAN TRỌNG: Lưu 2 giá trị này lại ngay!**

---

## 📝 Bước 7: Paste vào `.env`

Mở file `backend/.env` và điền:

```env
# Google OAuth (WEB Application)
GOOGLE_CLIENT_ID=123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

---

## ✅ Bước 8: Test OAuth

### Test 1: Start backend

```bash
cd backend
npm run dev
```

Phải thấy:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

### Test 2: Test Google OAuth

Mở browser:
```
http://localhost:5000/api/v1/auth/google
```

**Kết quả mong đợi:**

1. ✅ Redirect đến trang Google login
2. ✅ Chọn Google account
3. ✅ Trang "Resume Builder wants to access your Google Account"
4. ✅ Click "Allow"
5. ✅ Redirect về `http://localhost:5173/auth/callback?token=...&user=...`

**Nếu có lỗi:**

### ❌ Error: "redirect_uri_mismatch"

**Nguyên nhân:** Callback URL không khớp

**Giải pháp:**
1. Vào Google Cloud Console → Credentials
2. Click vào OAuth client vừa tạo
3. Check **Authorized redirect URIs** phải CHÍNH XÁC:
   ```
   http://localhost:5000/api/v1/auth/google/callback
   ```
4. Không có:
   - ❌ Dấu cách thừa
   - ❌ Dấu `/` ở cuối
   - ❌ `https` (phải là `http` khi dev)
   - ❌ Port sai
5. Save lại → đợi 1-2 phút → test lại

### ❌ Error: "Access blocked: This app's request is invalid"

**Nguyên nhân:** Chưa config OAuth consent screen

**Giải pháp:** Làm lại Bước 3

### ❌ Error: "This app isn't verified"

**Bình thường!** Khi develop sẽ thấy warning này.

**Giải pháp:**
1. Click **Advanced**
2. Click **Go to Resume Builder (unsafe)**
3. Click **Allow**
4. Trong production thì phải verify app

---

## 🎯 Tóm tắt các bước:

1. ✅ Tạo Project trên Google Cloud
2. ✅ Config **OAuth Consent Screen** (External)
3. ✅ Enable **Google People API**
4. ✅ Tạo **OAuth Client ID** → chọn **Web application**
5. ✅ Add redirect URI: `http://localhost:5000/api/v1/auth/google/callback`
6. ✅ Copy Client ID & Secret → paste vào `.env`
7. ✅ Test: `http://localhost:5000/api/v1/auth/google`

---

## 📱 Screenshots Reference (Vị trí các nút)

### OAuth Consent Screen:
```
APIs & Services > OAuth consent screen > CREATE

User Type: [○ Internal] [⭕ External] <- Chọn External
                                          Click CREATE
```

### Create Credentials:
```
APIs & Services > Credentials > + CREATE CREDENTIALS

↓
OAuth client ID

Application type: [Web application ▼]  <- PHẢI chọn Web!

Authorized redirect URIs:
┌──────────────────────────────────────────────────────────┐
│ http://localhost:5000/api/v1/auth/google/callback       │ <- Chính xác!
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 Nếu muốn thay đổi sau này

1. Google Console → Credentials
2. Click vào OAuth client name
3. Edit redirect URIs
4. **QUAN TRỌNG:** Sau khi edit phải đợi 1-2 phút để Google update!

---

## 🎓 Hiểu rõ hơn về OAuth Flow:

```
User Browser                Backend Server              Google OAuth
     |                           |                           |
     |---(1) Click Login-------->|                           |
     |                           |                           |
     |<--(2) Redirect to Google--|                           |
     |                           |                           |
     |---------------(3) Login to Google ------------------->|
     |                           |                           |
     |<--------------(4) Google returns code ----------------|
     |                           |                           |
     |--(5) Send code to backend>|                           |
     |                           |---(6) Exchange code------>|
     |                           |<--(7) Get user info-------|
     |                           |                           |
     |<--(8) Return JWT token----|                           |
     |                           |                           |
```

**Callback URL** là nơi Google sẽ redirect về sau khi user login (bước 4).

---

## 📚 Tài liệu tham khảo:

- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2/web-server
- Passport Google Strategy: http://www.passportjs.org/packages/passport-google-oauth20/

---

**Nếu vẫn bị lỗi, paste error message và tôi sẽ giúp debug!** 🚀
