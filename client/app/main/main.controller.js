'use strict';

(function() {

class MainController {

  constructor($http, $scope, Auth, Modal, $timeout, $location,email) {
    this.$http = $http;
    this.email=email;
    this.Auth = Auth;
    this.$location = $location;
    this.awesomeThings = [];
    this.isloggedIn=false;
    this.user=Auth.getCurrentUser;
    this.isLoggedIn=Auth.isLoggedIn;
    this.newRes = {};
    this.resList=[];
    this.code={};
    this.smfltnum={};
    var d = new Date(Date.now());
    this.currDate = new Date(d.getFullYear(),d.getMonth(),d.getDate()).toString();
    this.endDate= new Date(d.getFullYear(),d.getMonth()+7,d.getDate()).toString();
    this.disabledDates = [
      "1/1/2017","12/25/2016","11/24/2016"
    ];
    this.timeList = [];
    this.firstFlight = 9;
    this.lastFlight = 16;
    this.flightMatrix = [{flight:17, start:"2/3/2016", end:"11/4/2016"},
    {flight:18, start:"5/2/2016", end:"10/1/2016"},
    {flight:8, start:"5/2/2016", end:"9/15/2016"}
    ];
    
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
    
    this.delete = Modal.confirm.check(reservation => {
      this.$http.put('/api/reservations/delete/' + reservation._id,{user:this.user(), reservation:reservation}).then(response => {
        this.refresh();
      });
    });
    this.add = Modal.confirm.check(reservation => {
      this.$http.post('/api/reservations', reservation).then(response => {
            this.sendEmail(this.resObj);
            this.cancelRes();
          });
    });
    this.update = Modal.confirm.check(reservation => {
      this.$http.put('/api/reservations/' + reservation._id, {user:this.user(), reservation:reservation}).then(response => {
            this.sendEmail(this.resObj);
            this.cancelRes();
          });
    });
    this.getPhone = Modal.confirm.enterData(formData =>{
      this.$http.post('/api/userAttributes', {uid:this.user()._id, phone: formData.data}).then(response => {
      });
    });
    this.getEmail = Modal.confirm.enterData(formData =>{
      if (formData.data) Auth.changeEmail(formData.data, response => {
        this.Auth.logout();
        this.$location.path('/');
      });
    });
    
    this.isLoggedIn(response => {
      if (response) {
        $scope.main.refresh();
        $scope.main.newRes.FIRST =  $scope.main.user().name.split(" ")[0];
        $scope.main.newRes.LAST =  $scope.main.user().name.split(" ")[1];
        if ($scope.main.user().name.split(" ").length > 2) $scope.main.newRes.LAST += " " + $scope.main.user().name.split(" ")[2];
        $scope.main.$http.get('/api/userAttributes/user/' + $scope.main.user()._id).then(response => {
          if (!response.data[0]||!response.data[0].phone) {
            //user needs a phone number
            $scope.main.getPhone("Please enter a phone number for your account in settings.");
          }
        });
      }
    });
    
  }

  setFlights() {
    var d = new Date(Date.now());
    var today = new Date(d.getFullYear(),d.getMonth(),d.getDate());
    this.flightMatrix.forEach(number =>{
      if (number.flight>this.lastFlight) {
        if (new Date(number.start)<=new Date(this.newRes['DATE TO FLY'])&&new Date(number.end)>=new Date(this.newRes['DATE TO FLY'])){
          this.lastFlight = number.flight;
        }
      }
      if (number.flight<this.firstFlight) {
        if (new Date(number.start)<=new Date(this.newRes['DATE TO FLY'])&&new Date(number.end)>=new Date(this.newRes['DATE TO FLY'])){
          this.firstFlight = number.flight;
        }
      }
    });
    
  }
  
  addRes() {
    
    
    //move pulldown list selection to newRes object
    this.newRes['Ref#']=undefined;
    this.newRes.smfltnum=undefined;
    if (this.code.selected) this.newRes['Ref#']=this.code.selected.ref;
    if (this.smfltnum.selected) this.newRes.smfltnum=this.smfltnum.selected.smfltnum;
    //if there are any entries here, go ahead and post it
    //if (Object.keys(this.newRes).length>0) {
    if (!this.isInt(this.newRes.WEIGHT)||!this.isInt(this.newRes.FWeight)) return this.quickModal("Weight values need to be an integer");
    if (this.newRes.FIRST&&this.newRes.LAST&&this.newRes.WEIGHT&&this.newRes.smfltnum&&this.newRes['Ref#']&&this.newRes['DATE TO FLY']) {
      var date = new Date(this.newRes['DATE TO FLY']);
      this.newRes['DATE TO FLY']=(date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
      this.resObj = {
        FIRST: this.newRes.FIRST,
        LAST: this.newRes.LAST,
        TIME: this.smfltnum.selected.time,
        DATE: this.newRes['DATE TO FLY'],
        FROM: this.code.selected.name
      };
      this.resEntry = this.newRes.FIRST + ' ' + this.newRes.LAST + ' has a reservation at ' +  this.smfltnum.selected.time + ' on ' + this.newRes["DATE TO FLY"] + ' from ' + this.code.selected.name + '.';
      this.$http.get('/api/userAttributes/user/' + this.user()._id).then(response => {
        if (!response.data[0]||!response.data[0].phone) {
          this.getPhone("Please enter a phone number for your account.");
          return;
        }
        if (!this.user().email) {
          this.getEmail("Please enter an email for your account.  You will need to login again after entering this.");
          return;
        }
        this.newRes.Phone = response.data[0].phone;
        //prepare for post
        this.newRes.email = this.user().email;
        if (this.newRes._id){
          // has an _id field, its an edited reservation
          this.resEntry = 'UPDATED RESERVATION: ' + this.resEntry;
          this.newRes['FLIGHT#']="1" + this.newRes.smfltnum;
          //put
          this.update("Update",this.resEntry,this.newRes);
        }
        else {
          //no _id field, its a new reservation
          this.newRes.FWeight= this.newRes.FWeight||0;
          this.newRes['FLIGHT#']="1" + this.newRes.smfltnum;
          this.newRes.uid=this.user()._id;
          this.newRes['DATE RESERVED']=Date.now();
          //post
          this.add("Add",this.resEntry,this.newRes);
        }
        
      },response => {
        this.getPhone("Please enter a phone number for your account in settings.");
      });
      
      
    }
    else this.quickModal("Please enter the required fields marked with *");
  }

  remRes(res) {
    var date = new Date(res['DATE TO FLY']);
    var d = new Date(Date.now());
    var today = new Date(d.getFullYear(),d.getMonth(),d.getDate());
    var tomorrow = new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);
    if (date<today) {
      this.quickModal("Sorry, you cannot edit a reservation from a past date.");
      return;
    }
    var hour = (d.getTime()-today.getTime())/3600000;
    var enough = (parseInt(res.smfltnum.substring(0,2))-hour);
    if (date>=today && date<tomorrow && enough<2) {
      this.quickModal("Sorry, you cannot edit a reservation this close to flight time. Please call our office at (907) 235-1511 or (888) 482-1511.");
      return;
    }
    this.delete("Delete", 'Reservation for ' + res.FIRST + ' ' + res.LAST + ' from ' + this.convert(res['Ref#']),res);
  }
  
  cancelRes(){
    this.newRes = {};
    this.code.selected=undefined;
    this.smfltnum.selected=undefined;
    this.refresh();
  }
  
  editRes(res){
    var date = new Date(res['DATE TO FLY']);
    var d = new Date(Date.now());
    var today = new Date(d.getFullYear(),d.getMonth(),d.getDate());
    var tomorrow = new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);
    if (date<today) {
      this.quickModal("Sorry, you cannot edit a reservation from a past date.");
      return;
    }
    var hour = (d.getTime()-today.getTime())/3600000;
    var enough = (parseInt(res.smfltnum.substring(0,2))-hour);
    if (date>=today && date<tomorrow && enough<2) {
      this.quickModal("Sorry, you cannot edit a reservation this close to flight time. Please call our office at (907) 235-1511 or (888) 482-1511.");
      return;
    }
    var newRes = Object.assign({},res);
    this.newRes = newRes;
    this.newRes.UPDATED = d;
    this.newRes['DATE TO FLY']=(date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
    this.code.selected = this.travelCodes.filter(function ( tc ) {
      return tc.ref === newRes['Ref#'];
    })[0];
    this.makeList(this.newRes.smfltnum);
     
   }
   
   reverseRes(res){
     var date = new Date(res['DATE TO FLY']);
     var d = new Date(Date.now());
     var today = new Date(d.getFullYear(),d.getMonth(),d.getDate());
     var tomorrow = new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);
     var newRes = Object.assign({},res);
     this.newRes = newRes;
     this.newRes._id=undefined;
     this.newRes['INVOICE#']=undefined;
     this.newRes['DATE TO FLY']=(date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
     if (date<today) this.newRes['DATE TO FLY']=(d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
     this.newRes['DATE RESERVED']=(d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
     this.newRes['Ref#'] = 13-res['Ref#'];
     var hour = (d.getTime()-today.getTime())/3600000;
     var enough = (parseInt(res.smfltnum.substring(0,2))-hour);
     this.code.selected = this.travelCodes.filter(function ( tc ) {
       return tc.ref === newRes['Ref#'];
     })[0];
     this.makeList(this.newRes.smfltnum);
  }
  
  refresh(){
    //response.data is an array of objects representing reservations made by current user
    this.$http.get('/api/reservations/user/' + this.user()._id).then(response => {
      this.resList=response.data.filter(function(res){
        var date = new Date(res['DATE TO FLY']);
        var d = new Date(Date.now());
        var day = d.getDate();
        var month = d.getMonth();
        var year = d.getFullYear();
        if (day<=5) {
          day += 28;
          if (month===0){
            month=11;
            year--;
          }
          else month--;
        }
        var today = new Date(year,month,day-5);
        return today<=date;
      });
    });
  }
  
  convert(refnum){
    var obj = this.travelCodes.filter(function ( tc ) {
      return tc.ref === refnum;
    })[0];
    return obj.name;
  }
  
  sendEmail(res){
    this.email.sendEmail(res, this.resEntry,this.user());
  }
  
  showHelp(){
    this.quickModal("The first line contains input boxes for the details of your new reservation.  Below that are all the reservations associated with your account.  Click Add/Update to finalize your reservation, then you will see it below.  If you wish to make a change, the Remove and Edit buttons are available.  The orange button allows you to create a new reservation in the opposite direction of the original one. Click Edit to bring an existing reservation to the top row where you can edit it.  Click Undo if you change your mind and do not wish to make an edit. If your desired departure time does not appear in the pull-down list, please call us to make your reservation or choose another time.");
  }
  
  overWeight(){
    if (this.newRes.FWeight>50)
      this.quickModal("The first 50 pounds of baggage is included with your ticket.  Additional fees apply for overweight baggage.  Please be aware that we will make every effort to accomodate your baggage on the flight with you, but we may need to bring some of it at a later time.  If you need all of your baggage to stay with you, please consider whether a charter is a good option for you.  Please call us for details. (907) 235-1511 or (888) 481-1511");
  }
  
  isInt(value) {
    //not tradionally part of this, but workes for this application
    if (value===undefined) return true;
    var x;
    if (isNaN(value)) {
      return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
  }

  makeList(sfn){
    //don't do this if one of the fields is blank
    if (!(this.newRes['DATE TO FLY']&&this.code.selected)) return;
    this.setFlights();
    this.smfltnum.selected=undefined;
    this.timeList=[];
    //month starts with 0 for Jan var tempDate="2/18/16";
    var query = "date=" + this.newRes['DATE TO FLY'];
    this.$http.get('/api/reservations?' + query).then(response => {
      var sm="";
      var sma="B";
      var letter="A";
      if (this.code.selected.ref>6) {
        letter="B";
        sma="A";
      }
      var date = new Date(this.newRes['DATE TO FLY']);
      var d = new Date(Date.now());
      var today = new Date(d.getFullYear(),d.getMonth(),d.getDate());
      var tomorrow = new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);
      var hour = (d.getTime()-today.getTime())/3600000;
      var maxPax;
      for (var i=this.firstFlight;i<=this.lastFlight;i++){
          //initiate the current smfltnum as sm
          sm=i+letter;
          sma=i+sma;
          if (i<10) sm="0"+sm;
          var resList=response.data.filter(function(res){
            return res.smfltnum.toUpperCase()===sm.toUpperCase();
          });
          var resListAlt = response.data.filter(function(res){
            return res.smfltnum.toUpperCase()===sma.toUpperCase();
          });
          //no more than 8 passengers on any smfltnum to avoid overbooking
          maxPax=8;
          if (i===9&&date.getDay()>0&&date.getDay()<6) {
            maxPax=12;
          }
          //keep them from being first pax on 8:00 flight
          var enough = (i-hour);
          if (enough<0) enough+=24;
          if (date>=today && date<=tomorrow && enough<13 && i===8 && resList.length===0 && resListAlt.length===0) maxPax=0;
          
          if (resList.length<maxPax){
            if (date<today) {}
            else {
              enough = (i-hour);
              if (date>=today && date<tomorrow && enough<2) {}
              else {
                //add a departure time to the array
                if (i<12) this.timeList.push({time:i+this.code.selected.time+ " AM",smfltnum:sm});
                else {
                  if (i===12) this.timeList.push({time:i+this.code.selected.time+ " PM",smfltnum:sm});
                  else this.timeList.push({time:(i-12)+this.code.selected.time+ " PM",smfltnum:sm});
                }
              }
            }
               
          }
      }
      if (sfn){
        this.smfltnum.selected = this.timeList.filter(function ( tm ) {
          return tm.smfltnum === sfn;
        })[0];
      }
      this.firstFlight = 9;
      this.lastFlight = 16;
    });
  }
}

angular.module('tempApp')
  .controller('MainController', MainController);

})();
