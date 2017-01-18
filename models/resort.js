const mongoose = require('mongoose');

const resortSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: String, required: true },
  country: { type: Number },
  lat: { type: String, required: true },
  lng: { type: String, required: true}
});

module.exports = mongoose.model('Resort', resortSchema);
