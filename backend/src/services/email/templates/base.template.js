/**
 * Base Email Template
 * 
 * Provides consistent HTML structure and styling for all emails.
 * All other templates extend from this base.
 * 
 * USAGE:
 * Each template calls this function and replaces the content section.
 */

function getBaseTemplate(contentHtml) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
            color: #2c3e50;
            line-height: 1.6;
          }
          
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px 20px;
            text-align: center;
            color: #ffffff;
          }
          
          .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.9;
            margin: 5px 0 0 0;
          }
          
          .logo {
            display: inline-block;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .content h2 {
            font-size: 20px;
            color: #2c3e50;
            margin-bottom: 20px;
          }
          
          .content p {
            font-size: 14px;
            color: #555;
            margin-bottom: 15px;
          }
          
          .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #667eea;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: background-color 0.3s;
          }
          
          .cta-button:hover {
            background-color: #764ba2;
          }
          
          .info-box {
            background-color: #f8fafc;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          
          .info-box strong {
            color: #2c3e50;
          }
          
          .info-box p {
            margin: 5px 0;
            font-size: 13px;
          }
          
          .divider {
            height: 1px;
            background-color: #ecf0f1;
            margin: 30px 0;
          }
          
          .footer {
            background-color: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #ecf0f1;
          }
          
          .footer p {
            font-size: 12px;
            color: #7f8c8d;
            margin: 5px 0;
          }
          
          .footer a {
            color: #667eea;
            text-decoration: none;
          }
          
          .footer a:hover {
            text-decoration: underline;
          }
          
          .social-links {
            margin: 10px 0;
          }
          
          .social-links a {
            display: inline-block;
            margin: 0 8px;
            font-size: 12px;
          }
          
          @media (max-width: 600px) {
            .container {
              border-radius: 0;
            }
            
            .content {
              padding: 20px 15px;
            }
            
            .header {
              padding: 20px 15px;
            }
            
            .header h1 {
              font-size: 18px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🔧 Local Service Finder</div>
            <h1>Service Platform</h1>
          </div>
          
          <div class="content">
            ${contentHtml}
          </div>
          
          <div class="footer">
            <div class="divider"></div>
            <p><strong>Local Service Finder</strong></p>
            <p>Your trusted platform for local service providers</p>
            <div class="social-links">
              <a href="https://localservicefinder.com">Website</a> |
              <a href="https://localservicefinder.com/help">Help Center</a> |
              <a href="https://localservicefinder.com/privacy">Privacy</a>
            </div>
            <p style="margin-top: 15px; font-size: 11px;">
              © ${new Date().getFullYear()} Local Service Finder. All rights reserved.<br>
              <a href="https://localservicefinder.com/unsubscribe">Unsubscribe from these emails</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Get plain text fallback for base template
 */
function getBaseTextTemplate(contentText) {
  return `
LOCAL SERVICE FINDER
====================

${contentText}

---
© ${new Date().getFullYear()} Local Service Finder
Website: https://localservicefinder.com
Help: https://localservicefinder.com/help
Privacy: https://localservicefinder.com/privacy
  `;
}

module.exports = {
  getBaseTemplate,
  getBaseTextTemplate,
};
