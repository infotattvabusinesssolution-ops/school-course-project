import express from 'express';
import { getPublishedCourses, getPublicCourseDetails } from '../controllers/course.controller.js';

const router = express.Router();

router.get('/courses', getPublishedCourses);
router.get('/courses/:id', getPublicCourseDetails);

export default router;
