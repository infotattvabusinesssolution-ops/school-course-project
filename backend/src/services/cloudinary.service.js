import {
  uploadOnCloudinary,
  deleteFromCloudinary,
  uploadImageOnCloudinary,
  uploadBufferOnCloudinary,
  cloudinary,
} from '../utils/cloudinary.js';

export const cloudinaryService = {
  upload: uploadOnCloudinary,
  delete: deleteFromCloudinary,
  uploadImage: uploadImageOnCloudinary,
  uploadBuffer: uploadBufferOnCloudinary,
  cloudinary,
};

export default cloudinaryService;