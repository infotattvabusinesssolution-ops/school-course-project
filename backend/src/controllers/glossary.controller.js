import Glossary from '../models/Glossary.model.js';

// @desc    Get all glossary terms
// @route   GET /api/glossary
// @access  Public
export const getGlossary = async (req, res) => {
  try {
    const terms = await Glossary.find().sort({ term: 1 });
    res.json(terms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a glossary term
// @route   POST /api/glossary
// @access  Private (Admin)
export const createGlossaryTerm = async (req, res) => {
  try {
    const { term, definition } = req.body;
    const newTerm = new Glossary({
      term,
      definition
    });
    const glossaryTerm = await newTerm.save();
    res.json(glossaryTerm);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a glossary term
// @route   PUT /api/glossary/:id
// @access  Private (Admin)
export const updateGlossaryTerm = async (req, res) => {
  try {
    const { term, definition } = req.body;
    let glossaryTerm = await Glossary.findById(req.params.id);
    if (!glossaryTerm) return res.status(404).json({ msg: 'Glossary term not found' });

    glossaryTerm = await Glossary.findByIdAndUpdate(
      req.params.id,
      { $set: { term, definition } },
      { new: true }
    );
    res.json(glossaryTerm);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a glossary term
// @route   DELETE /api/glossary/:id
// @access  Private (Admin)
export const deleteGlossaryTerm = async (req, res) => {
  try {
    const glossaryTerm = await Glossary.findById(req.params.id);
    if (!glossaryTerm) return res.status(404).json({ msg: 'Glossary term not found' });

    await glossaryTerm.deleteOne();
    res.json({ msg: 'Glossary term removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
