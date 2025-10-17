# Hướng Dẫn Test Chức Năng Xóa Tài Khoản

## Các Thay Đổi Mới

### 1. Backend - Controller có logging chi tiết
- ✅ Console logs ở mỗi bước
- ✅ Redis errors không block việc xóa account
- ✅ Error stack trace đầy đủ

### 2. Backend - Redis graceful fallback
- ✅ Check `redisClient.isOpen` trước khi dùng
- ✅ Không crash nếu Redis chưa connect

### 3. Frontend - Logging và error handling
- ✅ Log request body
- ✅ Log response status và data
- ✅ Hiển thị validation errors từ backend
- ✅ Không gửi password nếu rỗng (cho OAuth users)

## Cách Test Trên Local

### Bước 1: Start Backend
```bash
cd backend
npm run dev
```

Kiểm tra logs:
- ✅ MongoDB connected
- ⚠️ Redis có thể không connect (OK - không bắt buộc)

### Bước 2: Start Frontend
```bash
cd frontend
npm run dev
```

### Bước 3: Test Delete Account

1. **Đăng nhập vào app**
2. **Mở DevTools Console** (F12)
3. **Vào Profile page**
4. **Click "Delete All My Data"**
5. **Nhập thông tin:**
   - Confirmation: `DELETE MY ACCOUNT` (chính xác)
   - Password: 
     - Local user: nhập password
     - OAuth user (Google/Facebook): để trống hoặc bỏ qua

6. **Xem Console Logs:**
   
   Frontend logs:
   ```
   Deleting account...
   User provider: local (hoặc google)
   Has password: true/false
   Endpoint: http://localhost:5000/api/v1/users/account/permanent
   Request body: {confirmation: "DELETE MY ACCOUNT", password: "***"}
   Response status: 200
   Response data: {success: true, ...}
   ```
   
   Backend logs:
   ```
   Delete account request for user 507f..., provider: local
   Password verified for local user
   Deleting resumes for user 507f...
   Permanently deleted 2 resumes
   Deleting notifications for user 507f...
   Permanently deleted 1 notifications
   Clearing cache for user 507f...
   Cache cleared successfully (hoặc warning nếu Redis không connect)
   Permanently deleting user account 507f... from MongoDB...
   Successfully deleted user account 507f... from MongoDB
   ```

## Các Lỗi Thường Gặp và Cách Fix

### 1. "Failed to delete account" - Lỗi chung

**Xem backend console để biết lỗi cụ thể:**

```bash
# Backend terminal sẽ show:
Error during permanent account deletion: [Chi tiết lỗi]
Error stack: [Stack trace]
```

### 2. "Password is required for local accounts"

**Nguyên nhân:** Bạn dùng local account nhưng không nhập password

**Giải pháp:** Nhập password vào form

### 3. "Incorrect password"

**Nguyên nhân:** Password sai

**Giải pháp:** Nhập đúng password

### 4. "Confirmation text must be DELETE MY ACCOUNT"

**Nguyên nhân:** Không nhập đúng text confirmation

**Giải pháp:** Nhập chính xác: `DELETE MY ACCOUNT` (viết hoa, có khoảng trắng)

### 5. "User not found"

**Nguyên nhân:** 
- Token hết hạn
- User đã bị xóa trước đó

**Giải pháp:** 
- Logout và login lại
- Kiểm tra MongoDB có user này không

### 6. Redis Connection Error

**Log:** `Redis not connected, skipping DEL`

**Giải pháp:** 
- Không cần lo, Redis là optional
- App vẫn xóa được account
- Nếu muốn dùng Redis, start Redis server:
  ```bash
  # Windows (nếu có Redis installed)
  redis-server
  
  # hoặc dùng Docker
  docker run -d -p 6379:6379 redis
  ```

## Test với MongoDB

Sau khi delete account, verify trong MongoDB:

```bash
# Connect to MongoDB
mongosh "mongodb+srv://your-connection-string"

# Switch to database
use your_database_name

# Check user không còn
db.users.find({email: "deleted_user@example.com"})
# Kết quả: rỗng

# Check resumes của user đã bị xóa
db.resumes.find({user: ObjectId("507f1f77bcf86cd799439011")})
# Kết quả: rỗng
```

## Test Script

Chạy test script để verify endpoint:

```bash
cd backend

# Lấy token từ browser (DevTools → Application → LocalStorage)
node test-delete-endpoint.js YOUR_TOKEN_HERE
```

## Checklist Debug

Khi gặp lỗi "Failed to delete account", kiểm tra:

- [ ] Backend server đang chạy?
- [ ] MongoDB connected? (xem backend logs)
- [ ] Token còn hợp lệ? (test `/api/v1/users/test-auth`)
- [ ] User tồn tại trong database?
- [ ] Provider đúng? (local vs google/facebook)
- [ ] Password đúng? (nếu local user)
- [ ] Confirmation text đúng? (`DELETE MY ACCOUNT`)
- [ ] Xem error stack trace trong backend console
- [ ] Xem console logs trong frontend DevTools

## Environment Variables Cần Thiết

Backend `.env`:
```env
# Required
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret

# Optional
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

## Liên Hệ Debug

Nếu vẫn lỗi, cung cấp:
1. **Frontend console logs** (tất cả logs từ "Deleting account..." đến response)
2. **Backend terminal logs** (tất cả logs từ "Delete account request..." hoặc error logs)
3. **Screenshots** của error message
4. **Thông tin:**
   - Provider: local/google/facebook
   - Có nhập password không
   - Confirmation text đã nhập
