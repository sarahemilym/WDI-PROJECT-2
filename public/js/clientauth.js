"use strict";var Auth=Auth||{};Auth.init=function(){this.apiUrl="http://localhost:3000/api",console.log(this.apiUrl),this.$main=$("main"),console.log(Auth.currentUser),$(".register").on("click",this.register.bind(this)),$(".login").on("click",this.login.bind(this)),$(".logout").on("click",this.logout.bind(this)),$(".usersShow").on("click",this.usersShow.bind(this)),this.$main.on("submit","form",this.handleForm),$(".modal").on("submit","form",this.handleForm),$("main").on("click","#close",this.closeProfile),this.getToken()?this.loggedInState():this.loggedOutState()},Auth.loggedInState=function(){$(".loggedIn").show(),$(".loggedOut").hide(),Auth.setCurrentUser()},Auth.loggedOutState=function(){$(".loggedOut").show(),$(".loggedIn").hide(),this.login()},Auth.setCurrentUser=function(){if(Auth.getToken()){var t=Auth.getToken(),e=t.split(".")[1],n=JSON.parse(window.atob(e)),o=n.user;Auth.ajaxRequest("http://localhost:3000/api/users/"+o,"GET",null,function(t){Auth.currentUser=t})}},Auth.register=function(t){t&&t.preventDefault(),$(".modal-content").html('\n    <form method="post" action="/register">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Register</h4>\n      </div>\n      <div class="modal-body">\n        <div class="form-group">\n          <label for="user_username">Username</label>\n          <input class="form-control" type="text" name="user[username]" id="user_username" placeholder="Username">\n        </div>\n        <div class="form-group">\n          <label for="user_email">Email</label>\n          <input class="form-control" type="email" name="user[email]" id="user_email" placeholder="Email">\n        </div>\n        <div class="form-group">\n          <label for="user_password">Password</label>\n          <input class="form-control" type="password" name="user[password]" id="user_password" placeholder="Password">\n        </div>\n        <div class="form-group">\n          <label for="user_passwordConfirmation">Confirm Password</label>\n          <input class="form-control" type="password" name="user[passwordConfirmation]" id="user_passwordConfirmation" placeholder="Confirm Password">\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="submit" class="btn btn-primary register" value="Register">Register</button>\n        <button type="button" class="btn btn-default close-register" data-dismiss="modal">Close</button>\n      </div>\n    </form>'),$(".modal").modal("show")},Auth.login=function(t){t&&t.preventDefault(),this.$main.html('\n      <div class="login">\n      <form method="post" action="/login" class="loggedOut">\n      <div class="form-group">\n      <input class="form-control" type="email" name="email" placeholder="Email">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="password" placeholder="Password">\n      </div>\n      <input class="btn btn-primary login" type="submit" value="Login">\n      </form>\n      </div>\n      <div class="jumbotron loggedOut">\n      </div>')},Auth.logout=function(t){t&&t.preventDefault(),this.removeToken(),this.loggedOutState()},Auth.handleForm=function(t){t&&t.preventDefault();var e=""+Auth.apiUrl+$(this).attr("action"),n=$(this).attr("method"),o=$(this).serialize();return $(".modal").modal("hide"),Auth.ajaxRequest(e,n,o,function(t){t.token&&Auth.setToken(t.token),Auth.loggedInState()})},Auth.usersShow=function(t){t&&t.preventDefault(),$.ajax({method:"GET",url:Auth.apiUrl+"/users/"+Auth.currentUser._id,beforeSend:this.setRequestHeader.bind(this)}).done(function(t){$("main").html('\n          <div class="user">\n          <div class="user-tile">\n          <h2 id="username">'+Auth.currentUser.username+"</h2>\n          <p>"+Auth.currentUser.email+'</p>\n          <ul class="list-inline">\n          <li><a id="close" href="#">Close</a></li>\n          </ul>\n          </div>\n          </div>')})},Auth.closeProfile=function(){$("main").hide()},Auth.ajaxRequest=function(t,e,n,o){return $.ajax({url:t,method:e,data:n,beforeSend:this.setRequestHeader.bind(this)}).done(o).fail(function(t){console.log(t)})},Auth.setRequestHeader=function(t){return t.setRequestHeader("Authorization","Bearer "+this.getToken())},Auth.setToken=function(t){return window.localStorage.setItem("token",t)},Auth.getToken=function(){return window.localStorage.getItem("token")},Auth.removeToken=function(){return window.localStorage.clear()},$(Auth.init.bind(Auth));