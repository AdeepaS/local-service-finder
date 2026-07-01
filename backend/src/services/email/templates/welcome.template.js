const { getBaseTemplate, getBaseTextTemplate } = require('./base.template');

/**
 * Welcome Email Template
 * 
 * Sent to users after successful registration.
 * 
 * INPUT:
 * {
 *   name: string (user's name),
 *   email: string (user's email),
 *   role: string ('customer' | 'provider' | 'admin'),
 *   verificationLink?: string (optional email verification link)
 * }
 * 
 * OUTPUT:
 * {
 *   subject: string,
 *   html: string,
 *   text: string
 * }
 */

function generateWelcomeTemplate(user) {
  const roleDescriptions = {
    customer: 'Browse and book local service providers in your area.',
    provider: 'List your services and start accepting bookings from customers.',
    admin: 'Access the admin dashboard to manage the platform.',
  };

  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const roleDescription = roleDescriptions[user.role] || 'Explore our platform!';

  // HTML Content
  const htmlContent = `
    <h2>Welcome to Local Service Finder! 👋</h2>
    
    <p>Hi <strong>${escapeHtml(user.name)}</strong>,</p>
    
    <p>Thank you for joining Local Service Finder! We're excited to have you on board as a <strong>${roleLabel}</strong>.</p>
    
    <div class="info-box">
      <strong>Your Role:</strong>
      <p>${roleDescription}</p>
    </div>
    
    <p>Here's what you can do next:</p>
    
    <ul style="margin: 15px 0 15px 20px; color: #555;">
      ${user.role === 'customer' ? `
        <li style="margin: 8px 0;">Browse service providers in your area</li>
        <li style="margin: 8px 0;">Filter by service category, location, and rating</li>
        <li style="margin: 8px 0;">Book services and track your bookings</li>
        <li style="margin: 8px 0;">Leave reviews and manage your profile</li>
      ` : user.role === 'provider' ? `
        <li style="margin: 8px 0;">Create and list your services</li>
        <li style="margin: 8px 0;">Upload service photos and set pricing</li>
        <li style="margin: 8px 0;">Receive and manage booking requests</li>
        <li style="margin: 8px 0;">Build your reputation with customer reviews</li>
      ` : `
        <li style="margin: 8px 0;">Manage platform services and users</li>
        <li style="margin: 8px 0;">Review and approve service listings</li>
        <li style="margin: 8px 0;">Monitor platform activity and metrics</li>
      `}
    </ul>
    
    <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
    
    <p>Happy exploring!<br><strong>The Local Service Finder Team</strong></p>
  `;

  // Text Content
  const textContent = `
Welcome to Local Service Finder!

Hi ${user.name},

Thank you for joining Local Service Finder! We're excited to have you on board as a ${roleLabel}.

Your Role:
${roleDescription}

Here's what you can do next:
${user.role === 'customer' ? `
- Browse service providers in your area
- Filter by service category, location, and rating
- Book services and track your bookings
- Leave reviews and manage your profile
` : user.role === 'provider' ? `
- Create and list your services
- Upload service photos and set pricing
- Receive and manage booking requests
- Build your reputation with customer reviews
` : `
- Manage platform services and users
- Review and approve service listings
- Monitor platform activity and metrics
`}

If you have any questions or need help getting started, feel free to reach out to our support team.

Happy exploring!
The Local Service Finder Team
  `;

  return {
    subject: `Welcome to Local Service Finder, ${user.name}! 🎉`,
    html: getBaseTemplate(htmlContent),
    text: getBaseTextTemplate(textContent),
  };
}

/**
 * Helper to escape HTML entities
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

module.exports = generateWelcomeTemplate;
