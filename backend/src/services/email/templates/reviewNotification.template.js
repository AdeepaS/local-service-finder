const { getBaseTemplate, getBaseTextTemplate } = require('./base.template');

/**
 * Review Notification Email Template
 * 
 * Sent to service provider when a customer leaves a review.
 * 
 * INPUT:
 * {
 *   review: {
 *     _id: string,
 *     rating: number (1-5),
 *     comment: string,
 *     createdAt: Date,
 *   },
 *   customer: {
 *     name: string,
 *   },
 *   service: {
 *     title: string,
 *     _id: string,
 *   },
 *   provider: {
 *     name: string,
 *     email: string,
 *   },
 *   averageRating?: number,
 *   totalReviews?: number,
 *   reviewLink?: string
 * }
 * 
 * OUTPUT:
 * {
 *   subject: string,
 *   html: string,
 *   text: string
 * }
 */

function generateReviewNotificationTemplate({
  review,
  customer,
  service,
  provider,
  averageRating,
  totalReviews,
  reviewLink,
}) {
  const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const sentiment = getSentiment(review.rating);

  // HTML Content
  const htmlContent = `
    <h2>You've Received a Review! ${sentiment.icon}</h2>
    
    <p>Hi <strong>${escapeHtml(provider.name)}</strong>,</p>
    
    <p><strong>${escapeHtml(customer.name)}</strong> just left a review for your service <strong>"${escapeHtml(
    service.title
  )}"</strong>. Take a look below:</p>
    
    <div class="info-box">
      <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
        <div>
          <div style="font-size: 24px; margin: 0;">${stars}</div>
          <div style="font-size: 14px; color: #667eea; font-weight: 600;">${review.rating} out of 5 stars</div>
        </div>
        <div style="flex: 1;">
          <p style="margin: 0; font-size: 13px; color: #7f8c8d;">
            <strong>${escapeHtml(customer.name)}</strong><br>
            ${new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
      
      ${review.comment ? `
        <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; margin-top: 15px; border: 1px solid #ecf0f1;">
          <p style="margin: 0; font-size: 14px; color: #2c3e50; font-style: italic;">
            "${escapeHtml(review.comment)}"
          </p>
        </div>
      ` : ''}
    </div>
    
    ${sentiment.message ? `
      <div style="background-color: ${sentiment.bgColor}; border-left: 4px solid ${sentiment.color}; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 13px; color: ${sentiment.textColor};">
          <strong>${sentiment.title}</strong> ${sentiment.message}
        </p>
      </div>
    ` : ''}
    
    <div class="info-box">
      <strong>Your Service Rating</strong>
      ${averageRating ? `
        <p><strong>Average Rating:</strong> ${averageRating.toFixed(1)} ⭐ (${totalReviews} ${
    totalReviews === 1 ? 'review' : 'reviews'
  })</p>
      ` : ''}
      <p style="font-size: 13px; color: #7f8c8d; margin-top: 10px;">
        Keep delivering excellent service to maintain your reputation and attract more customers!
      </p>
    </div>
    
    ${reviewLink ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${escapeHtml(reviewLink)}" class="cta-button">View Full Review</a>
      </div>
    ` : ''}
    
    ${review.rating < 3 ? `
      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 13px; color: #856404;">
          <strong>📞 Need Help?</strong> If you believe this review is unfair or want to respond, please contact our support team.
        </p>
      </div>
    ` : ''}
  `;

  // Text Content
  const textContent = `
You've Received a Review!

Hi ${provider.name},

${escapeHtml(customer.name)} just left a review for your service "${service.title}". Take a look below:

REVIEW
======
Rating: ${review.rating} out of 5 stars ${stars}
Customer: ${escapeHtml(customer.name)}
Date: ${new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })}

${review.comment ? `Comment: "${escapeHtml(review.comment)}"` : 'No comment provided.'}

YOUR SERVICE RATING
===================
${averageRating ? `Average Rating: ${averageRating.toFixed(1)} ⭐ (${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'})` : ''}
Keep delivering excellent service to maintain your reputation and attract more customers!

${review.rating < 3 ? `
NEED HELP?
If you believe this review is unfair or want to respond, please contact our support team.
` : ''}

${reviewLink ? `View the full review: ${reviewLink}` : ''}
  `;

  return {
    subject: `${customer.name} left a ${review.rating}⭐ review for ${service.title}`,
    html: getBaseTemplate(htmlContent),
    text: getBaseTextTemplate(textContent),
  };
}

/**
 * Get sentiment based on rating
 */
function getSentiment(rating) {
  const sentiments = {
    5: {
      icon: '🌟',
      title: 'Excellent Review!',
      message: 'Your customer was very satisfied with your service. Keep up the great work!',
      color: '#27ae60',
      bgColor: '#d5f4e6',
      textColor: '#0e6251',
    },
    4: {
      icon: '😊',
      title: 'Positive Feedback!',
      message: 'Your customer is happy with your service. Continue delivering quality work.',
      color: '#3498db',
      bgColor: '#d6eaf8',
      textColor: '#0c5460',
    },
    3: {
      icon: '👍',
      title: 'Neutral Feedback',
      message: 'Your customer found your service acceptable. Consider any suggestions they may have.',
      color: '#f39c12',
      bgColor: '#fff3cd',
      textColor: '#856404',
    },
    2: {
      icon: '⚠️',
      title: 'Needs Improvement',
      message: 'Your customer had some concerns. Review their feedback and make improvements.',
      color: '#e67e22',
      bgColor: '#ffeaa7',
      textColor: '#d63031',
    },
    1: {
      icon: '❌',
      title: 'Negative Feedback',
      message: 'Your customer was not satisfied. Please review their feedback carefully and consider reaching out.',
      color: '#e74c3c',
      bgColor: '#fadbd8',
      textColor: '#c0392b',
    },
  };

  return sentiments[rating] || sentiments[3];
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

module.exports = generateReviewNotificationTemplate;
