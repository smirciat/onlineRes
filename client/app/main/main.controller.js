'use strict';

(function() {

class MainController {

  constructor($http, $scope, Auth, Modal) {
    this.$http = $http;
    this.awesomeThings = [];
    this.isloggedIn=false;
    this.isLoggedIn=Auth.isLoggedIn();
    this.user=Auth.getCurrentUser();
    this.newRes = {};
    this.resList=[];
    this.code={};
    this.smfltnum={};
    var d = new Date(Date.now());
    this.currDate = new Date(d.getFullYear(),d.getMonth(),d.getDate()).toString();
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
    this.delete = Modal.confirm.delete(reservation => {
      this.$http.delete('/api/reservations/' + reservation._id).then(response => {
        this.refresh();
      });
    });
    
    
    
    if (this.isLoggedIn) {
      this.refresh();
      this.$http.get('/api/userAttributes/user/' + this.user._id).then(response => {
        if (!response.data[0]||!response.data[0].phone) {
          this.quickModal("Please enter a phone number for your account in settings (the little gear at the top right)");
        }
      });
      this.$http.get('/api/userAttributes/user/' + this.user._id).then(response => {
        if (!response.data[0]||!response.data[0].phone) {
          this.quickModal("Please enter a phone number for your account in settings (the little gear at the top right)");
        }
      });
    }
    else {
      //run asynch version to try again?
      
    }
    
  }

  addRes() {
    //move pulldown list selection to newRes object
    if (this.code.selected) this.newRes['Ref#']=this.code.selected.ref;
    if (this.smfltnum.selected) this.newRes.smfltnum=this.smfltnum.selected.smfltnum;
    //if there are any entries here, go ahead and post it
    //if (Object.keys(this.newRes).length>0) {
    if (this.newRes.FIRST&&this.newRes.LAST&&this.newRes.WEIGHT&&this.newRes.smfltnum&&this.newRes['Ref#']&&this.newRes['DATE TO FLY']) {
      this.$http.get('/api/userAttributes/user/' + this.user._id).then(response => {
        if (!response.data[0]||!response.data[0].phone) {
          this.quickModal("Please enter a phone number for your account in settings (the little gear at the top right)");
          return;
        }
        this.newRes.Phone = response.data[0].phone;
        //prepare for post
        this.newRes.email = this.user.email;
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
        
      },response => {
        this.quickModal("Please enter a phone number for your account in settings (the little gear at the top right)");
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
    this.delete("delete",res);
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
    this.newRes = res;
    this.newRes['DATE TO FLY']=(date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
    this.code.selected = this.travelCodes.filter(function ( tc ) {
      return tc.ref === res['Ref#'];
    })[0];
    this.makeList(res.smfltnum);
    
  }
  
  refresh(){
    //response.data is an array of objects representing reservations made by current user
    this.$http.get('/api/reservations/user/' + this.user._id).then(response => {
      
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
  
  showHelp(){
    this.quickModal("The first line contains input boxes for the details of your new reservation.  Below that are all the reservations associated with your account.  Click Add/Update to finalize your reservation, then you will see it below.  If you wish to make a change, the Remove and Edit buttons are available.  Click Edit to bring an existing reservation to the top row where you can edit it.  Click Undo if you change your mind and do not wish to make an edit. If your desired departure time does not appear in the pull-down list, please call us to make your reservation or choose another time.");
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
      var date = new Date(this.newRes['DATE TO FLY']);
      var d = new Date(Date.now());
      var today = new Date(d.getFullYear(),d.getMonth(),d.getDate());
      var tomorrow = new Date(d.getFullYear(),d.getMonth(),d.getDate()+1);
      var hour = (d.getTime()-today.getTime())/3600000;
      for (var i=this.firstFlight;i<=this.lastFlight;i++){
          //initiate the current smfltnum as sm
          sm=i+letter;
          if (i<10) sm="0"+sm;
          var resList=response.data.filter(function(res){
            return res.smfltnum.toUpperCase()===sm.toUpperCase();
          });
          //no more than 8 passengers on any smfltnum to avoid overbooking
          if (resList.length<8){
            
            var enough = (i-hour);
            if (date<today) {}
            else {
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
    });
  }
}

angular.module('tempApp')
  .controller('MainController', MainController);

})();
