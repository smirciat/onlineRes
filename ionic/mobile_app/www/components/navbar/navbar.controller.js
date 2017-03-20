'use strict';

angular.module('tempApp')
  .controller('NavbarController', function ($location, Auth, $window) {
    this.menu = [{
      'title': 'Reservations','link': '/'},
      {'title':'Smokey Bay Main Site','link':'http://www.smokeybayair.com'},
      {'title':'See Bears!','link':'https://fareharbor.com/smokeybayair/items/'}
    ];
  
    this.isCollapsed = true;
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.window= $window;
  
  this.search = function(){
    if (this.$location.path()==='/searchName') this.window.location.href = "/searchName";
    else this.$location.path('/searchName');
  };

  this.isActive = function(route) {
    return route === this.$location.path();
  }
});
  