import Ebook from "../models/Ebook.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const getPublicEbooks = asyncHandler(async (req, res) => {
  const ebooks = await Ebook.find({}).sort({ createdAt: -1 });
  return res.status(200).json(
    new ApiResponse(200, ebooks, "Ebooks retrieved successfully")
  );
});

export const getEbookById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ebook = await Ebook.findById(id);
  if (!ebook) {
    throw new ApiError(404, "Ebook not found");
  }
  return res.status(200).json(
    new ApiResponse(200, ebook, "Ebook details retrieved successfully")
  );
});

export const createEbook = asyncHandler(async (req, res) => {
  const { title, price, coverTitle, subtitle, description, category, inStock, coverImage: bodyCoverImage } = req.body;

  if (!title || !price) {
    throw new ApiError(400, "Ebook title and price are required");
  }

  let coverImage = bodyCoverImage || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop";
  let coverImagePublicId = null;
  let samplePdfUrl = null;
  let samplePdfPublicId = null;
  let pdfUrl = null;
  let pdfPublicId = null;

  // Handle Cloudinary file uploads if present
  if (req.files) {
    if (req.files.coverImage && req.files.coverImage[0]) {
      const uploadedImage = await uploadOnCloudinary(req.files.coverImage[0].path);
      if (uploadedImage) {
        coverImage = uploadedImage.secure_url;
        coverImagePublicId = uploadedImage.public_id;
      }
    }
    if (req.files.samplePdf && req.files.samplePdf[0]) {
      const uploadedSample = await uploadOnCloudinary(req.files.samplePdf[0].path);
      if (uploadedSample) {
        samplePdfUrl = uploadedSample.secure_url;
        samplePdfPublicId = uploadedSample.public_id;
      }
    }
    if (req.files.pdf && req.files.pdf[0]) {
      const uploadedPdf = await uploadOnCloudinary(req.files.pdf[0].path);
      if (uploadedPdf) {
        pdfUrl = uploadedPdf.secure_url;
        pdfPublicId = uploadedPdf.public_id;
      }
    }
  }

  const ebook = await Ebook.create({
    title: title.trim(),
    price: Number(price),
    coverTitle: coverTitle ? coverTitle.trim() : "",
    subtitle: subtitle ? subtitle.trim() : "",
    description: description ? description.trim() : "",
    category: category || "Trade & Logistics",
    inStock: inStock !== undefined ? inStock : true,
    coverImage,
    coverImagePublicId,
    samplePdfUrl,
    samplePdfPublicId,
    pdfUrl,
    pdfPublicId,
  });

  return res.status(201).json(
    new ApiResponse(201, ebook, "Ebook created successfully")
  );
});

export const updateEbook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ebook = await Ebook.findById(id);

  if (!ebook) {
    throw new ApiError(404, "Ebook not found");
  }

  const { title, price, coverTitle, subtitle, description, category, inStock, coverImage: bodyCoverImage } = req.body;

  if (title) ebook.title = title.trim();
  if (price !== undefined) ebook.price = Number(price);
  if (coverTitle !== undefined) ebook.coverTitle = coverTitle.trim();
  if (subtitle !== undefined) ebook.subtitle = subtitle.trim();
  if (description !== undefined) ebook.description = description.trim();
  if (category !== undefined) ebook.category = category;
  if (inStock !== undefined) ebook.inStock = Boolean(inStock);
  if (bodyCoverImage) ebook.coverImage = bodyCoverImage;

  // Cloudinary uploads update
  if (req.files) {
    if (req.files.coverImage && req.files.coverImage[0]) {
      if (ebook.coverImagePublicId) {
        await deleteFromCloudinary(ebook.coverImagePublicId, 'image');
      }
      const uploadedImage = await uploadOnCloudinary(req.files.coverImage[0].path);
      if (uploadedImage) {
        ebook.coverImage = uploadedImage.secure_url;
        ebook.coverImagePublicId = uploadedImage.public_id;
      }
    }
    if (req.files.samplePdf && req.files.samplePdf[0]) {
      if (ebook.samplePdfPublicId) {
        await deleteFromCloudinary(ebook.samplePdfPublicId, 'raw');
      }
      const uploadedSample = await uploadOnCloudinary(req.files.samplePdf[0].path);
      if (uploadedSample) {
        ebook.samplePdfUrl = uploadedSample.secure_url;
        ebook.samplePdfPublicId = uploadedSample.public_id;
      }
    }
    if (req.files.pdf && req.files.pdf[0]) {
      if (ebook.pdfPublicId) {
        await deleteFromCloudinary(ebook.pdfPublicId, 'raw');
      }
      const uploadedPdf = await uploadOnCloudinary(req.files.pdf[0].path);
      if (uploadedPdf) {
        ebook.pdfUrl = uploadedPdf.secure_url;
        ebook.pdfPublicId = uploadedPdf.public_id;
      }
    }
  }

  await ebook.save();

  return res.status(200).json(
    new ApiResponse(200, ebook, "Ebook updated successfully")
  );
});

export const deleteEbook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const ebook = await Ebook.findById(id);

  if (!ebook) {
    throw new ApiError(404, "Ebook not found");
  }

  if (ebook.coverImagePublicId) {
    await deleteFromCloudinary(ebook.coverImagePublicId, 'image');
  }
  if (ebook.samplePdfPublicId) {
    await deleteFromCloudinary(ebook.samplePdfPublicId, 'raw');
  }
  if (ebook.pdfPublicId) {
    await deleteFromCloudinary(ebook.pdfPublicId, 'raw');
  }

  await Ebook.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, null, "Ebook deleted successfully")
  );
});
