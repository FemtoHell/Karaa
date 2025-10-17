# Debug Hướng Dẫn: Xóa Tài Khoản

## Vấn Đề
Route xóa tài khoản báo lỗi "Route not found" trên Render

## Các Thay Đổi Đã Thực Hiện

### 1. Sửa Frontend Endpoints
**File: `frontend/src/config/api.js`**
- ✅ Thêm `DELETE_ACCOUNT: /api/v1/users/account`
- ✅ Thêm `DELETE_ACCOUNT_PERMANENT: /api/v1/users/account/permanent`
- ❌ Trước đây dùng sai: `/api/v1/users/profile/account/permanent`

### 2. Sửa API Service
**File: `frontend/src/services/api.service.js`**
- ✅ Cập nhật `deleteAccount()` dùng endpoint đúng
- ✅ Thêm `permanentDeleteAccount(password, confirmation)` với đầy đủ params

### 3. Sửa Profile Component
**File: `frontend/src/Profile.jsx`**
- ✅ Cập nhật `handleDeleteAccount()` dùng `API_ENDPOINTS.DELETE_ACCOUNT_PERMANENT`

### 4. Cải Thiện Backend Controller
**File: `backend/src/controllers/userController.js`**
- ✅ Thêm logging chi tiết hơn
- ✅ Xử lý OAuth users (không cần password)
- ✅ Xử lý local users (cần password)
- ✅ Try-catch để bắt lỗi MongoDB
- ✅ Kiểm tra `deletedUser` sau khi delete
- ✅ Cookie settings chuẩn cho production

### 5. Sửa Validation Middleware
**File: `backend/src/middleware/validation.js`**
- ✅ Password là optional (chỉ bắt buộc với local users)
- ❌ Trước đây: `password` optional nhưng vẫn yêu cầu notEmpty() → gây lỗi

### 6. Thêm Test Endpoint
**File: `backend/src/routes/userRoutes.js`**
- ✅ Thêm `GET /api/v1/users/test-auth` để test authentication

## Cách Kiểm Tra Trên Render

### Bước 1: Kiểm Tra MongoDB Connection
```bash
cd backend
node test-delete-user.js
```

Nếu không kết nối được:
1. Kiểm tra biến môi trường `MONGODB_URI` trên Render dashboard
2. Đảm bảo IP của Render được whitelist trên MongoDB Atlas

### Bước 2: Test Authentication
```bash
curl -X GET https://your-app.onrender.com/api/v1/users/test-auth \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Cookie: token=YOUR_TOKEN"
```

### Bước 3: Test Delete Account (Với Test User)
```bash
# Với OAuth user (không cần password)
curl -X DELETE https://your-app.onrender.com/api/v1/users/account/permanent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "confirmation": "DELETE MY ACCOUNT"
  }'

# Với local user (cần password)
curl -X DELETE https://your-app.onrender.com/api/v1/users/account/permanent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "your_password",
    "confirmation": "DELETE MY ACCOUNT"
  }'
```

## Checklist Trên Render

- [ ] Kiểm tra Logs: Dashboard → Logs → Tìm "DELETE" hoặc "Permanently deleted"
- [ ] Verify Environment Variables:
  - [ ] `MONGODB_URI` có đúng không?
  - [ ] `JWT_SECRET` đã set chưa?
  - [ ] `NODE_ENV=production`
- [ ] Check MongoDB Atlas:
  - [ ] IP Whitelist: `0.0.0.0/0` (allow all) hoặc thêm IP của Render
  - [ ] Database user có quyền delete không?
- [ ] Test với Postman hoặc cURL:
  - [ ] Test endpoint `/api/v1/users/test-auth` trước
  - [ ] Kiểm tra token có hợp lệ không

## Routes Backend (Đúng)

```
DELETE /api/v1/users/account              → Soft delete
DELETE /api/v1/users/account/permanent    → Hard delete (xóa vĩnh viễn)
```

## Lỗi Thường Gặp

### 1. "Route not found"
- **Nguyên nhân**: Frontend gọi sai endpoint
- **Giải pháp**: Đã sửa trong commit này

### 2. "Password is required"
- **Nguyên nhân**: OAuth user nhưng validation yêu cầu password
- **Giải pháp**: Đã sửa validation middleware

### 3. "User not found" sau khi delete
- **Nguyên nhân**: MongoDB không xóa được
- **Giải pháp**: 
  - Kiểm tra connection
  - Kiểm tra user permissions
  - Xem logs trong controller

### 4. CORS error
- **Nguyên nhân**: Frontend URL không được config
- **Giải pháp**: Set `FRONTEND_URL` env variable trên Render

## Logs Để Xem

Khi delete account thành công, bạn sẽ thấy logs:
```
Delete account request for user 507f1f77bcf86cd799439011, provider: google
OAuth user - skipping password verification
Deleting resumes for user 507f1f77bcf86cd799439011...
Permanently deleted 3 resumes
Deleting notifications for user 507f1f77bcf86cd799439011...
Permanently deleted 5 notifications
Clearing cache for user 507f1f77bcf86cd799439011...
Permanently deleting user account 507f1f77bcf86cd799439011 from MongoDB...
Successfully deleted user account 507f1f77bcf86cd799439011 from MongoDB
```

## Next Steps

1. Deploy code lên Render
2. Test với một tài khoản test (KHÔNG dùng tài khoản chính)
3. Kiểm tra logs trên Render dashboard
4. Verify trong MongoDB Atlas rằng user đã được xóa

## Contact

Nếu vẫn còn lỗi, cung cấp:
1. Screenshot của error message
2. Logs từ Render dashboard
3. Provider của user (local/google/facebook)
