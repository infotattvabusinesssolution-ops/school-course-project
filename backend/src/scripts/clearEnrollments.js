import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const clearEnrollments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const db = mongoose.connection.db;
    
    // Delete all enrollments
    console.log("Deleting all enrollments...");
    const enrollmentResult = await db.collection("enrollments").deleteMany({});
    console.log(`Deleted ${enrollmentResult.deletedCount} enrollments.`);

    // Delete all progress
    console.log("Deleting all progress records...");
    const progressResult = await db.collection("progresses").deleteMany({});
    console.log(`Deleted ${progressResult.deletedCount} progress records.`);

    // Also clear completedLessons from ActivityLogs if any exist? The user just asked to remove courses from students.
    // Progress and Enrollments are enough to clear their "Purchased" courses.

    console.log("Successfully cleared all student purchases and progress.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing enrollments:", error);
    process.exit(1);
  }
};

clearEnrollments();
