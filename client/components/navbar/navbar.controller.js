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

  constructor($location, Auth, $window,$scope,appConfig,$http,$sce) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.hasRole = Auth.hasRole;
    this.getCurrentUser = Auth.getCurrentUser;
    this.window= $window;
    this.scope=$scope;
    this.pdfMenu = appConfig.pdfFiles;
    this.http=$http
    this.sce=$sce;
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
    this.scope.pdf.loading=true;
    this.http({ url: "/pdf?filename=" + pdfName, 
      method: "GET", 
      headers: { 'Accept': 'application/pdf' }, 
      responseType: 'arraybuffer' })
    .then(response=> {
      var result = new Uint8Array(response.data);
      var currentBlob = new Blob([result], {type: 'application/pdf'});
      var url = URL.createObjectURL(currentBlob);// + '#toolbar=0';
      this.scope.pdf.pdfUrl = this.sce.trustAsResourceUrl(url);
      this.scope.pdf.loading=false;
    });
  }
}

angular.module('tempApp')
  .controller('NavbarController', NavbarController);
  