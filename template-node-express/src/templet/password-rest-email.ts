export const passwordResetEmailTemplate = (resetUrl: string): string => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333333;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        background-color: #1e40af;
        padding: 20px;
        text-align: center;
        color: #ffffff;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .reset-button {
        display: inline-block;
        padding: 12px 24px;
        background-color: #1e40af;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 500;
        margin: 20px 0;
      }
      .footer {
        background-color: #f4f4f4;
        padding: 20px;
        text-align: center;
        font-size: 14px;
        color: #666666;
      }
      .footer a {
        color: #1e40af;
        text-decoration: none;
      }
      @media only screen and (max-width: 600px) {
        .container {
          margin: 10px;
        }
        .content {
          padding: 20px;
        }
        .reset-button {
          padding: 10px 20px;
          font-size: 14px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Parking Management System</h1>
      </div>
      <div class="content">
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your password for the Parking Management System. Click the button below to set a new password. This link is valid for 1 hour.</p>
        <a href="${resetUrl}" class="reset-button">Reset Password</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
      <div class="footer">
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p>© 2025 Parking Management System. All rights reserved. | <a href="https://parking-system.com">Visit our website</a></p>
      </div>
    </div>
  </body>
  </html>
`;