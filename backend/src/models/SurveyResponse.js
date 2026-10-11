const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema(
  {
    formSlug: {
      type: String,
      default: 'swachha-sarvekshana',
      index: true,
    },
    formName: {
      type: String,
      default: 'Swachha Sarvekshana',
    },
    respondentName: {
      type: String,
      trim: true,
    },
    villageName: {
      type: String,
      trim: true,
      index: true,
    },
    respondentCategory: {
      type: String,
      trim: true,
    },
    respondentPhone: {
      type: String,
      trim: true,
    },
    surveyTeam: {
      type: String,
      trim: true,
    },
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      text: String,
    },
    photoData: {
      type: String, // base64 or file reference
    },
    surveyDate: {
      type: String,
    },
    surveyTime: {
      type: String,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
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

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);
