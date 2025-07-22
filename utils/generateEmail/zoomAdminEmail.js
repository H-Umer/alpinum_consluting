import nodemailer from "nodemailer";

export const zoomAdminEmail = async ({ contractorName, companyName, startTime }) => {
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
        <h2 style="color: #f47920;">📅 Interview Scheduled</h2>
        <p style="font-size: 16px; margin-top: 20px;">
          An interview meeting has been scheduled between 
          <strong style="color: #2d8cff;">${companyName}</strong> and 
          <strong style="color: #2d8cff;">${contractorName}</strong>
          from <strong style="color: #f47920;">Alpinum Consulting</strong> at ${startTime}
        </p>
        <p style="font-size: 13px; color: #999;">
          This email is intended to notify you of scheduled interviews in the platform.<br/>
          No action is required unless further follow-up is necessary.
        </p>
      </div>
    </div>
  `;

    await transporter.sendMail({
      from: `"Alpinum Consulting" <${process.env.SMTP_USER}>`,
      to: "alecs@alpinumconsulting.com, mike@alpinumconsulting.com",
      subject: `Interview Scheduled Notification - Alpinum Consulting`,
      html: htmlContent,
    });
  } catch (err) {
    console.error("Zoom admin email error:", err);
  }
};
