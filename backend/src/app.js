const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const rateLimit = require('express-rate-limit');
const passport = require('./config/passport');
const { errorHandler } = require('./middleware/errorHandler');
const { redisClient } = require('./config/redis');

// Import routes
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const templateRoutes = require('./routes/templateRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const guestRoutes = require('./routes/guestRoutes');
const guideRoutes = require('./routes/guideRoutes');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Session middleware (required for Passport)
// Use Redis store for production to avoid memory leaks
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

// Use Redis store if client is connected (production)
if (redisClient.isOpen) {
  sessionConfig.store = new RedisStore({
    client: redisClient,
    prefix: 'sess:',
  });
}

app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  message: 'Too many requests from this IP, please try again later'
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// API version
const API_VERSION = process.env.API_VERSION || 'v1';

// Health check endpoints (both root and versioned)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get(`/api/${API_VERSION}/health`, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/resumes`, resumeRoutes);
app.use(`/api/${API_VERSION}/templates`, templateRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${API_VERSION}/guest`, guestRoutes);
app.use(`/api/${API_VERSION}/guides`, guideRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Resume Builder API - MongoDB + OAuth',
    version: API_VERSION,
    features: ['MongoDB', 'Redis Cache', 'Google OAuth', 'Facebook OAuth'],
    endpoints: {
      auth: `/api/${API_VERSION}/auth`,
      resumes: `/api/${API_VERSION}/resumes`,
      templates: `/api/${API_VERSION}/templates`,
      users: `/api/${API_VERSION}/users`,
      notifications: `/api/${API_VERSION}/notifications`
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
