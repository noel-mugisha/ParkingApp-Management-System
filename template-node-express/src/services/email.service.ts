import nodemailer, { Transporter } from 'nodemailer';
import { verificationEmailTemplate } from '../templet/send-verification-email';
import { passwordResetEmailTemplate } from '../templet/password-rest-email';

export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, otp: string): Promise<void> {
    const htmlTemplate = verificationEmailTemplate(otp);

    await this.transporter.sendMail({
      from: '"Parking Management" <no-reply@parking.com>',
      to: email,
      subject: 'Verify Your Email - Parking Management System',
      html: htmlTemplate,
    });
  }
  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${resetToken}`;
    const htmlTemplate = passwordResetEmailTemplate(resetUrl);

    await this.transporter.sendMail({
      from: '"Parking Management" <no-reply@parking.com>',
      to: email,
      subject: 'Reset Your Password - Parking Management System',
      html: htmlTemplate,
    });
  }
}