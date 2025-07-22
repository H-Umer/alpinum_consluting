import nodemailer from "nodemailer";

export const zoomCompanyEmail = async ({
  contractorName,
  companyName,
  email,
  meetingTitle,
  startTime,
  password,
  joinUrl,
}) => {
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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f8fb; padding: 40px 20px;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05); text-align: center;">
        <h2 style="color: #f47920; margin-bottom: 20px;">Interview Meeting Scheduled</h2>
        <p style="font-size: 16px;">Hi <strong>${companyName}</strong>,</p>
        <p style="font-size: 16px;">You have successfully scheduled an interview meeting with <strong>${contractorName}</strong>.</p>

        <table style="margin: 20px auto; border-collapse: collapse; font-size: 15px; text-align: left;">
          <tr>
            <td style="padding: 10px; font-weight: bold;">Meeting Title:</td>
            <td style="padding: 10px;">${meetingTitle}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Date & Time:</td>
            <td style="padding: 10px;">${startTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold;">Meeting Password:</td>
            <td style="padding: 10px;">${password}</td>
          </tr>
        </table>

        <p style="margin: 20px 0; font-size: 15px;">You can start the meeting as host using the link below:</p>

        <a href="${joinUrl}" 
           style="display: inline-block; background-color: #f47920; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Start Zoom Meeting
        </a>

        <p style="margin: 25px 0 5px; font-size: 14px;">If the button doesn't work, copy and paste this link in your browser:</p>
        <p style="word-break: break-all;"><a href="${joinUrl}" style="color: #2d8cff;">${joinUrl}</a></p>

        <hr style="margin: 30px 0;" />

        <br/>
        <p style="font-size: 14px;">Thanks for using our Alpinum Consulting.</p>
        <p style="font-size: 14px;">Best regards,<br/><strong>Alpinum Consulting - Team</strong></p>
      </div>
    </div>
    `;

    await transporter.sendMail({
      from: `"Alpinum Consulting" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Interview Scheduled Notification - Alpinum Consulting`,
      html: htmlContent,
    });
  } catch (err) {
    console.error("Zoom company host email error:", err);
  }
};
