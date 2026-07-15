const categoriesData = require('../data/categories.json');

function getAllCategories(req, res) {
  res.status(200).json({
    success: true,
    count: categoriesData.categories.length,
    data: categoriesData.categories
  });
}

function getCategoryById(req, res, next) {
  const { id } = req.params;
  const category = categoriesData.categories.find((c) => c.id === id);

  if (!category) {
    const error = new Error(`Category with id "${id}" not found`);
    error.statusCode = 404;
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: category
  });
}

function getKeywordsForInterests(req, res, next) {
  const { interests } = req.query;

  if (!interests) {
    const error = new Error('Query parameter "interests" is required (comma-separated category ids)');
    error.statusCode = 400;
    return next(error);
  }

  const requestedIds = interests.split(',').map((s) => s.trim().toLowerCase());
  const matched = categoriesData.categories.filter((c) => requestedIds.includes(c.id));

  const keywords = [...new Set(matched.flatMap((c) => c.keywords))];

  res.status(200).json({
    success: true,
    interests: requestedIds,
    matchedCategories: matched.map((c) => c.id),
    keywords
  });
}

module.exports = { getAllCategories, getCategoryById, getKeywordsForInterests };
