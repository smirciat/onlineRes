'use strict';

angular.module('tempApp')
  .service('tcFactory', ['$http', 'socket', function ($http,socket) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var d = new Date(Date.now());
    var date =date||months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    var smfltnum = (d.getHours()+1);
    if (smfltnum===24) smfltnum=19;
    if (smfltnum<7) smfltnum=7;
    if (smfltnum>19) smfltnum =19;
    if (smfltnum<10) smfltnum = '0' + smfltnum + 'A';
    else smfltnum = smfltnum + 'A';
    var travelCodes;
    var pilots;
    var aircraft;
    var flights;
    var reservations;
    var oldBody = {};
    var oldBody1={};
    var name;
    var invoice;
    return {
        getData: function (callback) {
            if(travelCodes) {
                return callback(travelCodes);
            } else {
                $http.get('/api/travelCodes').success(function(d) {
                    travelCodes = d;
                    return callback(d);
                });
            }
        },
        getFlights: function (body,callback) {
            if (oldBody.date) oldBody.date = new Date(oldBody.date);
            if (body.date) body.date = new Date(body.date);
            if (flights&&oldBody.date&&
                         oldBody.date.getMonth()===body.date.getMonth()&&
                         oldBody.date.getFullYear()===body.date.getFullYear()&&
                         oldBody.date.getDate()===body.date.getDate()) return callback(flights);
            else {
                $http.post('/api/flights/o',{date:body.date}).success(function(d) {
                  oldBody=body;
                  flights=d;
                  var dt;
                  socket.unsyncUpdates('flight');
                  socket.syncUpdates('flight', flights, function(event, item, array){
                     
                     if (oldBody.date){
                        
                        flights=array.filter(function(flight){
                            dt=new Date(flight.DATE);
                            return (dt.getMonth()===oldBody.date.getMonth()
                                   &&dt.getDate()===oldBody.date.getDate()
                                   &&dt.getFullYear()===oldBody.date.getFullYear());
                        }); 
                     } 
                     
                  });
                  return callback(flights);
                });
            }
        },
        getF: function () {
            
                  return flights;

        },
        getReservations: function (body,callback) {
            if (body.smfltnum) body.smfltnum = body.smfltnum.toUpperCase();
            if (reservations&&oldBody1.date===body.date&&oldBody1.smfltnum===body.smfltnum) return callback(reservations);
            else {
                $http.post('/api/reservations/o',body).success(function(d) {
                  oldBody1=body;
                  return callback(reservations=d);
                });
            }
        },
        getPilots: function (callback) {
            if(pilots) {
                return callback(pilots);
            } else {
                $http.get('/api/pilotSchs').success(function(d) {
                    return callback(pilots = d);
                });
            }
        },
        getAircraft: function (callback) {
            if(aircraft) {
                return callback(aircraft);
            } else {
                $http.get('/api/aircraftSchs').success(function(d) {
                    return callback(aircraft = d);
                });
            }
        },
        setInvoice: function(i){
            invoice=i;
        },
        getInvoice: function(){
            return invoice;
        },
        setName: function(nm){
            name=nm;
        },
        getName: function(){
            return name;
        },
        setDate: function(dt){
            date=dt;
        },
        getDate: function(){
            var d = new Date(date);
            return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
        },
        setSmfltnum: function(sm){
           smfltnum=sm.toUpperCase();
        },
        getSmfltnum: function(){
            return smfltnum;
        },
        setRow: function(api,row,callback){
            console.log(row);
            $http.patch('/api/' + api + '/', row).success(function(d){
               return callback(d); 
            });

        },
        refreshFlights: function(){
            oldBody={};
            oldBody1={};
        }
    };
}]);
