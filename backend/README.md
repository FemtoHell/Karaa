# 🚀 Resume Builder Backend - MongoDB + OAuth

Backend REST API với **MongoDB**, **Redis**, **Google OAuth**, và **LinkedIn OAuth**.

## ✨ Features

### 🔐 Authentication
- ✅ Email/Password registration & login
- ✅ **Google OAuth** (Login with Google)
- ✅ **LinkedIn OAuth** (Login with LinkedIn)
- ✅ Auto account linking (same email)
- ✅ JWT tokens với refresh tokens
- ✅ Password reset
- ✅ Session management

### 📦 Core Features
- ✅ Full CRUD cho Resumes
- ✅ Template Management
- ✅ User Profile Management
- ✅ Notification System
- ✅ Redis Caching
- ✅ File Upload support
- ✅ Soft Delete
- ✅ Pagination & Search

### 🛡️ Security
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ OAuth 2.0

## 🏗️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Cache**: Redis
- **Authentication**: Passport.js
  - passport-google-oauth20
  - passport-linkedin-oauth2
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: express-validator

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   ├── redis.js             # Redis client
│   │   └── passport.js          # OAuth strategies
│   ├── models/
│   │   ├── User.js              # User model (với OAuth fields)
│   │   ├── Resume.js            # Resume model
│   │   ├── Template.js          # Template model
│   │   └── Notification.js      # Notification model
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── resumeController.js  # Resume CRUD
│   │   ├── templateController.js
│   │   ├── userController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT middleware
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── authRoutes.js        # Includes OAuth routes
│   │   ├── resumeRoutes.js
│   │   ├── templateRoutes.js
│   │   ├── userRoutes.js
│   │   └── notificationRoutes.js
│   ├── utils/
│   │   ├── jwtUtils.js
│   │   └── asyncHandler.js
│   ├── app.js                   # Express app (với Passport)
│   └── server.js                # Server startup
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd backend
npm install
```

### 2. Setup MongoDB

**Option A: MongoDB Local**
```bash
# Download: https://www.mongodb.com/try/download/community
# Install và start service

# Verify
mongosh
```

**Option B: MongoDB Atlas (RECOMMENDED)**
1. Tạo FREE account: https://www.mongodb.com/cloud/atlas/register
2. Create cluster (M0 tier - FREE)
3. Setup user & network access
4. Get connection string

### 3. Setup Redis

```bash
# Windows
choco install redis-64
redis-server

# Linux
sudo apt-get install redis-server
sudo systemctl start redis

# Mac
brew install redis
brew services start redis

# Verify
redis-cli ping
# Response: PONG
```

### 4. Get OAuth Credentials

#### Google OAuth:
1. https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Credentials → Create OAuth client ID
4. Add redirect URI: `http://localhost:5000/api/v1/auth/google/callback`
5. Copy Client ID & Secret

#### LinkedIn OAuth:
1. https://www.linkedin.com/developers/apps
2. Create app
3. Auth → Add redirect URL: `http://localhost:5000/api/v1/auth/linkedin/callback`
4. Copy Client ID & Secret

### 5. Configure Environment

```bash
cp .env.example .env
```

Update `.env`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/resume_builder
# OR Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/resume_builder

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets (generate random)
JWT_SECRET=your_random_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/v1/auth/linkedin/callback

# Frontend URL
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 6. Start Server

```bash
npm run dev
```

Success output:
```
✅ MongoDB Connected: localhost
✅ Redis connected successfully
🚀 Server is running on port 5000
```

## 📚 API Endpoints

### 🔐 Authentication

```
POST   /api/v1/auth/register          - Register with email
POST   /api/v1/auth/login             - Login with email
GET    /api/v1/auth/google            - Login with Google
GET    /api/v1/auth/google/callback   - Google callback
GET    /api/v1/auth/linkedin          - Login with LinkedIn
GET    /api/v1/auth/linkedin/callback - LinkedIn callback
POST   /api/v1/auth/logout            - Logout
GET    /api/v1/auth/me                - Get current user
POST   /api/v1/auth/forgotpassword    - Forgot password
PUT    /api/v1/auth/resetpassword/:token
PUT    /api/v1/auth/updatepassword
```

### 📄 Resumes (Protected)

```
GET    /api/v1/resumes              - Get all resumes
GET    /api/v1/resumes/:id          - Get single resume
POST   /api/v1/resumes              - Create resume
PUT    /api/v1/resumes/:id          - Update resume
DELETE /api/v1/resumes/:id          - Delete resume
POST   /api/v1/resumes/:id/duplicate - Duplicate resume
GET    /api/v1/resumes/stats        - Get statistics
```

### 🎨 Templates (Public)

```
GET    /api/v1/templates            - Get all templates
GET    /api/v1/templates/:id        - Get single template
GET    /api/v1/templates/categories - Get categories
GET    /api/v1/templates/popular    - Get popular templates
POST   /api/v1/templates            - Create (Admin only)
PUT    /api/v1/templates/:id        - Update (Admin only)
DELETE /api/v1/templates/:id        - Delete (Admin only)
```

### 👤 Users (Protected)

```
GET    /api/v1/users/profile         - Get profile
PUT    /api/v1/users/profile         - Update profile
PUT    /api/v1/users/change-password - Change password
DELETE /api/v1/users/account         - Delete account
POST   /api/v1/users/avatar          - Upload avatar
GET    /api/v1/users/activity        - Get activity
```

### 🔔 Notifications (Protected)

```
GET    /api/v1/notifications           - Get all notifications
GET    /api/v1/notifications/unread-count
PUT    /api/v1/notifications/:id/read
PUT    /api/v1/notifications/read-all
DELETE /api/v1/notifications/:id
```

## 🧪 Testing

### Test Regular Authentication

```bash
# Register
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### Test OAuth

**Google:**
```
http://localhost:5000/api/v1/auth/google
```

**LinkedIn:**
```
http://localhost:5000/api/v1/auth/linkedin
```

Browser sẽ redirect đến OAuth provider → login → callback về app với token.

### Test Protected Routes

```bash
GET http://localhost:5000/api/v1/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🗄️ MongoDB Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  role: 'user' | 'admin',

  // OAuth fields
  googleId: String,
  linkedinId: String,
  provider: 'local' | 'google' | 'linkedin',

  lastLogin: Date,
  timestamps: true
}
```

### Resume Model
```javascript
{
  user: ObjectId (ref: User),
  template: ObjectId (ref: Template),
  title: String,
  content: {
    personal: {},
    experience: [],
    education: [],
    skills: {},
    projects: [],
    certificates: [],
    activities: []
  },
  customization: {},
  timestamps: true
}
```

### Template Model
```javascript
{
  name: String,
  description: String,
  category: 'modern' | 'professional' | 'creative' | 'minimalist',
  color: String,
  gradient: String,
  image: String,
  tags: [String],
  config: Mixed,
  popularity: Number,
  views: Number,
  isActive: Boolean,
  timestamps: true
}
```

### Notification Model
```javascript
{
  user: ObjectId (ref: User),
  type: 'success' | 'info' | 'warning' | 'error',
  title: String,
  message: String,
  isRead: Boolean,
  readAt: Date,
  timestamps: true
}
```

## 🔄 OAuth Flow

### Google OAuth Flow:

1. User clicks "Login with Google" → redirect to `/api/v1/auth/google`
2. Passport redirects to Google login page
3. User authorizes app
4. Google redirects to `/api/v1/auth/google/callback` với code
5. Passport exchanges code for user profile
6. Backend:
   - Checks if user exists (googleId or email)
   - Creates new user OR links Google to existing account
   - Generates JWT token
7. Redirect to frontend: `/auth/callback?token=xxx&user=xxx`
8. Frontend stores token và user, redirects to dashboard

LinkedIn OAuth flow tương tự!

### Account Linking:

Nếu user đã có account với `john@example.com`:
- Login với Google (same email) → **auto links** Google account
- Login với LinkedIn (same email) → **auto links** LinkedIn account

User có thể login bằng bất kỳ method nào!

## 💾 Caching Strategy

Redis cache với TTL:

- **User profiles**: 10 phút
- **Resume lists**: 5 phút
- **Individual resumes**: 10 phút
- **Templates**: 1 giờ
- **Template categories**: 24 giờ
- **Notification count**: 30 giây

Cache auto invalidates khi data updates/deletes.

## 🛡️ Security Features

- **Password Hashing**: bcryptjs với salt rounds 10
- **JWT Tokens**: Secure, HttpOnly cookies
- **OAuth 2.0**: Industry standard authentication
- **Rate Limiting**: 100 requests per 15 minutes
- **Helmet.js**: Security headers
- **CORS**: Configured for frontend domain
- **Input Validation**: express-validator
- **NoSQL Injection**: Mongoose sanitization
- **XSS Protection**: Built-in

## 🐛 Troubleshooting

### MongoDB Connection Error

```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solution:**
- Check MongoDB service running
- Verify MONGODB_URI in `.env`
- Test connection: `mongosh`

### Redis Connection Failed

```
⚠️ Warning: Redis connection failed
```

**Solution:**
- Check Redis running: `redis-cli ping`
- App still works without cache
- Start Redis: `redis-server`

### OAuth redirect_uri_mismatch

```
Error: redirect_uri_mismatch
```

**Solution:**
- Check callback URL trong `.env` matches Google/LinkedIn console
- Must be EXACT (including protocol, port, path)

### Passport Error: Unknown authentication strategy

**Solution:**
- Ensure passport strategies loaded: `require('./config/passport')`
- Check client ID & secrets trong `.env`

## 📊 Why MongoDB?

✅ **Dễ setup** - No schema migrations
✅ **Flexible** - Add fields without ALTER TABLE
✅ **JSON native** - Perfect cho resume content
✅ **Fast development** - Mongoose ORM clean & powerful
✅ **Free cloud** - MongoDB Atlas M0 tier
✅ **Scalable** - Easy horizontal scaling
✅ **Great for prototypes** - Quick iterations

## 🎯 Production Checklist

- [ ] Use MongoDB Atlas production cluster
- [ ] Enable Redis persistence (AOF/RDB)
- [ ] Set strong JWT secrets
- [ ] Enable HTTPS
- [ ] Update OAuth callback URLs to production domain
- [ ] Configure proper CORS origin
- [ ] Add rate limiting per user
- [ ] Setup monitoring (PM2, New Relic)
- [ ] Configure logging service
- [ ] Setup automated backups
- [ ] Add error tracking (Sentry)
- [ ] Environment variables validation

## 📖 Documentation

- **Setup Guide**: `../MONGODB_OAUTH_GUIDE.md`
- **API Docs**: To be created
- **Frontend Integration**: Examples in setup guide

## 🤝 Contributing

Backend structure follows:
- Controllers: Business logic
- Routes: Endpoint definitions
- Models: Data schemas
- Middleware: Reusable functions
- Utils: Helper functions

## 📝 License

MIT

---

**Backend ready với MongoDB + Google OAuth + LinkedIn OAuth!** 🎉

Xem hướng dẫn setup chi tiết trong `MONGODB_OAUTH_GUIDE.md`
