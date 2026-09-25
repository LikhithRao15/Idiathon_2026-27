const Theme = require('../models/Theme');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Get all themes (optional filter by active)
 * @route   GET /api/themes
 * @access  Public / Authenticated
 */
const getThemes = async (req, res, next) => {
  try {
    const filter = {};
    // If not admin, only show active themes
    if (!req.user || req.user.role !== 'admin') {
      filter.isActive = true;
    } else if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    }

    const themes = await Theme.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, 'Themes retrieved successfully.', themes);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single theme by ID
 * @route   GET /api/themes/:id
 * @access  Public / Authenticated
 */
const getThemeById = async (req, res, next) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) {
      return sendError(res, 'Theme not found.', 404);
    }
    return sendSuccess(res, 'Theme details retrieved successfully.', theme);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new theme track
 * @route   POST /api/themes
 * @access  Private (Admin only)
 */
const createTheme = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;

    const existing = await Theme.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existing) {
      return sendError(res, 'A theme with this name already exists.', 400);
    }

    const theme = await Theme.create({
      name,
      description,
      isActive: isActive !== undefined ? isActive : true,
    });

    return sendSuccess(res, 'Theme created successfully.', theme, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing theme
 * @route   PUT /api/themes/:id
 * @access  Private (Admin only)
 */
const updateTheme = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;
    const theme = await Theme.findById(req.params.id);

    if (!theme) {
      return sendError(res, 'Theme not found.', 404);
    }

    if (name) theme.name = name.trim();
    if (description) theme.description = description.trim();
    if (isActive !== undefined) theme.isActive = isActive;

    await theme.save();
    return sendSuccess(res, 'Theme updated successfully.', theme);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a theme
 * @route   DELETE /api/themes/:id
 * @access  Private (Admin only)
 */
const deleteTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) {
      return sendError(res, 'Theme not found.', 404);
    }

    await Theme.findByIdAndDelete(req.params.id);
    return sendSuccess(res, 'Theme deleted successfully.', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getThemes,
  getThemeById,
  createTheme,
  updateTheme,
  deleteTheme,
};
