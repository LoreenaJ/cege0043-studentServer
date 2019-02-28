// express is the server that forms part of the NodeJS program
var express = require('express');
var path = require('path');
var app = express();

// add an http server to serve files to the Edge browser
// due to certificate issues it rejetcs the https files if they are not directly called in a typed URL
var http = require('http');
var httpServer = http.createServer(app);

httpServer.listen(4480);

// adding functionality to process the form data
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// import required database connectivity code to set up database connection
var fs = require('fs');
var pg = require('pg');

var configtext = ""+fs.readFileSync("/home/studentuser/certs/postGISConnection.js");

//convert the configuration file into the correct format (e.g. a name/valu pair array)
var configarray = configtext.split(",");
var config = {};
for (var i = 0;i < configarray.length; i++){
	var split = configarray[i].split(':');
	config[split[0].trim()] = split[1].trim();
}

var pool = new pg.Pool(config);

//adding functionality to test out the connection
app.get('/postgistest',function(req,res){
	pool.connect(function(err,client,done){
		if(err){
			console.log("Not able to get connection"+err);
			res.status(400).send(err);
		}
		client.query('SELECT name FROM london_poi',function(err,result){
			done();
			if(err){
				console.log(err);
				res.status(400).send(err);
			}
			res.status(200).send(result.rows);
		});
	});
});

// adding functionality to allow cross-domain queries when PhoneGap is running a server
app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","X-Requested-With");
	next();
});

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

app.post('/refelctData',function(req,res){
	//note that we are using POST here as we are uploading the data so the parameters form part of the BODY of the request rather
	//than the RESTful API
	console.dir(req.body);

	//for now, just echo the request back to the client
	res.send(req.body);
});

// finally - serve static files for requests that are not met by any of the
// code above
// serve static files - e.g. html, css
app.use(express.static(__dirname));
