import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dropIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const db = mongoose.connection.db;
    
    // Drop the unique indexes
    console.log("Dropping Enrollment index...");
    await db.collection("enrollments").dropIndex("student_1_course_1").catch(e => console.log(e.message));
    
    console.log("Dropping Progress index...");
    await db.collection("progresses").dropIndex("student_1_course_1").catch(e => console.log(e.message));
    
    // Also drop the older one just in case
    await db.collection("progresses").dropIndex("student_1_course_1_lesson_1").catch(e => console.log(e.message));

    console.log("Indexes dropped successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error dropping indexes:", error);
    process.exit(1);
  }
};

dropIndexes();
