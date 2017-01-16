const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  "request": {
    "passengers": {
      "adultCount": { type: Number },
      "childCount": { type: Number },
    },
    "slice": [
      {
        "origin": { type: String },
        "destination": { type: String },
        "date": { type: String },
        "preferredCabin":{ type: String },
        "permittedDepartureTime": {
          "earliestTime": { type: String },
          "latestTime": { type: String }
        },
      },
      ],
    "maxPrice": { type: String },
    "solutins": { type: String },
    "refundable": boolean,
  }
}

{}
