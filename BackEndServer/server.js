/*


Summary: The server.js is used to start the backend server.
*/

var express = require('express');
var serveStatic = require('serve-static');
var app = require('./controller/app.js');

var port = 8081;

app.use(serveStatic(__dirname + '/public')); 

var server = app.listen(port, "127.0.0.1" , function(){
    console.log('Web App Hosted at http://127.0.0.1:%s', port);
});