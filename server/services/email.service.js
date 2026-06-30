const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send a generic email
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'RAHAT Emergency <noreply@rahat.in>',
      to,
      subject,
      html,
      text,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #DC2626; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🚨 RAHAT</h1>
        <p style="color: #fca5a5; margin: 5px 0;">Emergency Assistance Platform</p>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2 style="color: #111827;">Password Reset Request</h2>
        <p style="color: #4b5563;">You requested to reset your RAHAT account password. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #DC2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">This link expires in <strong>30 minutes</strong>.</p>
        <p style="color: #6b7280; font-size: 14px;">If you did not request this, ignore this email. Your password remains unchanged.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          RAHAT Emergency Assistance Platform | India<br/>
          Emergency: <a href="tel:112" style="color: #DC2626;">112</a> | Ambulance: <a href="tel:108" style="color: #DC2626;">108</a>
        </p>
      </div>
    </div>
  `;
  return sendEmail({
    to: email,
    subject: 'RAHAT – Password Reset Request',
    html,
    text: `Reset your RAHAT password at: ${resetUrl}. This link expires in 30 minutes.`,
  });
};

/**
 * Send SOS notification to emergency contact
 */
const sendSOSEmail = async (contact, user, sosRequest) => {
  const mapsLink = `https://www.google.com/maps?q=${sosRequest.location.coordinates[1]},${sosRequest.location.coordinates[0]}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #DC2626; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🚨 EMERGENCY ALERT</h1>
        <p style="color: white; font-size: 18px; margin: 5px 0;">RAHAT SOS Activated</p>
      </div>
      <div style="padding: 30px; background: #fff3f3; border: 2px solid #DC2626;">
        <h2 style="color: #DC2626;">Your contact needs help!</h2>
        <p style="color: #111827; font-size: 16px;"><strong>${user.name}</strong> has activated an SOS emergency alert and listed you as an emergency contact.</p>
        <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${sosRequest.address || 'See map link below'}</p>
          <p style="margin: 5px 0;"><strong>📞 Phone:</strong> ${user.phone}</p>
          <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
        </div>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${mapsLink}" style="background: #DC2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
            📍 View Location on Map
          </a>
        </div>
        <p style="color: #DC2626; font-weight: bold; font-size: 16px;">Please call them immediately or contact emergency services:</p>
        <p style="font-size: 24px; text-align: center;">
          <a href="tel:112" style="color: #DC2626;">112</a> (Emergency) | 
          <a href="tel:108" style="color: #DC2626;">108</a> (Ambulance) | 
          <a href="tel:100" style="color: #DC2626;">100</a> (Police)
        </p>
      </div>
    </div>
  `;
  return sendEmail({
    to: contact.email,
    subject: `🚨 EMERGENCY: ${user.name} needs your help! – RAHAT SOS`,
    html,
    text: `EMERGENCY: ${user.name} has activated an SOS. Location: ${sosRequest.address}. Map: ${mapsLink}. Call: ${user.phone}. Emergency: 112`,
  });
};

module.exports = { sendEmail, sendPasswordResetEmail, sendSOSEmail };
