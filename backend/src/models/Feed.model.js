import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Feed = mongoose.model('Feed', feedSchema);
export default Feed;
