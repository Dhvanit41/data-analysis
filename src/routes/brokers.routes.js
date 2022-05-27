const express = require('express');
const router = express.Router();

const brokersController = require('../controllers/brokers.controller');

router.get('/healthcheck', brokersController.healthcheck);

router.get('/', [], brokersController.getTrend);

module.exports = router;
