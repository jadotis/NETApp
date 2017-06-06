﻿var express = require('express'); // Express web server framework
var session = require('express-session');
var app = express();
var request = require('request'); // "Request" library
var handlebars = require('handlebars');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var body_parser = require('body-parser');
var session = require('express-session');
var favicon = require('serve-favicon');
var path = require('path');
const sql = require("mssql/msnodesqlv8");
// /require("msnodesqlv8");
var returnValue = '';
const conn = new sql.ConnectionPool({
    Provider : "SQLOLEDB",
    database: "Footprints",
    server: "bos-footdev01",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
});
conn.connect(function(err){
   if(err)
   {
       console.log(err);
   }
   else
   {
       console.log("Connected");
       const request = new sql.Request(conn);
       var myQuery = request.query('select top 100 mrID, mrTITLE, mrSTATUS, Target__bDate  from dbo.MASTER2 order by mrSUBMITDATE desc;', function(err,result){
           if(err){
               console.log(err);
           }
           else{
               returnValue = result;
           }
       });
       returnValue = myQuery;
   }
});

app.post('/onload', function(req, res){
    console.log('test');
    console.log(returnValue);
    res.send(returnValue); // end the response
});


app.use(body_parser.urlencoded({extended : false}));
app.use(body_parser({limit: '50mb'}));
app.use(body_parser.json());
app.use(express.static(__dirname + '/public')).use(cookieParser());
app.use(favicon(path.join(__dirname, 'public' ,'favicon.ico')));

module.exports = app;

console.log('Listening on 8080');