const SurveyResponse = require('../models/SurveyResponse');

/**
 * Submit survey response (Public)
 * POST /api/survey/submit
 */
exports.submitSurvey = async (req, res, next) => {
  try {
    const {
      formSlug = 'swachha-sarvekshana',
      formName = 'Swachha Sarvekshana',
      respondentName,
      villageName,
      respondentCategory,
      respondentPhone,
      surveyTeam,
      location,
      photoData,
      surveyDate,
      surveyTime,
      answers,
    } = req.body;

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const newResponse = await SurveyResponse.create({
      formSlug,
      formName,
      respondentName: respondentName || 'Anonymous',
      villageName: villageName || 'Not Specified',
      respondentCategory,
      respondentPhone,
      surveyTeam,
      location,
      photoData,
      surveyDate,
      surveyTime,
      answers: answers || {},
      ipAddress,
      userAgent,
    });

    res.status(201).json({
      success: true,
      message: 'Survey response recorded successfully. ಧನ್ಯವಾದಗಳು!',
      data: {
        id: newResponse._id,
        submittedAt: newResponse.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all survey responses (Admin)
 * GET /api/survey/responses
 */
exports.getSurveyResponses = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, village, search } = req.query;
    const query = {};

    if (village) {
      query.villageName = new RegExp(village, 'i');
    }

    if (search) {
      query.$or = [
        { respondentName: new RegExp(search, 'i') },
        { villageName: new RegExp(search, 'i') },
        { respondentPhone: new RegExp(search, 'i') },
      ];
    }

    const total = await SurveyResponse.countDocuments(query);
    const responses = await SurveyResponse.find(query)
      .select('-photoData') // exclude heavy photo data in list
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        responses,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get survey statistics summary
 * GET /api/survey/stats
 */
exports.getSurveyStats = async (req, res, next) => {
  try {
    const totalResponses = await SurveyResponse.countDocuments();
    const uniqueVillages = await SurveyResponse.distinct('villageName');
    
    // Aggregate by respondent category
    const categoryBreakdown = await SurveyResponse.aggregate([
      { $group: { _id: '$respondentCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalResponses,
        villagesCount: uniqueVillages.length,
        categoryBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single survey response detail
 * GET /api/survey/responses/:id
 */
exports.getSurveyById = async (req, res, next) => {
  try {
    const response = await SurveyResponse.findById(req.params.id);
    if (!response) {
      return res.status(404).json({
        success: false,
        message: 'Survey response not found',
      });
    }

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
