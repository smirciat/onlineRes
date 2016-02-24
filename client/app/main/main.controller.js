'use strict';

(function() {

class MainController {

  constructor($http, $scope, Auth, Modal, $timeout) {
    this.$http = $http;
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
    this.getPhone = Modal.confirm.enterPhone(formData =>{
      this.$http.post('/api/userAttributes', {uid:this.user()._id, phone: formData.phone}).then(response => {
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
          this.quickModal("Please enter a phone number for your account in settings (the little gear at the top right)");
          return;
        }
        this.newRes.Phone = response.data[0].phone;
        //prepare for post
        this.newRes.email = this.user().email;
        if (this.newRes._id){
          // has an _id field, its an edited reservation
          this.resEntry = 'UPDATED RESERVATION: ' + this.resEntry;
          this.newRes.UPDATED = Date.now();
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
    this.newRes = res;
    this.newRes['DATE TO FLY']=(date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
    this.code.selected = this.travelCodes.filter(function ( tc ) {
      return tc.ref === res['Ref#'];
    })[0];
    this.makeList(res.smfltnum);
    
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
    var mailOptions = {
      to: this.user().email, // list of receivers
      subject: 'Reservation with Smokey Bay Air', // Subject line
      text: this.resEntry, // plaintext body
      html: this.template(res) // html body
    };
    this.$http.post('/api/mails', mailOptions).then(response => {
      //res.status = 500 for fail, 200 for success
      
    },response => {
      //this is a failure
      this.$http.put('/api/mails/' + this.user()._id, {res:this.resEntry}).then(response => {
        //log an email failure
      });
    });
  }
  
  showHelp(){
    this.quickModal("The first line contains input boxes for the details of your new reservation.  Below that are all the reservations associated with your account.  Click Add/Update to finalize your reservation, then you will see it below.  If you wish to make a change, the Remove and Edit buttons are available.  Click Edit to bring an existing reservation to the top row where you can edit it.  Click Undo if you change your mind and do not wish to make an edit. If your desired departure time does not appear in the pull-down list, please call us to make your reservation or choose another time.");
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
  
  template(res) {
    return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
'<html xmlns="http://www.w3.org/1999/xhtml" style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">' +
'<head>'+
'<meta name="viewport" content="width=device-width" />' +
'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
'<title>Alerts e.g. approaching your limit</title>' +
'<style type="text/css">' +
'img {'+
'max-width: 100%;' +
'}' +
'body {' +
'-webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em;' +
'}' +
'body {' +
'background-color: #f6f6f6;' +
'}' +
'@media only screen and (max-width: 640px) {' +
  'body {' +
    'padding: 0 !important;'+
  '}'+
  'h1 {' +
    'font-weight: 800 !important; margin: 20px 0 5px !important;' +
  '}' +
  'h2 {' +
    'font-weight: 800 !important; margin: 20px 0 5px !important;' +
  '}'+
  'h3 {' +
    'font-weight: 800 !important; margin: 20px 0 5px !important;' +
  '}' +
  'h4 {' +
    'font-weight: 800 !important; margin: 20px 0 5px !important;' +
  '}' +
  'h1 {' +
    'font-size: 22px !important;' +
  '}' +
  'h2 {' +
    'font-size: 18px !important;' +
  '}' +
  'h3 {' +
    'font-size: 16px !important;'+
  '}'+
  '.container {'+
    'padding: 0 !important; width: 100% !important;'+
  '}'+
  '.content {'+
    'padding: 0 !important;'+
  '}'+
  '.content-wrap {'+
    'padding: 10px !important;'+
  '}'+
  '.invoice {'+
    'width: 100% !important;'+
  '}'+
'}'+
'</style>'+
'</head>'+
'<body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">'+
'<table class="body-wrap" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>'+
		'<td class="container" width="600" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">'+
			'<div class="content" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">'+
				  '<table class="main" width="100%" cellpadding="0" cellspacing="0" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"><tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="alert alert-success" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 16px; vertical-align: top; color: #fff; font-weight: 500; text-align: center; border-radius: 3px 3px 0 0; background-color: SteelBlue; margin: 0; padding: 20px;" align="center" bgcolor="SteelBlue" valign="top">'+
							'Smokey Bay Air'+
						'</td>'+
					'</tr><tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-wrap" style="text-align:center;font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">'+
							'<table width="100%" cellpadding="0" cellspacing="0" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="text-align:center;font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="text-align:center;font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">'+
										'<img src="http://s18.postimg.org/7vaiwz4hl/Bear_Paw.jpg" height=150">'+
										'<p>This email is a confirmation of the reservation you just made with us.  Please double check the reservations details below and edit your reservation if anything is not correct.  Please call us if you have any problems.</p>'+
									'</td>'+
								'</tr><tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">'+
									
									'<table border="0" align="center" cellpadding="5" cellspacing="0" style="border-collapse:collapse;background-color:Wheat;color:black;font-family:arial,helvetica,sans-serif;">' +
									  '<tbody>'+
									    '<tr>'+
									      '<td colspan="3" style="padding:5px;background-color:SteelBlue;color:Wheat;font-size:200%;border:5px solid SteelBlue;text-align:center;">Reservation</td>'+
									    '</tr>'+
									    '<tr>'+
									      '<td style="text-align:center;border:5px solid SteelBlue;white-space:nowrap;">First Name</td>'+
									      '<td style="border:5px solid SteelBlue;white-space:nowrap;text-align:left;font-size:125%;">'+ res.FIRST  +'</td>'+
									    '</tr>'+
									    '<tr>'+
									      '<td style="text-align:center;border:5px solid SteelBlue;white-space:nowrap;">Last Name</td>'+
									      '<td style="border:5px solid SteelBlue;white-space:nowrap;text-align:left;font-size:125%;">'+ res.LAST  +'</td>'+
									    '</tr>'+
									    '<tr>'+
									      '<td style="text-align:center;border:5px solid SteelBlue;white-space:nowrap;">From</td>'+
									      '<td style="border:5px solid SteelBlue;white-space:nowrap;text-align:left;font-size:125%;">'+ res.FROM  +'</td>'+
									    '</tr>'+
									    '<tr>'+
									      '<td style="text-align:center;border:5px solid SteelBlue;white-space:nowrap;">Date</td>'+
									      '<td style="border:5px solid SteelBlue;white-space:nowrap;text-align:left;font-size:125%;">'+ res.DATE  +'</td>'+
									    '</tr>'+
									    '<tr>'+
									      '<td style="text-align:center;border:5px solid SteelBlue;white-space:nowrap;">Time</td>'+
									      '<td style="border:5px solid SteelBlue;white-space:nowrap;text-align:left;font-size:125%;">'+ res.TIME  +'</td>'+
									    '</tr>'+
									  '</tbody>'+
								  '</table>'+
									
										
									'</td>'+
								'</tr><tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">'+
								  '</td>'+
								'</tr><tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="text-align:center;font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">'+
										'<p>Thanks for choosing Smokey Bay Air!</p><p>2100 Kachemak Dr Ste 1, Homer, AK 99603</p><p>(907) 235-1511 or (888) 482-1511</p>'+
									'</td>'+
								'</tr></table></td>'+
					'</tr></table><div class="footer" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">'+
					'<table width="100%" style="font-family: \'Helvetica Neue\,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="aligncenter content-block" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top"><a href="http://www.mailgun.com" style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;"></td>'+
						'</tr></table></div></div>'+
		'</td><td style="font-family: \'Helvetica Neue\',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>'+
	'</tr></table></body>'+
'</html>';
  }
}

angular.module('tempApp')
  .controller('MainController', MainController);

})();
