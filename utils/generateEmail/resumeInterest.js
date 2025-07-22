import nodemailer from "nodemailer";

export const resumeInterestEmail = async ({ resumeCode, companyName }) => {
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

    const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f8fb; padding: 40px 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center;">
        <h2 style="color: #f47920;">📩 Contractor's Resume Interest Notification</h2>
        <p style="font-size: 16px; margin-top: 20px;">
        <strong style="color: #2d8cff;">${companyName}</strong> has shown interest in the resume with the code <strong style="color: #2d8cff;">${resumeCode}</strong>.
        </p>
        <p style="font-size: 13px; color: #999;">
          This email is intended to notify you of resume interest in the platform.<br/>
          No action is required unless further follow-up is necessary.
        </p>
      </div>
    </div>
  `;

    await transporter.sendMail({
      from: `"Alpinum Consulting" <${process.env.SMTP_USER}>`,
      to: "alecs@alpinumconsulting.com, mike@alpinumconsulting.com",
      subject: `Contractor Resume Interest Notification - Alpinum Consulting`,
      html: htmlContent,
    });
  } catch (err) {
    console.error("Resume interest email error:", err);
  }
};
