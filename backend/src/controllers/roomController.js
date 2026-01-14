const Room = require('../models/Room');
const Question = require('../models/Question');
const { cacheGet, cacheSet, cacheDel, cacheDelPattern } = require('../config/redis');

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private
const createRoom = async (req, res, next) => {
  try {
    // Generate unique room code
    const roomCode = await Room.generateRoomCode();

    const room = await Room.create({
      ...req.body,
      roomCode,
      teacher: req.teacher._id,
    });

    // Cache the room
    await cacheSet(`room:${roomCode}`, room, 86400); // 24 hours

    // Invalidate teacher's rooms list cache
    await cacheDelPattern(`rooms:teacher:${req.teacher._id}:*`);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rooms for logged-in teacher
// @route   GET /api/rooms
// @access  Private
const getRooms = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = { teacher: req.teacher._id };
    if (status) query.status = status;

    const cacheKey = `rooms:teacher:${req.teacher._id}:${JSON.stringify(query)}:page:${page}`;

    // Try cache
    const cachedData = await cacheGet(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        ...cachedData,
        cached: true,
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const rooms = await Room.find(query)
      .populate('questions', 'questionText questionType topic difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Room.countDocuments(query);

    const result = {
      count: rooms.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: rooms,
    };

    // Cache for 5 minutes
    await cacheSet(cacheKey, result, 300);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Private
const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('teacher', 'firstName lastName email')
      .populate('questions');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check ownership
    if (room.teacher._id.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this room',
      });
    }

    res.json({
      success: true,
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get room by room code (for students)
// @route   GET /api/rooms/join/:roomCode
// @access  Public
const getRoomByCode = async (req, res, next) => {
  try {
    const { roomCode } = req.params;

    // Try cache first
    const cacheKey = `room:${roomCode}`;
    const cachedRoom = await cacheGet(cacheKey);

    if (cachedRoom) {
      // Check if room is active
      if (cachedRoom.status === 'active') {
        return res.json({
          success: true,
          data: {
            _id: cachedRoom._id,
            roomCode: cachedRoom.roomCode,
            title: cachedRoom.title,
            description: cachedRoom.description,
            status: cachedRoom.status,
            teacher: cachedRoom.teacher,
            settings: cachedRoom.settings,
            questions: cachedRoom.questions,
            questionCount: cachedRoom.questions.length,
          },
          cached: true,
        });
      }
    }

    const room = await Room.findOne({ roomCode })
      .populate('questions', 'questionText questionType choices correctAnswer pairs topic difficulty points imageUrl')
      .populate('teacher', 'firstName lastName');
      
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check if room is active
    if (room.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Room is not active',
      });
    }

    // Check if room is full
    if (room.stats.totalParticipants >= room.settings.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Room is full',
      });
    }

    // Cache room data
    await cacheSet(cacheKey, room, 3600); // 1 hour

    res.json({
      success: true,
      data: {
        _id: room._id,
        roomCode: room.roomCode,
        title: room.title,
        description: room.description,
        status: room.status,
        teacher: room.teacher,
        settings: room.settings,
        questions: room.questions,
        questionCount: room.questions.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private
const updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check ownership
    if (room.teacher.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room',
      });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('questions');

    // Invalidate caches
    await cacheDel(`room:${room.roomCode}`);
    await cacheDelPattern(`rooms:teacher:${req.teacher._id}:*`);

    res.json({
      success: true,
      message: 'Room updated successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check ownership
    if (room.teacher.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room',
      });
    }

    await room.deleteOne();

    // Invalidate caches
    await cacheDel(`room:${room.roomCode}`);
    await cacheDelPattern(`rooms:teacher:${req.teacher._id}:*`);

    res.json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add questions to room
// @route   POST /api/rooms/:id/questions
// @access  Private
const addQuestionsToRoom = async (req, res, next) => {
  try {
    const { questionIds } = req.body;

    if (!questionIds || !Array.isArray(questionIds)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of question IDs',
      });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check ownership
    if (room.teacher.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this room',
      });
    }

    // Verify questions exist and belong to teacher
    const questions = await Question.find({
      _id: { $in: questionIds },
      teacher: req.teacher._id,
    });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some questions not found or do not belong to you',
      });
    }

    // Add questions to room (avoid duplicates)
    questionIds.forEach((id) => {
      if (!room.questions.includes(id)) {
        room.questions.push(id);
      }
    });

    await room.save();

    // Invalidate caches
    await cacheDel(`room:${room.roomCode}`);

    res.json({
      success: true,
      message: 'Questions added to room successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room status
// @route   PATCH /api/rooms/:id/status
// @access  Private
const updateRoomStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['draft', 'active', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Check ownership
    if (room.teacher.toString() !== req.teacher._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this room',
      });
    }

    room.status = status;
    if (status === 'active' && !room.startDate) {
      room.startDate = new Date();
    }
    if (status === 'closed' && !room.endDate) {
      room.endDate = new Date();
    }

    await room.save();

    // Invalidate caches
    await cacheDel(`room:${room.roomCode}`);
    await cacheDelPattern(`rooms:teacher:${req.teacher._id}:*`);

    res.json({
      success: true,
      message: 'Room status updated successfully',
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  getRoomByCode,
  updateRoom,
  deleteRoom,
  addQuestionsToRoom,
  updateRoomStatus,
};
