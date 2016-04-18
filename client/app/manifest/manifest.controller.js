'use strict';

angular.module('tempApp')
  .controller('ManifestCtrl', function ($scope, $http,tcFactory,$location, socket) {
    //this.sections = [{section:1,flights:[{'flight#':'109A',[{tcs:'1',[{reservation:1}]
    //                                                       }]
    //                                     },{'flight#':'109B'}]
      
    //                }]
    var hours;
    this.hours = hours;
    var section, flight, hour, sectionIndex, flightIndex, hourIndex;
    var body = {date:tcFactory.getDate()}; 
    var res;
    this.oneFlight = function(hr){
      tcFactory.setSmfltnum(hr+'A');
      $location.path('/oneFlight');
    };
    
    var post = function(){
      hours=[];
      return $http.post('/api/reservations/day', body).then(response => {
        res=response.data;
        socket.unsyncUpdates('reservation');
        socket.syncUpdates('reservation',res, function(event, item, array){
          post().then(function(hrs){
            $scope.man.hours=hrs;
          });
        });
        response.data.forEach(function(res){
          
          if (!res.LAST) res.LAST="";
          hour=res['FLIGHT#'].substring(1,3);
          section=res['Ref#'];
          flight=res['FLIGHT#'];
          hourIndex=-1;
          sectionIndex=-1;
          flightIndex=-1;
          for (var i=0;i<hours.length;i++){
            if (hours[i].hour===hour) hourIndex = i;
          }
          if (hourIndex===-1) {
            hours.push({hour:hour,sections:[]});
            hours.sort(function(a,b){
              return a.hour.localeCompare(b.hour);
            });
            for (var i=0;i<hours.length;i++){
              if (hours[i].hour===hour) hourIndex = i;
            }
          }
          for (var i=0;i<hours[hourIndex].sections.length;i++){
            if (hours[hourIndex].sections[i].section===section) sectionIndex = i;
          }
          if (sectionIndex===-1) {
            hours[hourIndex].sections.push({section:section,flights:[]});
            hours[hourIndex].sections.sort(function(a,b){
              return a.section>b.section;
            });
            for (var i=0;i<hours[hourIndex].sections.length;i++){
              if (hours[hourIndex].sections[i].section===section) sectionIndex=i;
            }
          }
          for (var i=0;i<hours[hourIndex].sections[sectionIndex].flights.length;i++){
            if (hours[hourIndex].sections[sectionIndex].flights[i].flight.toUpperCase()===flight.toUpperCase()) flightIndex = i;
          }
          if (flightIndex===-1) {
            hours[hourIndex].sections[sectionIndex].flights.push({flight:flight,reservations:[]});
            hours[hourIndex].sections[sectionIndex].flights.sort(function(a,b){
              return a.flight.toUpperCase().localeCompare(b.flight.toUpperCase());
            });
            for (var i=0;i<hours[hourIndex].sections[sectionIndex].flights.length;i++){
              if (hours[hourIndex].sections[sectionIndex].flights[i].flight.toUpperCase()===flight.toUpperCase()) flightIndex = i;
            }
            
          }
         
          hours[hourIndex].sections[sectionIndex].flights[flightIndex].reservations.push(res);
          //reservations[reservations.length-1].time set
          var tvlC= hours[hourIndex].sections[sectionIndex].flights[flightIndex].reservations[hours[hourIndex].sections[sectionIndex].flights[flightIndex].reservations.length-1]['Ref#'];
          var after="";
          switch (tvlC) {
            case 1: after=":00";
            break;
            case 2: after=":00";
            break;
            case 3: after=":00";
            break;
            case 4: after=":15";
            break;
            case 5: after=":15";
            break;
            case 6: after=":25";
            break;
            case 7: after=":25";
            break;
            case 8: after=":25";
            break;
            case 9: after=":25";
            break;
            case 10: after=":25";
            break;
            case 11: after=":25";
            break;
            case 12: after=":40";
            break;
            default: after=":00";
          }
          hours[hourIndex].sections[sectionIndex].flights[flightIndex].time = hour+after;
          hours[hourIndex].sections[sectionIndex].flights[flightIndex].reservations[hours[hourIndex].sections[sectionIndex].flights[flightIndex].reservations.length-1].time = 
              hour+after;
        });
        tcFactory.getData(function(tcs){
          for (var h=0;h<hours.length;h++){
            
                 //aircraft and pilot and total load HOM for sections[i].flights[j]
                 
                 for (var i=0;i<hours[h].sections.length;i++){
                   var temp = tcs.filter(function(element){
                    return element['Ref#']===hours[h].sections[i].section;
                   });
                   if (temp.length>0) hours[h].sections[i].code = temp[0]['Route'];
                 }
              
          }
        });
        tcFactory.getFlights(body,function(flights){
          for (var h=0;h<hours.length;h++){
            for (var i=0;i<hours[h].sections.length;i++){
              hours[h].sections[i].endTime = (parseInt(hours[h].hour,10)+1).toString() + ':00';
              for (var j=0;j<hours[h].sections[i].flights.length;j++){
                 //aircraft and pilot and total load HOM for sections[i].flights[j]
                 var flight = flights.filter(function(flt){
                   return (flt['FLIGHT#'].toUpperCase()===hours[h].sections[i].flights[j].flight.toUpperCase());
                 })[0];
                 if (flight) {
                   hours[h].sections[i].flights[j].aircraft = flight.AIRCRAFT;
                   hours[h].sections[i].flights[j].pilot = flight.PILOT;
                   hours[h].sections[i].pilot = flight.PILOT;
                   hours[h].sections[i].flights[j].date = flight.DATE;
                 }
                 hours[h].sections[i].flights[j].total=0;
                 
                   for (var l=0;l<hours[h].sections[i].flights[j].reservations.length;l++){
                     var r = hours[h].sections[i].flights[j].reservations[l]['Ref#'];
                     if ((r>0&&r<4)||(r>9&&r<13)) {
                       hours[h].sections[i].flights[j].total += hours[h].sections[i].flights[j].reservations[l]['WEIGHT'] + hours[h].sections[i].flights[j].reservations[l]['FWeight'];
                     }
                   }
                 
              }
            }  
          }
          tcFactory.getPilots(function(pilotSch){
            for (var h=0;h<hours.length;h++){
              for (var i=0;i<hours[h].sections.length;i++){
                hours[h].sections[i].pilotCert = pilotSch.filter(function(pilot){
                  return pilot.Pilot.toUpperCase()===hours[h].sections[i].pilot.toUpperCase();
                })[0].lic;
              }  
            }
          });
        });
        return hours;
      });
    };
    post().then(function(hrs){
      $scope.man.hours=hrs;
    });
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('reservation');
    });
  });
