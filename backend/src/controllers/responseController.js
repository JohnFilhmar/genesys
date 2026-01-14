const StudentResponse = require('../models/StudentResponse');
const Room = require('../models/Room');
const Question = require('../models/Question');

/**
 * @desc    Create a new response (when student joins room)
 * @route   POST /api/responses
 * @access  Public
 */
exports.createResponse = async (req, res) => {
  try {
    const { roomId, studentInfo, ipAddress, userAgent } = req.body;

    // Validate student info
    if (!studentInfo || !studentInfo.name) {
      return res.status(400).json({
        success: false,
        message: 'Student name is required',
      });
    }

    // Check if room exists and is active
    const room = await Room.findById(roomId).populate('questions');
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    if (room.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Room is not active',
      });
    }

    // Check if room has reached max students
    if (room.maxStudents > 0) {
      const currentResponseCount = await StudentResponse.countDocuments({
        room: roomId,
      });

      if (currentResponseCount >= room.maxStudents) {
        return res.status(400).json({
          success: false,
          message: 'Room has reached maximum capacity',
        });
      }
    }

    // Calculate max score from questions
    const maxScore = room.questions.reduce(
      (sum, question) => sum + (question.points || 0),
      0
    );

    // Initialize answers array with question IDs
    const answers = room.questions.map((question) => ({
      questionId: question._id,
      answer: null,
      isCorrect: false,
      pointsEarned: 0,
      timeSpent: 0,
    }));

    // Create response
    const response = await StudentResponse.create({
      room: roomId,
      studentInfo,
      answers,
      maxScore,
      status: 'in-progress',
      ipAddress,
      userAgent,
    });

    // Update room stats - increment total participants
    await Room.findByIdAndUpdate(roomId, {
      $inc: { 'stats.totalParticipants': 1 },
    });

    res.status(201).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error creating response:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Update response answers (while taking quiz)
 * @route   PUT /api/responses/:id
 * @access  Public
 */
exports.updateResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, totalTimeSpent } = req.body;

    // Find response
    const response = await StudentResponse.findById(id);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found',
      });
    }

    // Check if response is already submitted
    if (response.status === 'submitted' || response.status === 'reviewed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update submitted response',
      });
    }

    // Update answers
    if (answers && Array.isArray(answers)) {
      response.answers = answers;
    }

    // Update total time spent
    if (totalTimeSpent !== undefined) {
      response.totalTimeSpent = totalTimeSpent;
    }

    await response.save();

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error updating response:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Submit response (finalize and calculate score)
 * @route   POST /api/responses/:id/submit
 * @access  Public
 */
exports.submitResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, totalTimeSpent } = req.body;

    // Find response and populate room with questions
    const response = await StudentResponse.findById(id);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found',
      });
    }

    // Check if already submitted
    if (response.status === 'submitted' || response.status === 'reviewed') {
      return res.status(400).json({
        success: false,
        message: 'Response already submitted',
      });
    }

    // Get room with questions
    const room = await Room.findById(response.room).populate('questions');
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Create question map for easy lookup
    const questionMap = new Map();
    room.questions.forEach((q) => {
      questionMap.set(q._id.toString(), q);
    });

    // Grade each answer
    const gradedAnswers = answers.map((answer) => {
      const question = questionMap.get(answer.questionId.toString());
      if (!question) {
        return { ...answer, isCorrect: false, pointsEarned: 0 };
      }

      let isCorrect = false;
      let pointsEarned = 0;

      // Grade based on question type
      switch (question.questionType) {
        case 'multiple-choice':
          // Check if selected option is correct
          const selectedOption = question.choices.find(
            (opt) => opt._id.toString() === answer.answer
          );
          isCorrect = selectedOption ? selectedOption.isCorrect : false;
          pointsEarned = isCorrect ? question.points : 0;
          break;

        case 'true-false':
          isCorrect = answer.answer === question.correctAnswer;
          pointsEarned = isCorrect ? question.points : 0;
          break;

        case 'matching':
          // Check if all pairs match correctly
          if (Array.isArray(answer.answer) && Array.isArray(question.pairs)) {
            const correctMatches = question.pairs.every((pair) => {
              const studentPair = answer.answer.find(
                (sp) => sp.left === pair.left
              );
              return studentPair && studentPair.right === pair.right;
            });
            isCorrect = correctMatches && answer.answer.length === question.pairs.length;
            pointsEarned = isCorrect ? question.points : 0;
          }
          break;

        case 'fill-in-the-blank':
          // Check if all blanks are filled correctly (case-insensitive)
          if (Array.isArray(answer.answer) && Array.isArray(question.correctAnswers)) {
            const correctBlanks = answer.answer.every((studentAnswer, index) => {
              const correctAnswer = question.correctAnswers[index];
              return (
                studentAnswer &&
                correctAnswer &&
                studentAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
              );
            });
            isCorrect = correctBlanks && answer.answer.length === question.correctAnswers.length;
            pointsEarned = isCorrect ? question.points : 0;
          }
          break;

        case 'short-answer':
        case 'essay':
          // These require manual grading
          isCorrect = false;
          pointsEarned = 0;
          break;

        default:
          isCorrect = false;
          pointsEarned = 0;
      }

      return {
        ...answer,
        isCorrect,
        pointsEarned,
      };
    });

    // Update response
    response.answers = gradedAnswers;
    response.totalTimeSpent = totalTimeSpent || response.totalTimeSpent;
    response.submittedAt = new Date();
    response.status = 'submitted';

    // Calculate total score (pre-save hook will handle this)
    await response.save();

    // Update room stats - increment submissions and recalculate average score
    const allSubmissions = await StudentResponse.find({
      room: response.room,
      status: { $in: ['submitted', 'reviewed'] },
    });

    const averageScore = allSubmissions.length > 0
      ? allSubmissions.reduce((sum, r) => sum + r.percentage, 0) / allSubmissions.length
      : 0;

    await Room.findByIdAndUpdate(response.room, {
      $inc: { 'stats.totalSubmissions': 1 },
      $set: { 'stats.averageScore': averageScore },
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all responses for a room (for teacher analytics)
 * @route   GET /api/responses/room/:roomId
 * @access  Private (Teacher only)
 */
exports.getRoomResponses = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { status } = req.query;

    // Build query
    const query = { room: roomId };
    if (status) {
      query.status = status;
    }

    // Find responses
    const responses = await StudentResponse.find(query)
      .populate('room', 'title code')
      .sort({ submittedAt: -1, createdAt: -1 });

    // Calculate statistics
    const stats = {
      total: responses.length,
      submitted: responses.filter((r) => r.status === 'submitted' || r.status === 'reviewed').length,
      inProgress: responses.filter((r) => r.status === 'in-progress').length,
      averageScore: 0,
      averagePercentage: 0,
      averageTime: 0,
    };

    const submittedResponses = responses.filter((r) => r.status === 'submitted' || r.status === 'reviewed');
    if (submittedResponses.length > 0) {
      stats.averageScore =
        submittedResponses.reduce((sum, r) => sum + r.totalScore, 0) /
        submittedResponses.length;
      stats.averagePercentage =
        submittedResponses.reduce((sum, r) => sum + r.percentage, 0) /
        submittedResponses.length;
      stats.averageTime =
        submittedResponses.reduce((sum, r) => sum + r.totalTimeSpent, 0) /
        submittedResponses.length;
    }

    res.json({
      success: true,
      count: responses.length,
      stats,
      data: responses,
    });
  } catch (error) {
    console.error('Error getting room responses:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Get a single response by ID
 * @route   GET /api/responses/:id
 * @access  Public/Private
 */
exports.getResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await StudentResponse.findById(id)
      .populate('room', 'title code questions')
      .populate({
        path: 'room',
        populate: {
          path: 'questions',
        },
      });

    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found',
      });
    }

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error getting response:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a response
 * @route   DELETE /api/responses/:id
 * @access  Private (Teacher only)
 */
exports.deleteResponse = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await StudentResponse.findById(id);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found',
      });
    }

    await response.deleteOne();

    res.json({
      success: true,
      message: 'Response deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Update response grade (for manual grading of essays/short-answer)
 * @route   PUT /api/responses/:id/grade
 * @access  Private (Teacher only)
 */
exports.gradeResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const response = await StudentResponse.findById(id);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Response not found',
      });
    }

    // Update specific answer grades
    if (answers && Array.isArray(answers)) {
      answers.forEach((updatedAnswer) => {
        const answerIndex = response.answers.findIndex(
          (a) => a.questionId.toString() === updatedAnswer.questionId
        );
        if (answerIndex !== -1) {
          response.answers[answerIndex].isCorrect = updatedAnswer.isCorrect;
          response.answers[answerIndex].pointsEarned = updatedAnswer.pointsEarned;
        }
      });
    }

    response.status = 'reviewed';
    await response.save(); // Pre-save hook will recalculate total score

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error grading response:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};
