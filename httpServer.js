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

// adding functionality to log the requests
app.use(function (req, res, next) {
	var filename = path.basename(req.url);
	var extension = path.extname(filename);
	console.log("The file " + filename + " was requested.");
	next();
});

// read in the file and force it to be a string by adding “” at the beginning
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




//Get questions from database table
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


app.post('/uploadData',function(req,res){
	// note that we are using POST here as we are uploading data
	// so the parameters form part of the BODY of the request rather than the RESTful API
	console.dir(req.body);
	pool.connect(function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
			res.status(400).send(err);
		}
		// pull the geometry component together
		// note that well known text requires the points as longitude/latitude !
		// well known text should look like: 'POINT(-71.064544 42.28787)'
		var geometrystring = "st_geomfromtext('POINT(" + req.body.longitude + " " + req.body.latitude + ")'";
		
		var querystring = "INSERT into questionform (location_name,question, answer1, answer2, answer3, answer4, correct_answer,  geom) values ('";
		querystring = querystring + req.body.location_name + "','" + req.body.question + "','" + req.body.answer1 + "','";
		querystring = querystring + req.body.answer2 + "','" + req.body.answer3 + "','" + req.body.answer4 + "','" + req.body.correct_answer + "',"+geometrystring + "))";
		console.log(querystring);
		client.query( querystring,function(err,result) {
		done();
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		res.status(200).send("row inserted");
		});
	});
});

app.get('/postgistest', function (req,res) {
	console.log('postgistest');
	pool.connect(function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
			res.status(400).send(err);
		} 
		client.query('SELECT name FROM uk_counties_subset' ,function(err,result) {
			console.log("query");
			done(); 
			if(err){
				console.log(err);
				res.status(400).send(err);
			}
			res.status(200).send(result.rows);
		});
	});
});


//
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