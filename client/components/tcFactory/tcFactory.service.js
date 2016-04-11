'use strict';

angular.module('tempApp')
  .service('tcFactory', ['$http', function ($http) {
    var date = new Date(Date.now());
    date = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
    var smfltnum = "09A";
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
            if (flights&&oldBody.date===body.date&&oldBody.smfltnum===body.smfltnum) return callback(flights);
            else {
                oldBody=body;
                $http.post('/api/flights/o',body).success(function(d) {
                  return callback(flights=d);
                });
            }
        },
        getReservations: function (body,callback) {
            if (reservations&&oldBody1.date===body.date&&oldBody1.smfltnum===body.smfltnum) return callback(reservations);
            else {
                oldBody1=body;
                $http.post('/api/reservations/day',body).success(function(d) {
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
            return date;
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
