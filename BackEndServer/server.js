/*


Summary: The server.js is used to start the backend server.
*/

var serveStatic = require("serve-static");


const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const logger = require('./utils/logger');

var app = require('./controller/app.js');

var port = 8081;

// Create a daily rotating write stream for Morgan
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs')
});

// 1. Log to the rotating file (Standard Apache Combined format)
app.use(morgan('combined', { stream: accessLogStream }));

// 2. ALSO pipe to Winston so security events are captured in the app logs
app.use(morgan('dev', {
  stream: { write: (message) => logger.info(`HTTP Request: ${message.trim()}`) }
}));

app.use(serveStatic(__dirname + "/public"));

var server = app.listen(port, "127.0.0.1", function () {
  console.log("Web App Hosted at http://127.0.0.1:%s", port);
});
