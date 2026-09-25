const mongoose = require('mongoose');

const round2SubmissionSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
      unique: true,
      index: true,
    },
    detailedConcept: {
      type: String,
      required: [true, 'Detailed concept is required'],
      trim: true,
    },
    valuePropositionAndCircularity: {
      type: String,
      trim: true,
    },
    valueProposition: {
      type: String,
      trim: true,
    },
    feasibilityPlan90Days: {
      type: String,
      required: [true, '90-Day feasibility plan is required'],
      trim: true,
    },
    resourceRequirements: {
      type: String,
      required: [true, 'Resource requirements are required'],
      trim: true,
    },
    problemAnalysis: {
      type: String,
      trim: true,
    },
    proposedSolution: {
      type: String,
      trim: true,
    },
    expectedImpact: {
      type: String,
      trim: true,
    },
    scalability: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SUBMITTED', 'UNDER_EVALUATION', 'SELECTED', 'NOT_SELECTED'],
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

const Round2Submission = mongoose.model('Round2Submission', round2SubmissionSchema);

module.exports = Round2Submission;
