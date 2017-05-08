'use strict';

angular.module('tempApp')
  .controller('FomsCtrl', function ($scope,$http) {
    $http.get('/api/runwayChecklists').then((response)=>{
      console.log(response.data)
    });
    this.menuItems = [{item:'Hazard Reporting',href:'/hazard',click:''},
                      {item:'Discrepancy Log',href:'/discrepancy',click:''},
                      {item:'Assess Flight Risk',href:'/foms',click:'assess()'},
                      {item:'Browse and Review',href:'/directives',click:''},
                      {item:'Hobbes Update',href:'/hobbes',click:''}
      ];
    this.villages = [{village:'Homer',array:[{item:'Other',choices:['None','Unreliable Wx Source','Turbulence/Wind Shear Possible']}]}
      
      ];
  });
