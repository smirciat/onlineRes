'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Reservations',
    'link': '/'},
    
    {'title':'Smokey Bay Main Site','link':'http://www.smokeybayair.com'},
    {'title':'See Bears!','link':'https://fareharbor.com/smokeybayair/items/'}
  ];

  isCollapsed = true;
  //end-non-standard

  constructor($location, Auth, $window) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.window= $window;
  }
  
  search = function(){
    if (this.$location.path()==='/searchName') this.window.location.href = "/searchName";
    else this.$location.path('/searchName');
  };

  isActive(route) {
    return route === this.$location.path();
  }
}

angular.module('tempApp')
  .controller('NavbarController', NavbarController);
  