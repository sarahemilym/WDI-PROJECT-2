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
  this.getResorts();
};

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
    map: this.map
  });
  this.addInWindowForResort(resort, marker);
};




googleMap.addInWindowForResort = function(resort, marker) {
  google.maps.event.addListener(marker, 'click', () => {
    if (typeof this.infoWindow !== 'undefined') this.infoWindow.close();
    this.infoWindow = new google.maps.InfoWindow({
      content: `<p>${resort.name}</p>`
    });
    this.infoWindow.open(this.map, marker);
    this.map.setCenter(marker.getPosition());
    this.map.setZoom(5);
  });
};

$(googleMap.mapSetup.bind(googleMap));





const Auth = Auth || {};

Auth.init = function(){
  this.apiUrl = 'http://localhost:3000/api';
  this.$main  = $('main');
  $('.register').on('click', this.register.bind(this));
  $('.login').on('click', this.login.bind(this));
  $('.logout').on('click', this.logout.bind(this));
  this.$main.on('submit', 'form', this.handleForm);
};

Auth.loggedInState = function(){
  $('.loggedIn').show();
  $('.loggedOut').hide();
};

Auth.loggedOutState = function(){
  $('.loggedOut').show();
  $('.loggedShow').hide();
};

Auth.register = function(e){
  if (e) e.preventDefault();
  this.$main.html(`
    <h2>Register</h2>
    <form method="post" action="/register">
    <div class="form-group">
    <input class="form-control" type="text" name="user[username]" placeholder="Username">
    </div>
    <div class="form-group">
    <input class="form-control" type="email" name="user[email]" placeholder="Email">
    </div>
    <div class="form-group">
    <input class="form-control" type="password" name="user[password]" placeholder="Password">
    </div>
    <div class="form-group">
    <input class="form-control" type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
    </div>
    <input class="btn btn-primary" type="submit" value="Register">
    </form>
    `);
  };

  // Auth.register = function(e){
  //   if (e) e.preventDefault();
  //   $('.modal-content').html(`
  //       <form method="post" action="/register" class="usersCreate">
  //         <div class="modal-header">
  //           <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  //           <h4 class="modal-title">Register</h4>
  //         </div>
  //         <div class="modal-body">
  //           <div class="form-group">
  //             <label for="user_name">Username</label>
  //             <input class="form-control" type="text" name="user[username]" id="user_username" placeholder="Username">
  //           </div>
  //           <div class="form-group">
  //             <label for="user_email">Email</label>
  //             <input class="form-control" type="email" name="user[user_email]" id="user_email" placeholder="Email">
  //           </div>
  //           <div class="form-group">
  //             <label for="user_password">Password</label>
  //             <input class="form-control" type="password" name="user[password]" id="user_password" placeholder="Password">
  //           </div>
  //           <div class="form-group">
  //             <label for="user_passwordConfirmation">Confirm Password</label>
  //             <input class="form-control" type="password" name="user[passwordConfirmation]" id="user_passwordConfirmation" placeholder="Confirm Password">
  //           </div>
  //         </div>
  //         <div class="modal-footer">
  //           <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
  //           <button type="submit" class="btn btn-primary" value="Register">Register</button>
  //         </div>
  //       </form>`);
  //
  //   $('.modal').modal('show');
  // };

  Auth.login = function(e) {
    if (e) e.preventDefault;
    this.$main.html(`
      <h2>Login</h2>
      <form method="post" action="/login">
      <div class="form-group">
      <input class="form-control" type="email" name="email" placeholder="Email">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <input class="btn btn-primary" type="submit" value="Login">
      </form>
      `);
    };

    Auth.logout = function(e){
      if (e) e.preventDefault;
      this.removeToken();
      this.loggedOutState();
    };

    Auth.handleForm = function(e){
      if (e) e.preventDefault();

      const url    = `${Auth.apiUrl}${$(this).attr('action')}`;
      const method = $(this).attr('method');
      const data   = $(this).serialize();

      return Auth.ajaxRequest(url, method, data);
      // return Auth.ajaxRequest(url, method, data, data => {
      //   if (data.token) Auth.setToken(data.token);
      // Auth.loggedInState();
      // });
    };

    // Auth.ajaxRequest = function(url, method, data, callback)
    Auth.ajaxRequest = function(url, method, data, callback){
      return $.ajax({
        url,
        method,
        data
        // beforeSend: this.setRequestHeader.bind(this)
      })
      .done(callback)
      .fail(data => {
        console.log(data);
      });
    };

    Auth.setRequestHeader = function(xhr) {
      return xhr.setRequestHeader('Authorization', `Bearer ${this.getToken()}`);
    };

    Auth.setToken = function() {
      return window.localStorage.getItem('token');
    };

    Auth.removeToken = function() {
      return window.localStorage.clear();
    };


    $(Auth.init.bind(Auth));
