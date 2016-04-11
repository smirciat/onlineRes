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
        if (row.entity._id) $http.put('/api/' + scope.myApi + '/superdelete/' + row.entity._id);
         
    };
    
    scope.return = function(row){
      //make a copy of row in the opposite direction
      var newRow = jQuery.extend(true,{},row);
      newRow.entity['$$hashKey'] = undefined;
      newRow.entity._id=undefined;
      newRow.entity['Ref#'] = 13-newRow.entity['Ref#'];
      newRow.entity['FLIGHT#'] = undefined;
      if (newRow.entity.smfltnum.substring(2)==='A') newRow.entity.smfltnum = newRow.entity.smfltnum.substring(0,2) + 'B';
      else newRow.entity.smfltnum = newRow.entity.smfltnum.substring(0,2) + 'A';
      newRow.entity['DATE RESERVED'] = new Date(Date.now());
      var index = scope.gridOptions.data.indexOf(row);
      tcFactory.getData(function(tcs) {
        newRow.entity.travelCode.value = tcs.filter(function(element){
              return element['Ref#']===newRow.entity['Ref#'];
            })[0]['Route'];
        //scope.gridOptions.data.splice(index,0,newRow.entity);    
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
        pilots=[];
        aircrafts=[];
        sections=[];
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
              rowEntity.WEIGHT=response.data[i].WEIGHT;
              done++;
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
          return $http.post('/api/reservations/day',body);
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
            if (rowEntity._id) return ($http.patch('/api/' + scope.myApi + '/'+rowEntity._id, rowEntity));
            else {
              scope.gridOptions.data.splice(scope.index,1);
              if (!rowEntity.hasOwnProperty('uid')) scope.addData();
              return $http.patch('/api/' + scope.myApi + '/', rowEntity);
            }
            
        })
        
        
        ;
      }
      //other api's
      else {
        if (rowEntity._id) {
          //this is an update
          if (rowEntity.Pilot) rowEntity.PILOT = rowEntity.Pilot.value;
          if (rowEntity.Aircraft) rowEntity.AIRCRAFT = rowEntity.Aircraft.value;
          promise =  ($http.patch('/api/' + scope.myApi + '/'+rowEntity._id, rowEntity));
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
              promise = $http.patch('/api/' + scope.myApi + '/', rowEntity);
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
    
        
      
    scope.getData = function(query){
      var ext = '/o';
      if (scope.nameTrue==="true") {
        ext = '/name';
      }
      $http.post('/api/' + scope.myApi + ext, query).success(function(data){
        data = gridSettings.getFun(scope.myApi,data);
        scope.gridOptions.data=data;
        scope.addData();
        scope.shortApi = scope.myApi.substr(0,scope.myApi.length-1);
        socket.unsyncUpdates(scope.shortApi);
        socket.syncUpdates(scope.shortApi, scope.gridOptions.data, function(event, item, array){
          scope.gridOptions.data = gridSettings.getFun(scope.myApi,array);
          scope.gridOptions.data.sort(function(a,b){
            if (!a['FLIGHT#']) return true;
            if (!b['FLIGHT#']) return false;
            if (a['FLIGHT#']===b['FLIGHT#']) return a['Ref#']>b['Ref#'];
            return a['FLIGHT#'].localeCompare(b['FLIGHT#']);
          });
          scope.print();
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
        if (tc&&tc.length>1) query = {first:tcFactory.getName()[0], last:tcFactory.getName()[1],date:tcFactory.getDate()};
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
              console.log(response.data[i]['INVOICE#'].substring(0,8));
              if (Number.isInteger(parseInt(response.data[i]['INVOICE#'].substring(0,8),10))) row.entity['INVOICE#']=response.data[i]['INVOICE#'];
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