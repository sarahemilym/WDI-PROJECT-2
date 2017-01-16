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

googleMap.createDropdown = function(resort) {
  $('.dropdown-menu').append(`<li class="filter" value="${resort.country}"><a href="#">${resort.country}</a></li>`);
  var $country = $('.filter').val();
  if ($country.selected === true) {
    console.log($country);
  }

};

googleMap.getResorts = function(region) {
  $.get('http://localhost:3000/api/resorts').done(data => {
    // console.log(data);
    if (region){
      data = data.filter(function(resort){
        return resort.region === region;
      });
    }
    this.loopThroughResorts(data);
  });
};

googleMap.loopThroughResorts = function(data) {
  $.each(data, (i, resort) => {
    googleMap.createDropdown(resort);
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
      googleMap.openFlightModal();
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
  };


googleMap.openFlightModal = function() {
  $('#map-canvas').on('click', '#flights', (e) => {
    if (e) e.preventDefault();
    $('.modal-content').html(`
      <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h4 class="modal-title">Choose Flights</h4>
      </div>
      <div class="modal-body">
      <div class="form-group">
      <label for="project_title">Title</label>
      <input class="form-control" type="text" name="project[title]" id="project_title" placeholder="Title">
      </div>
      <div class="form-group">
      <label for="flight_origin">Origin</label>
      <input class="form-control" type="text" id="flight_origin" placeholder="Origin">
      </div>
      <div class="form-group">
      <label for="flight_destination">Destination</label>
      <input class="form-control" type="text" id="flight_destination" placeholder="Destination">
      </div>
      <div class="form-group">
      <label for="fligh_date">Travel Date</label>
      <input class="form-control" type="date" id="flight_date" placeholder="Travel Date yyyy-mm-dd">
      </div>
      <div class="form-group">
      <label for="flight_passengers">Number of Passengers</label>
      <input class="form-control" type="number" id="flight_passengers" placeholder="Number of passengers">
      </div>
      </div>
      <div class="modal-footer">
      <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      <button type="submit" class="btn btn-primary" id="search">Search</button>
      </div>
      </form>`);

    $('.modal').modal('show');
  });
  // googleMap.findFlights();
};

// googleMap.findFlights = function() {
//   $('#map-canvas').on('click', '#search', (e) => {
//   if (e) e.preventDefault();
//   const $origin = $('#flight_origin').val();
//   const $destination = $('#flight_destination').val();
//   var FlightRequest = {
//       'request': {
//         'slice': [
//           {
//             'origin': $origin,
//             'destination': $destination,
//             // 'date': '2017-02-11'
//           }
//         ],
//       //   'passengers': {
//       //     'adultCount': 1,
//       //     'infantInLapCount': 0,
//       //     'infantInSeatCount': 0,
//       //     'childCount': 0,
//       //     'seniorCount': 0
//       //   },
//       //   'solutions': 10,
//       //   'refundable': false
//     }
//   };
//     // googleMap.searchFlights();
// });
// };

// googleMap.searchFlights = function() {
//   $('main').on('click', '#search', (e) => {
//     if (e) e.preventDefault();
//     const formData = $(this).serialize();
//     console.log('clicked');
//   console.log($origin);
// });
// };
//     $.ajax({
//       type: 'POST',
//      //Set up your request URL and API Key.
//       url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBeNMXTnV9y9muXtJCm-5BlC5sG1YRsVA0',
//       contentType: 'application/json', // Set Content-type: application/json
//       dataType: 'json',
//      // The query we want from Google QPX, This will be the variable we created in the beginning
//       data: JSON.stringify(FlightRequest),
//       success: function (data) {
//       //Once we get the result you can either send it to console or use it anywhere you like.
//         console.log(JSON.stringify(data.trips.data.airport[0].name));
//       },
//       error: function(){
//        //Error Handling for our request
//         alert('Access to Google QPX Failed.');
//       }
//     });
//   });
// };

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
