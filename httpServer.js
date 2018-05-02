var express = require('express');

var path = require("path");

var app = express();

var fs = require('fs');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({

  extended: true

}));

app.get('/', function (req, res) {

  // run some server-side code

console.log('the server has received a request'); 

res.send('Hello World');

});

