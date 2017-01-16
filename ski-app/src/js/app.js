const googleMap = googleMap || {};
const google = google;

var markers = [];

googleMap.mapSetup = function() {

  const canvas = document.getElementById('map-canvas');

  const mapOptions = {
    zoom: 2,
    center: new google.maps.LatLng(51.490744,-0.140362),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(canvas, mapOptions);
  this.getCountries();
  this.getResorts();
};

googleMap.getCountries = function() {
  $.get('http://localhost:3000/api/resorts').done(data => {
    const codes = [];
    const resortValue = data.map(resort => resort.country);
    resortValue.some((code, idx) => {
      if(resortValue.indexOf(code) === idx) {
        codes.push(code);
      }
    });
    googleMap.createDropdown(codes);
    // console.log(codes);
  });
};


    // const countryCodes = {
    //   "38" : "England"
    // }
googleMap.createDropdown = function(codes) {
  $.each(codes, function(i, val) {
    $('.dropdown-menu').append(`<li><a href="#" class="filter" value="${val}">${val}</a></li>`);
  });
  $('.filter').on('click', googleMap.selectCountry);
};

googleMap.selectCountry = function(e) {
  if (e) e.preventDefault();
  var $country = parseInt(this.innerHTML);
  console.log('country edit', typeof($country), $country);
  // googleMap.getResorts($country);
  console.log('clicked', this.innerHTML);
  // var $country = this.value;
  googleMap.getResorts($country);
  // console.log($country);

};

googleMap.getResorts = function($country) {
  $.get('http://localhost:3000/api/resorts').done(data => {
    // console.log(data);
    if ($country){
      const filteredCountries = data.filter(d => d.country === $country);
      this.loopThroughResorts(filteredCountries);
    } else {
      this.loopThroughResorts(data);
    }
  });
};


googleMap.loopThroughResorts = function(data) {
  googleMap.deleteMarkers();
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
  markers.push(marker);
  this.addInWindowForResort(resort, marker);
};

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

googleMap.clearMarkers = function() {
  setMapOnAll(null);
};

googleMap.deleteMarkers = function() {
  googleMap.clearMarkers();
  markers = [];
  googleMap.map.setZoom(1);
};


googleMap.addInWindowForResort = function(resort, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    console.log('clicked', 'lat' + resort.lat, 'lng' + resort.lng);
    $.get(`http://api.openweathermap.org/data/2.5/weather?lat=${resort.lat}&lon=${resort.lng}&units=metric&APPID=17716dc84c929276085ec7322162e7f3`).done(function(data){
      // console.log(data);
      console.log(typeof googleMap.infoWindow, 'infowindow');
      if (typeof googleMap.infoWindow !== 'undefined') googleMap.infoWindow.close();
      this.infoWindow = new google.maps.InfoWindow({
        content: `<p>${resort.name}</p><p>${resort.region}</p><p>${resort.country}</p><p>Temperature is ${data.main.temp} ℃</p><p>Min temperature is ${data.main.temp_min} ℃</p><p>Max temperature is ${data.main.temp} ℃</p><p>Weather is ${data.weather[0].description}</p><p>Wind Speed is ${data.wind.speed}</p><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="icon"><input type="button" id="forecast"/><a href="#" id="flights">Find flights</a>`
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
  googleMap.findFlights();
};

    googleMap.findFlights = function() {
      $('.modal').on('click', '#search', (e) => {
        console.log('clicked');
          if (e) e.preventDefault();

        const $origin = $('#flight_origin').val().toString();
        const $destination = $('#flight_destination').val().toString();
        const $date = $('#flight_date').val().toString();
        const $passengers = parseInt($('#flight_passengers').val());
        console.log(typeof $origin, 'origin')
        console.log(typeof $destination, 'destination')
        console.log(typeof $date, 'date', $date)
        console.log(typeof $passengers, 'passengers')

        var FlightRequest = {
          'request': {
            'slice': [
              {
                'origin': $origin,
                'destination': $destination,
                'date': $date
              }
            ],
            'passengers': {
              'adultCount': $passengers
            },
            'solutions': 10,
            'refundable': false
        }
      };

      console.log(FlightRequest);

        $.ajax({
          type: 'POST',
         //Set up your request URL and API Key.
          url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBeNMXTnV9y9muXtJCm-5BlC5sG1YRsVA0',
          contentType: 'application/json', // Set Content-type: application/json
          dataType: 'json',
         // The query we want from Google QPX, This will be the variable we created in the beginning
          data: JSON.stringify(FlightRequest),
          success: function (data) {
          //Once we get the result you can either send it to console or use it anywhere you like.
            // console.log(JSON.stringify(data.trips.data.airport[0].name));
            console.log(JSON.stringify(data));
          },
          error: function(){
           //Error Handling for our request
            alert('Access to Google QPX Failed.');
          }
        });
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
