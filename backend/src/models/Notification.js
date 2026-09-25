const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'REGISTRATION',
        'ROUND1_SUBMITTED',
        'ROUND1_SELECTED',
        'ROUND1_REJECTED',
        'ROUND2_OPENED',
        'ROUND2_REMINDER',
        'ROUND2_SELECTED',
        'ROUND2_REJECTED',
        'FINALIST_SELECTED',
        'FINAL_EVENT_REMINDER',
        'RESULT_PUBLISHED',
        'SYSTEM_ANNOUNCEMENT',
      ],
      required: [true, 'Notification type is required'],
    },
    channel: {
      type: String,
      enum: ['IN_APP', 'EMAIL', 'SMS', 'ALL'],
      default: 'IN_APP',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
