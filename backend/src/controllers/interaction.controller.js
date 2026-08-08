import Doubt from "../models/Doubt.model.js";
import Review from "../models/Review.model.js";
import { Course } from "../models/Course.model.js";

// ----- DOUBTS (Q&A) -----

// Student: Submit multiple doubts at once
export const submitDoubts = async (req, res) => {
  try {
    const { doubts } = req.body; // array of { course, lesson, timestamp, question }
    const studentId = req.user._id;

    if (!doubts || !Array.isArray(doubts) || doubts.length === 0) {
      return res.status(400).json({ message: "No doubts provided" });
    }

    // Verify course exists and find instructor
    const courseId = doubts[0].course;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const instructorId = course.instructor;

    // Attach student and instructor to all doubts
    const doubtsToInsert = doubts.map(d => ({
      ...d,
      student: studentId,
      instructor: instructorId
    }));

    await Doubt.insertMany(doubtsToInsert);

    res.status(201).json({ message: "Doubts submitted successfully!" });
  } catch (error) {
    console.error("Submit Doubts Error:", error);
    res.status(500).json({ message: "Failed to submit doubts" });
  }
};

// Student: Get all their own doubts
export const getStudentDoubts = async (req, res) => {
  try {
    const studentId = req.user._id;
    const doubts = await Doubt.find({ student: studentId })
      .populate("course", "title thumbnailUrl modules")
      .sort({ createdAt: -1 });

    const formattedDoubts = doubts.map(d => {
      const doc = d.toObject();
      let lessonTitle = "Unknown Lesson";
      if (doc.course && doc.course.modules) {
        for (const m of doc.course.modules) {
          const l = m.lessons.find(lesson => lesson._id.toString() === doc.lesson.toString());
          if (l) { lessonTitle = l.title; break; }
        }
        delete doc.course.modules; // remove modules payload to save bandwidth
      }
      doc.lesson = { _id: doc.lesson, title: lessonTitle };
      return doc;
    });

    res.status(200).json({ doubts: formattedDoubts });
  } catch (error) {
    console.error("Get Student Doubts Error:", error);
    res.status(500).json({ message: "Failed to fetch doubts" });
  }
};

// Instructor: Get all doubts directed to them
export const getInstructorDoubts = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const doubts = await Doubt.find({ instructor: instructorId })
      .populate("course", "title modules")
      .populate("student", "name avatarUrl")
      .sort({ isAnswered: 1, createdAt: -1 }); // Unanswered first

    const formattedDoubts = doubts.map(d => {
      const doc = d.toObject();
      let lessonTitle = "Unknown Lesson";
      if (doc.course && doc.course.modules) {
        for (const m of doc.course.modules) {
          const l = m.lessons.find(lesson => lesson._id.toString() === doc.lesson.toString());
          if (l) { lessonTitle = l.title; break; }
        }
        delete doc.course.modules;
      }
      doc.lesson = { _id: doc.lesson, title: lessonTitle };
      return doc;
    });

    res.status(200).json({ doubts: formattedDoubts });
  } catch (error) {
    console.error("Get Instructor Doubts Error:", error);
    res.status(500).json({ message: "Failed to fetch doubts" });
  }
};

// Instructor: Answer a specific doubt
export const answerDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;
    const { answer } = req.body;
    const instructorId = req.user._id;

    if (!answer || answer.trim() === "") {
      return res.status(400).json({ message: "Answer cannot be empty" });
    }

    const doubt = await Doubt.findOne({ _id: doubtId, instructor: instructorId });
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found or unauthorized" });
    }

    doubt.answer = answer;
    doubt.isAnswered = true;
    await doubt.save();

    res.status(200).json({ message: "Doubt answered successfully!", doubt });
  } catch (error) {
    console.error("Answer Doubt Error:", error);
    res.status(500).json({ message: "Failed to answer doubt" });
  }
};


// ----- REVIEWS -----

// Student: Submit a course review
export const submitReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const studentId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Valid rating (1-5) is required" });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ course: courseId, student: studentId });
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();
      return res.status(200).json({ message: "Review updated successfully", review: existingReview });
    }

    const review = new Review({
      course: courseId,
      student: studentId,
      rating,
      comment
    });

    await review.save();
    
    // Update Course average rating
    const allReviews = await Review.find({ course: courseId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    await Course.findByIdAndUpdate(courseId, { 
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: allReviews.length 
    });

    res.status(201).json({ message: "Review submitted successfully!", review });
  } catch (error) {
    console.error("Submit Review Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this course" });
    }
    res.status(500).json({ message: "Failed to submit review" });
  }
};

// Public: Get all reviews for a course
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId })
      .populate("student", "name avatarUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// Instructor: Get all reviews for their courses
export const getInstructorReviews = async (req, res) => {
  try {
    const instructorId = req.user._id;
    // Find all courses owned by this instructor
    const courses = await Course.find({ instructor: instructorId }).select("_id title");
    const courseIds = courses.map(c => c._id);

    // Find all reviews for these courses
    const reviews = await Review.find({ course: { $in: courseIds } })
      .populate("course", "title")
      .populate("student", "name avatarUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Get Instructor Reviews Error:", error);
    res.status(500).json({ message: "Failed to fetch instructor reviews" });
  }
};
