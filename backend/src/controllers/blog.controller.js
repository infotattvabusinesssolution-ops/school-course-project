import Blog from '../models/Blog.model.js';

// Create a new blog (Admin)
export const createBlog = async (req, res, next) => {
  try {
    const { title, content, coverImage, isPublished } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const newBlog = await Blog.create({
      title,
      content,
      coverImage,
      isPublished: isPublished !== undefined ? isPublished : true,
      author: req.user._id // Assuming authenticate/authorize middleware sets req.user
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog
    });
  } catch (error) {
    next(error);
  }
};

// Get all blogs (Public / Admin)
export const getAllBlogs = async (req, res, next) => {
  try {
    // If admin is requesting, they can see unpublished ones too.
    // For simplicity, we just return all blogs or filter by isPublished for public.
    const filter = req.user?.role === 'admin' ? {} : { isPublished: true };
    
    const blogs = await Blog.find(filter)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog by ID (Public)
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name avatar');
    
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // If not published and not admin, deny access
    if (!blog.isPublished && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'This blog is not published yet' });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// Update a blog (Admin)
export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// Delete a blog (Admin)
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
