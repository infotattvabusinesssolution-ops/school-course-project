import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "You're Subscribed! Welcome to CRMISA Newsletter",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to CRMISA Newsletter</title>
      </head>
      <body style="margin:0; padding:0; background-color: #ffffff;">
          <center style="width: 100%; background-color: #ffffff; padding: 30px 0;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden;">
                  <tr>
                      <td align="center" style="background-color: #223e7c; padding: 30px;">
                          <h1 style="color: #ffffff; font-size: 24px; margin: 0;"> Welcome to CRMISA </h1>
                          <p style="color: #d4af37; font-size: 16px; margin: 10px 0 0 0;">Thank You For Subscribing To Our Newsletter!</p>
                      </td>
                  </tr>
                  <tr>
                      <td style="padding: 30px; font-family: Arial, sans-serif; color: #333333;">
                          <p style="font-size: 16px; margin-bottom: 15px;">Hi ${name},</p>
                          <p style="font-size: 16px; margin-bottom: 15px;">Thank you for subscribing to the <strong>CRMISA Newsletter</strong>! We’re thrilled to have you on board.</p>
                          <p style="font-size: 16px; margin-bottom: 15px;">You’ll now be the first to know about our latest updates, exclusive resources, event announcements, training opportunities, and more.</p>
                          <p style="font-size: 16px; margin-bottom: 15px;">If you ever have any questions or feedback, feel free to reach out to us at <a href="mailto:info@crmisa.co.za" style="color: #223e7c; text-decoration: none;">info@crmisa.co.za</a>.</p>
                          <p style="font-size: 16px; margin-bottom: 15px;">Once again, welcome to the CRMISA community!</p>
                          <p style="margin-top: 20px; font-size: 16px;">Warm regards,</p>
                          <p style="margin-top: 0; font-size: 16px;"><strong>The CRMISA Team</strong></p>
                      </td>
                  </tr>
                  <tr>
                      <td align="center" style="background-color: #000000; padding: 20px;">
                          <h2 style="margin: 0; color: #ffffff;">Lets Get Started!</h2>
                          <p style="margin: 10px 0 0 0; color: #ffffff;">Explore your courses and resources now.</p>
                      </td>
                  </tr>
                  <tr>
                      <td style="background-color: #223e7c; color: #ffffff; text-align: center; padding: 20px; font-family: Arial, sans-serif; font-size: 14px;">
                          <h2 style="margin: 0 0 10px 0; color: #d4af37;">HAPPY LEARNING!</h2>
                          <p style="margin: 0 0 15px 0;">We are looking forward to seeing you grow with us.</p>
                          <div style="margin-top: 15px; color: #ffffff; font-size: 12px;">
                              © ${new Date().getFullYear()} CRMISA. All Rights Reserved.
                          </div>
                      </td>
                  </tr>
              </table>
          </center>
      </body>
      </html>
    `,
    text: `Welcome ${name},\n\nYour Subscription is successful.\n\nThank you,\nCRMISA Team`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const sendAdminNotification = async (name, email) => {
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME} Notifications" <${process.env.SMTP_FROM_EMAIL}>`,
    to: 'admin@crmisa.co.za', // The user requested to keep both code, and they didn't answer the email question directly. Let's just use the primary one for now, or fall back to the env var.
    subject: "New Newsletter Subscriber",
    html: `
      <h2>New Subscriber Details</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
    `,
    text: `New Subscriber:\nName: ${name}\nEmail: ${email}`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
};
