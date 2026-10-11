const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

// Public route to submit survey response
router.post('/submit', surveyController.submitSurvey);

// Admin-only routes to view responses and statistics
router.get('/responses', requireAuth, requireRole('admin'), surveyController.getSurveyResponses);
router.get('/stats', requireAuth, requireRole('admin'), surveyController.getSurveyStats);
router.get('/responses/:id', requireAuth, requireRole('admin'), surveyController.getSurveyById);

module.exports = router;
