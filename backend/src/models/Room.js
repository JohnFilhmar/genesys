const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 6,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Room title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    // Room settings
    settings: {
      timeLimit: {
        type: Number, // in minutes
        default: 0, // 0 means no limit
      },
      shuffleQuestions: {
        type: Boolean,
        default: false,
      },
      shuffleChoices: {
        type: Boolean,
        default: false,
      },
      showResultsImmediately: {
        type: Boolean,
        default: false,
      },
      allowReview: {
        type: Boolean,
        default: true,
      },
      maxStudents: {
        type: Number,
        default: 100,
      },
      requiredFields: {
        name: { type: Boolean, default: true },
        lrn: { type: Boolean, default: false },
        section: { type: Boolean, default: false },
        email: { type: Boolean, default: false },
      },
    },
    // Room status
    status: {
      type: String,
      enum: ['draft', 'active', 'closed', 'expired'],
      default: 'draft',
    },
    // Dates
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index - MongoDB will auto-delete expired documents
    },
    // Statistics
    stats: {
      totalParticipants: {
        type: Number,
        default: 0,
      },
      totalSubmissions: {
        type: Number,
        default: 0,
      },
      averageScore: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique room code
roomSchema.statics.generateRoomCode = async function () {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  let exists = true;

  while (exists) {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    exists = await this.findOne({ roomCode: code });
  }

  return code;
};

// Set expiry date automatically (24 hours from creation)
roomSchema.pre('save', function (next) {
  if (!this.expiresAt) {
    const hoursToExpire = parseInt(process.env.ROOM_EXPIRY_HOURS) || 24;
    this.expiresAt = new Date(Date.now() + hoursToExpire * 60 * 60 * 1000);
  }
  next();
});

// Indexes
// roomSchema.index({ roomCode: 1 });
roomSchema.index({ teacher: 1, status: 1 });
// roomSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Room', roomSchema);
