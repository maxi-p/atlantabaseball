const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Play = require('../models/play.model');
require('dotenv').config();

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const day = date.getDay() + 1 < 10 ? `0${date.getDay() + 1}` : `${date.getDay() + 1}`;
  return `${month}/${day}/${date.getFullYear() - 2000}`;
};

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected...');
    populateDatabase();
  })
  .catch(err => console.error(err));

function populateDatabase() {
  const results = [];

  fs.createReadStream('./src/scripts/BattedBallData.csv')
    .pipe(csv())
    .on('data', (data) => {
      results.push({
        batterId: !isNaN(parseInt(data.BATTER_ID, 10)) ? parseInt(data.BATTER_ID, 10) : null,
        batter: data.BATTER || null,
        pitcherId: !isNaN(parseInt(data.PITCHER_ID, 10)) ? parseInt(data.PITCHER_ID, 10) : null,
        pitcher: data.PITCHER || null,
        gameDate: data.GAME_DATE ? formatDate(data.GAME_DATE) : null,
        launchAngle: !isNaN(parseFloat(data.LAUNCH_ANGLE, 10)) ? parseFloat(data.LAUNCH_ANGLE).toFixed(2) : null,
        exitSpeed: !isNaN(parseFloat(data.EXIT_SPEED)) ? parseFloat(data.EXIT_SPEED).toFixed(2) : null,
        exitDirection: !isNaN(parseFloat(data.EXIT_DIRECTION)) ? parseFloat(data.EXIT_DIRECTION).toFixed(2) : null,
        hitDistance: !isNaN(parseFloat(data.HIT_DISTANCE)) ? parseFloat(data.HIT_DISTANCE).toFixed(2) : null,
        hangTime: !isNaN(parseFloat(data.HANG_TIME)) ? parseFloat(data.HANG_TIME).toFixed(2) : null,
        hitSpinRate: !isNaN(parseFloat(data.HIT_SPIN_RATE)) ? parseFloat(data.HIT_SPIN_RATE).toFixed(2) : null,
        playOutcome: data.PLAY_OUTCOME || null,
        videoLink: data.VIDEO_LINK || null,
      });
    })
    .on('end', () => {
      console.log('trying insert');
      Play.insertMany(results)
        .then(() => {
          console.log('Data successfully inserted!');
          mongoose.connection.close();
        })
        .catch(err => console.error(err));
    });
}
