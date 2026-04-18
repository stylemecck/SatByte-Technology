/**
 * Unified SatByte Technologies Email Template System.
 * Provides a modern, responsive, and branded HTML skeleton for all outgoing emails.
 */

const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
  
  body {
    background-color: #f8fafc;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 40px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .header {
    background: linear-gradient(135deg, #0c1b32 0%, #020617 100%);
    padding: 40px 20px;
    text-align: center;
  }
  
  .logo {
    height: 60px;
    margin-bottom: 15px;
  }
  
  .content {
    padding: 40px 30px;
    line-height: 1.6;
    color: #1e293b;
  }
  
  .footer {
    background-color: #f1f5f9;
    padding: 30px;
    text-align: center;
    font-size: 12px;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
  }
  
  .button {
    display: inline-block;
    padding: 12px 24px;
    background-color: #00e5ff;
    color: #0c1b32 !important;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 800;
    margin-top: 20px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  h1 { color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 0; }
  p { margin-bottom: 16px; font-size: 16px; }
  .accent { color: #00e5ff; }
  .meta-box { background-color: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #00e5ff; margin: 20px 0; }
`;

export function wrapEmail(title, htmlContent, ctaText = null, ctaUrl = null) {
  const logoUrl = 'https://res.cloudinary.com/dpddfcu8u/image/upload/v1776495196/satbyte/branding/email_logo_v1.jpg';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${SHARED_STYLES}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${logoUrl}" alt="SatByte Technologies" class="logo">
            <div style="font-size: 10px; color: #94a3b8; font-weight: 800; letter-spacing: 0.3em; text-transform: uppercase;">
              Premium Digital Solutions
            </div>
          </div>
          
          <div class="content">
            ${htmlContent}
            
            ${ctaText && ctaUrl ? `
              <div style="text-align: center;">
                <a href="${ctaUrl}" class="button">${ctaText}</a>
              </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p style="font-weight: 600; color: #0c1b32; margin-bottom: 8px;">SatByte Technologies</p>
            <p>Mahua, Vaishali, Bihar &bull; 844506</p>
            <p>
              <a href="https://satbyte.in" style="color: #64748b;">Website</a> &bull; 
              <a href="https://satbyte.in/contact" style="color: #64748b;">Contact Support</a>
            </p>
            <p style="margin-top: 20px; font-size: 10px; opacity: 0.6;">
              &copy; ${new Date().getFullYear()} SatByte IT Solutions India Pvt Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
