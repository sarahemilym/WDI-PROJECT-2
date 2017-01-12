console.log('working');

$(init);

function init(){
  $.get('http://localhost:3000/api/resorts').done(data => {
    data.forEach(resort => {
      $.get(`http://localhost:3000/api/resorts/${id}`).done(data => {
        console.log(data);
      });
    });
  });
}
