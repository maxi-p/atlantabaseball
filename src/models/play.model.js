const mongoose = require('mongoose');

const playSchema = new mongoose.Schema({
  batterId: { type: Number },
  batter: { type: String },
  pitcherId: { type: Number },
  pitcher: { type: String },
  gameDate: { type: Date },
  launchAngle: { type: Number },
  exitSpeed: { type: Number },
  exitDirection: { type: Number },
  hitDistance: { type: Number },
  hangTime: { type: Number },
  hitSpinRate: { type: Number },
  playOutcome: { type: String },
  videoLink: { type: String }
});

module.exports = mongoose.model('Play', playSchema);
