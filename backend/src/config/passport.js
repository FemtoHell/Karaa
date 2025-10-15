const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');
const Notification = require('../models/Notification');

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy (Only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Create login notification
        try {
          await Notification.create({
            user: user._id,
            type: 'success',
            title: 'Login Successful',
            message: `Welcome back! You successfully logged in with Google at ${new Date().toLocaleString()}`
          });
        } catch (err) {
          console.error('Failed to create login notification:', err);
        }

        return done(null, user);
      }

      // Check if email already exists
      user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.provider = 'google';
        if (!user.avatar && profile.photos && profile.photos.length > 0) {
          user.avatar = profile.photos[0].value;
        }
        user.lastLogin = Date.now();
        await user.save();

        // Create login notification
        try {
          await Notification.create({
            user: user._id,
            type: 'success',
            title: 'Google Account Linked',
            message: `Your Google account has been successfully linked. You logged in at ${new Date().toLocaleString()}`
          });
        } catch (err) {
          console.error('Failed to create login notification:', err);
        }

        return done(null, user);
      }

      // Create new user
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        provider: 'google',
        lastLogin: Date.now()
      });

      // Create welcome notification
      try {
        await Notification.create({
          user: user._id,
          type: 'success',
          title: 'Welcome to ResumeBuilder!',
          message: 'Your account has been created successfully. Start creating your professional resume now!'
        });
      } catch (err) {
        console.error('Failed to create welcome notification:', err);
      }

      done(null, user);
    } catch (error) {
      console.error('Google OAuth Error:', error);
      done(error, null);
    }
  }
  ));
} else {
  console.log('⚠️  Google OAuth is disabled. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable.');
}

// LinkedIn OAuth Strategy (Only if credentials are provided)
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL,
    scope: ['openid', 'profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ linkedinId: profile.id });

      if (user) {
        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Create login notification
        try {
          await Notification.create({
            user: user._id,
            type: 'success',
            title: 'Login Successful',
            message: `Welcome back! You successfully logged in with LinkedIn at ${new Date().toLocaleString()}`
          });
        } catch (err) {
          console.error('Failed to create login notification:', err);
        }

        return done(null, user);
      }

      // Check if email already exists
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;

      if (email) {
        user = await User.findOne({ email });

        if (user) {
          // Link LinkedIn account to existing user
          user.linkedinId = profile.id;
          user.provider = 'linkedin';
          if (!user.avatar && profile.photos && profile.photos.length > 0) {
            user.avatar = profile.photos[0].value;
          }
          user.lastLogin = Date.now();
          await user.save();

          // Create login notification
          try {
            await Notification.create({
              user: user._id,
              type: 'success',
              title: 'LinkedIn Account Linked',
              message: `Your LinkedIn account has been successfully linked. You logged in at ${new Date().toLocaleString()}`
            });
          } catch (err) {
            console.error('Failed to create login notification:', err);
          }

          return done(null, user);
        }
      }

      // Create new user
      user = await User.create({
        linkedinId: profile.id,
        email: email,
        name: profile.displayName || `${profile.name?.givenName} ${profile.name?.familyName}`.trim(),
        avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
        provider: 'linkedin',
        lastLogin: Date.now()
      });

      // Create welcome notification
      try {
        await Notification.create({
          user: user._id,
          type: 'success',
          title: 'Welcome to ResumeBuilder!',
          message: 'Your account has been created successfully. Start creating your professional resume now!'
        });
      } catch (err) {
        console.error('Failed to create welcome notification:', err);
      }

      done(null, user);
    } catch (error) {
      console.error('LinkedIn OAuth Error:', error);
      done(error, null);
    }
  }
  ));
} else {
  console.log('⚠️  LinkedIn OAuth is disabled. Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET to enable.');
}

module.exports = passport;
