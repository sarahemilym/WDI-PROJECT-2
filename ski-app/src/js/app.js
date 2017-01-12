const googleMap = googleMap || {};
const google = google;

googleMap.mapSetup = function() {

  const canvas = document.getElementById('map-canvas');

  const mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(51.490744,-0.140362),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(canvas, mapOptions);
  this.getResorts();
};

googleMap.getResorts = function() {
  $.get('http://localhost:3000/resorts').done(this.loopThroughResorts);
};

googleMap.loopThroughResorts = function(resorts) {
  console.log(resorts);
};

$(googleMap.mapSetup.bind(googleMap));
