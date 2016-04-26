'use strict';

angular.module('tempApp')
  .directive('myGrid', function ($http, uiGridConstants, gridSettings, socket, $q, tcFactory, $location, $timeout, Modal) {
  return {
    templateUrl: 'components/myGrid/myGrid.html',
    restrict: 'E',
    replace: true,
    scope: {
      nameTrue:'@',
      myApi:'@',
      date:'=',
      smfltnum:'@',
      print:'&'
    },
    link: function (scope, element, attrs ) {
    scope.gridOptions = gridSettings.get(scope.myApi).gridOptions;
    scope.tempData = [];
    scope.quick=Modal.confirm.quickMessage();
    scope.invoice = Modal.confirm.choice(function(response){
      $location.path('/invoice');
    });
    var flight;
    var sections, pilots, aircrafts, pilotSch, aircraftSch, travelCodes;
    tcFactory.getAircraft(function(ac){
      aircraftSch = ac;
    });
    tcFactory.getPilots(function(p){
     pilotSch = p;
    });
    tcFactory.getData(function(t){
     travelCodes = t;
    });
    
    scope.addData = function(){
      var object = angular.copy(gridSettings.get(scope.myApi).newRecord);
      object.smfltnum = scope.smfltnum + "A";
      object['DATE TO FLY'] = scope.date;
      scope.gridOptions.data.push(object);
    };
    
    scope.removeRow = function(row) {
        //put a modal in here?
        row.entity.travelCode=undefined;
        if (row.entity._id) { 
          $http.put('/api/' + scope.myApi + '/superdelete/' + row.entity._id);
          if (scope.myApi==='flights') {
            tcFactory.refreshFlights();
            var newFlight = row.entity['FLIGHT#'].substring(0,3) + 'B';
            if (row.entity['FLIGHT#'].substring(3).toUpperCase()==='B') newFlight=row.entity['FLIGHT#'].substring(0,3) + 'A';
            row.entity['FLIGHT#']=newFlight;
            var body = {date:row.entity['DATE'], smfltnum:row.entity.SmFltNum};
            tcFactory.getFlights(body,function(flts){
              var flt = flts.filter(function(f){
                return f['FLIGHT#']===newFlight;
              });
              if (flt.length>0) {
                $http.put('/api/' + scope.myApi + '/superdelete/' + flt[0]._id);
              }
            });
          }
        }
    };
    
    scope.return = function(row){
      //make a copy of row in the opposite direction
      var newRow = jQuery.extend(true,{},row);
      newRow.entity['$$hashKey'] = undefined;
      newRow.entity._id=undefined;
      newRow.entity['Ref#'] = 13-newRow.entity['Ref#'];
      newRow.entity['FLIGHT#'] = undefined;
      newRow.entity['INVOICE#'] = undefined;
      if (newRow.entity.smfltnum.substring(2)==='A') newRow.entity.smfltnum = newRow.entity.smfltnum.substring(0,2) + 'B';
      else newRow.entity.smfltnum = newRow.entity.smfltnum.substring(0,2) + 'A';
      newRow.entity['DATE RESERVED'] = new Date(Date.now());
      var index = scope.gridOptions.data.indexOf(row);
      tcFactory.getData(function(tcs) {
        var values = tcs.filter(function(element){
              return element['Ref#']===newRow.entity['Ref#'];
            });
        if (values.length>0) newRow.entity.travelCode.value = values[0]['Route'];  
        scope.gridOptions.data.push(newRow.entity);
        $timeout(function(){
          scope.gridApi.rowEdit.setRowsDirty([scope.gridOptions.data[scope.gridOptions.data.length-1]]);
        },100);
      });
    };
    
    scope.index=0;
    scope.saveRow = function( rowEntity ) {
      scope.index = scope.gridOptions.data.indexOf(rowEntity);
      //rowEntity.dateModified = new Date();
      var preSave = gridSettings.get(scope.myApi).preSave;
      preSave.forEach(function(element){
        rowEntity[element] = new Date(rowEntity[element]);
      });
      var body = {date:rowEntity['DATE TO FLY']||rowEntity['DATE'], smfltnum:rowEntity.smfltnum||rowEntity.SmFltNum};
      //reservations only
      if (scope.myApi==='reservations'){
        if (rowEntity['FLIGHT#']&&rowEntity['FLIGHT#'].substring(1)!==rowEntity.smfltnum) rowEntity['FLIGHT#']=undefined;
        pilots=[];
        aircrafts=[];
        sections=['0'];
        aircraftSch.forEach(function(ac){
          aircrafts.push(ac.Aircraft);
        });
        pilotSch.forEach(function(p){
          pilots.push(p.Pilot);
        });
        var tcs,flights, res, temp;
        var promise = tcFactory.getData(function(data){
          tcs=data;
          rowEntity['Ref#'] = tcs.filter(function(element){
              return element['Route']===rowEntity.travelCode.value;
          })[0]['Ref#'];
          rowEntity.travelCode=undefined;
          var obj = {first:rowEntity.FIRST,last:rowEntity.LAST,date:rowEntity['DATE TO FLY']};
          return $http.post('/api/reservations/name',obj);
        })
        
        .then(function(response){
          var done=0;
          for (var i=0;i<response.data.length;i++){
            if (rowEntity.WEIGHT===0) {
              if (response.data[i].WEIGHT&&response.data[i].WEIGHT>0) {
                rowEntity.WEIGHT=response.data[i].WEIGHT;
                done++;
              }
            }
            if (!rowEntity.Phone) {
              rowEntity.Phone=response.data[i].Phone;
              done++;
            }
            if (!rowEntity.email) {
              rowEntity.email=response.data[i].email;
              done++;
            }
            if (done>=3) i = response.data.length;
          }
          return $http.post('/api/flights/o',body);
        })
        
        .then(function(response){
          flights=response.data;
          flight = undefined;
          flights = flights.filter(function(flight){
            return flight.SmFltNum===rowEntity.smfltnum;
          });
          flights.sort(function(a,b){
            return a['FLIGHT#'].localeCompare(b['FLIGHT#']);
          });
          return $http.post('/api/reservations/o',body);
        })
        
        .then(function(response){
            var reservations =response.data.filter(function(reservation){
              return reservation.smfltnum===rowEntity.smfltnum;
            });
            for (var i=0;i<flights.length;i++){
              res = reservations.filter(function(reservation){
                return flights[i]['FLIGHT#']===reservation['FLIGHT#'];
              });
              if (res.length<4) {
                flight = flights[i]['FLIGHT#'];
                i=flights.length;
              }
              else {
                pilots = pilots.filter(function(p){
                  return p.toUpperCase()!==flights[i].PILOT.toUpperCase();
                });
                aircrafts = aircrafts.filter(function(a){
                  return a.toUpperCase()!==flights[i].AIRCRAFT.toUpperCase();
                });
                sections.push(flights[i]['FLIGHT#'].substring(0,1));
              }
            }
            if (!rowEntity['FLIGHT#']) {
              if (flight) rowEntity['FLIGHT#'] = flight;
              else {
                //no room for res, create new flight
                if (pilots.length>0&&aircrafts.length>0){
                  sections.sort(function(a,b){
                    return b<a;
                  });
                  rowEntity['FLIGHT#'] = (parseInt(sections[sections.length-1],10)+1) + rowEntity.smfltnum;
                  var newFlight = {AIRCRAFT:aircrafts[0], PILOT:pilots[0], 
                       "PAY TIME":0,
                       "FLIGHT#":rowEntity['FLIGHT#'].substring(0,3) + 'A', 
                       SmFltNum:rowEntity.smfltnum.substring(0,2) + 'A',
                       DATE:rowEntity['DATE TO FLY']
                  };
                  $http.patch('/api/flights/',newFlight);
                  var otherFlight = Object.assign({},newFlight);
                  otherFlight.SmFltNum = newFlight.SmFltNum.substring(0,2) + 'B';
                  otherFlight['FLIGHT#'] = newFlight['FLIGHT#'].substring(0,3) + 'B';
                  $http.patch('/api/flights/',otherFlight);
                  tcFactory.refreshFlights();
                }
                else rowEntity['FLIGHT#'] = '9' + rowEntity.smfltnum;
              }
            }
            if (rowEntity._id) {
              rowEntity.UPDATED = new Date(Date.now());
              return ($http.patch('/api/' + scope.myApi + '/'+rowEntity._id, rowEntity));
            }
            else {
              scope.gridOptions.data.splice(scope.index,1);
              //if return res (reverse copy) don't addData
              if (!rowEntity.hasOwnProperty('uid')) scope.addData();
              return $http.patch('/api/' + scope.myApi + '/', rowEntity).then(function(response){});
            }
        });
      }
      //other api's
      else {
        if (rowEntity._id) {
          //this is an update
          if (rowEntity.Pilot) rowEntity.PILOT = rowEntity.Pilot.value;
          if (rowEntity.Aircraft) rowEntity.AIRCRAFT = rowEntity.Aircraft.value;
          promise =  $http.patch('/api/' + scope.myApi + '/'+rowEntity._id, rowEntity).then(function(response){
            tcFactory.refreshFlights();
          });
          //update other half of flight
          $http.post('/api/flights/o',body).then(function(response){
            var flights = response.data.filter(function(flt){
              var end = 'B';
              if (rowEntity['FLIGHT#'].substring(3).toUpperCase()==='B') end = 'A';
              return flt['FLIGHT#'].toUpperCase()===(rowEntity['FLIGHT#'].substring(0,3) + end).toUpperCase();
            });
            if (flights.length>0) {
              flights[0].PILOT = rowEntity.PILOT;
              flights[0].AIRCRAFT = rowEntity.AIRCRAFT;
              $http.patch('/api/' + scope.myApi + '/' + flights[0]._id, flights[0]);
            }
          });
        }
        else {
              scope.gridOptions.data.splice(scope.index,1);
              if (!rowEntity.hasOwnProperty('uid')) scope.addData();
              promise = $http.patch('/api/' + scope.myApi + '/', rowEntity).then(function(response){
                tcFactory.refreshFlights();
              });
        }
      }
        
       //actually save the change
      scope.gridApi.rowEdit.setSavePromise( rowEntity, promise);
    };
    
    scope.gridOptions.multiSelect=false;
    
    scope.gridOptions.onRegisterApi = function(gridApi){
    //set gridApi on scope
      scope.gridApi = gridApi;
      gridApi.rowEdit.on.saveRow(scope, scope.saveRow);
      scope.gridApi.edit.on.afterCellEdit(scope,function(rowEntity, colDef, newValue, oldValue){
        var body = {date:rowEntity['DATE TO FLY'], flight:rowEntity['FLIGHT#']};
        var body1 = {date:rowEntity['DATE TO FLY'], flight:rowEntity['FLIGHT#'].substring(0,3) +'B'};
        if (rowEntity['FLIGHT#'].substring(3).toUpperCase()==='B') body1 = {date:rowEntity['DATE TO FLY'], flight:rowEntity['FLIGHT#'].substring(0,3) +'A'};
        
        if (scope.myApi==='reservations'&&$location.path()==='/oneFlight'&&(colDef.name==="Pilot"||colDef.name==="Aircraft")) {
          $http.post('/api/flights/o',body)
            .then(function(response){
              response.data[0][colDef.name.toUpperCase()]=newValue;
              $http.patch('/api/flights/' + response.data[0]._id,response.data[0]);
            });
          $http.post('/api/flights/o',body1)
            .then(function(response){
              response.data[0][colDef.name.toUpperCase()]=newValue;
              $http.patch('/api/flights/' + response.data[0]._id,response.data[0])
                .then(function(res){
                  tcFactory.refreshFlights();
                  scope.setPlanePilot();
                });
            });
        }
        if (scope.myApi==='reservations'&&$location.path()==='/oneFlight'&&colDef.name==="Last Name"&&rowEntity.WEIGHT===0) {
          //look up body weight
          $http.post('/api/reservations/name',{first:rowEntity.FIRST,last:rowEntity.LAST}).success(function(data){
            for (var i=0;i<data.length;i++){
              if (data[i].WEIGHT>0) {
                rowEntity.WEIGHT = data[i].WEIGHT;
                if (!rowEntity.Phone) rowEntity.Phone=data[i].Phone;
                i=data.length;
              }
            }
          });
        }
      });
    };

    scope.refreshOptions = function(){
      if (scope.myApi==="reservations"){
        //$http.get('/api/travelCodes').success(function(data){
        tcFactory.getData(function(data) {
          data.forEach(function(d){
            d.value=d['Route'];
          });
          scope.gridOptions.columnDefs[6].editDropdownOptionsArray= data;
        });
        //12 pillots
        tcFactory.getPilots(function(data) {
          data.forEach(function(d){
            d.value=d['Pilot'];
          });
          scope.gridOptions.columnDefs[12].editDropdownOptionsArray= data;
        });
        //13 aircraft
        tcFactory.getAircraft(function(data) {
          data.forEach(function(d){
            d.value=d['Aircraft'];
          });
          scope.gridOptions.columnDefs[13].editDropdownOptionsArray= data;
        });
      }
      if (scope.myApi==="flights"){
        //$http.get('/api/travelCodes').success(function(data){
        tcFactory.getPilots(function(data) {
          data.forEach(function(d){
            d.value=d['Pilot'];
          });
          scope.gridOptions.columnDefs[4].editDropdownOptionsArray= data;
        });
        tcFactory.getAircraft(function(data) {
          data.forEach(function(d){
            d.value=d['Aircraft'];
          });
          scope.gridOptions.columnDefs[5].editDropdownOptionsArray= data;
        });
      }
    };
    
    scope.selectedRow={};
    
    scope.rowDate = function(){
      return new Date(scope.selectedRow.entity.date);
    };
    
    var tempDate=new Date(2016,2,4,0,0,0,0); 
    scope.query = "date=" + tempDate + "&hourOfDay=8";
    gridSettings.setCriteria(tempDate,8);
    scope.query = gridSettings.getQuery();
    if (scope.myApi!=="reservations") scope.query="";
    
    scope.setPlanePilot = function(){
        var flts;
        if (scope.gridOptions.data.length>0){
          for (var i=0;i<scope.gridOptions.data.length;i++){
            scope.gridOptions.data[i].count=i;
          }
          var body = {date:scope.gridOptions.data[0]['DATE TO FLY'],smfltnum:scope.gridOptions.data[0].smfltnum};
          tcFactory.getFlights(body,function(flights){
            return tcFactory.getPilots(function(pilots){
              scope.gridOptions.data.forEach(function(d){
                flts = flights.filter(function(flight){
                  return flight['FLIGHT#']===d['FLIGHT#'];
                });
                d.pilot={};
                if (flts.length>0){ 
                  d.pilot.value = pilots.filter(function(element){
                    return element['Pilot']===flts[0]['PILOT'];
                  })[0]['Pilot'];
                }
              });
              return tcFactory.getAircraft(function(aircraft){
                scope.gridOptions.data.forEach(function(d){
                  flts = flights.filter(function(flight){
                    return flight['FLIGHT#']===d['FLIGHT#'];
                  });
                  d.aircraft={};
                  if (flts.length>0){
                    d.aircraft.value = aircraft.filter(function(element){
                      return element['Aircraft']===flts[0]['AIRCRAFT'];
                    })[0]['Aircraft'];
                  }
                });
                return scope.gridOptions.data;
              });
            });
          });  
        }
    };    
      
    scope.getData = function(query){
      var ext = '/o';
      if (scope.nameTrue==="true") {
        ext = '/name';
      }
      $http.post('/api/' + scope.myApi + ext, query).success(function(data){
        data = gridSettings.getFun(scope.myApi,data);
        scope.gridOptions.data=data;
        scope.addData();
        if (scope.myApi==='reservations'&&$location.path()==='/oneFlight') scope.setPlanePilot();
        scope.shortApi = scope.myApi.substr(0,scope.myApi.length-1);
        socket.unsyncUpdates(scope.shortApi);
        socket.syncUpdates(scope.shortApi, scope.gridOptions.data, function(event, item, array){
          if (scope.shortApi==='reservation') array.forEach(function(r){
            //cleanse newRecord of contaminated data for unknown reason
            if (!r.hasOwnProperty('uid')) {
              r.FIRST = '';
              r.LAST='';
              r['FLIGHT#']='';
              r.WEIGHT=0;
              r.FWeight=0;
              r.pilot={};
              r.aircraft={};
              r['INVOICE#']='';
              r.Phone='';
            }
          });
          array = array.filter(function(element){
            var result = true;
            if (query.date&&result) {
              var date = new Date(query.date);
              var year = date.getFullYear();
              var month = date.getMonth();
              var day = date.getDate();
              var date1 = new Date(element['DATE TO FLY']||element['DATE']);
              var year1 = date1.getFullYear();
              var month1 = date1.getMonth();
              var day1 = date1.getDate();
              result = new Date(year, month, day ,0,0,0,0).getTime() === new Date(year1,month1,day1,0,0,0,0).getTime();
            }
            if (query.hourOfDay&&result) {
              if (element.smfltnum) result = query.hourOfDay===element.smfltnum.substring(0,2);
              else if (element.SmFltNum) result = query.hourOfDay===element.SmFltNum.substring(0,2);
            }
            if (query.invoice&&result) result = query.invoice===element['INVOICE#']
            if (query.first&&result) result = query.first.substring(0,1).toLowerCase()===element.FIRST.substring(0,1).toLowerCase();
            if (query.last&&result) result = query.last.substring(0,1).toLowerCase()===element.LAST.substring(0,1).toLowerCase();
            return result;
          });
          scope.gridOptions.data = gridSettings.getFun(scope.myApi,array);
          scope.gridOptions.data.sort(function(a,b){
            if (!a['FLIGHT#']) return true;
            if (!b['FLIGHT#']) return false;
            if (a['FLIGHT#']===b['FLIGHT#']) return a['Ref#']>b['Ref#'];
            return a['FLIGHT#'].localeCompare(b['FLIGHT#']);
          });
          scope.print();
          if (scope.myApi==='reservations'&&$location.path()==='/oneFlight') scope.setPlanePilot();
        });
      });  
    };
    
    scope.flushRows = function(){
      scope.gridApi.rowEdit.flushDirtyRows(scope.gridApi.grid);
    };
    
    scope.makeQuery = function(){
      var date = new Date(scope.date);
      tempDate=new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0); 
      var query = {date: tempDate,hourOfDay:scope.smfltnum};
      var tc = tcFactory.getName();
      if (scope.nameTrue==="true") {
        if (tc&&tc.length>1) query = {first:tcFactory.getName()[0], last:tcFactory.getName()[1]};
        else query={};
      }
      if (scope.nameTrue==="invoice") {
        tc = tcFactory.getInvoice();
        if (tc) query = {invoice:tc};
        else query = {};
      }
      scope.getData(query);
    };
    
    scope.getName = function(row){
      tcFactory.setName([row.entity.FIRST,row.entity.LAST]);
      tcFactory.setDate(row.entity['DATE TO FLY']);
      $location.path('/oneName');
    };
    
    scope.getInvoice = function(row){
      var obj = {first:row.entity.FIRST,last:row.entity.LAST,date:row.entity['DATE TO FLY']};
      $http.post('/api/reservations/name',obj)
        .then(function(response){
          for (var i=0;i<response.data.length;i++){
            if (!row.entity['INVOICE#']) {
              if (response.data[i]['INVOICE#']&&Number.isInteger(parseInt(response.data[i]['INVOICE#'].substring(0,8),10))) 
                row.entity['INVOICE#']=response.data[i]['INVOICE#'];
              scope.gridApi.rowEdit.setRowsDirty([row.entity]);
            }  
          }
        })
      ;
      if (row.entity['INVOICE#']) {  
        obj = {invoice:row.entity['INVOICE#']};
        $http.post('/api/reservations/o',obj).then(function(response){
          var count=0;
          for (var i=0;i<response.data.length;i++){
            if (row.entity['INVOICE#']===response.data[i]['INVOICE#']) count++;
          }
          if (count>0) {
              tcFactory.setInvoice(row.entity['INVOICE#']);
              scope.invoice('Invoice ' + row.entity['INVOICE#']  + ' has been used ' + count + ' times.');
          }
        });
      }
    };
    
    scope.$on('$destroy', function () {
      socket.unsyncUpdates(scope.shortApi);
    });
    scope.$watch('date',function(){
      scope.makeQuery();
    });
    if (scope.smfltnum) {
      scope.$watch('smfltnum',function(){
        scope.makeQuery();
      });
    }
    //scope.getData(scope.query);
   }
  };
  });