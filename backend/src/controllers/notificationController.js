const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Get user's in-app notifications (with unread count)
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, unreadOnly } = req.query;

    const filter = { userId };
    if (unreadOnly === 'true') {
      filter.isRead = false;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId, isRead: false }),
    ]);

    return sendSuccess(res, 'Notifications retrieved successfully.', {
      notifications,
      unreadCount,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return sendError(res, 'Notification not found.', 404);
    }

    notification.isRead = true;
    await notification.save();

    return sendSuccess(res, 'Notification marked as read.', notification);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark all user notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );

    return sendSuccess(res, 'All notifications marked as read.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
