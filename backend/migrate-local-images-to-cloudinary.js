import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const publicDir = path.resolve(__dirname, '../frontend/public');

async function uploadLocalImage(relPath, folder) {
  if (!relPath) return null;
  if (relPath.startsWith('http://') || relPath.startsWith('https://')) {
    // If it's already a non-cloudinary or working remote URL, return as is
    return { secure_url: relPath, public_id: '' };
  }

  // Clean relative path (remove leading slash)
  const cleanRel = relPath.startsWith('/') ? relPath.slice(1) : relPath;
  const fullPath = path.join(publicDir, cleanRel);

  if (!fs.existsSync(fullPath)) {
    console.warn(`[WARN] File not found on disk: ${fullPath}`);
    return null;
  }

  console.log(`[UPLOADING] ${cleanRel} -> Cloudinary folder '${folder}'...`);
  try {
    const result = await cloudinary.uploader.upload(fullPath, {
      folder,
      resource_type: 'image',
    });
    console.log(`[UPLOADED] ${result.secure_url} (public_id: ${result.public_id})`);
    return result;
  } catch (error) {
    console.error(`[ERROR] Failed to upload ${fullPath}:`, error.message);
    return null;
  }
}

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB successfully.\n');

  const db = mongoose.connection.db;

  // 1. COURSES
  console.log('--- Migrating Courses Images ---');
  const courses = await db.collection('courses').find({}).toArray();
  let updatedCourses = 0;

  for (const course of courses) {
    console.log(`Checking course: "${course.title}"`);
    let changed = false;
    const updateFields = {};

    // Check defaultThumbnailUrl or thumbnailUrl
    const thumbTarget = course.defaultThumbnailUrl || course.thumbnailUrl;
    if (thumbTarget && !thumbTarget.includes('res.cloudinary.com')) {
      const uploadRes = await uploadLocalImage(thumbTarget, 'crmisa/courses');
      if (uploadRes && uploadRes.secure_url) {
        updateFields.thumbnailUrl = uploadRes.secure_url;
        updateFields.defaultThumbnailUrl = uploadRes.secure_url;
        updateFields.thumbnailPublicId = uploadRes.public_id;
        changed = true;
      }
    }

    // Check defaultBannerUrl or bannerUrl
    const bannerTarget = course.defaultBannerUrl || course.bannerUrl;
    if (bannerTarget && !bannerTarget.includes('res.cloudinary.com')) {
      const uploadRes = await uploadLocalImage(bannerTarget, 'crmisa/courses');
      if (uploadRes && uploadRes.secure_url) {
        updateFields.bannerUrl = uploadRes.secure_url;
        updateFields.defaultBannerUrl = uploadRes.secure_url;
        updateFields.bannerPublicId = uploadRes.public_id;
        changed = true;
      }
    }

    if (changed) {
      await db.collection('courses').updateOne(
        { _id: course._id },
        { $set: updateFields }
      );
      updatedCourses++;
      console.log(`[UPDATED] Course "${course.title}" with Cloudinary URLs.`);
    } else {
      console.log(`[SKIP] Course "${course.title}" already updated or no local images.`);
    }
  }
  console.log(`Total Courses Updated: ${updatedCourses}/${courses.length}\n`);

  // 2. EBOOKS
  console.log('--- Migrating Ebooks Images ---');
  const ebooks = await db.collection('ebooks').find({}).toArray();
  let updatedEbooks = 0;

  for (const ebook of ebooks) {
    console.log(`Checking ebook: "${ebook.title}"`);
    let changed = false;
    const updateFields = {};

    if (ebook.coverImage && !ebook.coverImage.includes('res.cloudinary.com')) {
      const uploadRes = await uploadLocalImage(ebook.coverImage, 'crmisa/ebooks');
      if (uploadRes && uploadRes.secure_url) {
        updateFields.coverImage = uploadRes.secure_url;
        updateFields.coverImagePublicId = uploadRes.public_id;
        changed = true;
      }
    }

    if (changed) {
      await db.collection('ebooks').updateOne(
        { _id: ebook._id },
        { $set: updateFields }
      );
      updatedEbooks++;
      console.log(`[UPDATED] Ebook "${ebook.title}" with Cloudinary cover.`);
    } else {
      console.log(`[SKIP] Ebook "${ebook.title}" already updated or no local cover.`);
    }
  }
  console.log(`Total Ebooks Updated: ${updatedEbooks}/${ebooks.length}\n`);

  // 3. BLOGS
  console.log('--- Migrating Blogs Images ---');
  const blogs = await db.collection('blogs').find({}).toArray();
  let updatedBlogs = 0;

  for (const blog of blogs) {
    console.log(`Checking blog: "${blog.title}"`);
    let changed = false;
    const updateFields = {};

    if (blog.coverImage && !blog.coverImage.includes('res.cloudinary.com')) {
      const uploadRes = await uploadLocalImage(blog.coverImage, 'crmisa/blogs');
      if (uploadRes && uploadRes.secure_url) {
        updateFields.coverImage = uploadRes.secure_url;
        changed = true;
      }
    }

    if (changed) {
      await db.collection('blogs').updateOne(
        { _id: blog._id },
        { $set: updateFields }
      );
      updatedBlogs++;
      console.log(`[UPDATED] Blog "${blog.title}" with Cloudinary cover.`);
    } else {
      console.log(`[SKIP] Blog "${blog.title}" already updated or no local cover.`);
    }
  }
  console.log(`Total Blogs Updated: ${updatedBlogs}/${blogs.length}\n`);

  // 4. TESTIMONIALS
  console.log('--- Migrating Testimonial Images (Resolving Broken/401 Cloudinary links) ---');
  const testimonials = await db.collection('testimonials').find({}).toArray();
  const studentDir = path.join(publicDir, 'student');
  let studentFiles = [];
  if (fs.existsSync(studentDir)) {
    studentFiles = fs.readdirSync(studentDir).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
  }

  // Upload available student images to Cloudinary if needed
  const uploadedStudentUrls = [];
  for (const sf of studentFiles) {
    const fullPath = path.join(studentDir, sf);
    console.log(`[UPLOADING] student image ${sf} -> crmisa/testimonials...`);
    try {
      const res = await cloudinary.uploader.upload(fullPath, {
        folder: 'crmisa/testimonials',
        resource_type: 'image',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });
      uploadedStudentUrls.push(res.secure_url);
      console.log(`[UPLOADED] ${res.secure_url}`);
    } catch (err) {
      console.error(`[ERROR] Failed to upload ${sf}:`, err.message);
    }
  }

  let updatedTestimonials = 0;
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    const isBroken = t.photo && t.photo.includes('res.cloudinary.com/dqyd8al5r/');
    if (isBroken && uploadedStudentUrls.length > 0) {
      const newPhoto = uploadedStudentUrls[i % uploadedStudentUrls.length];
      await db.collection('testimonials').updateOne(
        { _id: t._id },
        { $set: { photo: newPhoto } }
      );
      updatedTestimonials++;
      console.log(`[UPDATED] Testimonial "${t.name}" -> ${newPhoto}`);
    }
  }
  console.log(`Total Testimonials Updated: ${updatedTestimonials}/${testimonials.length}\n`);

  // 5. ABOUT IMAGE
  console.log('--- Migrating About / Static Images ---');
  const aboutImgPath = path.join(publicDir, 'media/about/Gemini_Generated_Image_2pg0lr2pg0lr2pg0.png');
  if (fs.existsSync(aboutImgPath)) {
    console.log(`[UPLOADING] About image -> crmisa/general...`);
    try {
      const res = await cloudinary.uploader.upload(aboutImgPath, {
        folder: 'crmisa/general',
        resource_type: 'image',
      });
      console.log(`[UPLOADED] About Image: ${res.secure_url}`);
    } catch (err) {
      console.error(`[ERROR] Failed to upload about image:`, err.message);
    }
  }

  console.log('\n========================================');
  console.log('ALL LOCAL IMAGES SUCCESSFULLY MIGRATED TO CLOUDINARY GLOBAL CDN!');
  console.log('========================================');

  process.exit(0);
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
