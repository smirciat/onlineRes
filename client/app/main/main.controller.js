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
    this.smfltnum={};
    this.currDate=new Date(Date.now()).toString();
    this.disabledDates = [
      "1/1/2017","12/25/2016","11/24/2016"
    ];
    this.timeList = [];
    this.firstFlight = 9;
    this.lastFlight = 17;
    this.travelCodes = [
      {name:"Homer to Seldovia",ref:1,time:":00"},
      {name:"Homer to Port Graham",ref:2,time:":00"},
      {name:"Homer to Nanwalek",ref:3,time:":00"},
      {name:"Seldovia to Nanwalek",ref:4,time:":15"},
      {name:"Seldovia to Port Graham",ref:5,time:":15"},
      {name:"Nanwalek to Port Graham",ref:6,time:":25"},
      {name:"Port Graham to Nanwalek",ref:7,time:":25"},
      {name:"Port Graham to Seldovia",ref:8,time:":25"},
      {name:"Nanwalek to Seldovia",ref:9,time:":25"},
      {name:"Nanwalek to Homer",ref:10,time:":25"},
      {name:"Port Graham to Homer",ref:11,time:":25"},
      {name:"Seldovia to Homer",ref:12,time:":40"}  
    ];
    
    this.quickModal=Modal.confirm.quickMessage();
    if (this.isLoggedIn) this.refresh();
    
    
  }

  addRes() {
    //move pulldown list selection to newRes object
    if (this.code.selected) this.newRes['Ref#']=this.code.selected.ref;
    if (this.smfltnum.selected) this.newRes.smfltnum=this.smfltnum.selected.smfltnum;
    //if there are any entries here, go ahead and post it
    //if (Object.keys(this.newRes).length>0) {
    if (this.newRes.FIRST&&this.newRes.WEIGHT&&this.newRes.smfltnum&&this.newRes['Ref#']&&this.newRes['DATE TO FLY']) {
      //prepare for post
      if (this.newRes._id){
        // has an _id field, its an edited reservation
        this.newRes.UPDATED = Date.now();
        this.newRes['FLIGHT#']="1" + this.newRes.smfltnum;
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
    this.smfltnum.selected=undefined;
    this.refresh();
  }
  
  editRes(res){
    this.newRes = res;
    var date = new Date(this.newRes['DATE TO FLY']);
    this.newRes['DATE TO FLY']=(date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
    this.code.selected = this.travelCodes.filter(function ( tc ) {
      return tc.ref === res['Ref#'];
    })[0];
    this.makeList(res.smfltnum);
    
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
  
  makeList(sfn){
    //don't do this if one of the fields is blank
    if (!(this.newRes['DATE TO FLY']&&this.code.selected)) return;
    this.smfltnum.selected=undefined;
    this.timeList=[];
    //month starts with 0 for Jan var tempDate="2/18/16";
    var query = "date=" + this.newRes['DATE TO FLY'];
    this.$http.get('/api/reservations?' + query).then(response => {
      var letter="A";
      if (this.code.selected.ref>6) letter="B";
      var sm="";
      for (var i=this.firstFlight;i<=this.lastFlight;i++){
          //initiate the current smfltnum as sm
          sm=i+letter;
          if (i<10) sm="0"+sm;
          var resList=response.data.filter(function(res){
            return res.smfltnum.toUpperCase()===sm.toUpperCase();
          });
          //no more than 8 passengers on any smfltnum to avoid overbooking
          if (resList.length<8){
            //add a departure time to the array
            if (i<12) this.timeList.push({time:i+this.code.selected.time+ " AM",smfltnum:sm});
            else {
              if (i===12) this.timeList.push({time:i+this.code.selected.time+ " PM",smfltnum:sm});
              else this.timeList.push({time:(i-12)+this.code.selected.time+ " PM",smfltnum:sm});
            }   
          }
      }
      if (sfn){
        this.smfltnum.selected = this.timeList.filter(function ( tm ) {
          return tm.smfltnum === sfn;
        })[0];
      }
    });
  }
}

angular.module('tempApp')
  .controller('MainController', MainController);

})();
