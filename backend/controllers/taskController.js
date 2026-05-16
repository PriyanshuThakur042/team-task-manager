const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, project, priority, dueDate } = req.body;

    if (!title || !description || !project) {
      res.status(400);
      throw new Error('Please provide title, description and project');
    }

    // Verify project exists
    const existingProject = await Project.findById(project);
    if (!existingProject) {
      res.status(404);
      throw new Error('Project not found');
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || null,
      project,
      priority: priority || 'Medium',
      status: 'Todo',
      dueDate,
      createdBy: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign task to user
// @route   PUT /api/tasks/:id/assign
// @access  Private/Admin
const assignTask = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    
    let task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    task.assignedTo = assignedTo;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private (Admin or Assigned Member)
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check authorization: Must be admin
    if (req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this task status');
    }

    // Validate status
    if (!['Todo', 'In Progress', 'Done'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Valid values: Todo, In Progress, Done');
    }

    task.status = status;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Authorization: User must be admin or a member of the project
    if (
      req.user.role !== 'admin' &&
      !project.members.some((m) => m.toString() === req.user._id.toString())
    ) {
      res.status(403);
      throw new Error('Not authorized to view tasks for this project');
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks assigned to current user
// @route   GET /api/tasks/my-tasks
// @access  Private
const getTasksByUser = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'title description')
      .populate('createdBy', 'name email');

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const query = {};
    const tasks = await Task.find(query)
      .populate('project', 'title')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  assignTask,
  updateTaskStatus,
  getTasksByProject,
  getTasksByUser,
  deleteTask,
  getTasks,
};
