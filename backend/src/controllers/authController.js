const Teacher = require('../models/Teacher');
const { generateToken } = require('../utils/jwt');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');

// @desc    Register new teacher
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, school, department } = req.body;

    // Check if teacher exists
    const teacherExists = await Teacher.findOne({ email });
    if (teacherExists) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email already exists',
      });
    }

    // Create teacher
    const teacher = await Teacher.create({
      firstName,
      lastName,
      email,
      password,
      school,
      department,
    });

    // Generate token
    const token = generateToken(teacher._id);

    res.status(201).json({
      success: true,
      message: 'Teacher registered successfully',
      data: {
        id: teacher._id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        school: teacher.school,
        department: teacher.department,
        role: teacher.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login teacher
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check for teacher (include password field)
    const teacher = await Teacher.findOne({ email }).select('+password');

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await teacher.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if account is active
    if (!teacher.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
      });
    }

    // Update last login
    teacher.lastLogin = Date.now();
    await teacher.save();

    // Generate token
    const token = generateToken(teacher._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: teacher._id,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        school: teacher.school,
        department: teacher.department,
        role: teacher.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current teacher profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    // Try to get from cache first
    const cacheKey = `teacher:${req.teacher._id}`;
    const cachedTeacher = await cacheGet(cacheKey);

    if (cachedTeacher) {
      return res.json({
        success: true,
        data: cachedTeacher,
        cached: true,
      });
    }

    // If not in cache, get from database
    const teacher = await Teacher.findById(req.teacher._id);

    // Cache the result
    await cacheSet(cacheKey, teacher, 3600); // Cache for 1 hour

    res.json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update teacher profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      school: req.body.school,
      department: req.body.department,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const teacher = await Teacher.findByIdAndUpdate(req.teacher._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    // Invalidate cache
    await cacheDel(`teacher:${req.teacher._id}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: teacher,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password',
      });
    }

    // Get teacher with password
    const teacher = await Teacher.findById(req.teacher._id).select('+password');

    // Check current password
    const isMatch = await teacher.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    teacher.password = newPassword;
    await teacher.save();

    // Invalidate cache
    await cacheDel(`teacher:${req.teacher._id}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};
