const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
};

// Generate 6-digit verification code
exports.generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
exports.sendVerificationEmail = async (email, name, code) => {
  // Add timeout wrapper to prevent hanging
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Email service timeout after 15 seconds')), 15000)
  );

  const sendEmailPromise = (async () => {
    try {
      const transporter = createTransporter();

      const mailOptions = {
      from: `${process.env.FROM_NAME || 'ResumeBuilder'} <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - ResumeBuilder',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .logo {
              color: #ffffff;
              font-size: 32px;
              font-weight: bold;
              margin: 0;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 24px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 20px;
            }
            .message {
              font-size: 16px;
              color: #666;
              margin-bottom: 30px;
            }
            .code-container {
              background-color: #f8f9fa;
              border: 2px dashed #667eea;
              border-radius: 8px;
              padding: 30px;
              text-align: center;
              margin: 30px 0;
            }
            .code-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .code {
              font-size: 48px;
              font-weight: bold;
              color: #667eea;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .expiry {
              font-size: 14px;
              color: #999;
              margin-top: 15px;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              font-size: 14px;
              color: #856404;
            }
            .footer {
              background-color: #f8f9fa;
              padding: 30px;
              text-align: center;
              font-size: 14px;
              color: #666;
            }
            .footer-links {
              margin-top: 15px;
            }
            .footer-links a {
              color: #667eea;
              text-decoration: none;
              margin: 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">📄 ResumeBuilder</h1>
            </div>
            
            <div class="content">
              <div class="greeting">Hi ${name}! 👋</div>
              
              <div class="message">
                Thank you for signing up for ResumeBuilder! To complete your registration and start creating professional resumes, please verify your email address using the code below:
              </div>
              
              <div class="code-container">
                <div class="code-label">Your Verification Code</div>
                <div class="code">${code}</div>
                <div class="expiry">⏰ This code will expire in 10 minutes</div>
              </div>
              
              <div class="message">
                Enter this code on the verification page to activate your account and unlock all features.
              </div>
              
              <div class="warning">
                ⚠️ <strong>Security Notice:</strong> If you didn't request this verification code, please ignore this email. Your account is safe.
              </div>
            </div>
            
            <div class="footer">
              <p>Need help? Contact us anytime!</p>
              <div class="footer-links">
                <a href="#">Support</a> •
                <a href="#">Privacy Policy</a> •
                <a href="#">Terms of Service</a>
              </div>
              <p style="margin-top: 20px; color: #999;">
                © ${new Date().getFullYear()} ResumeBuilder. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Verification email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  })();

  try {
    return await Promise.race([sendEmailPromise, timeoutPromise]);
  } catch (error) {
    console.error('❌ Email send failed or timed out:', error.message);
    throw error;
  }
};

// Send welcome email after verification
exports.sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'ResumeBuilder'} <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Welcome to ResumeBuilder! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e0e0e0; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .feature { padding: 15px; margin: 10px 0; background: #f8f9fa; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to ResumeBuilder!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Your email has been verified successfully! You're now ready to create amazing resumes.</p>
              
              <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" class="button">Go to Dashboard</a>
              
              <h3>What's Next?</h3>
              
              <div class="feature">
                <strong>✨ Choose a Template</strong><br>
                Browse our collection of professional templates
              </div>
              
              <div class="feature">
                <strong>✏️ Customize Your Resume</strong><br>
                Edit fonts, colors, and layouts to match your style
              </div>
              
              <div class="feature">
                <strong>📥 Download & Share</strong><br>
                Export as PDF or DOCX and share with employers
              </div>
              
              <p>If you have any questions, feel free to reach out to our support team.</p>
              
              <p>Happy resume building!<br>The ResumeBuilder Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw error for welcome email, it's not critical
    return { success: false, error: error.message };
  }
};

module.exports = exports;
