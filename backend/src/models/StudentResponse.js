const mongoose = require('mongoose');

const studentResponseSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    // Student information (no auth required)
    studentInfo: {
      name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true,
      },
      lrn: {
        type: String,
        trim: true,
      },
      section: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
      },
    },
    // Answers
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        answer: mongoose.Schema.Types.Mixed, // Can be string, array, object depending on question type
        isCorrect: Boolean,
        pointsEarned: {
          type: Number,
          default: 0,
        },
        timeSpent: {
          type: Number, // in seconds
          default: 0,
        },
      },
    ],
    // Test session info
    startedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
    },
    totalTimeSpent: {
      type: Number, // in seconds
      default: 0,
    },
    // Scoring
    totalScore: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    // Status
    status: {
      type: String,
      enum: ['in-progress', 'submitted', 'reviewed'],
      default: 'in-progress',
    },
    // IP and device info for security
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Calculate score before saving
studentResponseSchema.pre('save', function (next) {
  if (this.isModified('answers')) {
    this.totalScore = this.answers.reduce(
      (sum, answer) => sum + (answer.pointsEarned || 0),
      0
    );
    this.percentage = this.maxScore > 0 ? (this.totalScore / this.maxScore) * 100 : 0;
  }
  next();
});

// Indexes
studentResponseSchema.index({ room: 1, 'studentInfo.name': 1 });
studentResponseSchema.index({ room: 1, status: 1 });
studentResponseSchema.index({ submittedAt: 1 });

module.exports = mongoose.model('StudentResponse', studentResponseSchema);
