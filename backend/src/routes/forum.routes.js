import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  addReply,
  toggleLike,
  deletePost,
  deleteReply,
} from "../controllers/forum.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/posts", getAllPosts);
router.get("/posts/:id", getPostById);

// Protected routes
router.post("/posts", protect, createPost);
router.post("/posts/:id/reply", protect, addReply);
router.post("/posts/:id/like", protect, toggleLike);
router.delete("/posts/:id", protect, deletePost);
router.delete("/posts/:id/replies/:replyId", protect, deleteReply);

export default router;
