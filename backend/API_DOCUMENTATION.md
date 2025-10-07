# API Documentation - Resume Builder

Base URL: `http://localhost:5000/api/v1`

## Authentication

Tất cả các protected endpoints yêu cầu JWT token trong header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Hoặc token có thể được gửi qua cookie.

---

## 📌 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** (same as register)

### 3. Logout
**POST** `/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 4. Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer TOKEN`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null,
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z",
    "last_login": "2024-01-02T10:30:00.000Z"
  }
}
```

### 5. Forgot Password
**POST** `/auth/forgotpassword`

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset email sent",
  "resetToken": "abc123..." // Remove in production
}
```

### 6. Reset Password
**PUT** `/auth/resetpassword/:resettoken`

**Body:**
```json
{
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

## 📄 Resume Endpoints

### 1. Get All Resumes
**GET** `/resumes`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `sort` (default: updated_at)
- `order` (ASC/DESC, default: DESC)
- `search` (search in title)

**Example:** `/resumes?page=1&limit=10&search=software`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "template_id": 1,
      "template_name": "Modern Blue",
      "title": "Software Engineer Resume",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-02T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2. Get Single Resume
**GET** `/resumes/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "template_id": 1,
    "template_name": "Modern Blue",
    "title": "Software Engineer Resume",
    "content": {
      "personal": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "experience": [...],
      "education": [...]
    },
    "customization": {
      "font": "Inter",
      "fontSize": "medium",
      "colorScheme": "blue"
    },
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-02T00:00:00.000Z"
  }
}
```

### 3. Create Resume
**POST** `/resumes`

**Body:**
```json
{
  "title": "My New Resume",
  "template_id": 1,
  "content": {
    "personal": {
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  },
  "customization": {
    "font": "Inter",
    "colorScheme": "blue"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* created resume */ }
}
```

### 4. Update Resume
**PUT** `/resumes/:id`

**Body:**
```json
{
  "title": "Updated Title",
  "content": { /* updated content */ }
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated resume */ }
}
```

### 5. Delete Resume
**DELETE** `/resumes/:id`

**Response:**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

### 6. Duplicate Resume
**POST** `/resumes/:id/duplicate`

**Response:**
```json
{
  "success": true,
  "data": { /* duplicated resume */ }
}
```

### 7. Get Resume Statistics
**GET** `/resumes/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "recentUpdates": 2,
    "downloads": 12
  }
}
```

---

## 🎨 Template Endpoints

### 1. Get All Templates
**GET** `/templates`

**Query Parameters:**
- `category` (modern/professional/creative/minimalist)
- `color` (blue/green/purple/orange/red/gray)
- `sort` (popularity/views/name/created_at)
- `order` (ASC/DESC)
- `search` (search in name, description, tags)

**Example:** `/templates?category=modern&color=blue`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Modern Blue",
      "description": "Clean and contemporary design",
      "category": "modern",
      "color": "blue",
      "gradient": "linear-gradient(...)",
      "image": "https://...",
      "tags": ["tech", "software", "modern"],
      "popularity": 95,
      "views": 1250,
      "is_active": 1
    }
  ]
}
```

### 2. Get Single Template
**GET** `/templates/:id`

**Response:**
```json
{
  "success": true,
  "data": { /* template details */ }
}
```

### 3. Get Template Categories
**GET** `/templates/categories`

**Response:**
```json
{
  "success": true,
  "data": [
    { "category": "modern", "count": 4 },
    { "category": "professional", "count": 4 },
    { "category": "creative", "count": 3 },
    { "category": "minimalist", "count": 2 }
  ]
}
```

### 4. Get Popular Templates
**GET** `/templates/popular`

**Query Parameters:**
- `limit` (default: 6)

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [ /* popular templates */ ]
}
```

---

## 👤 User Endpoints

### 1. Get Profile
**GET** `/users/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "/uploads/avatars/abc123.jpg",
    "role": "user",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Update Profile
**PUT** `/users/profile`

**Body:**
```json
{
  "name": "John Updated",
  "email": "newemail@example.com",
  "avatar": "/uploads/avatars/new.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated user */ }
}
```

### 3. Change Password
**PUT** `/users/change-password`

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### 4. Delete Account
**DELETE** `/users/account`

**Response:**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

### 5. Get User Activity
**GET** `/users/activity`

**Query Parameters:**
- `limit` (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "resume_updated",
      "title": "Software Engineer Resume",
      "timestamp": "2024-01-02T10:30:00.000Z"
    }
  ]
}
```

---

## 🔔 Notification Endpoints

### 1. Get All Notifications
**GET** `/notifications`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `unread_only` (true/false)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "type": "success",
      "title": "Resume Downloaded",
      "message": "Your resume has been downloaded",
      "is_read": 0,
      "read_at": null,
      "created_at": "2024-01-02T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### 2. Get Unread Count
**GET** `/notifications/unread-count`

**Response:**
```json
{
  "success": true,
  "count": 3
}
```

### 3. Mark as Read
**PUT** `/notifications/:id/read`

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 4. Mark All as Read
**PUT** `/notifications/read-all`

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### 5. Delete Notification
**DELETE** `/notifications/:id`

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## 🚨 Error Responses

Tất cả errors đều có format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common Error Codes:

- **400 Bad Request** - Invalid input
- **401 Unauthorized** - Not authenticated
- **403 Forbidden** - Not authorized
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resource
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error

### Examples:

**Validation Error:**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

**Authentication Error:**
```json
{
  "success": false,
  "error": "Not authorized to access this route. Please login."
}
```

---

## 📊 Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Response when exceeded**:
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later"
}
```

---

## 🔄 Caching

API sử dụng Redis caching. Cached responses có thêm field:

```json
{
  "success": true,
  "cached": true,
  "data": { /* ... */ }
}
```

Cache TTL:
- User profiles: 10 minutes
- Resume lists: 5 minutes
- Individual resumes: 10 minutes
- Templates: 1 hour
- Notifications: 30 seconds

---

## 🧪 Testing with Postman/Thunder Client

### 1. Login
```
POST http://localhost:5000/api/v1/auth/login
Body: { "email": "admin@resumebuilder.com", "password": "admin123" }
```

### 2. Copy token from response

### 3. Use token in subsequent requests
```
Header: Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📝 Notes

1. Tất cả timestamps theo ISO 8601 format
2. JSON fields (content, customization, tags, config) được parse tự động
3. Soft delete: deleted items có `deleted_at` != null
4. Pagination: sử dụng page & limit params
5. Search: case-insensitive, partial matching
