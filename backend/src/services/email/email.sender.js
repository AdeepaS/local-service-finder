const transporter = require('../../config/mail.config');

/**
 * Email Sender - ABSTRACTION LAYER
 * 
 * This module is the ONLY place where the actual email delivery happens.
 * 
 * ARCHITECTURE PRINCIPLE:
 * Controllers → Email Service → Email Sender → SMTP (Nodemailer)
 * 
 * FUTURE MIGRATION:
 * When switching to RabbitMQ/Kafka/BullMQ/NATS, ONLY this file changes.
 * Everything above (controllers, email service) remains identical.
 * 
 * Current Implementation: Nodemailer (direct SMTP)
 * Future Implementations:
 *   - RabbitMQ: Use amqplib to publish messages to queue
 *   - Kafka: Use kafkajs to produce messages to topic
 *   - BullMQ: Use bull to add jobs to Redis queue
 *   - NATS: Use nats.js to publish messages
 */

/**
 * Send an email
 * 
 * @param {Object} emailData - Email configuration
 * @param {string} emailData.to - Recipient email address
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.html - HTML content
 * @param {string} emailData.text - Plain text content
 * @param {string} [emailData.from] - Sender email (optional, uses config default)
 * 
 * @returns {Promise<Object>} Result object with info about sent email
 * @throws {Error} Throws error if email sending fails
 * 
 * EXAMPLE:
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Welcome</h1>',
 *   text: 'Welcome'
 * });
 */
async function sendEmail({ to, subject, html, text, from }) {
  try {
    // Validate input
    if (!to || !subject || (!html && !text)) {
      throw new Error('Missing required email fields: to, subject, and (html or text)');
    }

    // Prepare email options
    const mailOptions = {
      from: from || process.env.MAIL_FROM_EMAIL || 'noreply@localservicefinder.com',
      to,
      subject,
      html: html || null,
      text: text || null,
    };

    // Send email using Nodemailer
    const info = await transporter.sendMail(mailOptions);

    // Log success
    console.log(`✅ Email sent successfully`);
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Message ID: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
      to,
      subject,
      timestamp: new Date(),
    };
  } catch (error) {
    // Log error
    console.error('❌ Failed to send email:');
    console.error(`   To: ${to}`);
    console.error(`   Subject: ${subject}`);
    console.error(`   Error: ${error.message}`);

    // Re-throw error for caller to handle
    throw error;
  }
}

/**
 * Send multiple emails in batch
 * 
 * @param {Array<Object>} emailList - Array of email configurations
 * @returns {Promise<Array>} Array of results for each email
 * 
 * EXAMPLE:
 * await sendEmailBatch([
 *   { to: 'user1@example.com', subject: 'Hi', html: '<p>Hi</p>', text: 'Hi' },
 *   { to: 'user2@example.com', subject: 'Hi', html: '<p>Hi</p>', text: 'Hi' }
 * ]);
 */
async function sendEmailBatch(emailList) {
  const results = {
    successful: [],
    failed: [],
    total: emailList.length,
  };

  // Process emails sequentially to avoid overwhelming the SMTP server
  for (const emailData of emailList) {
    try {
      const result = await sendEmail(emailData);
      results.successful.push(result);
    } catch (error) {
      results.failed.push({
        to: emailData.to,
        subject: emailData.subject,
        error: error.message,
      });
    }
  }

  console.log(`📧 Batch email summary:`);
  console.log(`   Total: ${results.total}`);
  console.log(`   Successful: ${results.successful.length}`);
  console.log(`   Failed: ${results.failed.length}`);

  return results;
}

module.exports = {
  sendEmail,
  sendEmailBatch,
};
