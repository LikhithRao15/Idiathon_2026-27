const mongoose = require('mongoose');

/**
 * Generate a unique team identifier in the format: TEAM-<YEAR>-<000>
 * Example: TEAM-2026-001
 */
const generateTeamId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `TEAM-${currentYear}-`;

  try {
    const Team = mongoose.model('Team');
    // Count teams created this year with the same prefix
    const count = await Team.countDocuments({
      teamId: { $regex: `^${prefix}` },
    });

    let nextNumber = count + 1;
    let candidateId = `${prefix}${String(nextNumber).padStart(3, '0')}`;

    // Ensure uniqueness
    let exists = await Team.findOne({ teamId: candidateId });
    while (exists) {
      nextNumber += 1;
      candidateId = `${prefix}${String(nextNumber).padStart(3, '0')}`;
      exists = await Team.findOne({ teamId: candidateId });
    }

    return candidateId;
  } catch (error) {
    // Fallback in case model is not yet compiled or during testing
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `${prefix}${randomSuffix}`;
  }
};

module.exports = generateTeamId;
