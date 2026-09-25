const mongoose = require('mongoose');

const finalistScheduleSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
      unique: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required (e.g. 10:00 AM)'],
      trim: true,
    },
    presentationDuration: {
      type: String,
      default: '15 minutes',
      trim: true,
    },
    instructions: {
      type: String,
      default: 'Please arrive 15 minutes before your scheduled slot with your presentation on a USB drive.',
      trim: true,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'PRESENTING', 'COMPLETED'],
      default: 'SCHEDULED',
    },
  },
  { _id: true, timestamps: true }
);

const eventConfigSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      default: 'Hasiru Samvadha Ideathon 2026',
      trim: true,
    },
    isRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
      default: null,
    },
    round1: {
      status: {
        type: String,
        enum: ['OPEN', 'CLOSED', 'UPCOMING', 'EVALUATION'],
        default: 'OPEN',
      },
      deadline: {
        type: Date,
        default: null,
      },
      instructions: {
        type: String,
        default: 'Submit your core idea, problem statement, and proposed solution.',
      },
    },
    round2: {
      status: {
        type: String,
        enum: ['OPEN', 'CLOSED', 'UPCOMING', 'EVALUATION'],
        default: 'CLOSED',
      },
      deadline: {
        type: Date,
        default: null,
      },
      instructions: {
        type: String,
        default: 'Provide in-depth feasibility, 90-day plan, budget, and scalability models.',
      },
    },
    finalRound: {
      status: {
        type: String,
        enum: ['UPCOMING', 'OPEN', 'COMPLETED', 'CLOSED'],
        default: 'UPCOMING',
      },
      eventDate: {
        type: Date,
        default: null,
      },
      venue: {
        type: String,
        default: 'Main Auditorium / Innovation Center',
      },
      instructions: {
        type: String,
        default: 'Pitch your validated prototype and business model to the Grand Jury.',
      },
    },
    finalists: [finalistScheduleSchema],
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

// Helper to get or create singleton event configuration
eventConfigSchema.statics.getEventConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({
      eventName: 'Hasiru Samvadha Ideathon 2026',
      isRegistrationOpen: true,
      round1: { status: 'OPEN' },
      round2: { status: 'CLOSED' },
      finalRound: { status: 'UPCOMING' },
    });
  }
  return config;
};

const Event = mongoose.model('Event', eventConfigSchema);

module.exports = Event;
