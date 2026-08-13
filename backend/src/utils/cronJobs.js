import cron from 'node-cron';
import Enrollment from '../models/Enrollment.model.js';
import { Course } from '../models/Course.model.js';
import Review from '../models/Review.model.js';
import User from '../models/User.model.js';
import Ebook from '../models/Ebook.model.js';
import { sendCourseReviewReminderEmail, sendEbookUpsellEmail } from './email.js';

export const startCronJobs = () => {
  // Review Reminder: Runs every day at 10:00 AM
  // Finds users who passed a course in the last 30 days and emails them every day until they review
  cron.schedule('0 10 * * *', async () => {
    console.log('[Cron] Running Review Reminder Job...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Find enrollments where the exam was passed within the last 30 days
      const enrollments = await Enrollment.find({
        isPassed: true,
        passedAt: { $gte: thirtyDaysAgo }
      }).populate('student', 'name email').populate('course', 'title');

      for (const enrollment of enrollments) {
        if (!enrollment.student || !enrollment.course) continue;

        // Check if a review already exists for this student and course
        const existingReview = await Review.findOne({
          course: enrollment.course._id,
          student: enrollment.student._id
        });

        if (!existingReview) {
           console.log(`[Cron] Sending review reminder to ${enrollment.student.email} for ${enrollment.course.title}`);
           await sendCourseReviewReminderEmail(
             enrollment.student.email, 
             enrollment.student.name, 
             enrollment.course.title,
             enrollment.course._id
           );
        }
      }
    } catch (error) {
      console.error('[Cron] Error in Review Reminder Job:', error);
    }
  });

  // Ebook Upsell: Runs every day at 11:00 AM
  // Upsell every 3 days lifetime for users who bought a course
  cron.schedule('0 11 * * *', async () => {
    console.log('[Cron] Running Ebook Upsell Job...');
    try {
      const enrollments = await Enrollment.find().populate('student', 'name email createdAt');
      
      // We only want to send to unique students
      const processedStudents = new Set();
      
      for (const enrollment of enrollments) {
        if (!enrollment.student || processedStudents.has(enrollment.student._id.toString())) continue;
        processedStudents.add(enrollment.student._id.toString());
        
        // Calculate days since the student registered or since first enrollment
        const studentCreatedAt = enrollment.student.createdAt || new Date();
        const diffTime = Math.abs(new Date() - studentCreatedAt);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Send email every 3 days
        if (diffDays > 0 && diffDays % 3 === 0) {
          console.log(`[Cron] Sending ebook upsell to ${enrollment.student.email}`);
          await sendEbookUpsellEmail(
             enrollment.student.email,
             enrollment.student.name
          );
        }
      }
    } catch (error) {
      console.error('[Cron] Error in Ebook Upsell Job:', error);
    }
  });

  console.log('[Cron] Background jobs initialized successfully.');
};
