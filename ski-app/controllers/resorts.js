const Resort = require('../models/resort');

function resortsIndex(req, res){
  Resort.find((err, resorts) => {
    if (err) return res.status(500).send();
    return res.status(200).json(resorts);
  });
}

module.exports = {
  index: resortsIndex
};
