const express = require('express');
const router = express.Router();
const brokersRoute = require('./brokers.routes');

const routes = [
  {
    path: '/',
    route: brokersRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
