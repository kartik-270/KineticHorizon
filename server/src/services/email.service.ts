import nodemailer from 'nodemailer';

class EmailService {
  private transporter: any;

  constructor() {
    const port = Number(process.env.SMTP_PORT) || 587;
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: port,
      secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER || 'mock_user',
        pass: process.env.SMTP_PASS || 'mock_pass',
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }


  async sendVerificationEmail(email: string, token: string, name?: string) {
    const url = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/verify?token=${token}`;
    
    await this.transporter.sendMail({
      from: '"Kinetic Horizon" <kartikkalra2705@gmail.com>',
      to: email,
      subject: 'Verify Your Kinetic Account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #0a0a0a; color: #ffffff; border-radius: 12px;">
          <h1 style="color: #5afaa9; font-style: italic;">KINETIC HORIZON</h1>
          <p>Hi ${name || 'Operative'},</p>
          <p>Welcome to the platform. To participate in draws and support your charity, please verify your email.</p>
          <a href="${url}" style="display: inline-block; background: #5afaa9; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; margin: 20px 0;">VERIFY MISSION ACCESS</a>
          <p style="font-size: 12px; color: #666;">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  }

  async sendScoreEntryConfirmation(email: string, score: number, charityName: string) {
    await this.transporter.sendMail({
      from: '"Kinetic Horizon" <noreply@kinetichorizon.com>',
      to: email,
      subject: 'Score Logged: Mission Accomplished',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #0a0a0a; color: #ffffff; border-radius: 12px;">
          <h1 style="color: #5afaa9; font-style: italic;">KINETIC HORIZON</h1>
          <p>Target coordinates logged.</p>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase;">Stableford Score</p>
            <p style="margin: 0; font-size: 48px; font-weight: bold; color: #5afaa9;">${score}</p>
          </div>
          <p>Your round has generated a contribution to <strong>${charityName}</strong>.</p>
          <p>You are now eligible for the end-of-month draw.</p>
        </div>
      `,
    });
  }

  async sendSubscriptionConfirmation(email: string, plan: string) {
    await this.transporter.sendMail({
      from: '"Kinetic Horizon" <noreply@kinetichorizon.com>',
      to: email,
      subject: 'Subscription Active: Kinetic Access Granted',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #0a0a0a; color: #ffffff; border-radius: 12px;">
          <h1 style="color: #5afaa9; font-style: italic;">KINETIC HORIZON</h1>
          <p>Your subscription is now active.</p>
          <p>Plan: <strong>${plan}</strong></p>
          <p>You have full access to all features, including the global leaderboard and premium charity impact reports.</p>
        </div>
      `,
    });
  }

  async sendDrawResultNotification(email: string, amount: number) {
    await this.transporter.sendMail({
      from: '"Kinetic Horizon" <noreply@kinetichorizon.com>',
      to: email,
      subject: 'MISSION COMPLETE: YOU HAVE WON',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #0a0a0a; color: #ffffff; border-radius: 12px; border: 2px solid #5afaa9;">
          <h1 style="color: #5afaa9; font-style: italic;">KINETIC HORIZON</h1>
          <h2 style="color: #5afaa9;">CONGRATULATIONS OPERATIVE.</h2>
          <p>You have been identified as a winner in the latest Major Draw.</p>
          <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #666; text-transform: uppercase;">Reward Amount</p>
            <p style="margin: 0; font-size: 48px; font-weight: bold; color: #5afaa9;">₹${amount.toLocaleString()}</p>
          </div>
          <p>Access your dashboard to claim your reward and allocate additional impact funds.</p>
        </div>
      `,
    });
  }
}

export default new EmailService();
