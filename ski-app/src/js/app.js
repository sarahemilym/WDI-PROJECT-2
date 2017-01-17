const googleMap = googleMap || {};
const google = google;

var markers = [];

googleMap.mapSetup = function() {
  const canvas = document.getElementById('map-canvas');

  const mapOptions = {
    zoom: 2,
    styles: [
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#90a8b3"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "color": "#fefefe"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
            {
                "weight": "0.01"
            },
            {
                "lightness": "24"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#50707f"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "weight": "1"
            }
        ]
    }
],
    center: new google.maps.LatLng(51.490744,-0.140362),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(canvas, mapOptions);
  googleMap.openFlightForm();
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
    console.log(codes);
  });
};


    // const countryCodes = {
    //   '38' : 'England"
    // }
const countryCodes = {
  '31': 'Canada',
  '184': 'USA',
  '10': 'Austria',
  '60': 'France',
  '183': 'UK',
  '167': 'Switzerland',
  '152': 'Serbia',
  '35': 'Chile',
  '125': 'New Zealand',
  '76': 'India',
  '78': 'Iran',
  '160': 'South Africa',
  '9': 'Australia',
  '7': 'Argentina',
  '36': 'China',
  '8': 'Armenia',
  '63': 'Georgia',
  '81': 'Lebanon',
  '86': 'Kazakhstan',
  '90': 'South Korea',
  '131': 'Pakistan',
  '84': 'Japan',
  '17': 'Belgium',
  '4': 'Andorra',
  '16': 'Belarus',
  '22': 'Bosnia & Herzegovina',
  '26': 'Bulgaria',
  '43': 'Croatia',
  '45': 'Cyprus',
  '46': 'Czech Republic',
  '56': 'Estonia',
  '102': 'Macedonia',
  '129': 'Norway',
  '138': 'Poland',
  '141': 'Romania',
  '142': 'Russia',
  '156': 'Slovakia',
  '157': 'Slovenia',
  '161': 'Spain',
  '59': 'Finland',
  '166': 'Sweden',
  '177': 'Turkey',
  '181': 'Ukraine',
  '82': 'Italy',
  '66': 'Greece',
  '75': 'Iceland'
};

googleMap.createDropdown = function(codes) {
  $.each(codes, function(i, val) {
    console.log('countryCodesVal', countryCodes[val]); // this changes it to the word
    // console.log(`countryCodes${val}`) - this is the number
    $('.dropdown-menu').append(`<li><a href="#" class="filter" value="${val}" id=${val}>${countryCodes[val]}</a></li>`);
  });
  $('.filter').on('click', googleMap.selectCountry);
};

googleMap.selectCountry = function(e) {
  // console.log($(this).attr('value'), 'filter value');
  if (e) e.preventDefault();
  var $country = parseInt($(this).attr('value'));
  console.log('country edit', typeof($country), $country);
  // googleMap.getResorts($country);
  console.log('clicked', this.innerHTML);
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
  const icon = {
    url: 'images/skiing.png',
    scaledSize: new google.maps.Size(20, 20),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(0, 0)
};
  const latlng = new google.maps.LatLng(resort.lat, resort.lng);
  const marker = new google.maps.Marker({
    position: latlng,
    region: resort.region,
    icon: icon,
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
    if (typeof googleMap.infoWindow !== 'undefined') googleMap.infoWindow.close();
    // console.log('clicked', 'lat' + resort.lat, 'lng' + resort.lng);
    $.get(`http://api.openweathermap.org/data/2.5/weather?lat=${resort.lat}&lon=${resort.lng}&units=metric&APPID=17716dc84c929276085ec7322162e7f3`).done(function(data){
      const currentMain = Math.round(data.main.temp);
      const currentMin = Math.round(data.main.temp_min);
      const currentMax = Math.round(data.main.temp_max);
      // console.log(data);
      // console.log(typeof googleMap.infoWindow, 'infowindow');
      googleMap.infoWindow = new google.maps.InfoWindow({
        content: `<div class="weather-infoWindow"><h4>${resort.name}</h4><h4 class="modal-title">Current Weather</h4>
        <div class="weather-container">
        <div class="current-weather">
        <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="icon">
        <p>${currentMain} ℃</p>
        <br>
        <h6>${data.weather[0].description}</h6>
          </div>
        <div class="minmax-temp">
        <h6>Min</h6><h6>Max</h6>
        <br>
        <p>${currentMin} ℃</p><p>${currentMax} ℃</p>
        </div>
        </div>
        <button class="btn btn-primary" id="forecast">Forecast</button>
        </div>
        </div>`
      });
      googleMap.addForecast(resort);
      googleMap.addMaps();
      googleMap.infoWindow.open(this.map, marker);
      googleMap.map.setCenter(marker.getPosition());
      googleMap.map.setZoom(5);
    });
  });
};

//      <input type="button" id="forecast">3 Day Forecast</input>
googleMap.addMaps = function() {
  $('#map-canvas').on('click', '#flights', (e) => {
    if (e) e.preventDefault();
    console.log('clicked');
    $.get('http://localhost:3000/api/skimaps').done(data => {
      console.log(data);
    });
  });
};

googleMap.addForecast = function(resort) {
  $('#map-canvas').on('click', '#forecast', (e) => {
    if (e) e.preventDefault();
    $.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${resort.lat}&lon=${resort.lng}&units=metric&APPID=17716dc84c929276085ec7322162e7f3`).done(function(data) {

      const mainTemp = Math.round(data.list[7].main.temp);
      const minTemp  = Math.round(data.list[7].main.temp_min);
      const maxTemp  = Math.round(data.list[7].main.temp_max);

      const mainTemp2 = Math.round(data.list[15].main.temp);
      const minTemp2  = Math.round(data.list[15].main.temp_min);
      const maxTemp2  = Math.round(data.list[15].main.temp_max);

      const mainTemp3 = Math.round(data.list[23].main.temp);
      const minTemp3  = Math.round(data.list[23].main.temp_min);
      const maxTemp3  = Math.round(data.list[23].main.temp_max);

      const date = moment(`${data.list[15].dt_txt}`).format('ddd Do MMM');
      const date2 = moment(`${data.list[23].dt_txt}`).format('ddd Do MMM');

      $('.modal-content').html(`
        <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4>${resort.name}</h4>
        <h4 class="modal-title">3 Day Forecast</h4>
        </div>
        <div class="modal-body">
        <div class="col-1">
        <h4>Tomorrow</h4>
        <div class="weather-tomorrow">
        <div class="forecast-weather">
        <img src="http://openweathermap.org/img/w/${data.list[7].weather[0].icon}.png" alt="icon">
        <p>${mainTemp} ℃</p>
        <br>
        <h6>${data.list[7].weather[0].description}</h6>
        </div>
        <div class="forecast-minmax"><h6>Min</h6><h6>Max</h6>
        <br>
        <p>${minTemp} ℃</p><p>${maxTemp} ℃</p>
        </div
        </div>
        </div>
        </div>

        <div class="col-2">
        <h4>${date}</h4>
        <div class="weather-tomorrow">
        <div class="forecast-weather">
        <img src="http://openweathermap.org/img/w/${data.list[15].weather[0].icon}.png" alt="icon">
        <p>${mainTemp2} ℃</p>
        <br>
        <h6>${data.list[15].weather[0].description}</h6>
        </div>
        <div class="forecast-minmax"><h6>Min</h6><h6>Max</h6>
        <br>
        <p>${minTemp2} ℃</p><p>${maxTemp2} ℃</p>
        </div
        </div>
        </div>
        </div>

        <div class="col-3">
        <h4>${date2}</h4>
        <div class="weather-tomorrow">
        <div class="forecast-weather">
        <img src="http://openweathermap.org/img/w/${data.list[23].weather[0].icon}.png" alt="icon">
        <p>${mainTemp3} ℃</p>
        <br>
        <h6>${data.list[23].weather[0].description}</h6>
        </div>
        <div class="forecast-minmax"><h6>Min</h6><h6>Max</h6>
        <br>
        <p>${minTemp3} ℃</p><p>${maxTemp3} ℃</p>
        </div
        </div>
        </div>
        </div>

        <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        </div>`);
      $('.modal').modal('show');
    });
  });
};


googleMap.openFlightForm = function() {
  $('nav').on('click', '.flights', (e) => {
    if (e) e.preventDefault();
    $('main').html(`
      <div class="flightForm">
      <h2 class="loggedIn">Find Flights</h2>
      <form class="form-inline">
        <div class="form-group">
        <label for="flight_origin">Flying from?</label>
        <input class="form-control" type="text" id="flight_origin" placeholder="Origin">
          </div>
        <div class="form-group">
        <label for="flight_destination">Flying to?</label>
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
          <div id="checkbox">
          <label for="cb1">Nonstop?</label>
        <input type="checkbox" id="cb" onclick="googleMap.checkbox()" />
        </div>
        <div class="form-footer flight">
        <button type="button" class="btn btn-default" data-dismiss="modal" id="close">Close</button>
        <button type="submit" class="btn btn-primary" id="search">Search</button>
        </div>
        </form>
        </div>`);
  });
  googleMap.findFlights();
};

googleMap.checkbox = function() {
  console.log('clicked');
  if ($('#cb').is(':checked')) {
    console.log('checked');
    $('#cb').val(0);
  } else {
      $('#cb').val('off');
  }
  console.log($('#cb').val());
};

googleMap.findFlights = function() {
  $('main').on('click', '#close', googleMap.hideFlightForm);
  $('main').on('click', '#search', (e) => {
    googleMap.hideFlightForm();
    console.log('clicked');
    if (e) e.preventDefault();

    const $origin = $('#flight_origin').val().toString();
    const $destination = $('#flight_destination').val().toString();
    const $date = $('#flight_date').val().toString();
    const $passengers = parseInt($('#flight_passengers').val());
    const $stops = parseInt($('#cb').val());

    var FlightRequest = {
      'request': {
        'slice': [
          {
            'origin': $origin,
            'destination': $destination,
            'date': $date,
            'maxStops': $stops
          }
        ],
        'passengers': {
          'adultCount': $passengers
        },
        'solutions': 3,
        'refundable': false
      }
    };

    console.log(FlightRequest);

    $.ajax({
      type: 'POST',
      url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBeNMXTnV9y9muXtJCm-5BlC5sG1YRsVA0',
      contentType: 'application/json', // Set Content-type: application/json
      dataType: 'json',
      data: JSON.stringify(FlightRequest),
      success: function (data) {
        console.log(JSON.stringify(data));
        googleMap.displayFlights(data);
      },
      error: function(){
        alert('Access to Google QPX Failed.');
      }
    });
  });
};

googleMap.displayFlights = function(data) {
  $('.modal-content').html(`
    <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    <h4 class="modal-title">Flights</h4>
    </div>
    <div class="modal-body">
    <p>Sale Total, ${data.trips.tripOption[0].saleTotal}</p>
    <p>Total Duration, ${data.trips.tripOption[0].slice[0].segment[0].duration}</p>
    <p>Class, ${data.trips.tripOption[0].slice[0].segment[0].cabin}</p>
    <p>Arrival Time, ${data.trips.tripOption[0].slice[0].segment[0].leg[0].arrivalTime}</p>
    <p>Departure Time, ${data.trips.tripOption[0].slice[0].segment[0].leg[0].departureTime}</p>
    <p>Origin, ${data.trips.tripOption[0].slice[0].segment[0].leg[0].origin}</p>
    <p>Destination, ${data.trips.tripOption[0].slice[0].segment[0].leg[0].destination}</p>
    <p>Flight Time, ${data.trips.tripOption[0].slice[0].segment[0].leg[0].duration}</p>

    <br>
    <p>Sale Total, ${data.trips.tripOption[1].saleTotal}</p>
    <p>Total Duration, ${data.trips.tripOption[1].slice[0].segment[0].duration}</p>
    <p>Class, ${data.trips.tripOption[1].slice[0].segment[0].cabin}</p>
    <p>Arrival Time, ${data.trips.tripOption[1].slice[0].segment[0].leg[0].arrivalTime}</p>
    <p>Departure Time, ${data.trips.tripOption[1].slice[0].segment[0].leg[0].departureTime}</p>
    <p>Origin, ${data.trips.tripOption[1].slice[0].segment[0].leg[0].origin}</p>
    <p>Destination, ${data.trips.tripOption[1].slice[0].segment[0].leg[0].destination}</p>
    <p>Flight Time, ${data.trips.tripOption[1].slice[0].segment[0].leg[0].duration}</p>

    <br>
    <p>Sale Total, ${data.trips.tripOption[2].saleTotal}</p>
    <p>Total Duration, ${data.trips.tripOption[2].slice[0].segment[0].duration}</p>
    <p>Class, ${data.trips.tripOption[2].slice[0].segment[0].cabin}</p>
    <p>Arrival Time, ${data.trips.tripOption[2].slice[0].segment[0].leg[0].arrivalTime}</p>
    <p>Departure Time, ${data.trips.tripOption[2].slice[0].segment[0].leg[0].departureTime}</p>
    <p>Origin, ${data.trips.tripOption[2].slice[0].segment[0].leg[0].origin}</p>
    <p>Destination, ${data.trips.tripOption[2].slice[0].segment[0].leg[0].destination}</p>
    <p>Flight Time, ${data.trips.tripOption[2].slice[0].segment[0].leg[0].duration}</p>

    </div>
    <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    </div>`);
  $('.modal').modal('show');
};

googleMap.hideFlightForm = function(e) {
  if (e) e.preventDefault();
  $('.flightForm').hide();
};

$(googleMap.mapSetup.bind(googleMap));
