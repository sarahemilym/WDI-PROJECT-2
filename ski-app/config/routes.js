const express = require('express');
const router = express.Router();

const resortsController = require('../controllers/resorts');
const staticsController = require('../controllers/statics');

router.route('/')
.get(staticsController.home);

router.route('/resorts')
.get(resortsController.index);

module.exports = router;
