// express is the server that forms part of the NodeJS program
var express = require('express');
var path = require('path');
var app = express();

// add an http server to serve files to the Edge browser
// due to certificate issues it rejetcs the https files if they are not directly called in a typed URL
var http = require('http');
var httpServer = http.createServer(app);
httpServer.listen(4480);

// adding functionality to log the requests
app.use(function(req,res,next){
	var filename = path.basename(req.url);
	var extension = path.extname(filename);
	console.log('The file '+filename+' was requested.');
	next();
});

app.get('/', function (req, res) {
  	// run some server-side code
	console.log('the http server has received a request');
	res.send('Hello World from the http server');
});

// finally - serve static files for requests that are not met by any of the
// code above
// serve static files - e.g. html, css
app.use(express.static(__dirname));
