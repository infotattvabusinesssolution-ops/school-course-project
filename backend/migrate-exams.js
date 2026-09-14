import 'dotenv/config';
import { connectDB } from './src/config/db.js';
import Exam from './src/models/Exam.model.js';
import mongoose from 'mongoose';

async function migrateExams() {
  try {
    await connectDB();
    console.log("Connected to DB.");

    // Drop old index if exists
    try {
      await Exam.collection.dropIndex('course_1');
      console.log("Dropped old unique index course_1");
    } catch (err) {
      console.log("No old index course_1 found or already dropped.", err.message);
    }

    const result = await Exam.updateMany(
      { attemptNumber: { $exists: false } },
      { $set: { attemptNumber: 1 } }
    );
    console.log(`Updated ${result.modifiedCount} exams to attemptNumber: 1.`);

    // Build new indexes
    await Exam.syncIndexes();
    console.log("Indexes synced.");
    
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateExams();
