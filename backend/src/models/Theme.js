const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theme name is required'],
      unique: true,
      trim: true,
      maxlength: [150, 'Theme name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Theme description is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
