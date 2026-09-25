const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Member email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Member phone number is required'],
      trim: true,
    },
    roleInTeam: {
      type: String,
      default: 'Member',
      trim: true,
    },
  },
  { _id: true }
);

const teamSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Team leader is required'],
    },
    members: {
      type: [memberSchema],
      default: [],
    },
    theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theme',
      required: [true, 'Theme selection is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    round1Status: {
      type: String,
      enum: [
        'NOT_SUBMITTED',
        'DRAFT',
        'SUBMITTED',
        'UNDER_SCRUTINY',
        'SELECTED',
        'NOT_SELECTED',
      ],
      default: 'NOT_SUBMITTED',
    },
    round2Status: {
      type: String,
      enum: [
        'LOCKED',
        'DRAFT',
        'SUBMITTED',
        'UNDER_EVALUATION',
        'SELECTED',
        'NOT_SELECTED',
      ],
      default: 'LOCKED',
    },
    finalStatus: {
      type: String,
      enum: ['NOT_QUALIFIED', 'FINALIST', 'WINNER', 'RUNNER_UP', 'COMPLETED'],
      default: 'NOT_QUALIFIED',
    },
    assignedPanelists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
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

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
