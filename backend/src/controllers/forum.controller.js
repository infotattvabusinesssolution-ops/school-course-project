import ForumPost from "../models/ForumPost.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Seed sample posts if empty
const seedSamplePosts = async (userId, userName) => {
  const count = await ForumPost.countDocuments();
  if (count === 0) {
    const samples = [
      {
        author: userId,
        authorName: userName || "Gyana Singh",
        category: "Customs",
        title: "What are the key documents required for SARS SAD500 customs clearance in Durban port?",
        content: "I am importing a 20ft container of electronics from Guangzhou to Durban harbor and need clarification on duty rates, Bill of Lading, and SAD500 processing timelines.",
        views: 42,
        replies: [
          {
            author: userId,
            authorName: "CRMISA Trade Advisor",
            text: "You will need a Bill of Lading, Commercial Invoice, Packing List, SARS SAD500 declaration, and Origin Certificate EUR.1 if claiming duty preferences.",
            createdAt: new Date(Date.now() - 3600000)
          },
          {
            author: userId,
            authorName: "David K (Export Consultant)",
            text: "Also make sure your Customs Client Number (CCN) is activated on eFiling before vessel arrival to avoid demurrage penalties at Durban container terminal!",
            createdAt: new Date(Date.now() - 1800000)
          }
        ]
      },
      {
        author: userId,
        authorName: "Thandi M",
        category: "Export",
        title: "Which Incoterm is recommended when exporting perishable produce to the EU via air freight?",
        content: "We are shipping fresh avocados from Johannesburg (JNB) to Frankfurt (FRA) and want to minimize risk allocation while maintaining competitive CIF/CIP pricing.",
        views: 29,
        replies: [
          {
            author: userId,
            authorName: "Sarah Trade Lead",
            text: "CIP (Carriage and Insurance Paid to) is recommended for air freight as risk transfers once delivered to the air carrier at OR Tambo.",
            createdAt: new Date(Date.now() - 7200000)
          }
        ]
      },
      {
        author: userId,
        authorName: "Lindiwe D",
        category: "Import",
        title: "Understanding Import Tariff Classifications (HS Codes) for Solar Inverters",
        content: "Could anyone share guidance on determining the correct 8-digit HS Code for hybrid solar inverters under South African customs tariffs?",
        views: 18,
        replies: []
      }
    ];
    await ForumPost.insertMany(samples);
  }
};

export const getAllPosts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;

  // Auto-seed if empty
  if (req.user) {
    await seedSamplePosts(req.user._id, req.user.name);
  }

  const query = {};
  if (category && category !== "all") {
    query.category = { $regex: new RegExp(`^${category}$`, "i") };
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } }
    ];
  }

  const posts = await ForumPost.find(query)
    .populate("author", "name email role profilePicture")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, posts, "Forum posts retrieved successfully")
  );
});

export const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await ForumPost.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("author", "name email role profilePicture")
    .populate("replies.author", "name email role profilePicture");

  if (!post) {
    throw new ApiError(404, "Forum post not found");
  }

  return res.status(200).json(
    new ApiResponse(200, post, "Forum post retrieved successfully")
  );
});

export const createPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !title.trim()) {
    throw new ApiError(400, "Post title is required");
  }

  const post = await ForumPost.create({
    author: req.user._id,
    authorName: req.user.name || "Student",
    category: category || "General",
    title: title.trim(),
    content: content ? content.trim() : "",
  });

  const populatedPost = await ForumPost.findById(post._id).populate(
    "author",
    "name email role profilePicture"
  );

  return res.status(201).json(
    new ApiResponse(201, populatedPost, "Forum post created successfully")
  );
});

export const addReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    throw new ApiError(400, "Reply text cannot be empty");
  }

  const post = await ForumPost.findById(id);
  if (!post) {
    throw new ApiError(404, "Forum post not found");
  }

  post.replies.push({
    author: req.user._id,
    authorName: req.user.name || "Student",
    text: text.trim(),
  });

  await post.save();

  const updatedPost = await ForumPost.findById(id)
    .populate("author", "name email role profilePicture")
    .populate("replies.author", "name email role profilePicture");

  return res.status(200).json(
    new ApiResponse(200, updatedPost, "Reply posted successfully")
  );
});

export const toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const post = await ForumPost.findById(id);
  if (!post) {
    throw new ApiError(404, "Forum post not found");
  }

  const likedIndex = post.likes.indexOf(userId);
  if (likedIndex > -1) {
    post.likes.splice(likedIndex, 1);
  } else {
    post.likes.push(userId);
  }

  await post.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { likesCount: post.likes.length, isLiked: likedIndex === -1 },
      "Like toggled successfully"
    )
  );
});

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await ForumPost.findById(id);
  if (!post) {
    throw new ApiError(404, "Forum post not found");
  }

  // Check if user is author or ADMIN
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Not authorized to delete this post");
  }

  await ForumPost.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, null, "Forum post deleted successfully")
  );
});

export const deleteReply = asyncHandler(async (req, res) => {
  const { id, replyId } = req.params;

  const post = await ForumPost.findById(id);
  if (!post) {
    throw new ApiError(404, "Forum post not found");
  }

  const replyIndex = post.replies.findIndex((r) => r._id.toString() === replyId);
  if (replyIndex === -1) {
    throw new ApiError(404, "Reply not found");
  }

  const reply = post.replies[replyIndex];
  if (reply.author.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
    throw new ApiError(403, "Not authorized to delete this reply");
  }

  post.replies.splice(replyIndex, 1);
  await post.save();

  return res.status(200).json(
    new ApiResponse(200, post, "Reply deleted successfully")
  );
});
