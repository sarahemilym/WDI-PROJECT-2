const Resort = require('../models/resort');
const rp = require('request-promise');

function resortsIndex(req, res){
  Resort.find((err, resorts) => {
    if (err) return res.status(500).send();
    return res.status(200).json(resorts);
  });
}

function resortsWeather(req, res){
  rp({
    uri: req.query.oWeatherUrl
  }).then(data => {
    return res.status(200).json(data);
  }).catch(err => {
    return console.log(err);
  });
}

function resortsForecast(req, res){
  rp({
    uri: req.query.oWeatherUrl
  }).then(data => {
    return res.status(200).json(data);
  }).catch(err => {
    return console.log(err);
  });
}

module.exports = {
  index: resortsIndex,
  weather: resortsWeather,
  forecast: resortsForecast
};
