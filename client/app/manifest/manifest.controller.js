'use strict';

angular.module('tempApp')
  .controller('ManifestCtrl', function ($scope, $http,tcFactory) {
    //this.sections = [{section:1,flights:[{'flight#':'109A',[{tcs:'1',[{reservation:1}]
    //                                                       }]
    //                                     },{'flight#':'109B'}]
      
    //                }]
    var sections=[];
    var section, flight, tc, sectionIndex, flightIndex, tcIndex;
    var body = {date:tcFactory.getDate(), smfltnum:tcFactory.getSmfltnum()}; //+ this.newRes['DATE TO FLY'];
    this.four = [1,2,3,4];
    $http.post('/api/reservations/day', body).then(response => {
      response.data.forEach(function(res){
        section=res['FLIGHT#'].substring(0,1);
        flight=res['FLIGHT#'];
        tc = res['Ref#'];
        sectionIndex=-1;
        flightIndex=-1;
        tcIndex=-1;
        for (var i=0;i<sections.length;i++){
          if (sections[i].section===section) sectionIndex = i;
        }
        if (sectionIndex===-1) {
          sections.push({section:section,flights:[]});
          sections.sort(function(a,b){
            return a.section.localeCompare(b.section);
          });
          for (var i=0;i<sections.length;i++){
            if (sections[i].section===section) sectionIndex=i;
          }
        }
        for (var i=0;i<sections[sectionIndex].flights.length;i++){
          if (sections[sectionIndex].flights[i].flight.toUpperCase()===flight.toUpperCase()) flightIndex = i;
        }
        if (flightIndex===-1) {
          sections[sectionIndex].flights.push({flight:flight,tcs:[]});
          sections[sectionIndex].flights.sort(function(a,b){
            return a.flight.toUpperCase().localeCompare(b.flight.toUpperCase());
          });
          for (var i=0;i<sections[sectionIndex].flights.length;i++){
            if (sections[sectionIndex].flights[i].flight.toUpperCase()===flight.toUpperCase()) flightIndex = i;
          }
          
        }
        for (var i=0;i<sections[sectionIndex].flights[flightIndex].tcs.length;i++){
          if (sections[sectionIndex].flights[flightIndex].tcs[i].tc===tc) tcIndex = i;
        }
        if (tcIndex===-1) {
          sections[sectionIndex].flights[flightIndex].tcs.push({tc:tc,reservations:[]});
          sections[sectionIndex].flights[flightIndex].tcs.sort(function(a,b){
            return a.tc>b.tc;
          });
          for (var i=0;i<sections[sectionIndex].flights[flightIndex].tcs.length;i++){
            if (sections[sectionIndex].flights[flightIndex].tcs[i].tc===tc) tcIndex = i;
          }
          
        }
        sections[sectionIndex].flights[flightIndex].tcs[tcIndex].reservations.push(res);
        //reservations[reservations.length-1].time set
        var hr = body.smfltnum.substring(0,2);
        var tvlC= sections[sectionIndex].flights[flightIndex].tcs[tcIndex].reservations[sections[sectionIndex].flights[flightIndex].tcs[tcIndex].reservations.length-1]['Ref#'];
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
        sections[sectionIndex].flights[flightIndex].tcs[tcIndex].reservations[sections[sectionIndex].flights[flightIndex].tcs[tcIndex].reservations.length-1].time = 
            hr+after;
      });
      tcFactory.getData(function(tcs){
        for (var i=0;i<sections.length;i++){
          for (var j=0;j<sections[i].flights.length;j++){
             //aircraft and pilot and total load HOM for sections[i].flights[j]
             
             for (var k=0;k<sections[i].flights[j].tcs.length;k++){
               sections[i].flights[j].tcs[k].code = tcs.filter(function(element){
                return element['Ref#']===sections[i].flights[j].tcs[k].reservations[0]['Ref#'];
               })[0]['Route'];
             }
          }
        }
      });
      tcFactory.getFlights(body,function(flights){
        for (var i=0;i<sections.length;i++){
          sections[i].endTime = (parseInt(body.smfltnum.substring(0,2),10)+1).toString() + ':00';
          for (var j=0;j<sections[i].flights.length;j++){
             //aircraft and pilot and total load HOM for sections[i].flights[j]
             var flight = flights.filter(function(flt){
               return (flt['FLIGHT#'].toUpperCase()===sections[i].flights[j].flight.toUpperCase());
             })[0];
             sections[i].flights[j].aircraft = flight.AIRCRAFT;
             sections[i].flights[j].pilot = flight.PILOT;
             sections[i].pilot = flight.PILOT;
             sections[i].flights[j].date = flight.DATE;
             sections[i].flights[j].total=0;
             for (var k=0;k<sections[i].flights[j].tcs.length;k++){
               for (var l=0;l<sections[i].flights[j].tcs[k].reservations.length;l++){
                 var r = sections[i].flights[j].tcs[k].reservations[l]['Ref#'];
                 if ((r>0&&r<4)||(r>9&&r<13)) {
                   sections[i].flights[j].total += sections[i].flights[j].tcs[k].reservations[l]['WEIGHT'] + sections[i].flights[j].tcs[k].reservations[l]['FWeight'];
                 }
               }
             }
          }
        }  
        tcFactory.getPilots(function(pilotSch){
          for (var i=0;i<sections.length;i++){
            sections[i].pilotCert = pilotSch.filter(function(pilot){
              return pilot.Pilot.toUpperCase()===sections[i].pilot.toUpperCase();
            })[0].lic;
          }  
        
        });
      });
      this.sections=sections;
    });
  });
