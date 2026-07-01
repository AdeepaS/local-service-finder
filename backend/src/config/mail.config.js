const nodemailer = require('nodemailer');

/**
 * Mail Configuration
 * 
 * This file ONLY sets up the Nodemailer transporter.
 * No business logic or email sending happens here.
 * 
 * FUTURE MIGRATION PATH:
 * When switching to RabbitMQ/Kafka/BullMQ, this file remains unchanged.
 * Only email.sender.js will be modified to use the queue system instead.
 */

const mailConfig = {
  // Email provider configuration
  service: process.env.MAIL_SERVICE || 'gmail',
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 587,
  secure: process.env.MAIL_SECURE === 'true', // true for 465, false for 587
  
  auth: {
    user: process.env.MAIL_FROM_EMAIL,
    pass: process.env.MAIL_FROM_PASSWORD,
  },
};

// Validate required environment variables
if (!mailConfig.auth.user || !mailConfig.auth.pass) {
  console.warn('⚠️ Email credentials not configured. Email notifications will fail.');
  console.warn('Please set MAIL_FROM_EMAIL and MAIL_FROM_PASSWORD in .env');
}

// Create transporter
const transporter = nodemailer.createTransport(mailConfig);

/**
 * Verify transporter connection on startup
 */
if (process.env.NODE_ENV === 'development') {
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Email transporter connection failed:', error.message);
    } else {
      console.log('✅ Email transporter is ready to send emails');
    }
  });
}

module.exports = transporter;
