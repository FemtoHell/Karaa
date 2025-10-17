# Security & Privacy Features

## FR-7: Bảo mật và Quyền riêng tư

### FR-7.1: Mã hóa dữ liệu người dùng ✓

Tất cả dữ liệu cá nhân nhạy cảm được mã hóa sử dụng **AES-256-GCM** encryption:

#### Dữ liệu được mã hóa:
- **Phone numbers** (Số điện thoại)
- **Location** (Địa chỉ)
- **Bio** (Thông tin cá nhân)
- **Email trong CV** (Content của resume)
- **Phone trong CV**
- **Address trong CV**

#### Implementation:
```javascript
// Backend: src/utils/encryption.js
const { encrypt, decrypt } = require('./utils/encryption');

// Mã hóa khi lưu
const encryptedPhone = encrypt(userPhone);

// Giải mã khi đọc
const decryptedPhone = decrypt(encryptedPhone);
```

#### User Model Schema:
```javascript
phone: {
  type: String,
  default: null  // Stored encrypted
},
location: {
  type: String,
  default: null  // Stored encrypted
},
bio: {
  type: String,
  default: null  // Stored encrypted
}
```

#### API Endpoints:
- `GET /api/v1/users/profile` - Tự động giải mã dữ liệu khi trả về
- `PUT /api/v1/users/profile` - Tự động mã hóa dữ liệu khi cập nhật

#### Encryption Algorithm Details:
- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **IV Length**: 16 bytes (random per encryption)
- **Authentication Tag**: 16 bytes
- **Format**: `iv:encryptedData:authTag`

---

### FR-7.2: Xóa tài khoản và toàn bộ dữ liệu ✓

Người dùng có quyền xóa hoàn toàn tài khoản và tất cả dữ liệu liên quan.

#### Hai loại xóa:

##### 1. Soft Delete (Xóa mềm)
```
DELETE /api/v1/users/account
```
- Đánh dấu tài khoản là `deletedAt`
- Dữ liệu vẫn còn trong database (có thể khôi phục)
- CV và notifications cũng được soft delete
- Không yêu cầu xác nhận mật khẩu

##### 2. Permanent Delete (Xóa vĩnh viễn) - FR-7.2
```
DELETE /api/v1/users/account/permanent
```

**Yêu cầu:**
- Nhập mật khẩu để xác nhận
- Gõ chính xác cụm từ: `DELETE MY ACCOUNT`
- Không thể khôi phục sau khi xóa

**Dữ liệu bị xóa vĩnh viễn:**
- ✓ User account
- ✓ Tất cả resumes/CVs
- ✓ Tất cả notifications
- ✓ Tất cả cache entries
- ✓ Encrypted personal data
- ✓ Activity history

**Request Body:**
```json
{
  "password": "user_password",
  "confirmation": "DELETE MY ACCOUNT"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Account and all associated data permanently deleted",
  "data": {
    "resumesDeleted": 5,
    "notificationsDeleted": 12
  }
}
```

#### UI Implementation:
- Modal cảnh báo rõ ràng về hậu quả
- Require explicit confirmation text
- Password verification
- Clear warning about irreversibility
- Count of data that will be deleted

---

### FR-7.3: Không công khai CV khi chưa được sự đồng ý ✓

CV/Resume mặc định là **private** và yêu cầu sự đồng ý rõ ràng để chia sẻ.

#### Resume Schema Privacy Settings:
```javascript
isPublic: {
  type: Boolean,
  default: false  // Default to PRIVATE
},
privacyConsent: {
  given: {
    type: Boolean,
    default: false
  },
  givenAt: {
    type: Date,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  }
}
```

#### Privacy Rules:
1. **Default Private**: Mọi CV mới đều ở chế độ private
2. **Explicit Consent Required**: Phải có hành động rõ ràng để public
3. **Consent Tracking**: Lưu lại thời gian và IP address khi đồng ý
4. **Revocable**: Có thể thu hồi sự đồng ý bất cứ lúc nào
5. **Share Control**: Kiểm soát quyền download, password protect, expiration

#### Share Settings:
```javascript
shareSettings: {
  allowDownload: Boolean,    // Cho phép tải về
  password: String,          // Bảo vệ bằng mật khẩu
  expiresAt: Date,          // Hết hạn chia sẻ
  viewCount: Number         // Đếm số lượt xem
}
```

#### UI Features:
- Privacy status badge (Public/Private)
- Explicit "Make Public" button with consent form
- Share link generation với options
- View access logs
- Revoke access anytime

---

## Security Best Practices Implemented

### 1. Data Protection
- ✓ AES-256-GCM encryption for sensitive data
- ✓ PBKDF2 key derivation
- ✓ Random IV per encryption
- ✓ Authentication tags for integrity
- ✓ Secure password hashing (bcrypt)

### 2. Privacy by Default
- ✓ CVs default to private
- ✓ Explicit consent required for sharing
- ✓ Consent tracking and audit trail
- ✓ Revocable permissions

### 3. Data Deletion Rights
- ✓ Soft delete option
- ✓ Permanent delete with confirmation
- ✓ Complete data removal
- ✓ Cache clearing
- ✓ Audit logging

### 4. Access Control
- ✓ JWT authentication
- ✓ Password verification for sensitive operations
- ✓ Rate limiting
- ✓ CORS protection
- ✓ Helmet security headers

### 5. Compliance
- ✓ GDPR right to deletion
- ✓ GDPR right to data portability
- ✓ Privacy-by-default design
- ✓ Transparent data handling
- ✓ User consent management

---

## Testing

### Test Encryption:
```bash
cd backend
node test-encryption.js
```

### Test API Endpoints:

#### 1. Update Profile with Encrypted Data
```bash
curl -X PUT http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+84 123 456 789",
    "location": "Ho Chi Minh City, Vietnam",
    "bio": "Software developer"
  }'
```

#### 2. Permanent Delete Account
```bash
curl -X DELETE http://localhost:5000/api/v1/users/account/permanent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "user_password",
    "confirmation": "DELETE MY ACCOUNT"
  }'
```

---

## Environment Variables

Cần thiết lập trong `.env`:
```env
# JWT Secret (also used for encryption fallback)
JWT_SECRET=your-super-secret-key-min-32-characters

# Optional: Dedicated encryption secret
ENCRYPTION_SECRET=your-encryption-secret-key-min-32-characters
```

---

## Database Indexes

Để đảm bảo hiệu suất khi query encrypted data:
```javascript
// User model
userSchema.index({ deletedAt: 1 });
userSchema.index({ email: 1, deletedAt: 1 });

// Resume model
resumeSchema.index({ user: 1, deletedAt: 1 });
resumeSchema.index({ isPublic: 1 });
resumeSchema.index({ shareId: 1 }, { unique: true, sparse: true });
```

---

## Migration Notes

Nếu database có dữ liệu cũ chưa được mã hóa:

1. Chạy migration script để mã hóa dữ liệu hiện có
2. Backup database trước khi migrate
3. Test trên staging environment trước

```javascript
// Example migration script
const User = require('./models/User');
const { encrypt } = require('./utils/encryption');

async function migrateEncryption() {
  const users = await User.find({ phone: { $exists: true } });
  
  for (const user of users) {
    if (user.phone && !user.phone.includes(':')) {
      user.phone = encrypt(user.phone);
      await user.save();
    }
  }
}
```

---

## Frontend Security

### 1. Token Storage
- Store JWT in localStorage
- Clear on logout
- Auto-refresh mechanism

### 2. API Requests
- Always include Authorization header
- HTTPS only in production
- Credentials: 'include' for cookies

### 3. UI Security
- Password confirmation for sensitive actions
- Clear warnings about data deletion
- Explicit consent checkboxes
- Loading states to prevent double-submit

---

## Monitoring & Logging

### Events to Log:
- ✓ Account deletion requests
- ✓ Privacy consent changes
- ✓ Failed deletion attempts
- ✓ Encryption/decryption errors
- ✓ Unusual access patterns

### Log Format:
```javascript
console.log(`Permanently deleted user account ${userId}`);
console.log(`Deleted ${deletedCount} resumes for user ${userId}`);
console.log(`Privacy consent given for resume ${resumeId}`);
```

---

## Support & Documentation

Nếu có câu hỏi về security features:
1. Đọc document này
2. Xem code trong `src/utils/encryption.js`
3. Check `src/controllers/userController.js`
4. Review `src/models/User.js` và `src/models/Resume.js`

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: ✓ Implemented & Tested
