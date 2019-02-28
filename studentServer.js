// express is the server that forms part of the NodeJS program
var express = require('express');
var path = require('path');
var app = express();

// add an http server to serve files to the Edge browser
// due to certificate issues it rejetcs the https files if they are not directly called in a typed URL
var http = require('http');
var httpServer = http.createServer(app);
httpServer.listen(4480);

app.get('/',function(req,res){
	res.send('Hello world from the HTTP server');
});