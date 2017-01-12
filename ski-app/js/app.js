console.log('working');

$(init);

function init(){
  const $API = $.get('http://localhost:3000/api/resorts');
  $API.done(display);
}

function display (data) {
  for (var i = 0; i < data.length; i++) {
    console.log(data[i]);
    // console.log(data[i].SkiArea.name);
    // console.log(data[i].Region[0].name);
    console.log(data[i].SkiArea.geo_lat + data[i].SkiArea.geo_lng);
    debugger
  }
  // console.log(data);
}
