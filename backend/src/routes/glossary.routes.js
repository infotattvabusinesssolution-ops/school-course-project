import express from 'express';
const router = express.Router();
import { getGlossary, createGlossaryTerm, updateGlossaryTerm, deleteGlossaryTerm } from '../controllers/glossary.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

router.get('/', getGlossary);
router.post('/', protect, authorize('admin'), createGlossaryTerm);
router.put('/:id', protect, authorize('admin'), updateGlossaryTerm);
router.delete('/:id', protect, authorize('admin'), deleteGlossaryTerm);

export default router;
