const Question = require('../models/Question');
const { cacheGet, cacheSet, cacheDel, cacheDelPattern } = require('../config/redis');

// @desc    Create new question
// @route   POST /api/questions
// @access  Private
const createQuestion = async (req, res, next) => {
  try {
    req.body.teacher = req.teacher._id;

    const question = await Question.create(req.body);

    // Invalidate teacher's questions cache
    await cacheDelPattern(`questions:teacher:${req.teacher._id}:*`);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all questions for logged-in teacher
// @route   GET /api/questions
// @access  Private
const getQuestions = async (req, res, next) => {
  try {
    const { topic, difficulty, questionType, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { teacher: req.teacher._id };
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    if (questionType) query.questionType = questionType;

    // Create cache key
    const cacheKey = `questions:teacher:${req.teacher._id}:${JSON.stringify(query)}:page:${page}:limit:${limit}`;

    // Try to get from cache
    const cachedData = await cacheGet(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        ...cachedData,
        cached: true,
      });
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Question.countDocuments(query);

    const result = {
      count: questions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: questions,
    };

    // Cache the result for 5 minutes
    await cacheSet(cacheKey, result, 300);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
const getQuestion = async (req, res, next) => {
  try {
    const cacheKey = `question:${req.params.id}`;

    // Try cache first
    const cachedQuestion = await cacheGet(cacheKey);
    if (cachedQuestion) {
      return res.json({
        success: true,
        data: cachedQuestion,
        cached: true,
      });
    }

    const question = await Question.findById(req.params.id).populate(
      'teacher',
      'firstName lastName'
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Check if teacher owns the question
    if (question.teacher._id.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this question',
      });
    }

    // Cache for 10 minutes
    await cacheSet(cacheKey, question, 600);

    res.json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private
const updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Check ownership
    if (question.teacher.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this question',
      });
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Invalidate caches
    await cacheDel(`question:${req.params.id}`);
    await cacheDelPattern(`questions:teacher:${req.teacher._id}:*`);

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private
const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Check ownership
    if (question.teacher.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this question',
      });
    }

    await question.deleteOne();

    // Invalidate caches
    await cacheDel(`question:${req.params.id}`);
    await cacheDelPattern(`questions:teacher:${req.teacher._id}:*`);

    res.json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get questions by topic
// @route   GET /api/questions/topic/:topic
// @access  Private
const getQuestionsByTopic = async (req, res, next) => {
  try {
    const cacheKey = `questions:teacher:${req.teacher._id}:topic:${req.params.topic}`;

    const cachedQuestions = await cacheGet(cacheKey);
    if (cachedQuestions) {
      return res.json({
        success: true,
        count: cachedQuestions.length,
        data: cachedQuestions,
        cached: true,
      });
    }

    const questions = await Question.find({
      teacher: req.teacher._id,
      topic: req.params.topic,
    }).sort({ createdAt: -1 });

    // Cache for 10 minutes
    await cacheSet(cacheKey, questions, 600);

    res.json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsByTopic,
};
