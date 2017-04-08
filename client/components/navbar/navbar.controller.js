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

  constructor($location, Auth, $window,$scope,appConfig,$http) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.hasRole = Auth.hasRole;
    this.getCurrentUser = Auth.getCurrentUser;
    this.window= $window;
    this.scope=$scope;
    this.pdfMenu = appConfig.pdfFiles;
    this.http=$http
  }
  
  search = function(){
    if (this.$location.path()==='/searchName') this.window.location.href = "/searchName";
    else this.$location.path('/searchName');
  };

  isActive = function(route){
    return route === this.$location.path();
  };
  
  isPdf = function(){
    return this.$location.path()==='/viewPdf';
  }
  
  setPdf = function(pdfName){
    this.http.get("/pdf?filename=" + pdfName, {
        responseType: 'arraybuffer'
    }).then(response=> {
        this.scope.pdf.data = new Uint8Array(response.data);
    });
  }
}

angular.module('tempApp')
  .controller('NavbarController', NavbarController);
  