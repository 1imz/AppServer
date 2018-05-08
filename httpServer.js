// Code adapted from: https://github.com/claireellul/cegeg077-week5server/blob/master/httpServer.js

//Required as part of nodeJS
var express = require('express');
var http = require('http');
var path = require("path");
var app = express();
var httpServer = http.createServer(app); //create the server
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// adding functionality to allow cross-domain queries when PhoneGap is running a server
app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	next();
});

// adding functionality to log the file requests
app.use(function (req, res, next) {
	var filename = path.basename(req.url);
	var extension = path.extname(filename);
	console.log("The file " + filename + " was requested.");
	next();
});

// test for database connection
var configtext =""+fs.readFileSync("/home/studentuser/certs/postGISConnection.js");
// now convert the configuration file into the correct format -i.e. a name/value pair array
var configarray = configtext.split(",");
var config = {};
for (var i = 0; i < configarray.length; i++) {
	var split = configarray[i].split(':');
	config[split[0].trim()] = split[1].trim();
}
var pg = require('pg');
var pool = new pg.Pool(config);

httpServer.listen(4480);
app.get('/', function (req, res) {
	res.send('HTTP: You Forgot the Extension!');
});

//NOT REQUIRED FOR assignment -----
app.get('/getPOI', function (req,res) {
	pool.connect(function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
			res.status(400).send(err);
		}
		// use the inbuilt geoJSON functionality
		// and create the required geoJSON format using a query adapted from here: 
		//http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-FeatureCollections-with-JSON-and-PostGIS-functions.html,accessed 4th January 2018
		// note that query needs to be a single string with no line breaks so build it up bit by bit
		
		var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ";
		querystring = querystring + "(SELECT 'Feature' As type , ST_AsGeoJSON(lg.geom)::json As geometry, ";
		querystring = querystring + "row_to_json((SELECT l FROM (SELECT id, name, category) As l )) As properties";
		querystring = querystring + " FROM formdata As lg limit 100 ) As f ";
		console.log(querystring);
		client.query(querystring,function(err,result){
			//call `done()` to release the client back to the pool
			done();
			if(err){
				console.log(err);
				res.status(400).send(err);
			}
			res.status(200).send(result.rows);
		});
	});
});




//Get data/questions from database table
app.get('/getquestionData', function (req,res) {
     pool.connect(function(err,client,done) {
      	if(err){
          	console.log("not able to get connection "+ err);
           	res.status(400).send(err);
       	}
        	// now use the inbuilt geoJSON functionality
        	// and create the required geoJSON format using a query adapted from here:  
        	// http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-Feature-Collections-with-JSON-and-PostGIS-functions.html, accessed 4th January 2018
        	// note that query needs to be a single string with no line breaks so built it up bit by bit

        	var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features  FROM ";
        	querystring = querystring + "(SELECT 'Feature' As type     , ST_AsGeoJSON(lg.geom)::json As geometry, ";
        	querystring = querystring + "row_to_json((SELECT l FROM (SELECT location_name, question, answer1,answer2,answer3,answer4,correct_answer) As l      )) As properties";
        	querystring = querystring + "   FROM questionform  As lg limit 100  ) As f ";
        	console.log(querystring);

        	// run the second query
        	client.query(querystring,function(err,result){
	          //call `done()` to release the client back to the pool
          	done(); 
           	if(err){
				console.log(err);
				res.status(400).send(err);
          	}
           	res.status(200).send(result.rows);
			});
	});
});


////Uploads answer chosen by user to database table called 'question_answers'
app.post('/AnswerUpload', function(req,res){
	console.dir(req.body);
	pool.connect(function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
			res.status(400).send(err);
		}
		var querystring = "INSERT into question_answers (question,answer,correct_answer) values ('";
		querystring = querystring + req.body.question + "','" + req.body.answer + "','" + req.body.correct_answer+ "')";
		console.log(querystring);
		client.query(querystring,function(err,result) {
			done();
			if(err) {
				console.log(err);
				res.status(400).send(err);
			}
			res.status(200).send("Answer submitted successfully");
		});
	});
});



// the / indicates the path that you type into the server - in this case, what happens when you type in:  http://developer.cege.ucl.ac.uk:32560/xxxxx/xxxxx
app.get('/:name1', function (req, res) {
	console.log('request '+req.params.name1);
	res.sendFile(__dirname + '/'+req.params.name1);
});

// the / indicates the path that you type into the server - in this case, what happens when you type in:  http://developer.cege.ucl.ac.uk:32560/xxxxx/xxxxx
app.get('/:name1/:name2', function (req, res) {
	console.log('request '+req.params.name1+"/"+req.params.name2);
	res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2);
});


// the / indicates the path that you type into the server - in this case, what happens when you type in:  http://developer.cege.ucl.ac.uk:32560/xxxxx/xxxxx/xxxx
app.get('/:name1/:name2/:name3', function (req, res) {
	console.log('request '+req.params.name1+"/"+req.params.name2+"/"+req.params.name3);
	res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2+ '/'+req.params.name3);
});
// the / indicates the path that you type into the server - in this case, what happens when you type in:  http://developer.cege.ucl.ac.uk:32560/xxxxx/xxxxx/xxxx
app.get('/:name1/:name2/:name3/:name4', function (req, res) {
	console.log('request '+req.params.name1+"/"+req.params.name2+"/"+req.params.name3+"/"+req.params.name4); 
	res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2+ '/'+req.params.name3+"/"+req.params.name4);
});