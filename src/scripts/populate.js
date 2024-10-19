const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Play = require('../models/play.model');
require('dotenv').config();

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
        batterId: parseInt(data.BATTER_ID, 10) || null,
        batter: data.BATTER || null,
        pitcherId: parseInt(data.PITCHER_ID, 10) || null,
        pitcher: data.PITCHER || null,
        gameDate: data.GAME_DATE ? new Date(data.GAME_DATE) : null,
        launchAngle: parseFloat(data.LAUNCH_ANGLE) || null,
        exitSpeed: parseFloat(data.EXIT_SPEED) || null,
        exitDirection: parseFloat(data.EXIT_DIRECTION) || null,
        hitDistance: parseFloat(data.HIT_DISTANCE) || null,
        hangTime: parseFloat(data.HANG_TIME) || null,
        hitSpinRate: parseFloat(data.HIT_SPIN_RATE) || null,
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
