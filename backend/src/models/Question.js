const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    questionType: {
      type: String,
      enum: [
        'multiple-choice',
        'true-false',
        'matching',
        'fill-in-the-blank',
        'essay',
        'short-answer',
      ],
      required: [true, 'Question type is required'],
    },
    // For multiple choice questions
    choices: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],
    // For true/false
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed, // Can be string, boolean, or array
    },
    // For matching type
    pairs: [
      {
        left: String,
        right: String,
      },
    ],
    // Question metadata
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      enum: [
        'Genetic Engineering',
        'Evolution',
        'Taxonomy',
        'Reproduction',
        'Plant Systems',
        'Animal Systems',
        'Homeostasis',
        'Immune System',
        'Other',
      ],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    points: {
      type: Number,
      default: 1,
      min: 1,
    },
    explanation: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    tags: [String],
    isPublic: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
questionSchema.index({ teacher: 1, topic: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ tags: 1 });

module.exports = mongoose.model('Question', questionSchema);
