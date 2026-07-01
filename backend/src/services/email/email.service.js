const { sendEmail } = require('./email.sender');
const generateWelcomeTemplate = require('./templates/welcome.template');
const generateBookingConfirmationTemplate = require('./templates/bookingConfirmation.template');
const generateBookingStatusTemplate = require('./templates/bookingStatus.template');
const generateReviewNotificationTemplate = require('./templates/reviewNotification.template');

/**
 * Email Service
 * 
 * This is the ONLY module that controllers interact with.
 * Controllers NEVER directly call email.sender.js or templates.
 * 
 * ARCHITECTURE FLOW:
 * Controller → emailService.sendWelcomeEmail()
 *           → email.service.js (this file)
 *           → template function
 *           → email.sender.js
 *           → SMTP
 * 
 * ERROR HANDLING PRINCIPLE:
 * Email failures must NEVER break the main API response.
 * All email functions are wrapped in try/catch with logging.
 * They return success/failure without throwing errors.
 */

/**
 * Send welcome email to new user
 * 
 * @param {Object} user - User object from database
 * @param {string} user._id - User ID
 * @param {string} user.name - User's name
 * @param {string} user.email - User's email
 * @param {string} user.role - User's role (customer, provider, admin)
 * 
 * @returns {Promise<Object>} { success: boolean, message: string }
 * 
 * USAGE (In Auth Controller):
 * await emailService.sendWelcomeEmail(newUser);
 * 
 * IMPORTANT:
 * This function NEVER throws an error.
 * If email fails, it logs and returns { success: false }
 * The API request continues normally.
 */
async function sendWelcomeEmail(user) {
  try {
    if (!user || !user.email) {
      console.warn('⚠️ sendWelcomeEmail: Invalid user data');
      return { success: false, message: 'Invalid user data' };
    }

    // Generate email template
    const template = generateWelcomeTemplate({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Send email
    await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return {
      success: true,
      message: `Welcome email sent to ${user.email}`,
    };
  } catch (error) {
    // Log error but don't throw
    console.error('❌ sendWelcomeEmail failed:', error.message);
    return {
      success: false,
      message: 'Failed to send welcome email (non-critical)',
      error: error.message,
    };
  }
}

/**
 * Send booking confirmation email
 * 
 * @param {Object} params - Parameters
 * @param {Object} params.booking - Booking document from database
 * @param {string} params.booking._id - Booking ID
 * @param {string} params.booking.title - Service title
 * @param {string} params.booking.description - Service description
 * @param {string} params.booking.location - Service location
 * @param {Date} params.booking.requestedDate - Requested date
 * @param {number} params.booking.expectedDuration - Duration in minutes
 * @param {string} params.booking.notes - Additional notes
 * @param {number} params.booking.estimatedPrice - Estimated price
 * @param {Object} params.customer - Customer user object
 * @param {string} params.customer.name - Customer name
 * @param {string} params.customer.email - Customer email
 * @param {Object} params.provider - Provider user object
 * @param {string} params.provider.name - Provider name
 * @param {string} params.provider.email - Provider email
 * @param {string} params.bookingLink - Optional link to booking details
 * 
 * @returns {Promise<Object>} { success: boolean, message: string }
 * 
 * USAGE (In Booking Controller after booking creation):
 * const customer = await User.findById(booking.customerId);
 * const provider = await User.findById(booking.providerId);
 * 
 * // Send to customer
 * await emailService.sendBookingConfirmation({
 *   booking,
 *   customer,
 *   provider,
 *   recipientType: 'customer',
 *   bookingLink: `${process.env.FRONTEND_URL}/bookings/${booking._id}`
 * });
 * 
 * // Send to provider
 * await emailService.sendBookingConfirmation({
 *   booking,
 *   customer,
 *   provider,
 *   recipientType: 'provider',
 *   bookingLink: `${process.env.FRONTEND_URL}/bookings/${booking._id}`
 * });
 */
async function sendBookingConfirmation(params) {
  try {
    const { booking, customer, provider, recipientType, bookingLink } = params;

    if (!booking || !customer || !provider) {
      console.warn('⚠️ sendBookingConfirmation: Missing required parameters');
      return { success: false, message: 'Missing required parameters' };
    }

    // Determine recipient
    const recipient = recipientType === 'customer' ? customer : provider;
    if (!recipient || !recipient.email) {
      console.warn('⚠️ sendBookingConfirmation: Invalid recipient email');
      return { success: false, message: 'Invalid recipient email' };
    }

    // Generate email template
    const template = generateBookingConfirmationTemplate({
      booking,
      user: recipient,
      provider: recipientType === 'customer' ? provider : customer,
      recipientType,
      bookingLink,
    });

    // Send email
    await sendEmail({
      to: recipient.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return {
      success: true,
      message: `Booking confirmation sent to ${recipient.email}`,
    };
  } catch (error) {
    console.error('❌ sendBookingConfirmation failed:', error.message);
    return {
      success: false,
      message: 'Failed to send booking confirmation (non-critical)',
      error: error.message,
    };
  }
}

/**
 * Send booking status update email
 * 
 * @param {Object} params - Parameters
 * @param {Object} params.booking - Booking document
 * @param {string} params.booking._id - Booking ID
 * @param {string} params.booking.title - Service title
 * @param {string} params.booking.status - Booking status (ACCEPTED, REJECTED, IN_PROGRESS, COMPLETED, CANCELLED)
 * @param {string} params.booking.location - Service location
 * @param {Date} params.booking.requestedDate - Requested date
 * @param {number} params.booking.finalPrice - Final price (for completed bookings)
 * @param {Object} params.customer - Customer user object
 * @param {string} params.customer.name - Customer name
 * @param {string} params.customer.email - Customer email
 * @param {Object} params.provider - Provider user object
 * @param {string} params.provider.name - Provider name
 * @param {string} [params.statusReason] - Reason for rejection/cancellation
 * @param {string} [params.bookingLink] - Optional link to booking details
 * @param {string} [params.recipientType] - 'customer' or 'provider' (sends to both if not specified)
 * 
 * @returns {Promise<Object>} { success: boolean, message: string }
 * 
 * USAGE (In Booking Controller when status changes):
 * const booking = await Booking.findById(bookingId).populate('customerId providerId');
 * 
 * // Send to customer
 * await emailService.sendBookingStatusUpdate({
 *   booking,
 *   customer: booking.customerId,
 *   provider: booking.providerId,
 *   statusReason: 'Service not available on that date',
 *   bookingLink: `${process.env.FRONTEND_URL}/bookings/${booking._id}`,
 *   recipientType: 'customer'
 * });
 * 
 * // Send to provider
 * await emailService.sendBookingStatusUpdate({
 *   booking,
 *   customer: booking.customerId,
 *   provider: booking.providerId,
 *   bookingLink: `${process.env.FRONTEND_URL}/bookings/${booking._id}`,
 *   recipientType: 'provider'
 * });
 */
async function sendBookingStatusUpdate(params) {
  try {
    const { booking, customer, provider, statusReason, bookingLink, recipientType } = params;

    if (!booking || !customer || !provider) {
      console.warn('⚠️ sendBookingStatusUpdate: Missing required parameters');
      return { success: false, message: 'Missing required parameters' };
    }

    // Determine recipients
    let recipients = [];
    if (recipientType === 'customer') {
      recipients = [{ user: customer, type: 'customer' }];
    } else if (recipientType === 'provider') {
      recipients = [{ user: provider, type: 'provider' }];
    } else {
      recipients = [
        { user: customer, type: 'customer' },
        { user: provider, type: 'provider' },
      ];
    }

    // Send to each recipient
    const sendPromises = recipients.map(async ({ user, type }) => {
      if (!user || !user.email) {
        console.warn(`⚠️ sendBookingStatusUpdate: Invalid recipient email for ${type}`);
        return { success: false, message: 'Invalid recipient email' };
      }

      const template = generateBookingStatusTemplate({
        booking,
        user,
        provider: type === 'customer' ? provider : customer,
        recipientType: type,
        statusReason,
        bookingLink,
      });

      await sendEmail({
        to: user.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });

      return { success: true, recipientType: type, email: user.email };
    });

    const results = await Promise.allSettled(sendPromises);

    const successful = results
      .filter((r) => r.status === 'fulfilled' && r.value.success)
      .map((r) => r.value.email);

    return {
      success: successful.length > 0,
      message: `Status update sent to ${successful.join(', ')}`,
      sentTo: successful,
    };
  } catch (error) {
    console.error('❌ sendBookingStatusUpdate failed:', error.message);
    return {
      success: false,
      message: 'Failed to send booking status update (non-critical)',
      error: error.message,
    };
  }
}

/**
 * Send review notification email to service provider
 * 
 * @param {Object} params - Parameters
 * @param {Object} params.review - Review document
 * @param {string} params.review._id - Review ID
 * @param {number} params.review.rating - Rating (1-5)
 * @param {string} params.review.comment - Review comment
 * @param {Date} params.review.createdAt - Review creation date
 * @param {Object} params.customer - Customer who left review
 * @param {string} params.customer.name - Customer name
 * @param {Object} params.service - Service being reviewed
 * @param {string} params.service.title - Service title
 * @param {string} params.service._id - Service ID
 * @param {Object} params.provider - Service provider
 * @param {string} params.provider.name - Provider name
 * @param {string} params.provider.email - Provider email
 * @param {number} [params.averageRating] - Updated average rating for service
 * @param {number} [params.totalReviews] - Total number of reviews for service
 * @param {string} [params.reviewLink] - Optional link to review
 * 
 * @returns {Promise<Object>} { success: boolean, message: string }
 * 
 * USAGE (In Review Controller after review creation):
 * const review = await Review.findById(reviewId);
 * const customer = await User.findById(review.userId);
 * const service = await Service.findById(review.serviceId);
 * const provider = await User.findById(service.providerId);
 * 
 * const stats = await Review.aggregate([
 *   { $match: { serviceId: service._id } },
 *   { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
 * ]);
 * 
 * await emailService.sendReviewNotification({
 *   review,
 *   customer,
 *   service,
 *   provider,
 *   averageRating: stats[0]?.avgRating,
 *   totalReviews: stats[0]?.count,
 *   reviewLink: `${process.env.FRONTEND_URL}/services/${service._id}#reviews`
 * });
 */
async function sendReviewNotification(params) {
  try {
    const { review, customer, service, provider, averageRating, totalReviews, reviewLink } = params;

    if (!review || !customer || !service || !provider) {
      console.warn('⚠️ sendReviewNotification: Missing required parameters');
      return { success: false, message: 'Missing required parameters' };
    }

    if (!provider.email) {
      console.warn('⚠️ sendReviewNotification: Invalid provider email');
      return { success: false, message: 'Invalid provider email' };
    }

    // Generate email template
    const template = generateReviewNotificationTemplate({
      review,
      customer,
      service,
      provider,
      averageRating,
      totalReviews,
      reviewLink,
    });

    // Send email
    await sendEmail({
      to: provider.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return {
      success: true,
      message: `Review notification sent to ${provider.email}`,
    };
  } catch (error) {
    console.error('❌ sendReviewNotification failed:', error.message);
    return {
      success: false,
      message: 'Failed to send review notification (non-critical)',
      error: error.message,
    };
  }
}

module.exports = {
  sendWelcomeEmail,
  sendBookingConfirmation,
  sendBookingStatusUpdate,
  sendReviewNotification,
};
