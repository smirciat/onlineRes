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

  constructor($location, Auth, $window,$scope,appConfig,$http,$sce,$timeout) {
    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.hasRole = Auth.hasRole;
    this.getCurrentUser = Auth.getCurrentUser;
    this.window= $window;
    this.scope=$scope;
    this.pdfMenu = appConfig.pdfFiles;
    this.testMenu = appConfig.tests.sort((a,b)=>{
      return a.cat.localeCompare(b.cat);
    });
    this.testMenu.forEach((c)=>{
      c.list.sort((a,b)=>{
        return a.name.localeCompare(b.name);
      });
    });
    this.http=$http;
    this.sce=$sce;
    this.timeout=$timeout;
  }
  
  search = function(){
    if (this.$location.path()==='/searchName') this.window.location.href = "/searchName";
    else this.$location.path('/searchName');
  };

  isActive = function(route){
    return route === this.$location.path();
  };
  
  isRoute = function(route){
    return this.$location.path()===('/' + route);
  }
  
  setTest = function(test){
    var user = this.getCurrentUser;
    var url = "https://www.classmarker.com/online-test/start/?quiz=" 
      + test.id
      + "&cm_fn=" + user().name.split(" ")[0] 
      + "&cm_ln=" + user().name.split(" ")[1]
      + "&cm_e=" + user().email
      + "&cm_user_id=" + user()._id;
    if (test.vendor==="elearning") {
      url="https://elearning.easygenerator.com/" + test.id + '/';
    }
    var dummyUrl = "https://www.classmarker.com/online-test/start/?quiz=asdfasdf";
    this.scope.test.iframeSrc=this.sce.trustAsResourceUrl(dummyUrl);
    this.timeout(()=>{this.scope.test.iframeSrc=this.sce.trustAsResourceUrl(url)},350);
    this.scope.test.new=false;
  }
  
  setPdf = function(pdfName){
    this.scope.pdf.loading=true;
    this.scope.pdf.new=false;
    this.scope.pdf.pdfUrl=undefined;
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
  