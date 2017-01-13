const rp       = require('request-promise');
const Resort   = require('../models/resort');
const mongoose = require('mongoose');
const config     = require('../config/config');

mongoose.connect(config.db);

Resort.collection.drop();

rp('https://skimap.org/SkiAreas/index.json')
  .then(htmlString => {
    const json = JSON.parse(htmlString);
    console.log(`${json.length} FOUND`);
    json.forEach((result, i) => {
      try {
        console.log(`${i+1}. Creating ${result.SkiArea.name}`);
        Resort.create({
          name: result.SkiArea.name,
          region: result.Region[0].name,
          lat: result.SkiArea.geo_lat,
          lng: result.SkiArea.geo_lng
        });
      } catch(e) {
        console.log('Incorrect fields');
      }
    });
    console.log('FINISHED');
  })
  .catch(console.log);
