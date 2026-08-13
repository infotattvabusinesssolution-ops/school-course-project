import { asyncHandler } from "../utils/asyncHandler.js";
import Invoice from "../models/Invoice.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// @desc  Get all invoices for logged-in student
// @route GET /api/invoices/my
export const getMyInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ student: req.user._id })
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, invoices, "Invoices fetched"));
});

// @desc  Get a single invoice by invoice number (public-ish, but still auth)
// @route GET /api/invoices/:invoiceNumber
export const getInvoiceByNumber = asyncHandler(async (req, res) => {
  const { invoiceNumber } = req.params;
  const invoice = await Invoice.findOne({
    invoiceNumber,
    student: req.user._id,  // Must own the invoice
  }).populate("student", "name email");

  if (!invoice) throw new ApiError(404, "Invoice not found");

  res.status(200).json(new ApiResponse(200, invoice, "Invoice fetched"));
});
