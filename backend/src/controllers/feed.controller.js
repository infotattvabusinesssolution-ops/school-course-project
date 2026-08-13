import Feed from '../models/Feed.model.js';

// @desc    Get all feeds
// @route   GET /api/feeds
// @access  Public
export const getFeeds = async (req, res) => {
  try {
    const feeds = await Feed.find().sort({ createdAt: -1 });
    res.json(feeds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create a feed
// @route   POST /api/feeds
// @access  Private (Admin)
export const createFeed = async (req, res) => {
  try {
    const { title, description, url } = req.body;
    const newFeed = new Feed({
      title,
      description,
      url
    });
    const feed = await newFeed.save();
    res.json(feed);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a feed
// @route   PUT /api/feeds/:id
// @access  Private (Admin)
export const updateFeed = async (req, res) => {
  try {
    const { title, description, url } = req.body;
    let feed = await Feed.findById(req.params.id);
    if (!feed) return res.status(404).json({ msg: 'Feed not found' });

    feed = await Feed.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, url } },
      { new: true }
    );
    res.json(feed);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a feed
// @route   DELETE /api/feeds/:id
// @access  Private (Admin)
export const deleteFeed = async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id);
    if (!feed) return res.status(404).json({ msg: 'Feed not found' });

    await feed.deleteOne();
    res.json({ msg: 'Feed removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
