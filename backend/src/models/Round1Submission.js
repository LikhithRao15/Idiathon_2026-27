const mongoose = require('mongoose');

const round1SubmissionSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
      unique: true,
      index: true,
    },
    themeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theme',
      required: [true, 'Theme ID is required'],
    },
    problemStatement: {
      type: String,
      required: [true, 'Problem statement is required'],
      trim: true,
    },
    proposedSolution: {
      type: String,
      required: [true, 'Proposed solution is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'UNDER_SCRUTINY', 'SELECTED', 'NOT_SELECTED'],
      default: 'DRAFT',
    },
    submittedAt: {
      type: Date,
      default: null,
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

const Round1Submission = mongoose.model('Round1Submission', round1SubmissionSchema);

module.exports = Round1Submission;
