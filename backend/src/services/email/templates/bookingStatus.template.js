const { getBaseTemplate, getBaseTextTemplate } = require('./base.template');

/**
 * Booking Status Update Email Template
 * 
 * Sent to customer and provider when booking status changes.
 * 
 * INPUT:
 * {
 *   booking: {
 *     _id: string,
 *     title: string,
 *     status: 'ACCEPTED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
 *     requestedDate: Date,
 *     location: string,
 *     finalPrice?: number,
 *   },
 *   user: {
 *     name: string,
 *     email: string,
 *   },
 *   provider?: {
 *     name: string,
 *   },
 *   recipientType: 'customer' | 'provider',
 *   statusReason?: string (for rejected/cancelled bookings),
 *   bookingLink?: string
 * }
 * 
 * OUTPUT:
 * {
 *   subject: string,
 *   html: string,
 *   text: string
 * }
 */

function generateBookingStatusTemplate({ booking, user, provider, recipientType, statusReason, bookingLink }) {
  const isCustomer = recipientType === 'customer';
  const statusMessage = getStatusMessage(booking.status, isCustomer, provider);
  const statusColor = getStatusColor(booking.status);
  const statusIcon = getStatusIcon(booking.status);

  // HTML Content
  const htmlContent = `
    <h2>Booking Status Update ${statusIcon}</h2>
    
    <p>Hi <strong>${escapeHtml(user.name)}</strong>,</p>
    
    ${statusMessage}
    
    <div class="info-box" style="border-left-color: ${statusColor};">
      <strong>Booking Information</strong>
      <p><strong>Service:</strong> ${escapeHtml(booking.title)}</p>
      <p><strong>Location:</strong> ${escapeHtml(booking.location)}</p>
      <p><strong>Scheduled Date:</strong> ${new Date(booking.requestedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}</p>
      <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: 600;">${booking.status}</span></p>
      ${booking.finalPrice ? `<p><strong>Final Price:</strong> $${booking.finalPrice.toFixed(2)}</p>` : ''}
    </div>
    
    ${statusReason ? `
      <div style="background-color: #fee; padding: 15px; border-radius: 4px; margin: 15px 0; border-left: 4px solid #e74c3c;">
        <strong>Reason</strong>
        <p style="margin-top: 8px; font-size: 13px; color: #c0392b;">${escapeHtml(statusReason)}</p>
      </div>
    ` : ''}
    
    ${getNextSteps(booking.status, isCustomer)}
    
    ${bookingLink ? `<a href="${escapeHtml(bookingLink)}" class="cta-button">View Full Details</a>` : ''}
    
    <p style="margin-top: 30px; font-size: 13px; color: #7f8c8d;">
      <strong>Booking ID:</strong> ${booking._id}<br>
      If you have any questions, please contact our support team.
    </p>
  `;

  // Text Content
  const textContent = `
Booking Status Update

Hi ${user.name},

${statusMessage.replace(/<[^>]*>/g, '')}

BOOKING INFORMATION
==================
Service: ${booking.title}
Location: ${booking.location}
Scheduled Date: ${new Date(booking.requestedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
Status: ${booking.status}
${booking.finalPrice ? `Final Price: $${booking.finalPrice.toFixed(2)}` : ''}

${statusReason ? `REASON\n${statusReason}\n` : ''}

${getNextStepsText(booking.status, isCustomer)}

Booking ID: ${booking._id}
If you have any questions, please contact our support team.
  `;

  return {
    subject: `Booking ${booking.status}: ${booking.title}`,
    html: getBaseTemplate(htmlContent),
    text: getBaseTextTemplate(textContent),
  };
}

/**
 * Get status-specific message
 */
function getStatusMessage(status, isCustomer, provider) {
  const messages = {
    ACCEPTED: isCustomer
      ? `<p>Great news! The service provider <strong>${provider ? escapeHtml(provider.name) : 'has'}</strong> accepted your booking request. They will contact you shortly to confirm details.</p>`
      : `<p>You have accepted this booking request. The customer will receive your confirmation and you can proceed with the service.</p>`,

    REJECTED: isCustomer
      ? `<p>Unfortunately, the service provider has declined your booking request. Don't worry! You can try booking another provider or contact our support team for assistance.</p>`
      : `<p>Your rejection of this booking has been recorded. The customer has been notified and can try booking another provider.</p>`,

    IN_PROGRESS: isCustomer
      ? `<p>The service is now in progress! The provider is at work. You can track progress or contact them if needed.</p>`
      : `<p>The service has been started. Please complete the work and mark it as done when finished.</p>`,

    COMPLETED: isCustomer
      ? `<p>Excellent! The service has been completed. Please review your experience and leave feedback for the provider.</p>`
      : `<p>The booking has been marked as completed. Thank you for your service! The customer will leave a review.</p>`,

    CANCELLED: isCustomer
      ? `<p>This booking has been cancelled. If this was unexpected, please contact the provider or our support team.</p>`
      : `<p>This booking has been cancelled. If you need to cancel in the future, please provide notice to the customer.</p>`,
  };

  return messages[status] || '<p>Your booking status has been updated.</p>';
}

/**
 * Get status-specific next steps
 */
function getNextSteps(status, isCustomer) {
  const steps = {
    ACCEPTED: isCustomer
      ? `<p><strong>What's next:</strong> Expect a call or message from the provider to confirm timing and any additional details. Make sure to be available at the scheduled time.</p>`
      : `<p><strong>What's next:</strong> Contact the customer to confirm the exact time and any final details before starting the work.</p>`,

    REJECTED: isCustomer
      ? `<p><strong>What's next:</strong> Browse other service providers or refine your search criteria to find a match.</p>`
      : `<p></p>`,

    IN_PROGRESS: isCustomer
      ? `<p><strong>What's next:</strong> The provider will reach out once the service is completed. Please be available and ready to pay if using in-app payment.</p>`
      : `<p><strong>What's next:</strong> Complete the service and mark it as done. Don't forget to communicate any changes with the customer.</p>`,

    COMPLETED: isCustomer
      ? `<p><strong>What's next:</strong> Please leave a review and rating for the provider. Your feedback helps other customers and supports quality providers.</p>`
      : `<p><strong>What's next:</strong> Await customer review. Maintain high quality to earn more bookings!</p>`,

    CANCELLED: `<p></p>`,
  };

  return steps[status] || '';
}

/**
 * Get status-specific next steps (text version)
 */
function getNextStepsText(status, isCustomer) {
  const steps = {
    ACCEPTED: isCustomer
      ? `WHAT'S NEXT
Expect a call or message from the provider to confirm timing and any additional details. Make sure to be available at the scheduled time.`
      : `WHAT'S NEXT
Contact the customer to confirm the exact time and any final details before starting the work.`,

    REJECTED: isCustomer
      ? `WHAT'S NEXT
Browse other service providers or refine your search criteria to find a match.`
      : '',

    IN_PROGRESS: isCustomer
      ? `WHAT'S NEXT
The provider will reach out once the service is completed. Please be available and ready to pay if using in-app payment.`
      : `WHAT'S NEXT
Complete the service and mark it as done. Don't forget to communicate any changes with the customer.`,

    COMPLETED: isCustomer
      ? `WHAT'S NEXT
Please leave a review and rating for the provider. Your feedback helps other customers and supports quality providers.`
      : `WHAT'S NEXT
Await customer review. Maintain high quality to earn more bookings!`,

    CANCELLED: '',
  };

  return steps[status] || '';
}

/**
 * Get status color
 */
function getStatusColor(status) {
  const colors = {
    ACCEPTED: '#27ae60',
    REJECTED: '#e74c3c',
    IN_PROGRESS: '#f39c12',
    COMPLETED: '#2980b9',
    CANCELLED: '#95a5a6',
  };
  return colors[status] || '#667eea';
}

/**
 * Get status icon
 */
function getStatusIcon(status) {
  const icons = {
    ACCEPTED: '✅',
    REJECTED: '❌',
    IN_PROGRESS: '⚙️',
    COMPLETED: '✨',
    CANCELLED: '⛔',
  };
  return icons[status] || '📋';
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

module.exports = generateBookingStatusTemplate;
