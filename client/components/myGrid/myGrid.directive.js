'use strict';

angular.module('tempApp')
  .directive('myGrid', function ($http, uiGridConstants, gridSettings, socket, $q, tcFactory, $location, $timeout, Modal,email,User) {
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
    scope.users = User.query();
    scope.gridOptions = gridSettings.get(scope.myApi).gridOptions;
    scope.tempData = [];
    scope.quick=Modal.confirm.quickMessage();
    scope.invoice = Modal.confirm.choice(function(response){
      $location.path('/invoice');
    });
    var flight;
    var reload=true;
    var sections, pilots, aircrafts, pilotSch, aircraftSch, travelCodes;
    scope.firsts=[];
    scope.lasts=[];
    tcFactory.getAircraft(function(ac){
      aircraftSch = ac;
    });
    tcFactory.getPilots(function(p){
     pilotSch = p;
    });
    tcFactory.getData(function(t){
     travelCodes = t;
    });
    tcFactory.getFlights({date:scope.date},function(f){
     
    });
    $http.post('/api/reservations/first').then(function(res){
      res.data.forEach(function(first){
        scope.firsts.push(first.FIRST);
      });
    });
    $http.post('/api/reservations/last').then(function(res){
      res.data.forEach(function(last){
        scope.lasts.push(last.LAST);
      });
    });
    scope.typeaheadSelected = function(entity, selectedItem,field) {
        entity[field] = selectedItem;
        scope.$broadcast('uiGridEventEndCellEdit');
    };
    scope.clickedSomewhereElse = function(){
      console.log('hit');
      scope.$broadcast('uiGridEventEndCellEdit');
    };
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
            //tcFactory.refreshFlights();
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
      if (newRow.entity.smfltnum.substring(2).toUpperCase()==='A') newRow.entity.smfltnum = newRow.entity.smfltnum.substring(0,2) + 'B';
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
          //rowEntity.travelCode=undefined;
          var obj = {first:rowEntity.FIRST,last:rowEntity.LAST,date:rowEntity['DATE TO FLY']};
          return $http.post('/api/reservations/name',obj);
        })
        
        .then(function(response){
          if (rowEntity.LAST) {//no need to look up attributes for a res if there is no last name
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
              if (!rowEntity.uid){
                if (response.data[i].uid) {
                  //I don't want to paste in uid if the name does not match.  users might add res for another person, if they spot someone else's res in their list, they might delete it accidentally
                  var users = scope.users.filter(function(user){
                    return user._id===response.data[i].uid;
                  });
                  if (users.length>0&&users[0].name&&
                        users[0].name.toUpperCase()===response.data[i].FIRST.toUpperCase() + ' ' + response.data[i].LAST.toUpperCase()) {
                    rowEntity.uid=response.data[i].uid;
                    done++;
                  }
                }
              }
              if (done>=4) i = response.data.length;
            }
            if (rowEntity.dirty&&rowEntity.email) sendEmail(rowEntity);
          }
          return $http.post('/api/flights/o',body);
        })
        
        .then(function(response){
          flights=response.data;
          flight = undefined;
          flights = flights.filter(function(flight){
            return flight.SmFltNum.toUpperCase()===rowEntity.smfltnum.toUpperCase();
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
                return flights[i]['FLIGHT#'].toUpperCase()===reservation['FLIGHT#'].toUpperCase();
              });
              if (res.length<4) {
                flight = flights[i]['FLIGHT#'];
                i=flights.length;
              }
              else {
                pilots = pilots.filter(function(p){
                  if (flights[i].PILOT) return p.toUpperCase()!==flights[i].PILOT.toUpperCase();
                  else return true;
                });
                aircrafts = aircrafts.filter(function(a){
                  if (flights[i].AIRCRAFT) return a.toUpperCase()!==flights[i].AIRCRAFT.toUpperCase();
                  else return true;
                });
                if (flights[i]['FLIGHT#']) sections.push(flights[i]['FLIGHT#'].substring(0,1));
              }
            }
            if (!rowEntity['FLIGHT#']) {
              if (flight) rowEntity['FLIGHT#'] = flight;
              else {
                //no room for res, create new flight
                if (pilots.length>0&&aircrafts.length>0){
                  sections.sort(function(a,b){
                    return a-b;
                  });
                  var newSection = 1;
                  for (var i=0;i<sections.length;i++){
                    if (parseInt(sections[i],10)===newSection) newSection++;
                  }
                  rowEntity['FLIGHT#'] = newSection + rowEntity.smfltnum;
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
                  //tcFactory.refreshFlights();
                }
                else rowEntity['FLIGHT#'] = '9' + rowEntity.smfltnum;
              }
            }
            if (rowEntity._id) {
              
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
            //tcFactory.refreshFlights();
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
                //tcFactory.refreshFlights();
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
      gridApi.cellNav.on.navigate(scope,function(newRowcol, oldRowCol){
          scope.$broadcast('uiGridEventEndCellEdit');
      });
      scope.gridApi.edit.on.afterCellEdit(scope,function(rowEntity, colDef, newValue, oldValue){
        var body = {date:rowEntity['DATE TO FLY'], flight:rowEntity['FLIGHT#'].toUpperCase()};
        var body1 = {date:rowEntity['DATE TO FLY'], flight:rowEntity['FLIGHT#'].substring(0,3) +'B'};
        if (rowEntity['FLIGHT#'].substring(3).toUpperCase()==='B') body1 = {date:rowEntity['DATE TO FLY'], flight:rowEntity['FLIGHT#'].substring(0,3) +'A'};
        if (scope.myApi==='reservations'&&$location.path()==='/oneFlight'&&colDef.name==="Travel Code"&&rowEntity.smfltnum){
          tcFactory.getData(function(tcs){
            var t = tcs.filter(function(element){
              return element.Route===newValue;
            });
            if (t.length>0) {
              if (t[0]['NORTH?']==="1") rowEntity.smfltnum = rowEntity.smfltnum.substring(0,2) + 'B';
              else rowEntity.smfltnum = rowEntity.smfltnum.substring(0,2) + 'A';
            }
          });
          
        }
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
                  //tcFactory.refreshFlights();
                  scope.setPlanePilot();
                });
            });
        }
        if (scope.myApi==='reservations'&&$location.path()==='/oneFlight'&&colDef.name==="Last Name"&&rowEntity.WEIGHT===0&&rowEntity.FIRST&&rowEntity.LAST) {
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
        if (scope.myApi==='reservations'&&$location.path()==='/oneFlight'&&colDef.name==="First Name"&&rowEntity.FIRST) {
          if (newValue&&newValue.split(" ").length>1) {
            rowEntity.LAST = newValue.split(" ")[1];
            if (newValue.split(" ").length>2) {
              for (var i=2;i<newValue.split(" ").length;i++){
                rowEntity.LAST = rowEntity.LAST + ' ' + newValue.split(" ")[i];
              }
            }
            rowEntity.FIRST = newValue.split(" ")[0];
          }
        }
        if (scope.myApi==='reservations'&&$location.path()==='/oneFlight'&&(colDef.name==="SF#"||colDef.name==="Date")) {
          //for sake of determining if sending an email is appropriate
          rowEntity.dirty=true;
          if (rowEntity._id) rowEntity.UPDATED = new Date(Date.now());
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
        //12 pilots
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
                  return flight['FLIGHT#'].toUpperCase()===d['FLIGHT#'].toUpperCase();
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
                    return flight['FLIGHT#'].toUpperCase()===d['FLIGHT#'].toUpperCase();
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
        reload=false;
        data = gridSettings.getFun(scope.myApi,data);
        scope.gridOptions.data=data;
        if (data) scope.tempData=data.slice();
        scope.addData();
        if (scope.myApi==='reservations'&&$location.path()==='/oneFlight') scope.setPlanePilot();
        scope.shortApi = scope.myApi.substr(0,scope.myApi.length-1);
        socket.unsyncUpdates(scope.shortApi);
        socket.syncUpdates(scope.shortApi, scope.tempData, function(event, item, array){
          //this is similar to the implementation in the socket service, but is duplicated here since new records are only synced with socket service after they are saved.  Working on data array on this side allows those unsaved records to be preserved after socket update.
          if (event==='updated'){
            var oldItem = _.find(scope.gridOptions.data, {_id: item._id});
            if (oldItem) {
              var date = new Date(query.date);
              var date1 = new Date(item['DATE TO FLY']||item['DATE']);
              var smfltnum = item.smfltnum||item.SmFltNum;
              if (smfltnum.substring(0,2)===query.hourOfDay&&date.getDate()===date1.getDate()&&date.getMonth()===date1.getMonth()) {
                var index = scope.gridOptions.data.indexOf(oldItem);
                scope.gridOptions.data.splice(index, 1, item);
              }
              else  _.remove(scope.gridOptions.data, {_id: item._id});
            }
            else event='created';
          }
          if (event==='created') {
            var result = true;
            if (query.date&&result) {
              var date = new Date(query.date);
              var year = date.getFullYear();
              var month = date.getMonth();
              var day = date.getDate();
              var date1 = new Date(item['DATE TO FLY']||item['DATE']);
              var year1 = date1.getFullYear();
              var month1 = date1.getMonth();
              var day1 = date1.getDate();
              result = new Date(year, month, day ,0,0,0,0).getTime() === new Date(year1,month1,day1,0,0,0,0).getTime();
            }
            if (query.hourOfDay&&result) {
              if (item.smfltnum) result = query.hourOfDay===item.smfltnum.substring(0,2);
              else if (item.SmFltNum) result = query.hourOfDay===item.SmFltNum.substring(0,2);
            }
            if (query.invoice&&result) result = query.invoice===item['INVOICE#'];
            if (query.first&&result) result = query.first.substring(0,1).toLowerCase()===item.FIRST.substring(0,1).toLowerCase();
            if (query.last&&result) result = query.last.substring(0,1).toLowerCase()===item.LAST.substring(0,1).toLowerCase();
            if (result) scope.gridOptions.data.push(item);
          }
          
          if (event==='deleted'){
            _.remove(scope.gridOptions.data, {_id: item._id}); 
          }
          if ($location.path()!=='/oneFlight') scope.gridOptions.data=scope.tempData.slice();
          scope.gridOptions.data = gridSettings.getFun(scope.myApi,scope.gridOptions.data);
          if ($location.path()==='/oneFlight'||$location.path()==='/todaysFlights') scope.gridOptions.data.sort(function(a,b){
            if (!a['FLIGHT#']) return true;
            if (!b['FLIGHT#']) return false;
            if (a['FLIGHT#'].toUpperCase()===b['FLIGHT#'].toUpperCase()&&$location.path()==='/oneFlight') return a['Ref#']>b['Ref#'];
            return a['FLIGHT#'].localeCompare(b['FLIGHT#']);
          });
          else scope.gridOptions.data.sort(function(a,b){
            if (a['DATE TO FLY']) return new Date(b['DATE TO FLY']) - new Date(a['DATE TO FLY']);
            return true;
          });
          if (scope.myApi==='reservations'&&$location.path()==='/oneFlight') {
            scope.setPlanePilot();
          }
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
      socket.unsyncUpdates('flight');
    });
    scope.$watch(function(){ return tcFactory.getF(); }, function(flts){
      if (scope.myApi==='reservations') scope.setPlanePilot();
    }, true);
    scope.$watch('date',function(){
      scope.makeQuery();
    });
    if (scope.smfltnum) {
      scope.$watch('smfltnum',function(){
        //don't need two makeQUery's on page reload!
        if (!reload) scope.makeQuery();
      });
    }
    var sendEmail = function(res){
      if (res['Ref#']<=12) {
        var code = email.travelCodes.filter(function ( tc ) {
          return tc.ref === res['Ref#'];
        })[0];
        res.FROM = code.name;
        if (parseInt(res.smfltnum.substring(0,2),10)<12) res.TIME=parseInt(res.smfltnum.substring(0,2),10) + code.time + ' AM';
        else if (parseInt(res.smfltnum.substring(0,2),10)===12) res.TIME="12" + code.time + ' PM';
             else res.TIME=(parseInt(res.smfltnum.substring(0,2),10)-12) + code.time + ' PM';
        var d = new Date(res["DATE TO FLY"]);
        res.DATE = (d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear();
        var resEntry = res.FIRST + ' ' + res.LAST + ' has a reservation at ' +  res.TIME + ' on ' + res.DATE + ' from ' + res.FROM + '.';
        email.sendEmail(res,resEntry,res);
      }
    };
  }
  };
  });