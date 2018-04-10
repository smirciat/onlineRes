'use strict';
const fs = require('fs');
var files = fs.readdirSync('./server/pdfs');
if (files&&files.length>0) files.splice(0,1);

exports = module.exports = {
  userRoles: ['guest', 'user', 'applicant', 'admin', 'superadmin'],
  angularMomentConfig: {timezone: 'America/Anchorage'},
  pdfFiles: files,
  eightHourEmployees: [29],
  tests: [{cat:"Pilots",list:[
            {id:'b3y58e5273a2fc98',name:'Secured Aircraft Check',vendor:''},
            {id:'vcg58e52936a8a93',name:'Fuel Verification',vendor:''},
            {id:'vxv58f66f1875cd1', name:'Bay Procedures',vendor:''},
            {id:'gbm58e5cd0915bdd', name:'Operational Control',vendor:''},
            {id:'npe58edbca5cbfed',name:'Weatherhawk',vendor:''},
            {id:'d3758e6849d25f54',name:'CFIT',vendor:''},
            {id:'91886129-ee78-49b1-9d19-b7b26877effa',name:'SMS',vendor:'elearning'},
            {id:'per5a049029cdb52',name:'Emergency Response Plan - Aircraft Accident',vendor:''}
          ]},
          {cat:"Rampers",list:[
            {id:'ntv58efae259e78e', name:'Vehicle Operations',vendor:''},
            {id:'91886129-ee78-49b1-9d19-b7b26877effa',name:'SMS',vendor:'elearning'}
          ]},
          {cat:"Flight Coordinators",list:[
            {id:'vcg58e52936a8a93',name:'Fuel Verification',vendor:''},
            {id:'gbm58e5cd0915bdd', name:'Operational Control',vendor:''},
            {id:'npe58edbca5cbfed',name:'Weatherhawk',vendor:''},
            {id:'91886129-ee78-49b1-9d19-b7b26877effa',name:'SMS',vendor:'elearning'},
            {id:'per5a049029cdb52',name:'Emergency Response Plan - Aircraft Accident',vendor:''}
          ]},
          {cat:"Maintenance",list:[
            {id:'91886129-ee78-49b1-9d19-b7b26877effa',name:'SMS',vendor:'elearning'}
          ]},
          {cat:"Management",list:[
            {id:'per5a049029cdb52',name:'Emergency Response Plan - Aircraft Accident',vendor:''},
            {id:'91886129-ee78-49b1-9d19-b7b26877effa',name:'SMS',vendor:'elearning'}
          ]}
        ]
          
};
