'use strict';

angular.module('tempApp')
  .factory('gridSettings', function (uiGridConstants, tcFactory) {
var flightDate;
    var flightHour;
    var params={};
    //flights api options within an bject
    params.flights = {
      gridOptions: {
        rowEditWaitInterval: 0,
        enableCellEditOnFocus: true,
        columnDefs: [
          { name: ' ', cellTemplate: '<div><button type="button" id="removeRow"  ng-click="grid.appScope.removeRow(row)">X</button></div>', width:27 },
          { name: 'SmFltNum', sort: {
                direction: uiGridConstants.ASC, priority: 0}},
          { name: 'FLIGHT#', displayName:'Flight Number', sort: {
                direction: uiGridConstants.ASC, priority: 1}},
          { name: 'DATE', displayName:'Flight Date', type:'date', 
                cellFilter: 'date:"MM/dd/yyyy"' },
          { name: 'PILOT'},
          { name: 'AIRCRAFT'} 
        ],
        data : [] 
      },
      
      newRecord: { number: 'fltNum', date:new Date(), pilot:'pilot', aircraft:  'aircraft' 
      },
      
      preSave: ['date'] ,
      
      processAfterGet: function(data){return data;}
      
    };

    params.reservations = {
      gridOptions:{
      rowEditWaitInterval: 0,
      enableCellEditOnFocus: true,
      columnDefs: [
          { name: ' ', cellTemplate: '<div><button type="button" id="removeRow"  ng-click="grid.appScope.removeRow(row)">X</button></div>', width:27 },
          { name: '.', cellTemplate: '<div><button type="button" id="return"  ng-click="grid.appScope.return(row)"><i class="fa fa-refresh"></i></button></div>', width:27 },
          { name: 'First Name', field:'FIRST' },
          { name: 'Last Name', field:'LAST'}, 
          //{ name: 'Ref#'},
          { name: 'Travel Code', field: 'travelCode.value',  editModelField: 'travelCode', 
             editDropdownOptionsArray: [], editableCellTemplate: '<ui-select-wrap><ui-select ng-model="MODEL_COL_FIELD" theme="selectize" ng-disabled="disabled" append-to-body="true"><ui-select-match placeholder="Choose...">{{ COL_FIELD }}</ui-select-match><ui-select-choices repeat="item in col.colDef.editDropdownOptionsArray | filter: $select.search" refresh="grid.appScope.refreshOptions()"><span>{{ item.value }}</span></ui-select-choices></ui-select></ui-select-wrap>' },
          
          { name: 'Body Weight', field: 'WEIGHT'},
          { name: 'Freight Weight', field:'FWeight'},
          //{ name: 'Flight Number', field: 'flightId.value', editModelField: 'flightId', 
          //   editDropdownOptionsArray: [], editableCellTemplate: '<ui-select-wrap><ui-select ng-model="MODEL_COL_FIELD" theme="selectize" ng-disabled="disabled" append-to-body="true"><ui-select-match placeholder="Choose...">{{ COL_FIELD }}</ui-select-match><ui-select-choices repeat="item in col.colDef.editDropdownOptionsArray | filter: $select.search" refresh="grid.appScope.refreshOptions()"><span>{{ item.value }}</span></ui-select-choices></ui-select></ui-select-wrap>' },
          { name: 'Date', field:'DATE TO FLY' , type: 'date', cellFilter: 'date:"MM/dd/yyyy"'},
          { name: 'smfltnum'},
          { name: 'FLIGHT#', sort: {
                direction: uiGridConstants.ASC, priority: 0}},
          { name: 'INVOICE#'},
          //{ name: 'Travel Code', field: 'Ref#', editModelField: 'Ref#', 
          //   editDropdownOptionsArray: [], editableCellTemplate: '<ui-select-wrap><ui-select ng-model="MODEL_COL_FIELD" theme="selectize" ng-disabled="disabled" append-to-body="true"><ui-select-match placeholder="Choose...">{{ COL_FIELD }}</ui-select-match><ui-select-choices repeat="item in col.colDef.editDropdownOptionsArray | filter: $select.search" refresh="grid.appScope.refreshOptions()"><span>{{ item.value }}</span></ui-select-choices></ui-select></ui-select-wrap>' },
          { name: 'RESERVED', field:'DATE RESERVED', type: 'date', cellFilter: 'date:"MM/dd/yyyy"'}
      ],
      data : [] },
      
      newRecord: {
          FIRST: '' ,
          LAST: '',
          'FLIGHT#': '',
          smfltnum: '',
          'DATE TO FLY' : new Date(),
          WEIGHT : 0,
          FWeight: 0,
          'Ref#': 1,
          'DATE RESERVED': new Date()
      },
      
      preSave: ['DATE TO FLY','DATE RESERVED'],
      
      processAfterGet: function(data){
        //$http.get('/api/travelCodes').success(function(tcs){
        tcFactory.getData(function(tcs) {
          data.forEach(function(d){
            d.travelCode={};
            d.travelCode.value = tcs.filter(function(element){
              return element['Ref#']===d['Ref#'];
            })[0]['Route'];
          });
          //if (d.flightId) d.flightId.value = d.flightId.number;
        });
        return data;
        
      }
      
    };
    
    params.travelCodes = {
      gridOptions: {
        rowEditWaitInterval: 0,
        enableCellEditOnFocus: true,
        columnDefs: [
          { name: ' ', cellTemplate: '<div><button type="button" id="removeRow" ng-click="grid.appScope.removeRow(row)">X</button></div>', width:27 },
          { name: 'code', displayName:'Travel Code' },
          { name: 'depart', displayName:'Departure Location' },
          { name: 'arrive', displayName:'Arrival Location' },
          { name: 'index', displayName:'Index', type:'number', sort: {
                direction: uiGridConstants.ASC, priority: 0} 
          }
        ],
        data : [] 
        
      },
      
      newRecord: {
          code:'travel code',depart:'depart', arrive:'arrive', index: 0 
      },
      
      preSave: [],
      
      processAfterGet: function(data){return data;}
      
    };
    
    //$http.get('/api/travelCodes').success(function(data){
    tcFactory.getData(function(data) {
      var max=0;
      data.forEach(function(d){
        if (d.index>max) max=d.index;
      });
      
      params.travelCodes.newRecord={
          code:'travel code',depart:'depart', arrive:'arrive', index: max+1
      };
    });
    
    return {
      get: function(apiName){
        return params[apiName];
      },
      
      getNew: function(apiName){
        return params[apiName].newRecord;
      },
      
      getFun: function(apiName, data){
        return params[apiName].processAfterGet(data);
      },
      
      setCriteria: function(date, hour){
        flightDate=date;
        flightHour=hour;
      },

      testItem: function(item){
        if (flightDate&&item.date){
          var date=flightDate;
          date = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0); 
          var endDate = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
          if (item.date<date||item.date>endDate) return false;
        } 
        if (flightHour&&flightHour!==item.hourOfDay) return false;
        return true;
      },
      
      getQuery: function(){
        var queryString="";
        if (flightDate) queryString+="date="+flightDate;
        if (flightHour) queryString+="&hourOfDay="+flightHour;
        return queryString;
      }
      
    };
  });
