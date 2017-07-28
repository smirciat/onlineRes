'use strict';

angular.module('tempApp')
  .factory('gridSettings', function (uiGridConstants, tcFactory) {
    var flightDate;
    var flightHour;
    var params={};
    var cellColor = function(grid, row, col, rowRenderIndex, colRenderIndex) {
      var cellClass = "";
      if (row.entity.count%2===0) cellClass = 'even';
      else cellClass = 'odd';
      if (row.entity['FLIGHT#']&&row.entity['FLIGHT#'].substring(3).toUpperCase()==='A') cellClass += ' green';
      else if (row.entity['FLIGHT#']) cellClass += ' red';
      if (row.entity['WEIGHT']===0&&row.entity['FWeight']>0) cellClass += ' yellow';
      if (row.entity['FLIGHT#'].substring(0,1)==="1") cellClass += ' one';
      if (row.entity['FLIGHT#'].substring(0,1)==="2") cellClass += ' two';
      return cellClass;
    };
    var cellTemplateFirst = '<div class="typeaheadcontainer"><form><input id="active-first" type="text" ui-grid-editor ' +
    'class="typeaheadcontrol" autocomplete="off" ' +
    'ng-model="MODEL_COL_FIELD" uib-typeahead="first for first in grid.appScope.firsts | filter:$viewValue | limitTo:8"' +
    'typeahead-on-select="grid.appScope.typeaheadSelected(row.entity, $item,\'FIRST\')" ' +
    '/></form</div>';
    var cellTemplateLast = '<div class="typeaheadcontainer"><form><input id="active-first" type="text" ui-grid-editor ' +
    'class="typeaheadcontrol" autocomplete="off" ' +
    'ng-model="MODEL_COL_FIELD" uib-typeahead="first for first in grid.appScope.lasts | filter:$viewValue | limitTo:8"' +
    'typeahead-on-select="grid.appScope.typeaheadSelected(row.entity, $item,\'LAST\')" ' +
    '/></form></div>'; 
    var selectTemplate='<ui-select-wrap>'+
                         '<ui-select ng-model="MODEL_COL_FIELD" theme="selectize" ng-disabled="disabled" on-select="grid.appScope.updateSelect()" append-to-body="true">'+
                           '<ui-select-match placeholder="Choose...">{{ COL_FIELD }}</ui-select-match>'+
                           '<ui-select-choices repeat="item in col.colDef.editDropdownOptionsArray | filter: $select.search" refresh="grid.appScope.refreshOptions()">' +
                             '<span>{{ item.value }}</span>'+
                           '</ui-select-choices>'+
                         '</ui-select>'+
                       '</ui-select-wrap>';
    //flights api options within an object
    params.flights = {
      gridOptions: {
        rowEditWaitInterval: -1,
        enableCellEditOnFocus: true,
        columnDefs: [
          { name: ' ' , enableCellEdit:false, cellTemplate: '<div><button class="btn btn-danger" type="button" id="removeRow"  ng-click="grid.appScope.removeRow(row)">X</button></div>', width:35 },
          { name: 'SmFltNum', sort: {
                direction: uiGridConstants.ASC, priority: 0},minWidth:100},
          { name: 'FLIGHT#', displayName:'Flight Number', sort: {
                direction: uiGridConstants.ASC, priority: 1},minWidth:100},
          { name: 'DATE', enableCellEdit:false, displayName:'Flight Date', type:'date', 
                cellFilter: 'date:"MM/dd/yyyy"',minWidth:100 },
          { name: 'Pilot',field: 'Pilot.value',  editModelField: 'Pilot',minWidth:100, 
             editDropdownOptionsArray: [], editableCellTemplate: selectTemplate },
          { name: 'Aircraft',field: 'Aircraft.value',  editModelField: 'Aircraft',minWidth:100, 
             editDropdownOptionsArray: [], editableCellTemplate: selectTemplate },
          { name: '.', enableCellEdit:false, cellTemplate: '<div><button class="btn btn-success" type="button" id="removeRow"  ng-click="grid.appScope.flushRows()"><i class="fa fa-hdd-o"></i></button></div>', width:35 } 
        ],
        data : [] 
      },
      
      newRecord: { number: 'fltNum', date:new Date(), pilot:'pilot', aircraft:  'aircraft' 
      },
      
      preSave: ['date'] ,
      
      processAfterGet: function(data){
        if (data) data.forEach(function(d){
          d.Pilot = {value:d.PILOT};
          d.Aircraft = {value:d.AIRCRAFT};
        });
        return data;
        
      }
      
    };

    params.reservations = {
      gridOptions:{
      rowEditWaitInterval: -1,//7000,//-1,
      enableCellEditOnFocus: true,
      enableRowSelection: false,
      multiSelect: false,
      exporterMenuCsv: false,
      enableGridMenu:true,
      showColumnMenu:true,
      columnDefs: [
          { name: ' ', enableCellEdit:false, cellTemplate: '<div><button class="btn btn-danger" type="button" id="removeRow"  ng-click="grid.appScope.removeRow(row)">X</button></div>', width:35 },
          { name: '.', enableCellEdit:false, cellTemplate: '<div><button class="btn btn-warning" type="button" id="return"  ng-click="grid.appScope.return(row)"><i class="fa fa-refresh"></i></button></div>', width:38 },
          { name: 'First Name', field:'FIRST',editableCellTemplate: cellTemplateFirst,cellClass: cellColor,minWidth:90},
          { name: 'Last Name', field:'LAST',editableCellTemplate: cellTemplateLast,cellClass: cellColor,minWidth:90}, 
          { name: 'SF#', field:'smfltnum', width:50,cellClass: cellColor,minWidth:80},
          { name: 'FLT#', field:'FLIGHT#', width:60,cellClass: cellColor,minWidth:90},
          { name: 'Travel Code', field: 'travelCode.value',  editModelField: 'travelCode', cellClass: cellColor,minWidth:140,
             editDropdownOptionsArray: [], editableCellTemplate: selectTemplate},
          { name: 'Time', field: 'time',  width:80,cellClass: cellColor, enableCellEdit:false, minWidth:100},   
          { name: 'Body', field: 'WEIGHT', width:60,cellClass: cellColor,minWidth:100},
          { name: 'Frt', field:'FWeight', width:45,cellClass: cellColor,minWidth:100},
          { name: 'Date', field:'DATE TO FLY', type: 'date', cellFilter: 'date:"MM/dd/yyyy"',cellClass: cellColor,minWidth:100},
          { name: 'Invoice',field:'INVOICE#',cellClass: cellColor,minWidth:100},
          { name: 'Phone',cellClass: cellColor,minWidth:100},
          { name: 'Pilot', field: 'pilot.value', editModelField: 'pilot',cellClass: cellColor,minWidth:100, 
             editDropdownOptionsArray: [], editableCellTemplate: selectTemplate},
          { name: 'Aircraft', field: 'aircraft.value', editModelField: 'aircraft',cellClass: cellColor,minWidth:90, 
             editDropdownOptionsArray: [], editableCellTemplate: selectTemplate},
          { name: 'In?', field: 'checkedIn', width:50, cellClass: cellColor,type: 'boolean',
             cellTemplate: '<input type="checkbox" ng-model="row.entity.checkedIn" ng-change="grid.appScope.setDirty(row.entity)">'}, 
          { name: 'Rtn?', field: 'checkedIn', width:60, cellClass: cellColor,type: 'boolean',
             cellTemplate: '<input type="checkbox" ng-model="row.entity.checkedReturn" ng-change="grid.appScope.setDirty(row.entity)">'}, 
          { name: 'Email', field:'email', visible:false,cellClass: cellColor,minWidth:100},
          { name: 'RESERVED', enableCellEdit:false, field:'DATE RESERVED', type: 'date', cellFilter: 'date:"MM/dd/yyyy"', width:100, visible:false,cellClass: cellColor},
          { name: 'UPDATED', enableCellEdit:false, type: 'date', cellFilter: 'date:"MM/dd/yyyy"', width:100, visible:false,cellClass: cellColor},
          { name: '`', enableCellEdit:false, cellTemplate: '<div><button class="btn btn-info" type="button" ng-click="grid.appScope.getName(row)"><i class="fa fa-male"></i></button></div>', width:35 },
          { name: '\'', enableCellEdit:false, cellTemplate: '<div><button class="btn btn-primary" type="button" ng-click="grid.appScope.getInvoice(row)"><i class="fa fa-info"></i></button></div>', width:32 },
          { name: ',', enableCellEdit:false, cellTemplate: '<div><button class="btn btn-success" type="button" ng-click="grid.appScope.flushRows()"><i class="fa fa-hdd-o"></i></button></div>', width:36 }
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
        
          return tcFactory.getData(function(tcs) {
            if (data) data.forEach(function(d){
              d.travelCode={};
              d.travelCode.value = tcs.filter(function(element){
                return element['Ref#']===d['Ref#'];
              })[0]['Route'];
            });
            return data;
          });
        
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
