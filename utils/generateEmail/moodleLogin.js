import nodemailer from "nodemailer";

export const sendMoodleLoginMail = async ({
  passwordForMoodle,
  username,
  email,
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

    const link = "https://alpinumtraining.moodlecloud.com/login/";
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 8px; color: #333;">
        <h2 style="color: #F47920;">Moodle Account Created</h2>
        <p>Welcome <strong>${username}</strong>,</p>
        <p>Your Moodle account has been successfully created through Alpinum Consulting.</p>
        <p><strong>Here are your login credentials:</strong></p>
        <table style="margin: 10px 0; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Username:</td>
            <td style="padding: 8px;">${username}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Password:</td>
            <td style="padding: 8px;">${passwordForMoodle}</td>
          </tr>
        </table>
        <p>You can log in using the following link:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${link}" 
             style="background-color: #F47920; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Login to Moodle Portal
          </a>
        </div>
        <br/>
        <p>If you have any questions or issues, feel free to reply to this email.</p>
        <br/>
        <p>Best regards,<br/>Alpinum Consulting - Team</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Alpinum Consulting" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Moodle Login Credentials - Alpinum Consulting",
      html: htmlContent,
    });
  } catch (err) {
    console.error("err", err);
  }
};
