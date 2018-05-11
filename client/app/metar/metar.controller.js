'use strict';

angular.module('tempApp')
  .controller('MetarCtrl',function($http, $scope, $timeout,$interval) {
    this.$http = $http;
    this.awesomeThings = [];
    this.ceilings=[];
    this.winds=[];
    this.visibilities=[];
    this.raws=[];
    this.newAirport="";
    this.newICAO="";
    this.notifications=window.localStorage.getItem( 'notifications' )||null;
    if (!this.notifications){
      this.notifications="NO";
      window.localStorage.setItem( 'notifications',this.notifications );
    }
    this.yellows=JSON.parse(window.localStorage.getItem( 'yellows' )||null);
    if (!this.yellows) {
      this.yellows={'ceiling':1000,'visibility':3,'wind':25};
      window.localStorage.setItem( 'yellows',JSON.stringify(this.yellows) );
    }
    this.limits=JSON.parse(window.localStorage.getItem( 'limits' )||null);
    if (!this.limits) {
      this.limits={'ceiling':500,'visibility':2,'wind':30};
      window.localStorage.setItem( 'limits',JSON.stringify(this.limits) );
    }
    this.airports=JSON.parse(window.localStorage.getItem( 'airports' )||null);
    if (!this.airports) {
      this.airports=[{icao:'PAOM',name:'Nome'},{icao:'PAWM',name:'White Mountain'},{icao:'PASV',name:'Savoonga'},{icao:'PFEL',name:'Elim'},
      {icao:'PAGL',name:'Golovin'},{icao:'PAUN',name:'Unalakleet'},{icao:'PFSH',name:'Shaktoolik'},{icao:'PASH',name:'Shishmaref'},
      {icao:'PAIW',name:'Wales'},{icao:'PATE',name:'Teller'},{icao:'PAKK',name:'Koyuk'},{icao:'PAMK',name:'St. Michael'},
      {icao:'PAGM',name:'Gambell'},{icao:'PFKT',name:'Brevig Mission'}];
      window.localStorage.setItem( 'airports',JSON.stringify(this.airports) );
    }
      
    var self=this;
    
    self.weatherClass = function(parameter,attribute){
      var bits;
      var whole="";
      if (parameter==="") return;
      //if (parameter.includes(" ")) {
        //bits = parameter.split(" ");
        //whole=parseInt(bits[0],10);
        //parameter=bits[1];
      //}
      //if (parameter.includes('/')) {
      //  bits = parameter.split("/");
      //  parameter = parseInt(bits[0],10)/parseInt(bits[1],10);
      //}
      //if (whole!=="") parameter=whole+parameter;
      if (parseFloat(parameter)>=parseFloat(self.yellows[attribute])) return "green";
      if (parseFloat(parameter)>=parseFloat(self.limits[attribute])) return "yellow";
      return "red";
    };
    
    self.windClass = function(parameter){
      if (parameter==="") return;
      if (parseFloat(parameter)<=parseFloat(self.yellows.wind)) return "green";
      if (parseFloat(parameter)<=parseFloat(self.limits.wind)) return "yellow";
      return "red";
    };
    
    self.delete=function(airport){
      var index = self.airports.indexOf(airport);
      if (index > -1) {
        self.airports.splice(index, 1);
        self.airports.forEach(function(airport){
          airport.clicked="NO";
        });
        window.localStorage.setItem('airports',JSON.stringify(self.airports));
      }
    };
    
    self.avwx=function(index){
      self.loading=true;
      self.$http.get('https://avwx.rest/api/metar/' + self.airports[index].icao).then(function(response){
        self.loading=false;
        if (response.data.Error) return;
        self.airports[index].raw=response.data['Raw-Report'];
        var len = response.data['Cloud-List'].length;
        if (len===0) self.airports[index].ceiling='10000';
        else if (len>-1&&(response.data['Cloud-List'][0][0]==='BKN'||response.data['Cloud-List'][0][0]==='OVC'||response.data['Cloud-List'][0][0]==='VV')) self.airports[index].ceiling=response.data['Cloud-List'][0][1]+'00';
        else if (len>=2&&(response.data['Cloud-List'][1][0]==='BKN'||response.data['Cloud-List'][1][0]==='OVC'||response.data['Cloud-List'][0][0]==='VV')) self.airports[index].ceiling=response.data['Cloud-List'][1][1]+'00';
        else if (len>=3&&(response.data['Cloud-List'][2][0]==='BKN'||response.data['Cloud-List'][2][0]==='OVC'||response.data['Cloud-List'][0][0]==='VV')) self.airports[index].ceiling=response.data['Cloud-List'][2][1]+'00';
        else if (len>=4&&(response.data['Cloud-List'][3][0]==='BKN'||response.data['Cloud-List'][3][0]==='OVC'||response.data['Cloud-List'][0][0]==='VV')) self.airports[index].ceiling=response.data['Cloud-List'][3][1]+'00';
        else self.airports[index].ceiling='10000';
        self.airports[index].ceiling = self.airports[index].ceiling.replace(/^0+/, '');
        if (response.data['Wind-Gust']==="") self.airports[index].wind=response.data['Wind-Speed'];
        else self.airports[index].wind=response.data['Wind-Gust'];
        self.airports[index].visibility=response.data.Visibility;
        if (self.airports[index].visibility.includes('/')) {
          var bits = self.airports[index].visibility.split("/");
          self.airports[index].visibility = parseInt(bits[0],10)/parseInt(bits[1],10);
        }
        self.airports[index].visibility=parseFloat(self.airports[index].visibility);
        self.airports[index].visibilityColor=self.weatherClass(self.airports[index].visibility,'visibility');
        self.airports[index].ceilingColor=self.weatherClass(self.airports[index].ceiling,'ceiling');
        self.airports[index].windColor=self.windClass(self.airports[index].wind);
        //Is a notification required?
        if (self.notifications==="YES") {
          if (self.airports[index].ceilingColor!==self.airportsCopy[index].ceilingColor
            ||self.airports[index].windColor!==self.airportsCopy[index].windColor
            ||self.airports[index].visibilityColor!==self.airportsCopy[index].visibilityColor){
              //send a notification
              
          }
        }
      });
      self.$http.get('https://avwx.rest/api/taf/' + self.airports[index].icao).then(function(response){
        if (response.data.Error) { 
          //self.airports[index]=self.airportsCopy[index];
          return;
        }
        self.airports[index].taf=response.data['Raw-Report'];
      });
    };
    
    self.update = function(){
      console.log('updating')
      var fresh=true;
      if (self.airportsCopy) fresh=false;
      self.airportsCopy=self.airports.slice(0);
      self.airports.forEach(function(airport,index){
        //airport.ceiling='';
        //airport.visibility='';
        //airport.wind='';
        //airport.ceilingColor='';
        //airport.visibilityColor='';
        //airport.windColor='';
        //airport.raw='';
        self.avwx(index);
      });
    };
    
    self.toggle=function(index){
      if (self.airports[index].clicked==="YES") self.airports[index].clicked='NO';
      else self.airports[index].clicked='YES';
    };
    
    self.update();
    self.int=$interval(function(){self.update()},60*1000*5);
});
