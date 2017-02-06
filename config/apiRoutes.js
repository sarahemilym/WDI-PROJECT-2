const express = require('express');
const router = express.Router();

const resortsController = require('../controllers/resorts');
const authentications   = require('../controllers/authentications');
const users             = require('../controllers/users');


router.route('/register')
  .post(authentications.register);
router.route('/login')
  .post(authentications.login);

router.route('/users')
  .get(users.index);
router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .delete(users.delete);

router.route('/resorts')
  .get(resortsController.index);
router.route('/resortWeather')
  .get(resortsController.weather);
router.route('/resortWeather')
  .get(resortsController.forecast);

module.exports = router;
