import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMyInvoices, getInvoiceByNumber } from "../controllers/invoice.controller.js";

const router = express.Router();

router.get("/my", protect, getMyInvoices);
router.get("/:invoiceNumber", protect, getInvoiceByNumber);

export default router;
