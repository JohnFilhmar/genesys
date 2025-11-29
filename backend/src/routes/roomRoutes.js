const express = require('express');
const {
  createRoom,
  getRooms,
  getRoom,
  getRoomByCode,
  updateRoom,
  deleteRoom,
  addQuestionsToRoom,
  updateRoomStatus,
} = require('../controllers/roomController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public route - students can join rooms
router.get('/join/:roomCode', getRoomByCode);

// Protected routes - teachers only
router.use(protect);

router.route('/').get(getRooms).post(createRoom);

router.route('/:id').get(getRoom).put(updateRoom).delete(deleteRoom);

router.post('/:id/questions', addQuestionsToRoom);
router.patch('/:id/status', updateRoomStatus);

module.exports = router;
