'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket,Auth, Modal) {
    this.$http = $http;
    this.awesomeThings = [];
    this.isloggedIn=false;
    this.isLoggedIn=Auth.isLoggedIn();
    this.user=Auth.getCurrentUser();
    this.newRes = {};
    this.resList=[];
    this.code={};
    this.currDate=new Date(Date.now()).toString();
    this.disabledDates = [
      "1/1/2017","12/25/2016","11/24/2016"
    ];
    this.travelCodes = [
      {name:"Homer to Seldovia",ref:1},
      {name:"Homer to Port Graham",ref:2},
      {name:"Homer to Nanwalek",ref:3},
      {name:"Seldovia to Nanwalek",ref:4},
      {name:"Seldovia to Port Graham",ref:5},
      {name:"Nanwalek to Port Graham",ref:6},
      {name:"Port Graham to Nanwalek",ref:7},
      {name:"Port Graham to Seldovia",ref:8},
      {name:"Nanwalek to Seldovia",ref:9},
      {name:"Nanwalek to Homer",ref:10},
      {name:"Port Graham to Homer",ref:11},
      {name:"Seldovia to Homer",ref:12}  
    ];
    
    this.quickModal=Modal.confirm.quickMessage();
    if (this.isLoggedIn) this.refresh();
    
    
  }

  addRes() {
    //move pulldown list selection to newRes object
    if (this.code.selected) this.newRes['Ref#']=this.code.selected.ref;
    //if there are any entries here, go ahead and post it
    //if (Object.keys(this.newRes).length>0) {
    if (this.newRes.FIRST&&this.newRes.WEIGHT&&this.newRes.smfltnum&&this.newRes['Ref#']&&this.newRes['DATE TO FLY']) {
      //prepare for post
      if (this.newRes._id){
        // has an _id field, its an edited reservation
        
        this.$http.put('/api/reservations/' + this.newRes._id, this.newRes).then(response => {
          this.cancelRes();
        });
      }
      else {
        //no _id field, its a new reservation
        this.newRes.FWeight= this.newRes.FWeight||0;
        this.newRes['FLIGHT#']="1" + this.newRes.smfltnum;
        this.newRes.uid=this.user._id;
        this.newRes['DATE RESERVED']=Date.now();
        //post
        this.$http.post('/api/reservations', this.newRes).then(response => {
          this.cancelRes();
        });
        
      }
      
    }
    else this.quickModal("Please enter the required fields marked with *");
  }

  remRes(res) {
    this.$http.delete('/api/reservations/' + res._id).then(response => {
      this.refresh();
    });
  }
  
  cancelRes(){
    this.newRes = {};
    this.code.selected=undefined;
    this.refresh();
  }
  
  editRes(res){
    this.newRes = res;
    this.code.selected = this.travelCodes.filter(function ( tc ) {
      return tc.ref === res['Ref#'];
    })[0];
  }
  
  refresh(){
    //response.data is an array of objects representing reservations made by current user
    this.$http.get('/api/reservations/user/' + this.user._id).then(response => {
      this.resList=response.data;
    });
  }
  
  convert(refnum){
    var obj = this.travelCodes.filter(function ( tc ) {
      return tc.ref === refnum;
    })[0];
    return obj.name;
  }
  
  
}

angular.module('tempApp')
  .controller('MainController', MainController);

})();
