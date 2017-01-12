const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Resort = require('./models/resort');
const rp = require('request-promise');
const port = process.env.PORT || 3000; //move to config/config

const app = express();

const databaseUrl = process.env.PORT || 'mongodb://localhost:27017/skiing-app';
mongoose.connect(databaseUrl); //move these to config/config/

app.use(morgan('dev'));

app.get('/api/resorts', (req, res) => {
  return rp('https://skimap.org/SkiAreas/index.json')
  .then(htmlString => {
    const json = JSON.parse(htmlString);
    return res.status(200).json(json);
  })
  .catch(err => {
    return res.status(500).json(err);
  });
});

// app.get('/api/resorts', (req, res) => {
//   Resort
//   .find({})
//   .then(resorts => {
//     return res.status(200).json(resorts);
//   })
//   .catch(err => {
//     return res.status(500).json(err);
//   });
// });

app.get('/*', (req, res) => {
  return res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, () => console.log(`Express is alive and listening on port: ${port}`));
