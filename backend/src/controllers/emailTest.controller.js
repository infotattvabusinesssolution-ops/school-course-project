import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { 
  sendAccountWelcomeEmail,
  sendPasswordResetEmail,
  sendPurchaseInvoiceEmail,
  sendReExamReceiptEmail,
  sendExamPassedEmail,
  sendExamFailedEmail,
  sendCourseReviewReminderEmail,
  sendEbookUpsellEmail,
  sendProblemSolutionMarketingEmail
} from "../utils/email.js";

export const sendAllTestEmails = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(new ApiResponse(400, null, "Email is required"));
  }

  const dummyName = "Admin Tester";

  try {
    await Promise.all([
      sendAccountWelcomeEmail(email, dummyName),
      sendPasswordResetEmail(email, "https://crmisa.co.za/reset-password/dummy-token"),
      sendPurchaseInvoiceEmail(email, dummyName, { itemName: "Global Trade Pro (Test)", amount: 2500 }),
      sendReExamReceiptEmail(email, dummyName),
      sendExamPassedEmail(email, dummyName, 85),
      sendExamFailedEmail(email, dummyName, 45),
      sendCourseReviewReminderEmail(email, dummyName, "Global Trade Pro", "course_123"),
      sendEbookUpsellEmail(email, dummyName),
      sendProblemSolutionMarketingEmail(email, dummyName)
    ]);

    return res.status(200).json(new ApiResponse(200, null, "Test emails sent successfully. Please check your inbox."));
  } catch (error) {
    console.error("Error sending test emails:", error);
    return res.status(500).json(new ApiResponse(500, null, "Failed to send test emails"));
  }
});
