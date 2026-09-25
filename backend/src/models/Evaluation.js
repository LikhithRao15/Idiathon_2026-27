const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
      index: true,
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'submissionModel',
      required: false,
    },
    submissionModel: {
      type: String,
      enum: ['Round1Submission', 'Round2Submission', 'Event'],
      required: false,
    },
    panelistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Panelist ID is required'],
      index: true,
    },
    round: {
      type: Number,
      enum: [1, 2, 3],
      required: [true, 'Round number is required (1, 2, or 3)'],
      index: true,
    },
    scores: {
      type: Map,
      of: Number,
      required: [true, 'Scores map is required'],
    },
    totalScore: {
      type: Number,
      required: [true, 'Total score is required'],
      min: 0,
    },
    comments: {
      type: String,
      trim: true,
      default: '',
    },
    evaluatedAt: {
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

// Prevent duplicate evaluation from same panelist for the same team and round
evaluationSchema.index({ teamId: 1, panelistId: 1, round: 1 }, { unique: true });

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
