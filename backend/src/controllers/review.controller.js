import Review from "../models/Review.model.js";
import Progress from "../models/Progress.model.js";
import Certificate from "../models/Certificate.model.js";

// Add or update a review
export const addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;
    const studentId = req.user._id;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ success: false, message: "Comment is required" });
    }


    // Check if review already exists
    let review = await Review.findOne({ course: courseId, student: studentId });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      // Create new review
      review = new Review({
        course: courseId,
        student: studentId,
        rating,
        comment,
      });
      await review.save();
    }

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ success: false, message: "Failed to submit review" });
  }
};

// Get all reviews for a course
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ course: courseId })
      .populate("student", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get course reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

// Get the logged-in student's review for a course
export const getMyReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const review = await Review.findOne({ course: courseId, student: studentId });

    res.status(200).json({
      success: true,
      data: review || null,
    });
  } catch (error) {
    console.error("Get my review error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch your review" });
  }
};

// Admin: Get all reviews (with optional filtering)
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const { courseId } = req.query;
    
    let query = {};
    if (courseId) {
      query.course = courseId;
    }

    const reviews = await Review.find(query)
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

// Admin: Delete a review
export const deleteReviewAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
  }
};