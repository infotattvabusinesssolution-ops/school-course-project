import mongoose from 'mongoose';

const glossarySchema = new mongoose.Schema({
  term: {
    type: String,
    required: true,
    trim: true,
  },
  definition: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Glossary = mongoose.model('Glossary', glossarySchema);
export default Glossary;
