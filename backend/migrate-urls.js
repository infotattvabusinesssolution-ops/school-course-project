import mongoose from "mongoose";
import dotenv from "dotenv";
import { Course } from "./src/models/Course.model.js";
import Ebook from "./src/models/Ebook.model.js";

dotenv.config();

const updateUrls = (url) => {
  if (!url) return url;
  if (url.startsWith('/courses/')) return url.replace('/courses/', '/media/courses/');
  if (url.startsWith('/ebooks/')) return url.replace('/ebooks/', '/media/ebooks/');
  return url;
};

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const courses = await Course.find();
    let updatedCourses = 0;
    for (const course of courses) {
      let changed = false;
      if (course.pdfGuideUrl && course.pdfGuideUrl.startsWith('/courses/')) {
        course.pdfGuideUrl = updateUrls(course.pdfGuideUrl);
        changed = true;
      }
      if (course.defaultThumbnailUrl && course.defaultThumbnailUrl.startsWith('/courses/')) {
        course.defaultThumbnailUrl = updateUrls(course.defaultThumbnailUrl);
        changed = true;
      }
      if (course.defaultBannerUrl && course.defaultBannerUrl.startsWith('/courses/')) {
        course.defaultBannerUrl = updateUrls(course.defaultBannerUrl);
        changed = true;
      }
      if (course.videoUrl && course.videoUrl.startsWith('/courses/')) {
        course.videoUrl = updateUrls(course.videoUrl);
        changed = true;
      }
      if (changed) {
        await course.save({ validateBeforeSave: false });
        updatedCourses++;
      }
    }
    console.log(`Updated ${updatedCourses} courses.`);

    const ebooks = await Ebook.find();
    let updatedEbooks = 0;
    for (const ebook of ebooks) {
      let changed = false;
      if (ebook.pdfUrl && ebook.pdfUrl.startsWith('/ebooks/')) {
        ebook.pdfUrl = updateUrls(ebook.pdfUrl);
        changed = true;
      }
      if (ebook.defaultThumbnailUrl && ebook.defaultThumbnailUrl.startsWith('/ebooks/')) {
        ebook.defaultThumbnailUrl = updateUrls(ebook.defaultThumbnailUrl);
        changed = true;
      }
      if (changed) {
        await ebook.save({ validateBeforeSave: false });
        updatedEbooks++;
      }
    }
    console.log(`Updated ${updatedEbooks} ebooks.`);

    process.exit(0);
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  }
}

migrate();
