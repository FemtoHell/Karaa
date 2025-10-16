require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n🔍 SMTP Configuration Debug:');
console.log('================================');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_EMAIL:', process.env.SMTP_EMAIL);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? `[${process.env.SMTP_PASSWORD.length} chars] "${process.env.SMTP_PASSWORD}"` : 'NOT SET');
console.log('FROM_NAME:', process.env.FROM_NAME);
console.log('================================\n');

async function testSMTP() {
  try {
    console.log('📧 Creating transporter...');
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
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      debug: true, // Enable debug output
      logger: true // Enable logging
    });

    console.log('\n✅ Transporter created');
    console.log('\n🔌 Testing connection...');
    
    await transporter.verify();
    console.log('✅ SMTP connection successful!\n');

    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: `${process.env.FROM_NAME || 'ResumeBuilder'} <${process.env.SMTP_EMAIL}>`,
      to: process.env.SMTP_EMAIL, // Send to self
      subject: 'SMTP Test - ResumeBuilder',
      html: `
        <h1>✅ SMTP Working!</h1>
        <p>Your SMTP configuration is working correctly.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('\n🎉 All tests passed!\n');
    
  } catch (error) {
    console.error('\n❌ SMTP Error:', error.message);
    if (error.code) console.error('Error Code:', error.code);
    if (error.command) console.error('Failed Command:', error.command);
    if (error.response) console.error('Server Response:', error.response);
    console.error('\nFull Error:', error);
    process.exit(1);
  }
}

testSMTP();
