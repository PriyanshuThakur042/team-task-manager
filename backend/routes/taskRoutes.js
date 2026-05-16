const express = require('express');
const router = express.Router();
const {
  createTask,
  assignTask,
  updateTaskStatus,
  getTasksByProject,
  getTasksByUser,
  deleteTask,
  getTasks,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route for getting all tasks (Admin gets all, Member gets assigned)
router.get('/', protect, getTasks);

// Route for getting current user's tasks
router.get('/my-tasks', protect, getTasksByUser);

// Route for getting tasks by project
router.get('/project/:projectId', protect, getTasksByProject);

// Basic CRUD routes
router.post('/', protect, authorize('admin'), createTask);
router.delete('/:id', protect, authorize('admin'), deleteTask);

// Update/Assign routes
router.put('/:id/assign', protect, authorize('admin'), assignTask);
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
