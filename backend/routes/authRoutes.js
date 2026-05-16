const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, updateProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/profile', protect, updateProfile);

module.exports = router;
