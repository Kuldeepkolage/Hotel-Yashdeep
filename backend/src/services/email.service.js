import nodemailer from "nodemailer";
import ApiError from "../utils/ApiError.js";

// In-memory store for development test verification ONLY (never enabled in production)
const devOtpStore = new Map();

export const isEmailServiceConfigured = () => {
  return Boolean(
    process.env.BREVO_SMTP_USER &&
    process.env.BREVO_SMTP_PASSWORD
  );
};

export const getDevLastOTP = (email) => {
  if (process.env.NODE_ENV === "production") return null;
  return devOtpStore.get(email?.toLowerCase()?.trim()) || null;
};

const createTransporter = () => {
  const host = process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com";
  const port = Number(process.env.BREVO_SMTP_PORT || 587);
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASSWORD;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendOTPEmail = async ({ to, name, otp }) => {
  const normalizedEmail = to.toLowerCase().trim();

  // If credentials are not configured
  if (!isEmailServiceConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      devOtpStore.set(normalizedEmail, otp);
      try {
        const fs = await import("fs");
        const path = await import("path");
        const devFile = path.resolve(process.cwd(), "src/scripts/last-dev-otp.json");
        fs.writeFileSync(devFile, JSON.stringify({ email: normalizedEmail, otp, timestamp: Date.now() }));
      } catch (err) {}
      console.warn(
        `⚠️ [EMAIL SERVICE] Brevo SMTP credentials not configured. ` +
        `Required env vars: BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_USER, BREVO_SMTP_PASSWORD, BREVO_FROM_EMAIL, BREVO_FROM_NAME. ` +
        `In development mode, real email delivery is skipped.`
      );
      return { success: true, simulated: true };
    }

    throw new ApiError(
      503,
      "Email delivery service is currently not configured. Please contact the restaurant."
    );
  }

  const transporter = createTransporter();
  const fromName = process.env.BREVO_FROM_NAME || "Hotel Yashdeep";
  const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.BREVO_SMTP_USER;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 40px 20px; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #e7e2d9; border-radius: 16px; padding: 40px; }
          .header { text-align: center; border-bottom: 1px solid #f0ece1; padding-bottom: 24px; }
          .brand { font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: -0.5px; }
          .subbrand { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #8c827a; margin-top: 4px; }
          .content { padding: 32px 0; text-align: center; }
          .greeting { font-size: 16px; color: #333333; margin-bottom: 12px; }
          .instruction { font-size: 14px; color: #666666; line-height: 1.6; margin-bottom: 24px; }
          .otp-box { display: inline-block; background: #f9f8f5; border: 2px dashed #b8935c; border-radius: 12px; padding: 16px 36px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a; margin: 12px 0; }
          .expiry { font-size: 12px; color: #999999; margin-top: 16px; }
          .footer { text-align: center; border-top: 1px solid #f0ece1; padding-top: 20px; font-size: 11px; color: #aaaaaa; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="brand">Hotel Yashdeep</div>
            <div class="subbrand">Yermala · Restaurant & Beer Bar</div>
          </div>
          <div class="content">
            <div class="greeting">Hello ${name ? name : "Valued Customer"},</div>
            <div class="instruction">Use the 6-digit verification code below to confirm your email and complete your reservation account.</div>
            <div class="otp-box">${otp}</div>
            <div class="expiry">This verification code will expire in <strong>10 minutes</strong>.<br>If you did not request this, you can safely ignore this email.</div>
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} Hotel Yashdeep. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: normalizedEmail,
    subject: "Your Hotel Yashdeep Verification Code",
    text: `Your verification code for Hotel Yashdeep is: ${otp}. It will expire in 10 minutes.`,
    html,
  });

  return { success: true, simulated: false };
};
