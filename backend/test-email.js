require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('🧪 Testing SMTP Configuration...\n');

  console.log('📋 SMTP Settings:');
  console.log('  Host:', process.env.SMTP_HOST);
  console.log('  Port:', process.env.SMTP_PORT);
  console.log('  Email:', process.env.SMTP_EMAIL);
  console.log('  Password:', process.env.SMTP_PASSWORD ? '***' + process.env.SMTP_PASSWORD.slice(-4) : 'NOT SET');
  console.log('');

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('✅ Transporter created successfully');
    console.log('🔄 Verifying connection...');

    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection verified!');

    // Send test email
    console.log('📧 Sending test email...');
    const info = await transporter.sendMail({
      from: `${process.env.FROM_NAME || 'ResumeBuilder'} <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL, // Send to self
      subject: 'Test Email - ResumeBuilder',
      html: `
        <h1>✅ SMTP Test Successful!</h1>
        <p>Your email configuration is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Accepted:', info.accepted);
    console.log('');
    console.log('✅ All tests passed! Email service is working correctly.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');

    if (error.code === 'EAUTH') {
      console.error('  → Authentication failed');
      console.error('  → Check if SMTP_PASSWORD is correct');
      console.error('  → For Gmail: Use App Password, not regular password');
      console.error('  → https://support.google.com/accounts/answer/185833');
    } else if (error.code === 'ECONNECTION') {
      console.error('  → Connection failed');
      console.error('  → Check SMTP_HOST and SMTP_PORT');
      console.error('  → Check internet connection');
    } else {
      console.error('  → Unknown error:', error.code || 'N/A');
    }

    process.exit(1);
  }
}

testEmail();
