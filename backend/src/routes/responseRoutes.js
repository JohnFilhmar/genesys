const express = require('express');
const router = express.Router();
const {
  createResponse,
  updateResponse,
  submitResponse,
  getRoomResponses,
  getResponse,
  deleteResponse,
  gradeResponse,
} = require('../controllers/responseController');
const { protect } = require('../middleware/auth');

// Public routes (students can access)
router.post('/', createResponse);
router.get('/:id', getResponse);
router.put('/:id', updateResponse);
router.post('/:id/submit', submitResponse);

// Protected routes (teachers only)
router.get('/room/:roomId', protect, getRoomResponses);
router.delete('/:id', protect, deleteResponse);
router.put('/:id/grade', protect, gradeResponse);

module.exports = router;
