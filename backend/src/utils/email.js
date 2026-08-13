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

// Helper function to maintain consistent, premium email branding
const getEmailTemplate = ({ title, subtitle, content, preFooterTitle, preFooterSubtitle }) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color: #f4f7f6;">
    <center style="width: 100%; background-color: #f4f7f6; padding: 30px 0;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <!-- HEADER -->
            <tr>
                <td align="center" style="background-color: #223e7c; padding: 40px 20px;">
                    <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-family: Arial, sans-serif; letter-spacing: 2px;">CRMISA</h1>
                    ${subtitle ? `<p style="color: #d4af37; font-size: 16px; margin: 10px 0 0 0; font-family: Arial, sans-serif;">${subtitle}</p>` : ''}
                </td>
            </tr>
            <!-- CONTENT -->
            <tr>
                <td style="padding: 40px 30px; font-family: Arial, sans-serif; color: #333333; line-height: 1.6;">
                    ${content}
                </td>
            </tr>
            <!-- PRE-FOOTER (Optional) -->
            ${preFooterTitle ? `
            <tr>
                <td align="center" style="background-color: #111827; padding: 30px 20px;">
                    <h2 style="margin: 0; color: #ffffff; font-family: Arial, sans-serif; font-size: 20px;">${preFooterTitle}</h2>
                    ${preFooterSubtitle ? `<p style="margin: 10px 0 0 0; color: #9ca3af; font-family: Arial, sans-serif; font-size: 15px;">${preFooterSubtitle}</p>` : ''}
                </td>
            </tr>
            ` : ''}
            <!-- FOOTER -->
            <tr>
                <td style="background-color: #223e7c; color: #ffffff; text-align: center; padding: 30px 20px; font-family: Arial, sans-serif; font-size: 14px;">
                    <h2 style="margin: 0 0 10px 0; color: #d4af37; font-size: 18px; letter-spacing: 1px;">HAPPY LEARNING!</h2>
                    <p style="margin: 0 0 15px 0; color: #e0e7ff;">We are looking forward to seeing you grow with us.</p>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 12px;">
                        © ${new Date().getFullYear()} CRMISA. All Rights Reserved.<br>
                        <a href="mailto:info@crmisa.co.za" style="color: #d4af37; text-decoration: none; margin-top: 8px; display: inline-block;">info@crmisa.co.za</a>
                    </div>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;

// Helper for primary buttons
const getButton = (text, url) => `
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 25px 0;">
    <tr>
      <td align="center" bgcolor="#223e7c" style="border-radius: 6px;">
        <a href="${url}" style="display: inline-block; padding: 14px 24px; color: #ffffff; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 6px;">${text}</a>
      </td>
    </tr>
  </table>
`;

// 0. Newsletter Welcome
export const sendWelcomeEmail = async (email, name) => {
  const content = `
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${name},</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Thank you for subscribing to the <strong>CRMISA Newsletter</strong>! We’re thrilled to have you on board.</p>
    <p style="font-size: 16px; margin-bottom: 15px;">You’ll now be the first to know about our latest updates, exclusive resources, event announcements, training opportunities, and more.</p>
    <p style="margin-top: 25px; font-size: 16px;">Warm regards,<br><strong style="color:#223e7c;">The CRMISA Team</strong></p>
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "You're Subscribed! Welcome to CRMISA Newsletter",
    html: getEmailTemplate({
      title: "Welcome to CRMISA Newsletter",
      subtitle: "Thank You For Subscribing To Our Newsletter!",
      content,
      preFooterTitle: "Lets Get Started!",
      preFooterSubtitle: "Explore your courses and resources now."
    }),
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};

// Admin Notification (Newsletter)
export const sendAdminNotification = async (name, email) => {
  const content = `
    <h3 style="color:#223e7c; margin-top:0;">New Subscriber Details:</h3>
    <ul style="list-style: none; padding: 0; font-size: 16px;">
      <li style="margin-bottom: 10px;"><strong>Name:</strong> ${name}</li>
      <li style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</li>
      <li style="margin-bottom: 10px;"><strong>Date:</strong> ${new Date().toLocaleString()}</li>
    </ul>
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME} Notifications" <${process.env.SMTP_FROM_EMAIL}>`,
    to: 'admin@crmisa.co.za',
    subject: "New Newsletter Subscriber",
    html: getEmailTemplate({
      title: "Admin Notification",
      subtitle: "New Lead Captured",
      content,
    }),
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};

// 1. Account Welcome
export const sendAccountWelcomeEmail = async (email, name) => {
  const content = `
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${name},</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Welcome to the CRMISA Academy! Your account has been successfully created.</p>
    <p style="font-size: 16px; margin-bottom: 15px;">You can now browse our comprehensive catalog of courses, enroll in certifications, and start mastering Global Trade and Customs.</p>
    ${getButton("Login to Dashboard", "https://crmisa.co.za/login")}
    <p style="margin-top: 25px; font-size: 16px;">Warm regards,<br><strong style="color:#223e7c;">The CRMISA Team</strong></p>
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Welcome to CRMISA - Your Learning Journey Begins!",
    html: getEmailTemplate({
      title: "Welcome to CRMISA",
      subtitle: "Your Learning Journey Begins Here",
      content,
      preFooterTitle: "Ready to upscale your skills?",
      preFooterSubtitle: "Browse our top-rated courses today."
    })
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};

// 2. Password Reset
export const sendPasswordResetEmail = async (email, resetLink) => {
  const content = `
    <h3 style="color:#223e7c; margin-top:0;">Password Reset Request</h3>
    <p style="font-size: 16px; margin-bottom: 15px;">We received a request to reset the password for your CRMISA account.</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Click the button below to choose a new password. This link is valid for a limited time.</p>
    ${getButton("Reset My Password", resetLink)}
    <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME} Support" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "CRMISA - Password Reset Request",
    html: getEmailTemplate({
      title: "Password Reset",
      subtitle: "Secure your account",
      content,
    })
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};

// 3. Purchase Invoice (Rich Professional)
export const sendPurchaseInvoiceEmail = async (email, name, orderDetails) => {
  const invoiceNumber = orderDetails.invoiceNumber || 'N/A';
  const invoiceDate = orderDetails.invoiceDate || new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });

  // Support both itemList (rich, from createAndSendInvoice) and simple itemName
  const lineItemsHtml = orderDetails.itemList || `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#374151;">${orderDetails.itemName}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;color:#374151;">ZAR ${parseFloat(orderDetails.amount || 0).toFixed(2)}</td>
    </tr>
  `;

  const content = `
    <p style="font-size: 16px; margin-bottom: 5px;">Hi <strong>${name}</strong>,</p>
    <p style="font-size: 15px; color: #6b7280; margin-bottom: 25px;">Thank you for your purchase. Please find your official invoice below.</p>

    <!-- Invoice Header Box -->
    <div style="border:1px solid #e5e7eb; border-radius:8px; overflow:hidden; margin-bottom:25px;">
      
      <!-- Invoice Meta -->
      <div style="background:#f8fafc; padding:16px 20px; display:flex; justify-content:space-between; border-bottom:1px solid #e5e7eb;">
        <table style="width:100%">
          <tr>
            <td style="font-size:20px;font-weight:bold;color:#223e7c;">TAX INVOICE</td>
            <td style="text-align:right;font-size:13px;color:#6b7280;">
              <strong style="color:#111827;">Invoice #:</strong> ${invoiceNumber}<br>
              <strong style="color:#111827;">Date:</strong> ${invoiceDate}<br>
              <strong style="color:#111827;">Status:</strong> <span style="color:#10b981;font-weight:bold;">PAID</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Billed To + From -->
      <div style="padding:16px 20px; border-bottom:1px solid #e5e7eb;">
        <table style="width:100%">
          <tr>
            <td style="vertical-align:top;width:50%;padding-right:10px;">
              <p style="margin:0 0 4px 0;font-size:11px;text-transform:uppercase;color:#9ca3af;letter-spacing:1px;">Billed To</p>
              <p style="margin:0;font-size:14px;font-weight:bold;color:#111827;">${name}</p>
              <p style="margin:2px 0 0 0;font-size:13px;color:#6b7280;">${email}</p>
            </td>
            <td style="vertical-align:top;width:50%;text-align:right;padding-left:10px;">
              <p style="margin:0 0 4px 0;font-size:11px;text-transform:uppercase;color:#9ca3af;letter-spacing:1px;">Issued By</p>
              <p style="margin:0;font-size:14px;font-weight:bold;color:#223e7c;">CRMISA Academy</p>
              <p style="margin:2px 0 0 0;font-size:13px;color:#6b7280;">admin@crmisa.co.za</p>
              <p style="margin:2px 0 0 0;font-size:13px;color:#6b7280;">crmisa.co.za</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Line Items -->
      <div style="padding:16px 20px;border-bottom:1px solid #e5e7eb;">
        <table style="width:100%;font-size:14px;border-collapse:collapse;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:8px 6px;text-align:left;color:#374151;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Item / Description</th>
              <th style="padding:8px 6px;text-align:right;color:#374151;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${lineItemsHtml}
          </tbody>
        </table>
      </div>

      <!-- Total -->
      <div style="padding:14px 20px;background:#f8fafc;">
        <table style="width:100%;">
          <tr>
            <td style="font-size:16px;font-weight:bold;color:#111827;">Total Paid</td>
            <td style="text-align:right;font-size:20px;font-weight:bold;color:#10b981;">ZAR ${parseFloat(orderDetails.amount || 0).toFixed(2)}</td>
          </tr>
        </table>
      </div>
    </div>

    ${getButton("Go to Dashboard", "https://crmisa.co.za/dashboard")}
    <p style="font-size:13px;color:#9ca3af;margin-top:20px;">This is your official invoice. Please save it for your records. For any queries, contact <a href="mailto:admin@crmisa.co.za" style="color:#223e7c;">admin@crmisa.co.za</a>.</p>
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME} Billing" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: `Invoice ${invoiceNumber} - CRMISA Purchase Receipt`,
    html: getEmailTemplate({
      title: "Purchase Invoice",
      subtitle: "Official Tax Invoice",
      content,
    })
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};


// 4. Re-Exam Receipt
export const sendReExamReceiptEmail = async (email, name) => {
  const content = `
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${name},</p>
    <p style="font-size: 16px; margin-bottom: 15px;">We have successfully received your Re-Exam payment of <strong>ZAR 500</strong>.</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Your exam portal has been unlocked. Take some time to review the course materials, and good luck on your next attempt!</p>
    ${getButton("Start Re-Exam Now", "https://crmisa.co.za/dashboard/exams")}
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME} Billing" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Re-Exam Payment Receipt",
    html: getEmailTemplate({
      title: "Re-Exam Access Granted",
      subtitle: "Your exam portal is unlocked",
      content,
    })
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};

// 5. Exam Passed
export const sendExamPassedEmail = async (email, name, score) => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #223e7c; font-size: 24px; margin-bottom: 5px;">Congratulations!</h2>
      <p style="color: #10b981; font-size: 36px; font-weight: bold; margin: 10px 0;">${score}%</p>
      <p style="color: #6b7280; margin-top: 0;">Passing Score</p>
    </div>
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${name},</p>
    <p style="font-size: 16px; margin-bottom: 15px;">You have successfully passed your certification exam! Your hard work and dedication have paid off.</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Your digital certificate is now available to download, print, or share directly to your LinkedIn profile.</p>
    ${getButton("View Your Certificate", "https://crmisa.co.za/dashboard/certificate")}
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME} Academy" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Congratulations! You Passed your Exam",
    html: getEmailTemplate({
      title: "Exam Passed",
      subtitle: "Certification Achieved!",
      content,
      preFooterTitle: "Showcase your achievement",
      preFooterSubtitle: "Add your new certification to your resume and LinkedIn."
    })
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};

// 6. Exam Failed
export const sendExamFailedEmail = async (email, name, score) => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #dc2626; font-size: 24px; margin-bottom: 5px;">Exam Results Notice</h2>
      <p style="color: #dc2626; font-size: 36px; font-weight: bold; margin: 10px 0;">${score}%</p>
      <p style="color: #6b7280; margin-top: 0;">Your Score</p>
    </div>
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${name},</p>
    <p style="font-size: 16px; margin-bottom: 15px;">You recently completed your exam, but unfortunately, this score does not meet the passing grade requirement.</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Don't be discouraged! We highly recommend reviewing the course modules and reference materials before trying again.</p>
    <p style="font-size: 16px; margin-bottom: 15px;">When you're ready, you can unlock your next attempt by paying a small re-exam fee.</p>
    ${getButton("View Options", "https://crmisa.co.za/dashboard/exams")}
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME} Academy" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Exam Results Notice",
    html: getEmailTemplate({
      title: "Exam Results",
      subtitle: "Keep learning and try again!",
      content,
    })
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};

// 7. Course Review Reminder (Cron)
export const sendCourseReviewReminderEmail = async (email, name, courseName, courseId) => {
  const content = `
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${name},</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Congratulations again on recently completing <strong>${courseName}</strong>!</p>
    <p style="font-size: 16px; margin-bottom: 15px;">We strive to provide the best possible education in Global Trade and Customs. Could you take 2 minutes to leave an honest review of your experience?</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Your feedback helps us improve and helps future students make informed decisions.</p>
    ${getButton("Leave a Review", `https://crmisa.co.za/course/${courseId}`)}
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME} Quality" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "How was your course? Leave a review!",
    html: getEmailTemplate({
      title: "We value your feedback",
      subtitle: "Help us improve our courses",
      content,
    })
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};

// 8. Ebook Upsell (Cron)
export const sendEbookUpsellEmail = async (email, name) => {
  const content = `
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${name},</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Did you know we offer comprehensive E-books that serve as perfect quick-reference guides for your trade studies and daily operations?</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Our handbooks condense complex compliance rules and logistics workflows into easy-to-digest formats.</p>
    <p style="font-size: 16px; margin-bottom: 15px;">Enhance your learning experience by adding our expert E-books to your professional library today.</p>
    ${getButton("Browse E-books", "https://crmisa.co.za/ebooks")}
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME} Library" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Boost your knowledge with our E-books",
    html: getEmailTemplate({
      title: "Expand Your Library",
      subtitle: "Discover our expert Trade Handbooks",
      content,
      preFooterTitle: "Level up your daily workflow",
      preFooterSubtitle: "Keep essential trade knowledge right on your desk."
    })
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};

// 9. Problem Solution Marketing
export const sendProblemSolutionMarketingEmail = async (email, name) => {
  const content = `
    <h3 style="color: #223e7c; font-size: 20px; margin-top: 0;">The rules of Global Trade are constantly changing.</h3>
    <p style="font-size: 16px; margin-bottom: 15px;">Hi ${name}, keeping up with customs compliance, tariffs, and international shipping regulations can be overwhelming—and extremely costly if done incorrectly.</p>
    <p style="font-size: 16px; margin-bottom: 15px;"><strong>The Solution:</strong> Our expert-led courses at CRMISA give you the exact frameworks and knowledge you need to navigate these challenges with total confidence.</p>
    
    <div style="background-color: #f0fdf4; border: 1px dashed #10b981; padding: 20px; text-align: center; border-radius: 8px; margin: 25px 0;">
      <p style="color: #065f46; font-size: 16px; margin: 0 0 10px 0;">Use this exclusive code for <strong>20% off</strong> your next enrollment:</p>
      <p style="color: #059669; font-size: 28px; font-weight: bold; letter-spacing: 2px; margin: 0;">LEARN20</p>
    </div>
    
    ${getButton("Explore our Courses", "https://crmisa.co.za/courses")}
  `;
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME} Insights" <${process.env.SMTP_FROM_EMAIL}>`,
    to: email,
    subject: "Struggling with international trade compliance?",
    html: getEmailTemplate({
      title: "Master Global Trade",
      subtitle: "Don't let compliance issues slow you down",
      content,
    })
  };
  try { await transporter.sendMail(mailOptions); } catch (e) { console.error(e); }
};
