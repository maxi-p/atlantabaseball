const express = require('express');
const plays = require('./plays.routes');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/play',
    route: plays
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
