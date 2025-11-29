const express = require('express');
const {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByTopic,
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/').get(getQuestions).post(createQuestion);

router.route('/:id').get(getQuestion).put(updateQuestion).delete(deleteQuestion);

router.get('/topic/:topic', getQuestionsByTopic);

module.exports = router;
