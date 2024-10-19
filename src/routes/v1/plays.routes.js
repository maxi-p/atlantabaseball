const express = require('express');
const { playController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .get(playController.getPlays);

module.exports = router;
