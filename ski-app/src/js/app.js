const googleMap = googleMap || {};
const google = google;

googleMap.mapSetup = function() {

  const canvas = document.getElementById('map-canvas');

  const mapOptions = {
    zoom: 2,
    center: new google.maps.LatLng(51.490744,-0.140362),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(canvas, mapOptions);
  // this.createDropdown();
  this.getResorts();
};

  // googleMap.createDropdown = function() {
  //   $('<select></select>').append('main');
  //   Resort.forEach
  // }
googleMap.getResorts = function() {
  $.get('http://localhost:3000/api/resorts').done(this.loopThroughResorts);
};

googleMap.loopThroughResorts = function(data) {
  $.each(data, (i, resort) => {
    googleMap.createMarkerForResort(resort);
  });
};

googleMap.createMarkerForResort = function(resort) {
  const latlng = new google.maps.LatLng(resort.lat, resort.lng);
  const marker = new google.maps.Marker({
    position: latlng,
    region: resort.region,
    map: this.map
  });
    // $('select').on('click', this.addFilter);
        // console.log(region)
    // this.addWeather(resort);
  this.addInWindowForResort(resort, marker);


};

  // googleMap.addFilter = function(marker){
  //   console.log('clicked');
    // if (marker.region === $('region').val()) {
    //   marker.setVisible(true);
    // } else {
    //   marker.setVisible(false);
    // }
  // };


// googleMap.addInWindowForResort = function(resort, marker) {
//   $.get(`http://api.openweathermap.org/data/2.5/weather?lat=${resort.lat}&lon=${resort.lng}&units=metric&APPID=17716dc84c929276085ec7322162e7f3`).done(function(data){
//   google.maps.event.addListener(marker, 'click', () => {
//     if (typeof googleMap.infoWindow !== 'undefined') googleMap.infoWindow.close();
//     console.log(typeof googleMap.infoWindow) //does't know what this.infoWindow is gets undefined even when open
//     this.infoWindow = new google.maps.InfoWindow({
//       content: `<p>${resort.name}</p><p>${resort.region}</p><p>Temperature is ${data.main.temp} ℃</p><p>Min temperature is ${data.main.temp_min} ℃</p><p>Max temperature is ${data.main.temp} ℃</p><p>Weather is ${data.weather[0].description}</p><p>Wind Speed is ${data.wind.speed}</p><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="icon"><a href="#" class="forecast">Click for forecast</a>`
//     });
//     googleMap.addForecast();
//     this.infoWindow.open(this.map, marker);
//     googleMap.map.setCenter(marker.getPosition());
//     googleMap.map.setZoom(5);
// });
//   });
// };

//for practise when 429

googleMap.addInWindowForResort = function(resort, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    console.log('clicked', 'lat' + resort.lat, 'lng' + resort.lng);
    $.get(`http://api.openweathermap.org/data/2.5/weather?lat=${resort.lat}&lon=${resort.lng}&units=metric&APPID=17716dc84c929276085ec7322162e7f3`).done(function(data){
      console.log(data);
      if (typeof googleMap.infoWindow !== 'undefined') googleMap.infoWindow.close();
      console.log(typeof googleMap.infoWindow); //does't know what this.infoWindow is gets undefined even when open
      this.infoWindow = new google.maps.InfoWindow({
        content: `<p>${resort.name}</p><p>${resort.region}</p><p>Temperature is ${data.main.temp} ℃</p><p>Min temperature is ${data.main.temp_min} ℃</p><p>Max temperature is ${data.main.temp} ℃</p><p>Weather is ${data.weather[0].description}</p><p>Wind Speed is ${data.wind.speed}</p><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="icon"><input type="button" id="forecast"/><a href="#" id="flights">Find flights</a>`
      });
      googleMap.addForecast(resort);
      googleMap.findFlights();
      this.infoWindow.open(this.map, marker);
      googleMap.map.setCenter(marker.getPosition());
      googleMap.map.setZoom(5);
    });
  });
};

googleMap.addForecast = function(resort) {
  $('#map-canvas').on('click', '#forecast', () => {
    $.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${resort.lat}&lon=${resort.lng}&units=metric&APPID=17716dc84c929276085ec7322162e7f3`).done(function(data) {
        console.log(data.list[15].dt_txt);
            $('.modal-content').html(`
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Forecast</h4>
              </div>
              <div class="modal-body">
                <p>${data.list[7].dt_txt}</p>
                <p>Average Temperature: ${data.list[7].main.temp} ℃</p>
                <p>Min Temperature: ${data.list[7].main.temp_min} ℃</p>
                <p>Max Temperature: ${data.list[7].main.temp_max} ℃</p>
                <p>Weather Main: ${data.list[7].weather[0].main}</p>
                <p>Weather Description: ${data.list[7].weather[0].description}</p>
                <p>Wind Speed: ${data.list[7].wind.speed} meters per second</p>
                <img src="http://openweathermap.org/img/w/${data.list[7].weather[0].icon}.png" alt="icon">

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
              </div>`);
        $('.modal').modal('show');
      });
      });
  // });
};

googleMap.findFlights = function() {
  $('#map-canvas').on('click', '#flights', (e) => {
  if (e) e.preventDefault();
});
};


//   $.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${resort.lat}&lon=${resort.lng}&units=metric&APPID=17716dc84c929276085ec7322162e7f3`).done(function(data) {
//     console.log(data);
//   });
// };
//     $('.modal-content').html(`
//       <div class='modal-header'>
//         <button type='button' class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//         <h4 class="modal-title">Forecast</h4>
//       </div>
//       <div class="modal-body">
//         <p>Forecast will go here</p>
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
//       </div>`);
// $('.modal').modal('show');
  // }


$(googleMap.mapSetup.bind(googleMap));
