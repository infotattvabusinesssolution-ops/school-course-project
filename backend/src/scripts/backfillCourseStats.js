import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Course } from '../models/Course.model.js';
import Enrollment from '../models/Enrollment.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const backfillCourseStats = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses to update.`);

    for (const course of courses) {
      // Find all enrollments for this course
      const enrollments = await Enrollment.find({ course: course._id });
      
      let totalRevenue = 0;
      
      for (const enr of enrollments) {
        if (enr.amountPaid && enr.amountPaid > 0) {
          totalRevenue += enr.amountPaid;
        } else {
          // Fallback: if amountPaid is not set, use current course price
          totalRevenue += (course.price || 0);
          
          // Optionally, also backfill amountPaid onto the enrollment
          enr.amountPaid = course.price || 0;
          await enr.save();
        }
      }

      course.totalEnrollments = enrollments.length;
      course.totalRevenue = totalRevenue;
      
      await course.save();
      console.log(`Updated course "${course.title}" -> Enrollments: ${course.totalEnrollments}, Revenue: ${course.totalRevenue}`);
    }

    console.log('Successfully backfilled all course stats!');
    process.exit(0);
  } catch (error) {
    console.error('Error backfilling course stats:', error);
    process.exit(1);
  }
};

backfillCourseStats();
