(function(angular, undefined) {
'use strict';

angular.module('tempApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','applicant','admin','superadmin'],angularMomentConfig:{timezone:'America/Anchorage'},pdfFiles:['OPS SPECS 2017-05-10.pdf','SBA Employee Manual.pdf','SBA OPERATIONS Manual Rev23.pdf','SOP Beach Ops 6-10-13.pdf','SOP Fuel Verification 1-18-17 Rev 2.pdf','SOP-Operational-Control.pdf','SOP-Secured-Aircraft.pdf'],tests:[{cat:'Pilots',list:[{id:'b3y58e5273a2fc98',name:'Secured Aircraft Check'},{id:'vcg58e52936a8a93',name:'Fuel Verification'},{id:'vxv58f66f1875cd1',name:'Bay Procedures'},{id:'gbm58e5cd0915bdd',name:'Operational Control'},{id:'npe58edbca5cbfed',name:'Weatherhawk'},{id:'d3758e6849d25f54',name:'CFIT'}]},{cat:'Rampers',list:[{id:'ntv58efae259e78e',name:'Vehicle Operations'}]},{cat:'Flight Coordinators',list:[{id:'vcg58e52936a8a93',name:'Fuel Verification'},{id:'gbm58e5cd0915bdd',name:'Operational Control'},{id:'npe58edbca5cbfed',name:'Weatherhawk'}]}]})

;
})(angular);