const Task = require('../models/taskModel');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const userId = req.user._id;

    // If user is admin, aggregate all tasks.
    // If user is member, aggregate only tasks assigned to them.
    const matchStage = isAdmin ? {} : { assignedTo: userId };

    const currentDate = new Date();

    const stats = await Task.aggregate([
      { $match: matchStage },
      {
        $facet: {
          totalTasks: [{ $count: 'count' }],
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ],
          overdueTasks: [
            {
              $match: {
                dueDate: { $lt: currentDate },
                status: { $ne: 'Done' },
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    // Format the aggregation result
    const result = stats[0];
    const total = result.totalTasks[0] ? result.totalTasks[0].count : 0;
    const overdue = result.overdueTasks[0] ? result.overdueTasks[0].count : 0;
    
    // Group tasks by status with default values
    const groupedByStatus = result.statusCounts.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {
        'Todo': 0,
        'In Progress': 0,
        'Done': 0,
      }
    );

    // Calculate completed vs pending
    const completed = groupedByStatus['Done'];
    const pending = groupedByStatus['Todo'] + groupedByStatus['In Progress'];

    res.status(200).json({
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: pending,
      overdueTasks: overdue,
      tasksByStatus: groupedByStatus,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
