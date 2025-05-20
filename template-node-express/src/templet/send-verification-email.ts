export const verificationEmailTemplate = (otp: string): string => `
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
      .otp-box {
        display: inline-block;
        background-color: #f0f4f8;
        padding: 15px 30px;
        border-radius: 6px;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 5px;
        color: #1e40af;
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
        .otp-box {
          font-size: 24px;
          padding: 10px 20px;
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
        <h2>Email Verification</h2>
        <p>Thank you for registering with the Parking Management System. Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for 10 minutes.</p>
        <div class="otp-box">${otp}</div>
        <p>Enter this code in the verification form to complete your registration.</p>
      </div>
      <div class="footer">
        <p>If you didn't request this email, please ignore it.</p>
        <p>© 2025 Parking Management System. All rights reserved. | <a href="https://parking-system.com">Visit our website</a></p>
      </div>
    </div>
  </body>
  </html>
`;