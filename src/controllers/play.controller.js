const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../middleware/custom-error');
const Play = require('../models/play.model')

const getPlays = asyncWrapper(async (req, res) => {
  const plays = await Play.find({});
  res.status(200).json({ plays });
});

module.exports = { getPlays };
