'use strict';

angular.module('tempApp')
  .controller('OneFlightCtrl', function ($scope, $http, $interval, $q, uiGridConstants, tcFactory,Modal,$window,$timeout) {
    var aircraftSch, pilotSch ;
    this.arr=[];
    tcFactory.getAircraft(function(ac){
      aircraftSch = ac;
    });
    tcFactory.getPilots(function(p){
      pilotSch = p;
    });
    var d=new Date(Date.now());
    this.nameTrue=false;
    this.res = [];
    this.date = tcFactory.getDate();
    this.smfltnum=tcFactory.getSmfltnum().substring(0,2);
    this.times = [];
    var date; 
    var smfltnum;
    this.time={};
    this.time.selected={ref:parseInt(this.smfltnum,10),time:this.smfltnum + ":00"};
    for (var i=7;i<=19;i++){
      this.times.push({ref:i, time: i + ':00'});
    }
    var sections, section, flight, tc, sectionIndex, flightIndex, tcIndex;
    var body;
    this.four = [1,2,3,4];
      
    this.today = function(){
      d=new Date(Date.now());
      tcFactory.setDate(d);
      this.date=tcFactory.getDate();
      var smfltnum = (d.getHours()+1);
      if (smfltnum===24) smfltnum=19;
      if (smfltnum<7) smfltnum=7;
      if (smfltnum>19) smfltnum =19;
      if (smfltnum<10) smfltnum = '0' + smfltnum + 'A';
      else smfltnum = smfltnum + 'A';
      tcFactory.setSmfltnum(smfltnum);
      this.smfltnum=smfltnum.substring(0,2);
      this.time.selected={ref:parseInt(this.smfltnum,10),time:this.smfltnum + ":00"};
      //tcFactory.refreshFlights();
    };
    
    this.plus = function(){
      this.smfltnum = (parseInt(this.smfltnum,10)+1).toString();
      this.time.selected={ref:parseInt(this.smfltnum,10),time:this.smfltnum + ":00"};
      this.makeSm();
    };
    
    this.minus = function(){
      this.smfltnum = (parseInt(this.smfltnum,10)-1).toString();
      this.time.selected={ref:parseInt(this.smfltnum,10),time:this.smfltnum + ":00"};
      this.makeSm();
    };
    
    this.upDate =function(){
      tcFactory.setDate(new Date(this.date));
    };
    
    this.makeSm = function(){
      if (this.time.selected.ref<10) this.smfltnum="0" + this.time.selected.ref;
      else this.smfltnum=this.time.selected.ref.toString();
      tcFactory.setSmfltnum(this.smfltnum+'A');
      //this.print();
    };
    
    var quick=Modal.confirm.quickMessage();
    
    this.addFlight = function(){
      date = this.date;
      smfltnum = this.smfltnum;
      var pilots=[];
      var aircrafts=[];
      var sections= [];
      
      aircraftSch.forEach(function(ac){
        aircrafts.push(ac.Aircraft);
      });
      pilotSch.forEach(function(p){
        pilots.push(p.Pilot);
      });
      
        
      body = {date:date, smfltnum:smfltnum+'A'};
      tcFactory.getFlights(body,function(flights){
        flights=flights.filter(function(flight){
          if (flight.SmFltNum) return body.smfltnum.toUpperCase()===flight.SmFltNum.toUpperCase();
          else return false;
        });
        flights.forEach(function(flight){
          sections.push(flight['FLIGHT#'].substring(0,1));
          pilots = pilots.filter(function(p){
            if (flight.PILOT) return p.toUpperCase()!==flight.PILOT.toUpperCase();
            else return true;
          });
          aircrafts = aircrafts.filter(function(a){
            if (flight.AIRCRAFT) return a.toUpperCase()!==flight.AIRCRAFT.toUpperCase();
            else return true;
          });
        });
        
        sections.sort(function(a,b){
          return a-b;
        });
        var newSection = 1;
        for (var i=0;i<sections.length;i++){
          if (parseInt(sections[i],10)===newSection) newSection++;
        }
        
        var newFlight = {AIRCRAFT:aircrafts[0], PILOT:pilots[0], 
                         "PAY TIME":0,
                         "FLIGHT#":newSection+smfltnum + 'A', 
                         SmFltNum:smfltnum + 'A',
                         DATE:date
        };
        $http.patch('/api/flights/',newFlight);
        var otherFlight = Object.assign({},newFlight);
        otherFlight.SmFltNum = newFlight.SmFltNum.substring(0,2) + 'B';
        otherFlight['FLIGHT#'] = newFlight['FLIGHT#'].substring(0,3) + 'B';
        $http.patch('/api/flights/',otherFlight).then(function(res){
          quick('Flight #' + newFlight['FLIGHT#'] + ' and #' + otherFlight['FLIGHT#'] + ' added.');
        });
        
      });  
        
    };
    this.print = function(){
      tcFactory.setDate(this.date);
      body = {date:this.date, smfltnum:this.smfltnum+'A'};
      sections=[];
    $http.post('/api/reservations/day', body).then(response => {
      response.data.forEach(function(res){
        if (!res.LAST) res.LAST="";
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
        if (res['INVOICE#']) res['INVOICE#'] = res['INVOICE#'].substring(0,9);
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
             if (flight) {
               sections[i].flights[j].aircraft = flight.AIRCRAFT;
               sections[i].flights[j].pilot = flight.PILOT;
               sections[i].pilot = flight.PILOT;
               sections[i].flights[j].date = flight.DATE;
             }
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
            var p = pilotSch.filter(function(pilot){
              if (!sections[i].pilot) return false;
              return pilot.Pilot.toUpperCase()===sections[i].pilot.toUpperCase();
            });
            if (p.length>0) sections[i].pilotCert = p[0].lic;
          }  
          
        });
      });
      this.sections=sections;
      enterTimes(response.data); 
      $timeout($window.print,0);
    });
    };//end of this.print
    
    var enterTimes = function(reservations){
      var possibilities = tcFactory.getPossibility();
      var covered = tcFactory.getCovered();
      var success,sectionRes,route,sections,otherFlight,otherFlightUsed,start,end,flightDate,thisCovered, hours,minutes;
      //enter pilot times into each flight for this smfltnum
      tcFactory.getFlights(body,function(f){
        var allFlights=f.filter(function(flight){
          return flight.SmFltNum.substring(0,2)===tcFactory.getSmfltnum().substring(0,2);
        });
        //clean times
        allFlights.forEach(function(flight){
          flight['PAY TIME']=0;
          for (var i=1;i<5;i++){
            start = 'Start' + i;
            end = 'End' + i;
            route = 'Route' + i;
            flight[start] = null;
            flight[end] = null;
            flight[route] = null;
          }
        });
        //ignore duplicates
        sections=[];
        for (var i=0;i<allFlights.length;i++) {
          if (sections.indexOf(allFlights[i]['FLIGHT#'].toUpperCase())<0) {
            sections.push(allFlights[i]['FLIGHT#'].toUpperCase());
          }
          else {
            //remove spliced flight from database
            $http.delete('/api/flights/' + allFlights[i]._id).then(function(res){
              console.log('deleted ' )
              console.log(allFlights[i])
            });
            allFlights.splice(i,1);
            
            sections=[];
            i=-1;
          }
        }
        var flights=allFlights.filter(function(flight){
          return flight.SmFltNum.toUpperCase()===tcFactory.getSmfltnum().substring(0,2)+'A';
        });
        //each section (just the 'A' sides for now)
        flights.forEach(function(flight){
          
          //loop possibilities, if true, this possibility is the routing
          for (var i=0;i<possibilities.length;i++){
            success=true;
            //within each possibility, loop reservations for current section to prove true or false
            sectionRes=reservations.filter(function(res){
              return res['FLIGHT#'].substring(0,1)===flight['FLIGHT#'].substring(0,1);
            });
            if (sectionRes.length===0) success=false;
            else sectionRes.forEach(function(res){
              if (res['Ref#']>12) return success=false;
              route=covered.filter(function(c){
                return c.ref===res['Ref#'];
              });
              if (route.length>0) {
                route=route[0];
                //is possibilities[i].count contained in route.covered?  if so, success!
                if (route.covered.indexOf(possibilities[i].count)<0) success=false;
              }
              else success=false;
            });
            if (success) {
              //we have found our routing for this section!
              //write appropriate flight times for the found possibility  
              console.log(possibilities[i]);// + ' for section ' + flight['FLIGHT#'].substring(0,1));
              otherFlight = allFlights.filter(function(f){
                return f['FLIGHT#'].toUpperCase()===flight['FLIGHT#'].substring(0,3) + 'B';
              });
              if (otherFlight.length>0) otherFlight=otherFlight[0];
              else otherFlight=undefined;
              otherFlightUsed=false;
              var d = new Date(flight['DATE']);
              flightDate = new Date(d.getFullYear(),d.getMonth(),d.getDate(),0,0,0,0);
              for (var j=0;j<possibilities[i].includes.length;j++){
                thisCovered = covered.filter(function(c){
                  return c.ref===possibilities[i].includes[j];
                });
                if (thisCovered.length>0) {
                  thisCovered=thisCovered[0];
                  start = 'Start' + (j%4+1);
                  end = 'End' + (j%4+1);
                  route = 'Route' + (j%4+1);
                  d=flightDate;
                  hours = parseInt(flight.SmFltNum.substring(0,2),10);
                  if (j<4){
                    flight[start] = hours + ':' + thisCovered.start;
                    flight[end] = hours + ':' + thisCovered.end;
                    flight[route] = possibilities[i].includes[j];
                    flight['PAY TIME'] += (thisCovered.end-thisCovered.start)/60;
                  }
                  else {
                    if (otherFlight){
                      otherFlightUsed=true;
                      otherFlight[start] = hours + ':' + thisCovered.start;
                      otherFlight[end] = hours + ':' + thisCovered.end;
                      otherFlight[route] = possibilities[i].includes[j];
                      otherFlight['PAY TIME'] += (thisCovered.end-thisCovered.start)/60;
                    }
                  }
                }
              }
              console.log(flight)
              //save changes
              $http.put('/api/flights/'+ flight._id,flight);
              if (otherFlightUsed) $http.put('/api/flights/'+ otherFlight._id,otherFlight);
              i=possibilities.length;
            }
          }
        });
      });
      
    }
    
  });
