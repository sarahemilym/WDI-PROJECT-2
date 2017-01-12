console.log('working');

$(init);

function init(){
  $.get('http://localhost:3000/api/resorts').done(function(data) {
    $.each(data, function(i, resort) {
      console.log(data);
    });
  });
}
