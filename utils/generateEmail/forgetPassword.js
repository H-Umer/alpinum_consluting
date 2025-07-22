import nodemailer from "nodemailer";

export const forgetPasswordMail = async ({ email, token }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetLink = `https://alpinum-consulting.vercel.app/auth/reset-password?token=${token}`;
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested to reset your password for Alpinum Consulting.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" 
             style="background-color: #F47920; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </div>
       
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <p style="color: #666; font-size: 14px;">Best regards,<br>Alpinum Consulting - Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Alpinum Consulting" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset Request - Alpinum Consulting",
      html: htmlContent,
    });
  } catch (err) {
    console.error("err", err);
  }
};
