import { Router } from "express";
import {
  getPublicEbooks,
  getEbookById,
  createEbook,
  updateEbook,
  deleteEbook,
} from "../controllers/ebook.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// Public routes
router.get("/public/ebooks", getPublicEbooks);
router.get("/public/ebooks/:id", getEbookById);

// Admin protected routes with Cloudinary file upload
const uploadFields = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "samplePdf", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

router.post("/ebooks", protect, authorize("ADMIN"), uploadFields, createEbook);
router.put("/ebooks/:id", protect, authorize("ADMIN"), uploadFields, updateEbook);
router.delete("/ebooks/:id", protect, authorize("ADMIN"), deleteEbook);

export default router;
