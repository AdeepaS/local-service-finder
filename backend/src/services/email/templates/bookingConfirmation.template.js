const { getBaseTemplate, getBaseTextTemplate } = require('./base.template');

/**
 * Booking Confirmation Email Template
 * 
 * Sent to customer after booking is created, and to provider when they receive a new booking.
 * 
 * INPUT:
 * {
 *   booking: {
 *     _id: string,
 *     title: string,
 *     description: string,
 *     location: string,
 *     requestedDate: Date,
 *     expectedDuration: number (minutes),
 *     notes: string,
 *     estimatedPrice: number,
 *     status: string,
 *   },
 *   user: {
 *     name: string,
 *     email: string,
 *   },
 *   provider?: {
 *     name: string,
 *     email: string,
 *   },
 *   recipientType: 'customer' | 'provider',
 *   bookingLink?: string (optional link to booking details page)
 * }
 * 
 * OUTPUT:
 * {
 *   subject: string,
 *   html: string,
 *   text: string
 * }
 */

function generateBookingConfirmationTemplate({ booking, user, provider, recipientType, bookingLink }) {
  const requestedDate = new Date(booking.requestedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const requestedTime = new Date(booking.requestedDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const durationText = booking.expectedDuration
    ? `${booking.expectedDuration} minutes`
    : 'To be discussed';

  const isCustomer = recipientType === 'customer';
  const recipientName = user.name;

  // HTML Content
  const htmlContent = `
    <h2>Booking Confirmation ✓</h2>
    
    <p>Hi <strong>${escapeHtml(recipientName)}</strong>,</p>
    
    ${isCustomer
      ? `<p>Great news! Your booking request has been submitted successfully. The service provider will review your request and respond soon.</p>`
      : `<p>You have received a new booking request! A customer is interested in your ${escapeHtml(booking.title)} service.</p>`
    }
    
    <div class="info-box">
      <strong>Booking Details</strong>
      <p><strong>Service:</strong> ${escapeHtml(booking.title)}</p>
      <p><strong>Date:</strong> ${requestedDate}</p>
      <p><strong>Time:</strong> ${requestedTime}</p>
      <p><strong>Duration:</strong> ${durationText}</p>
      <p><strong>Location:</strong> ${escapeHtml(booking.location)}</p>
      ${booking.estimatedPrice ? `<p><strong>Estimated Price:</strong> $${booking.estimatedPrice.toFixed(2)}</p>` : ''}
      <p><strong>Status:</strong> <span style="color: #f39c12; font-weight: 600;">Pending Response</span></p>
    </div>
    
    ${booking.description ? `
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <strong>Description</strong>
        <p style="margin-top: 8px; font-size: 13px;">${escapeHtml(booking.description)}</p>
      </div>
    ` : ''}
    
    ${booking.notes ? `
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <strong>Additional Notes</strong>
        <p style="margin-top: 8px; font-size: 13px;">${escapeHtml(booking.notes)}</p>
      </div>
    ` : ''}
    
    ${isCustomer
      ? `
        <p>You can track your booking status anytime from your dashboard. The provider will contact you once they review your request.</p>
        ${bookingLink ? `<a href="${escapeHtml(bookingLink)}" class="cta-button">View Booking Details</a>` : ''}
      `
      : `
        <p>Review this booking request and decide whether to accept, reject, or contact the customer for more information.</p>
        ${bookingLink ? `<a href="${escapeHtml(bookingLink)}" class="cta-button">Review Booking</a>` : ''}
      `
    }
    
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 13px; color: #856404;">
        <strong>📞 Need Help?</strong> If you have any questions about this booking, please contact our support team.
      </p>
    </div>
  `;

  // Text Content
  const textContent = `
Booking Confirmation

Hi ${recipientName},

${isCustomer
  ? 'Great news! Your booking request has been submitted successfully. The service provider will review your request and respond soon.'
  : 'You have received a new booking request! A customer is interested in your ' + booking.title + ' service.'
}

BOOKING DETAILS
===============
Service: ${booking.title}
Date: ${requestedDate}
Time: ${requestedTime}
Duration: ${durationText}
Location: ${booking.location}
${booking.estimatedPrice ? `Estimated Price: $${booking.estimatedPrice.toFixed(2)}` : ''}
Status: Pending Response

${booking.description ? `\nDESCRIPTION\n${booking.description}\n` : ''}

${booking.notes ? `\nADDITIONAL NOTES\n${booking.notes}\n` : ''}

${isCustomer
  ? 'You can track your booking status anytime from your dashboard. The provider will contact you once they review your request.'
  : 'Review this booking request and decide whether to accept, reject, or contact the customer for more information.'
}

NEED HELP?
If you have any questions about this booking, please contact our support team.

Booking Reference: ${booking._id}
  `;

  const subject = isCustomer
    ? `Booking Confirmation: ${booking.title}`
    : `New Booking Request: ${booking.title}`;

  return {
    subject,
    html: getBaseTemplate(htmlContent),
    text: getBaseTextTemplate(textContent),
  };
}

/**
 * Helper to escape HTML entities
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

module.exports = generateBookingConfirmationTemplate;
