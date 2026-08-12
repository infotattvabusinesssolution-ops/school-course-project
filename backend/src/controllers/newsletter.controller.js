import Newsletter from '../models/Newsletter.model.js';
import { sendWelcomeEmail, sendAdminNotification } from '../utils/email.js';

// Subscribe to newsletter (Public)
export const subscribe = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Name, Email, and Phone are required' });
    }

    // Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ success: false, message: 'This email is already subscribed' });
    }

    const subscriber = await Newsletter.create({ name, email, phone });

    // Send emails asynchronously
    sendWelcomeEmail(email, name);
    sendAdminNotification(name, email);

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to the newsletter!',
      data: subscriber
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// Get all subscribers (Admin)
export const getAllSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    next(error);
  }
};

// Remove subscriber (Admin)
export const removeSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    await subscriber.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Subscriber removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
