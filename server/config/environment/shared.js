'use strict';
const fs = require('fs');
var files = fs.readdirSync('./server/pdfs');
if (files&&files.length>0) files.splice(0,1);

exports = module.exports = {
  userRoles: ['guest', 'user', 'applicant', 'admin', 'superadmin'],
  angularMomentConfig: {timezone: 'America/Anchorage'},
  pdfFiles: files,
  eightHourEmployees: [29,567],
  tests: [{cat:"Pilots",list:[
            {id:'b3y58e5273a2fc98',name:'Secured Aircraft Check'},
            {id:'vcg58e52936a8a93',name:'Fuel Verification'},
            {id:'vxv58f66f1875cd1', name:'Bay Procedures'},
            {id:'gbm58e5cd0915bdd', name:'Operational Control'},
            {id:'npe58edbca5cbfed',name:'Weatherhawk'},
            {id:'d3758e6849d25f54',name:'CFIT'}
          ]},
          {cat:"Rampers",list:[
            {id:'ntv58efae259e78e', name:'Vehicle Operations'}
          ]},
          {cat:"Flight Coordinators",list:[
            {id:'vcg58e52936a8a93',name:'Fuel Verification'},
            {id:'gbm58e5cd0915bdd', name:'Operational Control'},
            {id:'npe58edbca5cbfed',name:'Weatherhawk'}
          ]}
        ]
          
};
