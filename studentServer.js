// express is the server that forms part of the nodejs program
var express = require('express');
var app = express();

var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(app);
var configtext = ""+fs.readFileSync("/home/studentuser/certs/postGISConnection.js");

// now convert the configruation file into the correct format -i.e. a name/value pair array
var configarray = configtext.split(",");
var config = {};
for (var i = 0; i < configarray.length; i++) {
    var split = configarray[i].split(':');
    config[split[0].trim()] = split[1].trim();
}


console.log(config);

var pg = require('pg');
var pool = new pg.Pool(config)

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


httpServer.listen(4480);

// adding functionality to allow cross-domain queries when PhoneGap is running a server
app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	next();
});

app.post('/uploadData',function(req,res){
	// note that we are using POST here as we are uploading data
	// so the parameters form part of the BODY of the request rather than the RESTful API
	console.dir(req.body);

	pool.connect(function(err,client,done){
		if(err){
			console.log("not able to get connection "+ err);
			res.status(400).send(err);
		}

		var name = req.body.name;
		var surname = req.body.surname;
		var module = req.body.module;
		var portnum = req.body.port_id;
		var querystring = "INSERT into formdata (name,surname,module, port_id) values ($1,$2,$3,$4)";
		
		console.log(querystring);

		client.query(querystring,[name,surname,module,portnum],function(err,result){
			done();
			if(err){
				console.log(err);
				res.status(400).send(err);
			}
			res.status(200).send("row inserted");
		});
	});
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

// finally - serve static files for requests that are not met by any of the
// code above
// serve static files - e.g. html, css
app.use(express.static(__dirname));
