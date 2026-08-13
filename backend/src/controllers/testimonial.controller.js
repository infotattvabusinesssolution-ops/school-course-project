import Testimonial from '../models/Testimonial.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';

// Create a new testimonial (Admin)
export const createTestimonial = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: 'Name and description are required' });
    }

    let photoUrl = '';
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult) {
        photoUrl = uploadResult.secure_url;
      }
    } else {
      return res.status(400).json({ success: false, message: 'Photo is required' });
    }

    const testimonial = await Testimonial.create({
      name,
      description,
      photo: photoUrl,
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update an existing testimonial (Admin)
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    let testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    let photoUrl = testimonial.photo;
    if (req.file) {
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (uploadResult) {
        // Delete old photo if it exists on Cloudinary (optional optimization, keeping simple for now)
        if (testimonial.photo) {
           const publicId = testimonial.photo.split('/').pop().split('.')[0];
           await deleteFromCloudinary(publicId);
        }
        photoUrl = uploadResult.secure_url;
      }
    }

    testimonial.name = name || testimonial.name;
    testimonial.description = description || testimonial.description;
    testimonial.photo = photoUrl;
    
    if (isActive !== undefined) {
      testimonial.isActive = isActive === 'true' || isActive === true;
    }

    await testimonial.save();

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a testimonial (Admin)
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    if (testimonial.photo) {
      const publicId = testimonial.photo.split('/').pop().split('.')[0];
      await deleteFromCloudinary(publicId);
    }

    await testimonial.deleteOne();

    res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all testimonials (Admin)
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get active testimonials (Public)
export const getActiveTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Error fetching active testimonials:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
