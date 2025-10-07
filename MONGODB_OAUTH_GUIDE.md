# 🚀 MongoDB + OAuth Setup Guide - Resume Builder

## ✅ Đã hoàn thành

### 1. Chuyển sang MongoDB + Mongoose
- ✅ Package.json với Mongoose dependencies
- ✅ MongoDB connection config
- ✅ 4 Mongoose Models: User, Resume, Template, Notification
- ✅ Indexes optimization

### 2. OAuth Integration (Google & LinkedIn)
- ✅ Passport.js config
- ✅ Google OAuth Strategy
- ✅ LinkedIn OAuth Strategy
- ✅ Auto account linking nếu email trùng

### 3. Features
- ✅ Login với Email/Password
- ✅ Login với Google
- ✅ Login với LinkedIn
- ✅ Auto-link accounts
- ✅ JWT tokens
- ✅ Redis caching

---

## 📋 Prerequisites

1. **MongoDB**
   - MongoDB Community Server 7.0+
   - MongoDB Compass (optional, for GUI)
   - HOẶC MongoDB Atlas (cloud, FREE tier)

2. **Redis Server**
   - Windows/Linux/Mac

3. **OAuth Credentials**
   - Google Cloud Console account
   - LinkedIn Developer account

---

## 🛠️ Installation Steps

### Bước 1: Install MongoDB

#### Option A: MongoDB Local (Windows)

1. Download MongoDB Community: https://www.mongodb.com/try/download/community

2. Install với default settings

3. Start MongoDB service:
```bash
# Check if running
mongod --version

# Start service (Windows)
net start MongoDB

# Or run manually
mongod --dbpath="C:\data\db"
```

4. Verify:
```bash
mongosh
# Should connect to MongoDB shell
```

#### Option B: MongoDB Atlas (Cloud - RECOMMENDED)

1. Tạo account tại: https://www.mongodb.com/cloud/atlas/register

2. Create FREE cluster (M0 tier)

3. Setup Database Access:
   - Database Access → Add New Database User
   - Username: `admin`
   - Password: [your password]
   - Roles: Atlas Admin

4. Setup Network Access:
   - Network Access → Add IP Address
   - Allow Access from Anywhere (0.0.0.0/0) hoặc IP của bạn

5. Get Connection String:
   - Clusters → Connect → Connect your application
   - Copy connection string:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/resume_builder
   ```

### Bước 2: Setup Google OAuth

1. Truy cập: https://console.cloud.google.com/

2. Create New Project:
   - Project name: "Resume Builder"
   - Click Create

3. Enable Google+ API:
   - APIs & Services → Library
   - Search "Google+ API"
   - Click Enable

4. Create OAuth Credentials:
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: Web application
   - Name: "Resume Builder Web"

   - Authorized redirect URIs:
     ```
     http://localhost:5000/api/v1/auth/google/callback
     http://localhost:5173/auth/google/callback
     ```

   - Click Create

5. Copy credentials:
   - Client ID: `xxxxx.apps.googleusercontent.com`
   - Client Secret: `xxxxx`

### Bước 3: Setup LinkedIn OAuth

1. Truy cập: https://www.linkedin.com/developers/apps

2. Create App:
   - App name: "Resume Builder"
   - LinkedIn Page: [your company page or create one]
   - App logo: [upload any logo]
   - Click Create

3. Settings → Auth:
   - Redirect URLs:
     ```
     http://localhost:5000/api/v1/auth/linkedin/callback
     http://localhost:5173/auth/linkedin/callback
     ```

4. Products → Request access:
   - Sign In with LinkedIn using OpenID Connect ✓
   - Share on LinkedIn ✓

5. Auth Tab → Copy:
   - Client ID
   - Client Secret

### Bước 4: Setup Backend

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```bash
copy .env.example .env   # Windows
cp .env.example .env     # Linux/Mac
```

3. Update `.env`:

```env
# MongoDB (choose one)
# Local:
MONGODB_URI=mongodb://localhost:27017/resume_builder

# OR Atlas:
MONGODB_URI=mongodb+srv://admin:your_password@cluster0.xxxxx.mongodb.net/resume_builder

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT Secrets (generate random strings)
JWT_SECRET=your_random_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_here
SESSION_SECRET=your_session_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
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

4. Start Redis:
```bash
redis-server
```

5. Start Backend:
```bash
npm run dev
```

Nếu thành công:
```
✅ MongoDB Connected: localhost
✅ Redis connected successfully
🚀 Server is running on port 5000
```

---

## 🧪 Testing OAuth

### Test Google Login

1. Browser truy cập:
```
http://localhost:5000/api/v1/auth/google
```

2. Đăng nhập Google account

3. Sau khi success, sẽ redirect về frontend với token

### Test LinkedIn Login

1. Browser truy cập:
```
http://localhost:5000/api/v1/auth/linkedin
```

2. Đăng nhập LinkedIn account

3. Redirect về frontend với token

### Test Regular Login

```bash
# Register
POST http://localhost:5000/api/v1/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST http://localhost:5000/api/v1/auth/login
Body: {
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 🎨 Frontend Integration

### 1. Add OAuth Buttons trong Login.jsx:

```jsx
// Login.jsx
const handleGoogleLogin = () => {
  window.location.href = 'http://localhost:5000/api/v1/auth/google';
};

const handleLinkedInLogin = () => {
  window.location.href = 'http://localhost:5000/api/v1/auth/linkedin';
};

return (
  <div className="login-page">
    {/* Regular login form */}

    <div className="oauth-buttons">
      <button onClick={handleGoogleLogin} className="btn-oauth btn-google">
        <img src="/google-icon.svg" alt="Google" />
        Continue with Google
      </button>

      <button onClick={handleLinkedInLogin} className="btn-oauth btn-linkedin">
        <img src="/linkedin-icon.svg" alt="LinkedIn" />
        Continue with LinkedIn
      </button>
    </div>
  </div>
);
```

### 2. Handle OAuth Callback:

```jsx
// Create: frontend/src/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './AuthContext';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');

    if (token && user) {
      // Save token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', user);

      // Update auth context
      login(JSON.parse(user), token);

      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      // Error
      navigate('/login');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="loading">
      <h2>Logging you in...</h2>
    </div>
  );
};

export default OAuthCallback;
```

### 3. Add route trong App.jsx:

```jsx
import OAuthCallback from './OAuthCallback';

function App() {
  return (
    <Routes>
      {/* ... other routes */}
      <Route path="/auth/callback" element={<OAuthCallback />} />
    </Routes>
  );
}
```

---

## 📚 API Endpoints

### Authentication

```
POST   /api/v1/auth/register           - Register with email
POST   /api/v1/auth/login              - Login with email
GET    /api/v1/auth/google             - Start Google OAuth
GET    /api/v1/auth/google/callback    - Google callback
GET    /api/v1/auth/linkedin           - Start LinkedIn OAuth
GET    /api/v1/auth/linkedin/callback  - LinkedIn callback
POST   /api/v1/auth/logout             - Logout
GET    /api/v1/auth/me                 - Get current user
```

### Resumes (MongoDB CRUD)

```
GET    /api/v1/resumes                 - Get all resumes
GET    /api/v1/resumes/:id             - Get one resume
POST   /api/v1/resumes                 - Create resume
PUT    /api/v1/resumes/:id             - Update resume
DELETE /api/v1/resumes/:id             - Delete resume
POST   /api/v1/resumes/:id/duplicate   - Duplicate resume
```

Tất cả endpoints tương tự như trước nhưng giờ dùng MongoDB!

---

## 🗄️ MongoDB Database Schema

### Collections:

1. **users**
   - _id, name, email, password
   - googleId, linkedinId, provider
   - avatar, role, lastLogin
   - timestamps, deletedAt

2. **resumes**
   - _id, user (ref), template (ref)
   - title, content {}, customization {}
   - timestamps, deletedAt

3. **templates**
   - _id, name, description, category
   - color, gradient, image, tags[]
   - config {}, popularity, views
   - isActive, timestamps

4. **notifications**
   - _id, user (ref), type, title, message
   - isRead, readAt, timestamps

### View data với MongoDB Compass:

1. Open MongoDB Compass
2. Connect: `mongodb://localhost:27017`
3. Database: `resume_builder`
4. Browse collections

---

## 🔒 Security Notes

### OAuth Flow:

1. User clicks "Login with Google"
2. Redirect to Google login
3. User authorizes app
4. Google redirects back với authorization code
5. Backend exchanges code for user info
6. Create/update user trong MongoDB
7. Generate JWT token
8. Redirect to frontend với token

### Account Linking:

Nếu user đã có account với email `john@example.com`:
- Login với Google (cùng email) → auto link Google account
- Login với LinkedIn (cùng email) → auto link LinkedIn account

User có thể login bằng bất kỳ method nào!

---

## 🐛 Common Issues

### Issue 1: MongoDB Connection Error

```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solution:**
```bash
# Check MongoDB running
mongod --version

# Start MongoDB
net start MongoDB   # Windows
sudo systemctl start mongod  # Linux
```

### Issue 2: OAuth Redirect URI Mismatch

```
Error: redirect_uri_mismatch
```

**Solution:**
1. Check `.env` callback URL matches Google/LinkedIn settings
2. Must be EXACT match (including http/https, port, path)

### Issue 3: Session not working

**Solution:**
Add `trust proxy` nếu behind proxy:
```javascript
// app.js
app.set('trust proxy', 1);
```

---

## 🎉 Advantages của MongoDB vs MySQL

✅ **Dễ setup hơn** - Không cần tạo tables, migrations
✅ **Flexible schema** - Thêm fields không cần ALTER TABLE
✅ **JSON native** - Perfect cho resume content
✅ **Fast development** - Mongoose models rất clean
✅ **Free cloud** - MongoDB Atlas có free tier tốt
✅ **Scalable** - Dễ scale horizontal

---

## 📊 MongoDB Atlas FREE Tier

- 512 MB storage
- Shared RAM
- Enough cho development và small apps
- Auto backup
- SSL/TLS encryption
- Global clusters

**Perfect cho project này!**

---

## 🚀 Next Steps

1. ✅ Setup MongoDB (local hoặc Atlas)
2. ✅ Get Google OAuth credentials
3. ✅ Get LinkedIn OAuth credentials
4. ✅ Update `.env` file
5. ✅ Start backend
6. ✅ Test OAuth login
7. ✅ Integrate frontend
8. 🎉 Done!

---

**Backend đã sẵn sàng với MongoDB + OAuth!** 🎊

Giờ chỉ cần:
- `npm install` trong backend
- Setup `.env`
- `npm run dev`
- Test OAuth login!
