import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    
    // File has been uploaded successfully
    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Remove the locally saved temporary file as the upload operation failed
    console.error('Error uploading to cloudinary', error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return response;
  } catch (error) {
    console.error('Error deleting from cloudinary', error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
