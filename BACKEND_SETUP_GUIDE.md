# 🚀 Backend Setup Guide - Resume Builder

## ✅ Tóm tắt những gì đã hoàn thành

### 1. Backend Structure hoàn chỉnh
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MySQL connection pool
│   │   └── redis.js             # Redis client & cache helpers
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── resumeController.js  # Resume CRUD operations
│   │   ├── templateController.js # Template management
│   │   ├── userController.js    # User profile management
│   │   └── notificationController.js # Notification system
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Global error handling
│   │   └── validation.js        # Input validation
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── resumeRoutes.js      # Resume endpoints
│   │   ├── templateRoutes.js    # Template endpoints
│   │   ├── userRoutes.js        # User endpoints
│   │   └── notificationRoutes.js # Notification endpoints
│   ├── utils/
│   │   ├── jwtUtils.js          # JWT token helpers
│   │   └── asyncHandler.js      # Async error wrapper
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server startup
├── database/
│   ├── schema.sql               # MySQL database schema
│   └── DATABASE_DESIGN.md       # Database documentation
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── API_DOCUMENTATION.md
```

### 2. Features đã implement

#### 🔐 Authentication & Authorization
- ✅ User registration với password hashing (bcryptjs)
- ✅ Login với JWT tokens
- ✅ Logout
- ✅ Forgot password & Reset password
- ✅ Update password
- ✅ JWT middleware cho protected routes
- ✅ Role-based authorization (user/admin)

#### 📄 Resume Management (Full CRUD)
- ✅ Get all resumes (với pagination, search, sort)
- ✅ Get single resume
- ✅ Create new resume
- ✅ Update resume
- ✅ Delete resume (soft delete)
- ✅ Duplicate resume
- ✅ Get resume statistics

#### 🎨 Template Management
- ✅ Get all templates (với filters: category, color, search)
- ✅ Get single template
- ✅ Get template categories
- ✅ Get popular templates
- ✅ Create/Update/Delete templates (Admin only)
- ✅ Template view tracking

#### 👤 User Profile
- ✅ Get user profile
- ✅ Update profile
- ✅ Change password
- ✅ Delete account (soft delete)
- ✅ Upload avatar (ready for multer)
- ✅ Get user activity

#### 🔔 Notifications
- ✅ Get all notifications (với pagination)
- ✅ Get unread count
- ✅ Mark as read (single & all)
- ✅ Delete notification
- ✅ Create notification helper

#### 💾 Redis Caching
- ✅ Cache user profiles
- ✅ Cache resume lists & individual resumes
- ✅ Cache templates
- ✅ Cache notifications
- ✅ Auto cache invalidation on updates

#### 🛡️ Security Features
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation (express-validator)
- ✅ SQL injection prevention
- ✅ Password hashing
- ✅ JWT authentication

### 3. Database Schema

**7 tables đã được thiết kế:**

1. **users** - User accounts
2. **templates** - Resume templates
3. **resumes** - User resumes
4. **notifications** - User notifications
5. **resume_downloads** - Download tracking
6. **shared_resumes** - Shared resume links
7. **user_activity_log** - Audit trail

Xem chi tiết trong `backend/database/schema.sql`

---

## 📝 Hướng dẫn Setup

### Bước 1: Install Dependencies

```bash
cd backend
npm install
```

Packages được install:
- express
- mysql2
- redis
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- express-validator
- helmet
- compression
- morgan
- pdfkit
- docx
- nodemailer
- multer

### Bước 2: Setup MySQL Database

1. Mở **MySQL Workbench 8.0**

2. Tạo connection mới (nếu chưa có):
   - Connection Name: `Resume Builder`
   - Hostname: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: [your password]

3. Connect và chạy file `backend/database/schema.sql`:
   - File → Open SQL Script → chọn `schema.sql`
   - Execute (⚡ icon hoặc Ctrl+Shift+Enter)

4. Verify database đã được tạo:
   ```sql
   USE resume_builder;
   SHOW TABLES;
   ```

   Bạn sẽ thấy 7 tables:
   - users
   - templates
   - resumes
   - notifications
   - resume_downloads
   - shared_resumes
   - user_activity_log

### Bước 3: Setup Redis

**Windows:**
```bash
# Download Redis từ:
# https://github.com/microsoftarchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.msi

# Hoặc dùng Chocolatey:
choco install redis-64

# Start Redis:
redis-server
```

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Mac
brew install redis
brew services start redis

# Verify Redis đang chạy:
redis-cli ping
# Response: PONG
```

### Bước 4: Environment Configuration

1. Copy `.env.example` thành `.env`:
```bash
cd backend
copy .env.example .env    # Windows
cp .env.example .env      # Linux/Mac
```

2. Cập nhật file `.env`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=resume_builder
DB_PORT=3306

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_please_change_this
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_please_change_this
JWT_REFRESH_EXPIRE=30d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Cache TTL (seconds)
CACHE_TTL_SHORT=300
CACHE_TTL_MEDIUM=1800
CACHE_TTL_LONG=3600
```

**QUAN TRỌNG:**
- Thay `YOUR_MYSQL_PASSWORD_HERE` bằng password MySQL của bạn
- Thay `JWT_SECRET` và `JWT_REFRESH_SECRET` bằng random string

Generate random secret:
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# hoặc online:
# https://randomkeygen.com/
```

### Bước 5: Start Backend Server

**Development mode** (với nodemon auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Nếu thành công, bạn sẽ thấy:

```
✅ MySQL Database connected successfully
✅ Redis connected successfully
✅ Redis client ready

🚀 Server is running on port 5000
📍 Environment: development
🌐 API URL: http://localhost:5000/api/v1

✅ All systems operational
```

---

## 🧪 Testing API

### Method 1: Browser

Mở browser và truy cập:
```
http://localhost:5000/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Method 2: Postman / Thunder Client

1. **Test Register:**
```
POST http://localhost:5000/api/v1/auth/register

Body (JSON):
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

2. **Test Login:**
```
POST http://localhost:5000/api/v1/auth/login

Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}
```

Copy `token` từ response.

3. **Test Protected Route:**
```
GET http://localhost:5000/api/v1/auth/me

Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

4. **Test Get Templates (Public):**
```
GET http://localhost:5000/api/v1/templates
```

### Method 3: cURL

```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Get templates
curl http://localhost:5000/api/v1/templates
```

---

## 📚 API Endpoints Summary

Xem chi tiết trong `backend/API_DOCUMENTATION.md`

### Authentication (`/api/v1/auth`)
```
POST   /register          - Đăng ký
POST   /login             - Đăng nhập
POST   /logout            - Đăng xuất
GET    /me                - Get current user
POST   /forgotpassword    - Quên mật khẩu
PUT    /resetpassword/:token - Reset mật khẩu
PUT    /updatepassword    - Đổi mật khẩu
```

### Resumes (`/api/v1/resumes`) 🔒 Private
```
GET    /                  - Get all resumes
GET    /stats             - Get statistics
GET    /:id               - Get one resume
POST   /                  - Create resume
PUT    /:id               - Update resume
DELETE /:id               - Delete resume
POST   /:id/duplicate     - Duplicate resume
```

### Templates (`/api/v1/templates`)
```
GET    /                  - Get all templates
GET    /categories        - Get categories
GET    /popular           - Get popular templates
GET    /:id               - Get one template
POST   /                  - Create (Admin only)
PUT    /:id               - Update (Admin only)
DELETE /:id               - Delete (Admin only)
```

### Users (`/api/v1/users`) 🔒 Private
```
GET    /profile           - Get profile
PUT    /profile           - Update profile
PUT    /change-password   - Change password
DELETE /account           - Delete account
POST   /avatar            - Upload avatar
GET    /activity          - Get activity
```

### Notifications (`/api/v1/notifications`) 🔒 Private
```
GET    /                  - Get all notifications
GET    /unread-count      - Get unread count
PUT    /:id/read          - Mark as read
PUT    /read-all          - Mark all as read
DELETE /:id               - Delete notification
```

---

## 🔧 Common Issues & Solutions

### Issue 1: MySQL Connection Error

**Error:**
```
❌ MySQL connection error: Access denied for user 'root'@'localhost'
```

**Solution:**
1. Check MySQL đang chạy:
   - Windows: Services → MySQL80 → Start
   - Linux: `sudo systemctl start mysql`

2. Verify password trong `.env` file

3. Test connection:
   ```bash
   mysql -u root -p
   # Nhập password
   ```

### Issue 2: Redis Connection Failed

**Warning:**
```
⚠️ Warning: Redis connection failed. Caching will be disabled.
```

**Solution:**
1. Check Redis đang chạy:
   ```bash
   redis-cli ping
   # Response: PONG
   ```

2. Start Redis nếu chưa chạy:
   - Windows: `redis-server`
   - Linux: `sudo systemctl start redis`

**Note:** App vẫn hoạt động bình thường nếu Redis fail, chỉ không có caching.

### Issue 3: Port 5000 đã được sử dụng

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

**Windows:**
```bash
# Tìm process đang dùng port 5000
netstat -ano | findstr :5000

# Kill process (thay <PID> bằng số PID tìm được)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Tìm và kill process
lsof -ti:5000 | xargs kill -9

# Hoặc đổi port trong .env
PORT=3000
```

### Issue 4: Module not found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json  # Xóa và install lại
npm install
```

---

## 📊 Database Admin

### Admin User đã được tạo sẵn:

```
Email: admin@resumebuilder.com
Password: admin123
```

**QUAN TRỌNG:** Đổi password ngay sau khi login lần đầu!

### Quản lý Database với MySQL Workbench:

1. **View Tables:**
   ```sql
   USE resume_builder;
   SHOW TABLES;
   ```

2. **View Data:**
   ```sql
   SELECT * FROM users;
   SELECT * FROM templates;
   SELECT * FROM resumes;
   ```

3. **Check Indexes:**
   ```sql
   SHOW INDEX FROM users;
   SHOW INDEX FROM resumes;
   ```

4. **Database Size:**
   ```sql
   SELECT
     table_schema AS 'Database',
     ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
   FROM information_schema.tables
   WHERE table_schema = 'resume_builder';
   ```

---

## 🚀 Next Steps

### 1. Connect Frontend to Backend

Update frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Replace mock data với API calls:
```javascript
// Before (mock)
const resumes = [{ id: 1, title: 'Resume 1' }];

// After (API)
const response = await fetch('http://localhost:5000/api/v1/resumes', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { data } = await response.json();
```

### 2. Implement PDF/DOCX Export

Cần add trong `resumeController.js`:
```javascript
exports.exportPDF = async (req, res) => {
  // Use pdfkit to generate PDF
};

exports.exportDOCX = async (req, res) => {
  // Use docx library to generate DOCX
};
```

### 3. Add File Upload (Avatar)

Add multer middleware trong `app.js`:
```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/avatars/' });

app.post('/api/v1/users/avatar', protect, upload.single('avatar'), uploadAvatar);
```

### 4. Email Service

Configure nodemailer trong `forgotPassword`:
```javascript
const nodemailer = require('nodemailer');
// Send email với reset link
```

---

## 📖 Documentation

- **API Documentation**: `backend/API_DOCUMENTATION.md`
- **Database Design**: `backend/database/DATABASE_DESIGN.md`
- **README**: `backend/README.md`

---

## ✅ Checklist trước khi deploy Production

- [ ] Đổi admin password
- [ ] Generate strong JWT secrets
- [ ] Setup environment variables trên server
- [ ] Enable HTTPS
- [ ] Setup backup cho MySQL
- [ ] Configure Redis persistence
- [ ] Setup logging service
- [ ] Add monitoring (PM2, New Relic, etc.)
- [ ] Setup CI/CD pipeline
- [ ] Configure firewall rules
- [ ] Add rate limiting cho production
- [ ] Setup error tracking (Sentry, etc.)

---

## 🎉 Kết luận

Backend API đã hoàn thiện với:
- ✅ Full CRUD operations cho tất cả entities
- ✅ Authentication & Authorization
- ✅ MySQL database với 7 tables
- ✅ Redis caching layer
- ✅ Security best practices
- ✅ Error handling & validation
- ✅ API documentation

**Ready for integration với Frontend React!** 🚀
