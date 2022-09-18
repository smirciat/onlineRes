(function(angular, undefined) {
'use strict';

angular.module('tempApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','applicant','admin','superadmin'],angularMomentConfig:{timezone:'America/Anchorage'},pdfFiles:['OPS SPECS 2017-11-10.pdf','SBA Employee Manual.pdf','SBA OPERATIONS Manual Rev26 .pdf','SOP Beach Ops 6-10-13.pdf','SOP Fuel Verification 1-18-17 Rev 2.pdf','SOP Operational Control Final 5-19-17.PDF','SOP-Secured-Aircraft.pdf'],eightHourEmployees:[29,1548],tests:[{cat:'Pilots',list:[{id:'b3y58e5273a2fc98',name:'Secured Aircraft Check',vendor:''},{id:'vcg58e52936a8a93',name:'Fuel Verification',vendor:''},{id:'vxv58f66f1875cd1',name:'Bay Procedures',vendor:''},{id:'gbm58e5cd0915bdd',name:'Operational Control',vendor:''},{id:'npe58edbca5cbfed',name:'Weatherhawk',vendor:''},{id:'d3758e6849d25f54',name:'CFIT',vendor:''},{id:'91886129-ee78-49b1-9d19-b7b26877effa',name:'SMS',vendor:'elearning'},{id:'per5a049029cdb52',name:'Emergency Response Plan - Aircraft Accident',vendor:''}]},{cat:'Rampers',list:[{id:'ntv58efae259e78e',name:'Vehicle Operations',vendor:''},{id:'91886129-ee78-49b1-9d19-b7b26877effa',name:'SMS',vendor:'elearning'}]},{cat:'Flight Coordinators',list:[{id:'vcg58e52936a8a93',name:'Fuel Verification',vendor:''},{id:'gbm58e5cd0915bdd',name:'Operational Control',vendor:''},{id:'npe58edbca5cbfed',name:'Weatherhawk',vendor:''},{id:'91886129-ee78-49b1-9d19-b7b26877effa',name:'SMS',vendor:'elearning'},{id:'per5a049029cdb52',name:'Emergency Response Plan - Aircraft Accident',vendor:''}]},{cat:'Maintenance',list:[{id:'91886129-ee78-49b1-9d19-b7b26877effa',name:'SMS',vendor:'elearning'}]},{cat:'Management',list:[{id:'per5a049029cdb52',name:'Emergency Response Plan - Aircraft Accident',vendor:''},{id:'91886129-ee78-49b1-9d19-b7b26877effa',name:'SMS',vendor:'elearning'}]}]})

;
})(angular);