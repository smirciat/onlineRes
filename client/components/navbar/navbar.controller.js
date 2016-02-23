'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Reservations',
    'link': '/'},
    
    {'title':'Back to Smokey Bay Main Site','link':'http://www.smokeybayair.com'}
  ];

  isCollapsed = true;
  //end-non-standard

  constructor($location, Auth) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }

  isActive(route) {
    return route === this.$location.path();
  }
}

angular.module('tempApp')
  .controller('NavbarController', NavbarController);
